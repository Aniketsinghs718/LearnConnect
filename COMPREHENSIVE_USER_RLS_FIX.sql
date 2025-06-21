-- ==========================================
-- EMAIL CONFIRMATION AWARE USER REGISTRATION FIX
-- ==========================================
-- This script fixes RLS issues specifically for email confirmation enabled setup

-- ==========================================
-- STEP 1: DROP EXISTING PROBLEMATIC POLICIES
-- ==========================================

-- Drop all existing user policies to start fresh
DROP POLICY IF EXISTS "users_select_all" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_delete_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_any_authenticated" ON public.users;
DROP POLICY IF EXISTS "users_insert_registration_safe" ON public.users;

-- ==========================================
-- STEP 2: CREATE EMAIL-CONFIRMATION-AWARE RLS POLICIES
-- ==========================================

-- 1. SELECT: Allow everyone to read user profiles (needed for marketplace)
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

-- 2. INSERT: Allow profile creation during registration AND after email confirmation
CREATE POLICY "users_insert_registration_safe" ON public.users
  FOR INSERT WITH CHECK (
    -- Allow service role (for triggers during signup)
    auth.role() = 'service_role'
    OR
    -- Allow authenticated users to insert their own profile (after email confirmation)
    (auth.role() = 'authenticated' AND auth.uid() = id)
    OR
    -- Allow anon users to insert during registration process (before email confirmation)
    (auth.role() = 'anon' AND id IS NOT NULL)
    OR
    -- Fallback: allow if no role is set but user ID matches (during trigger execution)
    (auth.role() IS NULL AND id IS NOT NULL)
  );

-- 3. UPDATE: Users can only update their own profile (only when authenticated)
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. DELETE: Users can only delete their own profile (only when authenticated)
CREATE POLICY "users_delete_own" ON public.users
  FOR DELETE USING (auth.uid() = id);

-- ==========================================
-- STEP 3: CREATE EMAIL-CONFIRMATION-AWARE TRIGGER FUNCTION
-- ==========================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_email_confirmed();

-- Create function to handle new user creation (before email confirmation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create profile if it doesn't exist already
  INSERT INTO public.users (
    id, 
    name, 
    email, 
    college, 
    branch, 
    year, 
    semester,
    phone,
    avatar_url,
    is_verified,
    is_active,
    is_admin,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'branch', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'year', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'semester', 'Not specified'),
    '',
    NULL,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false), -- Set verified based on email confirmation
    true,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Don't update if already exists
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create function to handle email confirmation
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the user profile when email is confirmed
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Email was just confirmed
    UPDATE public.users 
    SET 
      is_verified = true,
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error updating user profile on email confirmation for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_user_email_confirmed();-- ==========================================
-- STEP 4: CREATE SIMPLIFIED SAFE PROFILE FUNCTION
-- ==========================================

-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.get_user_profile_safe(UUID);

-- Function to safely get user profile (works with email confirmation)
CREATE OR REPLACE FUNCTION public.get_user_profile_safe(user_id UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  email TEXT,
  college TEXT,
  branch TEXT,
  year TEXT,
  semester TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  is_admin BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Simply return existing profile - the trigger should have created it
  RETURN QUERY
  SELECT u.id, u.name, u.email, u.college, u.branch, u.year, u.semester,
         u.phone, u.avatar_url, u.is_verified, u.is_active, u.is_admin,
         u.created_at, u.updated_at
  FROM users u
  WHERE u.id = user_id;
  
  -- If profile still doesn't exist, create a minimal one
  IF NOT FOUND THEN
    INSERT INTO public.users (
      id, name, email, college, branch, year, semester,
      phone, avatar_url, is_verified, is_active, is_admin
    )
    SELECT 
      au.id,
      COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)),
      au.email,
      'Not specified',
      'Not specified',
      'Not specified',
      'Not specified',
      '',
      NULL,
      COALESCE(au.email_confirmed_at IS NOT NULL, false),
      true,
      false
    FROM auth.users au
    WHERE au.id = user_id
    ON CONFLICT (id) DO NOTHING;
    
    -- Return the profile
    RETURN QUERY
    SELECT u.id, u.name, u.email, u.college, u.branch, u.year, u.semester,
           u.phone, u.avatar_url, u.is_verified, u.is_active, u.is_admin,
           u.created_at, u.updated_at
    FROM users u
    WHERE u.id = user_id;
  END IF;
END;
$$;

-- ==========================================
-- STEP 5: GRANT PROPER PERMISSIONS
-- ==========================================

-- Grant necessary permissions for all scenarios
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon;
GRANT ALL ON public.users TO service_role;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_user_email_confirmed() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_profile_safe(UUID) TO authenticated, anon, service_role;

-- ==========================================
-- STEP 6: VERIFY THE SETUP
-- ==========================================

-- Check policies
SELECT '=== CURRENT RLS POLICIES ===' as status;
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY cmd, policyname;

-- Check functions
SELECT '=== FUNCTIONS CREATED ===' as status;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_email_confirmed', 'get_user_profile_safe');

-- Check triggers
SELECT '=== TRIGGERS ===' as status;
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_confirmed');

-- Check permissions
SELECT '=== PERMISSIONS ===' as status;
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY grantee, privilege_type;

SELECT '✅ EMAIL CONFIRMATION AWARE RLS FIX COMPLETED' as final_status;
SELECT 'The system now handles both confirmed and unconfirmed email registration properly!' as info;

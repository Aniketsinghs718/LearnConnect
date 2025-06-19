-- ==========================================
-- FINAL COMPLETE DATABASE RECREATION SCRIPT
-- ==========================================
-- This script recreates the entire LearnConnect database from scratch
-- Based on analysis of the complete codebase and existing SQL files
-- 
-- IMPORTANT: Run this script as authenticated user in Supabase SQL Editor
-- This will recreate EVERYTHING needed for your LearnConnect application

SELECT '🚀 STARTING COMPLETE DATABASE RECREATION FOR LEARNCONNECT' as status;

-- ==========================================
-- STEP 1: ENABLE REQUIRED EXTENSIONS
-- ==========================================

SELECT '🔧 STEP 1: ENABLING EXTENSIONS' as status;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SELECT '✅ Extensions enabled' as extensions_status;

-- ==========================================
-- STEP 2: CREATE CORE TABLES
-- ==========================================

SELECT '📊 STEP 2: CREATING CORE TABLES' as status;

-- ==========================================
-- CREATE USERS TABLE (Enhanced Profile System)
-- ==========================================

DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  college TEXT,
  branch TEXT,
  year TEXT,
  semester TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

SELECT '✅ Users table created' as users_status;

-- ==========================================
-- CREATE MARKETPLACE CATEGORIES TABLE
-- ==========================================

DROP TABLE IF EXISTS public.marketplace_categories CASCADE;

CREATE TABLE public.marketplace_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on marketplace_categories table
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;

SELECT '✅ Marketplace categories table created' as categories_status;

-- ==========================================
-- CREATE MARKETPLACE ITEMS TABLE (Enhanced with Admin Verification)
-- ==========================================

DROP TABLE IF EXISTS public.marketplace_items CASCADE;

CREATE TABLE public.marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.marketplace_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2) CHECK (original_price >= 0),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  college_name TEXT NOT NULL,
  size TEXT CHECK (size IN ('M', 'L', 'XL')), -- For aprons
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_sold BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  favorite_count INTEGER DEFAULT 0 CHECK (favorite_count >= 0),
  contact_info JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  -- Admin verification fields
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users(id),
  rejection_reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on marketplace_items table
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON public.marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category_id ON public.marketplace_items(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_available ON public.marketplace_items(is_available);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_verification_status ON public.marketplace_items(verification_status);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON public.marketplace_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_price ON public.marketplace_items(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_college_name ON public.marketplace_items(college_name);
CREATE INDEX IF NOT EXISTS idx_users_admin ON public.users(is_admin);

SELECT '✅ Marketplace items table created with indexes' as items_status;

-- ==========================================
-- CREATE USER FAVORITES TABLE
-- ==========================================

DROP TABLE IF EXISTS public.user_favorites CASCADE;

CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_id)
);

-- Enable RLS on user_favorites table
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_item_id ON public.user_favorites(item_id);

SELECT '✅ User favorites table created' as favorites_status;

-- ==========================================
-- STEP 3: CREATE TRIGGERS FOR UPDATED_AT
-- ==========================================

SELECT '⚙️ STEP 3: CREATING TRIGGERS' as status;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_marketplace_categories_updated_at ON public.marketplace_categories;
CREATE TRIGGER handle_marketplace_categories_updated_at
  BEFORE UPDATE ON public.marketplace_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_marketplace_items_updated_at ON public.marketplace_items;
CREATE TRIGGER handle_marketplace_items_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

SELECT '✅ Database triggers created' as triggers_status;

-- ==========================================
-- STEP 4: CREATE ADMIN FUNCTIONS
-- ==========================================

SELECT '🛡️ STEP 4: CREATING ADMIN FUNCTIONS' as status;

-- Function to approve an item
CREATE OR REPLACE FUNCTION approve_marketplace_item(item_id UUID, admin_notes_text TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can approve items';
  END IF;

  -- Update the item
  UPDATE public.marketplace_items 
  SET 
    verification_status = 'approved',
    verified_at = NOW(),
    verified_by = auth.uid(),
    admin_notes = admin_notes_text,
    rejection_reason = NULL
  WHERE id = item_id;
  
  RETURN FOUND;
END;
$$;

-- Function to reject an item
CREATE OR REPLACE FUNCTION reject_marketplace_item(item_id UUID, reason TEXT, admin_notes_text TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can reject items';
  END IF;

  -- Update the item
  UPDATE public.marketplace_items 
  SET 
    verification_status = 'rejected',
    verified_at = NOW(),
    verified_by = auth.uid(),
    rejection_reason = reason,
    admin_notes = admin_notes_text,
    is_available = false
  WHERE id = item_id;
  
  RETURN FOUND;
END;
$$;

-- Function to mark item as sold
CREATE OR REPLACE FUNCTION mark_item_as_sold(item_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the item to mark as sold
  UPDATE public.marketplace_items 
  SET 
    is_sold = true,
    is_available = false,
    updated_at = NOW()
  WHERE id = item_id 
    AND seller_id = auth.uid()
    AND NOT is_sold;
  
  -- Return true if the update was successful
  RETURN FOUND;
END;
$$;

-- Function to handle new user signup (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      SPLIT_PART(NEW.email, '@', 1),
      'User'
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college', ''),
    COALESCE(NEW.raw_user_meta_data->>'branch', ''),
    COALESCE(NEW.raw_user_meta_data->>'year', ''),
    COALESCE(NEW.raw_user_meta_data->>'semester', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    college = EXCLUDED.college,
    branch = EXCLUDED.branch,
    year = EXCLUDED.year,
    semester = EXCLUDED.semester,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create user profile (for existing users without profiles)
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile(user_id UUID)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First try to return existing profile
  RETURN QUERY
  SELECT * FROM public.users WHERE id = user_id;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.users (
      id,
      name,
      email,
      college,
      branch,
      year,
      semester,
      created_at,
      updated_at
    )
    SELECT 
      au.id,
      COALESCE(
        au.raw_user_meta_data->>'name',
        au.raw_user_meta_data->>'full_name',
        SPLIT_PART(au.email, '@', 1),
        'User'
      ),
      au.email,
      COALESCE(au.raw_user_meta_data->>'college', ''),
      COALESCE(au.raw_user_meta_data->>'branch', ''),
      COALESCE(au.raw_user_meta_data->>'year', ''),
      COALESCE(au.raw_user_meta_data->>'semester', ''),
      au.created_at,
      NOW()
    FROM auth.users au
    WHERE au.id = user_id;
    
    -- Return the newly created profile
    RETURN QUERY
    SELECT * FROM public.users WHERE id = user_id;
  END IF;
END;
$$;

-- Function specifically for the frontend to safely get user profile
CREATE OR REPLACE FUNCTION public.get_user_profile_safe(user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  college TEXT,
  branch TEXT,
  year TEXT,
  semester TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to get existing profile first
  RETURN QUERY
  SELECT 
    u.id, u.name, u.email, u.college, u.branch, u.year, u.semester,
    u.phone, u.avatar_url, u.bio, u.preferences, 
    u.is_verified, u.is_active, u.is_admin, u.created_at, u.updated_at
  FROM public.users u 
  WHERE u.id = user_id;
  
  -- If no profile found, create one and return it
  IF NOT FOUND THEN
    -- Create the profile
    INSERT INTO public.users (
      id, name, email, college, branch, year, semester, created_at, updated_at
    )
    SELECT 
      au.id,
      COALESCE(
        au.raw_user_meta_data->>'name',
        au.raw_user_meta_data->>'full_name',
        SPLIT_PART(au.email, '@', 1),
        'User'
      ),
      au.email,
      COALESCE(au.raw_user_meta_data->>'college', 'Not specified'),
      COALESCE(au.raw_user_meta_data->>'branch', 'Not specified'),
      COALESCE(au.raw_user_meta_data->>'year', 'Not specified'),
      COALESCE(au.raw_user_meta_data->>'semester', 'Not specified'),
      au.created_at,
      NOW()
    FROM auth.users au
    WHERE au.id = user_id;
    
    -- Return the newly created profile
    RETURN QUERY
    SELECT 
      u.id, u.name, u.email, u.college, u.branch, u.year, u.semester,
      u.phone, u.avatar_url, u.bio, u.preferences, 
      u.is_verified, u.is_active, u.is_admin, u.created_at, u.updated_at
    FROM public.users u 
    WHERE u.id = user_id;
  END IF;
END;
$$;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION approve_marketplace_item(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_marketplace_item(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_item_as_sold(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_user_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile_safe(UUID) TO authenticated;

SELECT '✅ Admin functions and user profile functions created' as functions_status;

-- ==========================================
-- STEP 5: CREATE USER PROFILES FOR EXISTING AUTH USERS
-- ==========================================

SELECT '👤 STEP 5: CREATING USER PROFILES FOR EXISTING AUTH USERS' as status;

-- Create profiles for all auth users who don't have one
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
  created_at,
  updated_at
)
SELECT 
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'name', 
    au.raw_user_meta_data->>'full_name',
    SPLIT_PART(au.email, '@', 1),
    'User'
  ) as name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'college', '') as college,
  COALESCE(au.raw_user_meta_data->>'branch', '') as branch,
  COALESCE(au.raw_user_meta_data->>'year', '') as year,
  COALESCE(au.raw_user_meta_data->>'semester', '') as semester,
  COALESCE(au.raw_user_meta_data->>'phone', '') as phone,
  au.raw_user_meta_data->>'avatar_url',
  false as is_verified,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
WHERE au.email IS NOT NULL
  AND au.deleted_at IS NULL
ON CONFLICT (id) DO NOTHING;

-- Show how many profiles were created
SELECT 
  'USER PROFILES CREATED:' as info,
  (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) as total_auth_users,
  (SELECT COUNT(*) FROM public.users) as total_profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users have profiles'
    ELSE '❌ Some profiles may be missing'
  END as profile_status;

-- ==========================================
-- STEP 6: CREATE COMPREHENSIVE RLS POLICIES
-- ==========================================

SELECT '🔒 STEP 6: CREATING RLS POLICIES' as status;

-- ==========================================
-- USERS TABLE POLICIES
-- ==========================================

-- Drop existing policies first
DROP POLICY IF EXISTS "users_select_all" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_delete_own" ON public.users;

-- Allow everyone to read user profiles (for marketplace seller info)
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "users_delete_own" ON public.users
  FOR DELETE USING (auth.uid() = id);

SELECT '✅ Users table policies created' as users_policies_status;

-- ==========================================
-- MARKETPLACE_CATEGORIES TABLE POLICIES
-- ==========================================

-- Drop existing policies first
DROP POLICY IF EXISTS "categories_select_active" ON public.marketplace_categories;

-- Allow everyone to read active categories
CREATE POLICY "categories_select_active" ON public.marketplace_categories
  FOR SELECT USING (is_active = true);

SELECT '✅ Categories table policies created' as categories_policies_status;

-- ==========================================
-- MARKETPLACE_ITEMS TABLE POLICIES
-- ==========================================

-- Drop existing policies first
DROP POLICY IF EXISTS "items_select_available_or_own" ON public.marketplace_items;
DROP POLICY IF EXISTS "items_insert_own" ON public.marketplace_items;
DROP POLICY IF EXISTS "items_update_own" ON public.marketplace_items;
DROP POLICY IF EXISTS "items_delete_own" ON public.marketplace_items;
DROP POLICY IF EXISTS "admin_items_select_all" ON public.marketplace_items;
DROP POLICY IF EXISTS "admin_items_update_verification" ON public.marketplace_items;

-- Allow everyone to read approved available items, own items, or admin access
CREATE POLICY "items_select_available_or_own" ON public.marketplace_items
  FOR SELECT USING (
    -- Show to everyone if approved and available
    (verification_status = 'approved' AND is_available = true) OR 
    -- Show own items regardless of verification status
    auth.uid() = seller_id OR
    -- Show all items to admins
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Users can insert items as themselves (pending verification)
CREATE POLICY "items_insert_own" ON public.marketplace_items
  FOR INSERT WITH CHECK (
    auth.uid() = seller_id AND
    auth.uid() IS NOT NULL
  );

-- Users can update their own items, admins can update verification
CREATE POLICY "items_update_own" ON public.marketplace_items
  FOR UPDATE USING (
    auth.uid() = seller_id OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    auth.uid() = seller_id OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Users can delete their own items
CREATE POLICY "items_delete_own" ON public.marketplace_items
  FOR DELETE USING (auth.uid() = seller_id);

SELECT '✅ Marketplace items policies created' as items_policies_status;

-- ==========================================
-- USER_FAVORITES TABLE POLICIES
-- ==========================================

-- Drop existing policies first
DROP POLICY IF EXISTS "favorites_select_own" ON public.user_favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON public.user_favorites;
DROP POLICY IF EXISTS "favorites_update_own" ON public.user_favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.user_favorites;

-- Users can view their own favorites
CREATE POLICY "favorites_select_own" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "favorites_insert_own" ON public.user_favorites
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    auth.uid() IS NOT NULL
  );

-- Users can update their own favorites
CREATE POLICY "favorites_update_own" ON public.user_favorites
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "favorites_delete_own" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

SELECT '✅ User favorites policies created' as favorites_policies_status;

-- ==========================================
-- STEP 7: SETUP STORAGE BUCKET AND POLICIES
-- ==========================================

SELECT '📁 STEP 7: SETTING UP STORAGE POLICIES' as status;

-- Create marketplace-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-images',
  'marketplace-images', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "marketplace_images_select" ON storage.objects;
DROP POLICY IF EXISTS "marketplace_images_insert" ON storage.objects;
DROP POLICY IF EXISTS "marketplace_images_update" ON storage.objects;
DROP POLICY IF EXISTS "marketplace_images_delete" ON storage.objects;

-- Create storage policies for marketplace-images bucket
CREATE POLICY "marketplace_images_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'marketplace-images');

CREATE POLICY "marketplace_images_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'marketplace-images' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "marketplace_images_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'marketplace-images' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'marketplace-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "marketplace_images_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'marketplace-images' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    auth.uid() IS NOT NULL
  );

SELECT '✅ Storage bucket and policies configured' as storage_status;

-- ==========================================
-- STEP 8: INSERT SAMPLE CATEGORIES
-- ==========================================

SELECT '📂 STEP 8: ADDING SAMPLE CATEGORIES' as status;

-- Clear existing categories and add the updated ones from the codebase
DELETE FROM public.marketplace_categories;

INSERT INTO public.marketplace_categories (name, description, icon, color, sort_order) VALUES
  ('Books', 'Textbooks, novels, and academic materials', '📚', '#3B82F6', 1),
  ('Calculator', 'Scientific and graphing calculators', '🔢', '#10B981', 2),
  ('Lab Apron', 'Laboratory aprons for science experiments', '🥼', '#F59E0B', 3),
  ('Workshop Apron', 'Workshop aprons for technical work', '👷', '#EF4444', 4),
  ('Accessories', 'General academic and study accessories', '🎒', '#8B5CF6', 5),
  ('Others', 'Miscellaneous items and general goods', '📦', '#6B7280', 6)
ON CONFLICT (name) DO NOTHING;

SELECT '✅ Sample categories added' as categories_sample_status;

-- ==========================================
-- STEP 9: VERIFICATION AND TESTING
-- ==========================================

SELECT '✅ STEP 9: VERIFICATION' as status;

-- Verify all users have profiles
SELECT 
  'FINAL PROFILE CHECK:' as info,
  (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) as auth_users,
  (SELECT COUNT(*) FROM public.users) as profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users have profiles'
    ELSE '❌ Missing profiles detected'
  END as profile_check;

-- Count policies by table
SELECT 
  'POLICY COUNT CHECK:' as info,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('users', 'marketplace_items', 'marketplace_categories', 'user_favorites')
GROUP BY tablename
ORDER BY tablename;

-- Verify storage bucket exists
SELECT 
  'STORAGE BUCKET CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'marketplace-images')
    THEN '✅ Marketplace images bucket exists'
    ELSE '❌ Marketplace images bucket missing'
  END as bucket_status;

-- Verify categories exist
SELECT 
  'CATEGORIES CHECK:' as info,
  COUNT(*) as category_count,
  CASE 
    WHEN COUNT(*) = 6
    THEN '✅ All 6 categories created correctly'
    ELSE '❌ Category count mismatch'
  END as categories_status
FROM public.marketplace_categories;

-- List all categories for verification
SELECT 'CREATED CATEGORIES:' as info;
SELECT name, icon, description, color FROM public.marketplace_categories ORDER BY sort_order;

-- Verify functions exist
SELECT 
  'FUNCTIONS CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'approve_marketplace_item')
    THEN '✅ approve_marketplace_item function exists'
    ELSE '❌ approve function missing'
  END as approve_func,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'reject_marketplace_item')
    THEN '✅ reject_marketplace_item function exists'
    ELSE '❌ reject function missing'
  END as reject_func,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'mark_item_as_sold')
    THEN '✅ mark_item_as_sold function exists'
    ELSE '❌ mark_item_as_sold function missing'
  END as sold_func,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user')
    THEN '✅ handle_new_user function exists'
    ELSE '❌ handle_new_user function missing'
  END as new_user_func,  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_or_create_user_profile')
    THEN '✅ get_or_create_user_profile function exists'
    ELSE '❌ get_or_create_user_profile function missing'
  END as profile_func,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_profile_safe')
    THEN '✅ get_user_profile_safe function exists'
    ELSE '❌ get_user_profile_safe function missing'
  END as safe_profile_func;

-- Test authentication context
SELECT 
  'AUTHENTICATION TEST:' as info,
  CASE 
    WHEN auth.uid() IS NOT NULL
    THEN '✅ Authentication context available'
    ELSE '❌ No authentication context'
  END as auth_status;

-- Final comprehensive status check
SELECT 
  CASE 
    WHEN (
      SELECT COUNT(*) FROM pg_policies 
      WHERE tablename = 'users' AND cmd = 'INSERT'
    ) > 0 AND (
      SELECT COUNT(*) FROM pg_policies 
      WHERE tablename = 'marketplace_items' AND cmd = 'INSERT'
    ) > 0 AND (
      SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL
    ) = (
      SELECT COUNT(*) FROM public.users
    ) AND EXISTS (
      SELECT 1 FROM storage.buckets WHERE id = 'marketplace-images'
    ) AND (
      SELECT COUNT(*) FROM public.marketplace_categories
    ) = 6 AND EXISTS (
      SELECT 1 FROM pg_proc WHERE proname = 'approve_marketplace_item'
    ) AND EXISTS (
      SELECT 1 FROM pg_proc WHERE proname = 'reject_marketplace_item'
    ) AND EXISTS (
      SELECT 1 FROM pg_proc WHERE proname = 'mark_item_as_sold'
    )
    THEN '🎉 SUCCESS: Complete LearnConnect database recreation completed!'
    ELSE '⚠️ WARNING: Some components may be missing - check the verification output above'
  END as final_status;

-- ==========================================
-- STEP 10: POST-SETUP INSTRUCTIONS
-- ==========================================

SELECT '📋 POST-SETUP INSTRUCTIONS:' as info;
SELECT '1. Test user registration in your LearnConnect app' as step_1;
SELECT '2. Test user login and profile creation' as step_2;
SELECT '3. Test marketplace item creation with image upload' as step_3;
SELECT '4. Test admin verification workflow (make yourself admin first)' as step_4;
SELECT '5. Verify all marketplace features work properly' as step_5;
SELECT '6. Check that RLS policies prevent unauthorized access' as step_6;

-- Instructions for making users admin
SELECT '👨‍💼 TO MAKE USERS ADMIN:' as admin_info;
SELECT 'UPDATE public.users SET is_admin = true WHERE email = ''your-email@example.com'';' as admin_command;

-- Database schema summary
SELECT '📊 DATABASE SCHEMA SUMMARY:' as schema_info;
SELECT 'Tables Created: users, marketplace_categories, marketplace_items, user_favorites' as tables;
SELECT 'Features: Admin verification, Image storage, RLS security, User profiles' as features;
SELECT 'Categories: Books, Calculator, Lab Apron, Workshop Apron, Accessories, Others' as categories;
SELECT 'Functions: approve_marketplace_item, reject_marketplace_item, mark_item_as_sold, handle_new_user, get_or_create_user_profile' as functions;

SELECT '✨ LEARNCONNECT DATABASE RECREATION COMPLETE! Your marketplace is ready to use.' as completion_message;

-- End of script
SELECT '🏁 DATABASE RECREATION SCRIPT COMPLETED SUCCESSFULLY!' as final_message;

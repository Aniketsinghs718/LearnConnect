-- ==========================================
-- COMPLETE LEARNCONNECT DATABASE SETUP
-- ==========================================
-- Comprehensive database setup for LearnConnect marketplace platform
-- This file combines all database schema creation, RLS policies, admin system, and fixes
-- Created: June 18, 2025
-- Run this script in Supabase SQL Editor as an authenticated user

-- ==========================================
-- STEP 1: INITIAL SETUP AND EXTENSIONS
-- ==========================================

SELECT '🚀 STARTING COMPLETE LEARNCONNECT DATABASE SETUP' as status;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SELECT '✅ Extensions enabled' as extensions_status;

-- ==========================================
-- STEP 2: CREATE CORE TABLES
-- ==========================================

SELECT '🏗️ CREATING CORE DATABASE TABLES' as status;

-- ==========================================
-- CREATE USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.users (
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
  total_purchases INTEGER DEFAULT 0 CHECK (total_purchases >= 0),
  is_verified BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

SELECT '✅ Users table created' as users_status;

-- ==========================================
-- CREATE MARKETPLACE CATEGORIES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.marketplace_categories (
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
-- CREATE MARKETPLACE ITEMS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.marketplace_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2) CHECK (original_price >= 0),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  college_name TEXT NOT NULL,
  size TEXT CHECK (size IN ('M', 'L', 'XL')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_sold BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  favorite_count INTEGER DEFAULT 0 CHECK (favorite_count >= 0),
  contact_info JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
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
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON public.marketplace_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_price ON public.marketplace_items(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_verification_status ON public.marketplace_items(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_admin ON public.users(is_admin);

SELECT '✅ Marketplace items table created' as items_status;

-- ==========================================
-- CREATE USER FAVORITES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_favorites (
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
-- STEP 3: CREATE UTILITY FUNCTIONS AND TRIGGERS
-- ==========================================

SELECT '⚙️ CREATING UTILITY FUNCTIONS AND TRIGGERS' as status;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_marketplace_categories_updated_at
  BEFORE UPDATE ON public.marketplace_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_marketplace_items_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle marking items as sold
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

-- Function to approve an item (admin only)
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

-- Function to reject an item (admin only)
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

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION mark_item_as_sold(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION approve_marketplace_item(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_marketplace_item(UUID, TEXT, TEXT) TO authenticated;

SELECT '✅ Functions and triggers created' as functions_status;

-- ==========================================
-- STEP 4: CREATE USER PROFILES FOR EXISTING AUTH USERS
-- ==========================================

SELECT '👤 CREATING USER PROFILES FOR EXISTING AUTH USERS' as status;

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
-- STEP 5: DROP ALL EXISTING POLICIES AND CREATE NEW ONES
-- ==========================================

SELECT '🔒 SETTING UP ROW LEVEL SECURITY POLICIES' as status;

-- Drop ALL existing policies to avoid conflicts
-- Users table policies
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;
DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_delete_own" ON users;

-- Marketplace items policies
DROP POLICY IF EXISTS "Anyone can view available items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can insert own items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can update own items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can delete own items" ON marketplace_items;
DROP POLICY IF EXISTS "Enable read access for available items" ON marketplace_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON marketplace_items;
DROP POLICY IF EXISTS "Enable update for item owners" ON marketplace_items;
DROP POLICY IF EXISTS "Enable delete for item owners" ON marketplace_items;
DROP POLICY IF EXISTS "items_select_available_or_own" ON marketplace_items;
DROP POLICY IF EXISTS "items_insert_own" ON marketplace_items;
DROP POLICY IF EXISTS "items_update_own" ON marketplace_items;
DROP POLICY IF EXISTS "items_delete_own" ON marketplace_items;
DROP POLICY IF EXISTS "admin_items_select_all" ON marketplace_items;
DROP POLICY IF EXISTS "admin_items_update_verification" ON marketplace_items;

-- Categories policies
DROP POLICY IF EXISTS "Anyone can view active categories" ON marketplace_categories;
DROP POLICY IF EXISTS "categories_select_active" ON marketplace_categories;

-- Favorites policies
DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;
DROP POLICY IF EXISTS "favorites_select_own" ON user_favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON user_favorites;
DROP POLICY IF EXISTS "favorites_update_own" ON user_favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON user_favorites;

-- ==========================================
-- CREATE NEW COMPREHENSIVE RLS POLICIES
-- ==========================================

-- USERS TABLE POLICIES
-- Allow everyone to read user profiles (for marketplace seller info)
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (auth.uid() = id);

-- MARKETPLACE_CATEGORIES TABLE POLICIES
-- Allow everyone to read active categories
CREATE POLICY "categories_select_policy" ON marketplace_categories
  FOR SELECT USING (is_active = true);

-- MARKETPLACE_ITEMS TABLE POLICIES
-- Allow viewing of approved items, own items, or all items for admins
CREATE POLICY "items_select_policy" ON marketplace_items
  FOR SELECT USING (
    -- Show approved and available items to everyone
    (verification_status = 'approved' AND is_available = true) OR 
    -- Show own items regardless of verification status
    auth.uid() = seller_id OR
    -- Show all items to admins
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Allow authenticated users to insert their own items
CREATE POLICY "items_insert_policy" ON marketplace_items
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Allow users to update their own items, or admins to update verification
CREATE POLICY "items_update_policy" ON marketplace_items
  FOR UPDATE USING (
    auth.uid() = seller_id OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Allow users to delete their own items
CREATE POLICY "items_delete_policy" ON marketplace_items
  FOR DELETE USING (auth.uid() = seller_id);

-- USER_FAVORITES TABLE POLICIES
-- Users can view their own favorites
CREATE POLICY "favorites_select_policy" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "favorites_insert_policy" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "favorites_delete_policy" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

SELECT '✅ RLS policies created successfully' as policies_status;

-- ==========================================
-- STEP 6: SETUP STORAGE BUCKET AND POLICIES
-- ==========================================

SELECT '📁 SETTING UP STORAGE BUCKET AND POLICIES' as status;

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
-- STEP 7: INSERT MARKETPLACE CATEGORIES
-- ==========================================

SELECT '📂 ADDING MARKETPLACE CATEGORIES' as status;

-- Clear existing categories and add new ones
DELETE FROM public.marketplace_categories;

-- Insert updated category structure
INSERT INTO public.marketplace_categories (name, description, icon, color, sort_order) VALUES
  ('Books', 'Textbooks, novels, and academic materials', '📚', '#3B82F6', 1),
  ('Calculator', 'Scientific and graphing calculators', '🔢', '#10B981', 2),
  ('Lab Apron', 'Laboratory aprons for science experiments', '🥼', '#F59E0B', 3),
  ('Workshop Apron', 'Workshop aprons for technical work', '👷', '#EF4444', 4),
  ('Accessories', 'General academic and study accessories', '🎒', '#8B5CF6', 5),
  ('Others', 'Miscellaneous items and general goods', '📦', '#6B7280', 6);

SELECT '✅ Marketplace categories added' as categories_added_status;

-- ==========================================
-- STEP 8: UPDATE EXISTING DATA FOR COMPATIBILITY
-- ==========================================

SELECT '🔄 UPDATING EXISTING DATA FOR COMPATIBILITY' as status;

-- Update existing items to be approved (for backward compatibility)
UPDATE public.marketplace_items 
SET verification_status = 'approved' 
WHERE verification_status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';

-- Ensure all items have proper sold status
UPDATE public.marketplace_items 
SET is_sold = false 
WHERE is_sold IS NULL;

SELECT '✅ Existing data updated' as data_update_status;

-- ==========================================
-- STEP 9: COMPREHENSIVE VERIFICATION AND TESTING
-- ==========================================

SELECT '✅ FINAL VERIFICATION AND TESTING' as status;

-- Verify all users have profiles
SELECT 
  '👤 PROFILE CHECK:' as info,
  (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) as auth_users,
  (SELECT COUNT(*) FROM public.users) as profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users have profiles'
    ELSE '❌ Missing profiles detected'
  END as profile_check;

-- Count policies by table
SELECT 
  '🔒 POLICY COUNT CHECK:' as info,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('users', 'marketplace_items', 'marketplace_categories', 'user_favorites')
GROUP BY tablename
ORDER BY tablename;

-- Verify storage bucket exists
SELECT 
  '📁 STORAGE BUCKET CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'marketplace-images')
    THEN '✅ Marketplace images bucket exists'
    ELSE '❌ Marketplace images bucket missing'
  END as bucket_status;

-- Verify categories exist
SELECT 
  '📂 CATEGORIES CHECK:' as info,
  COUNT(*) as category_count,
  CASE 
    WHEN COUNT(*) = 6
    THEN '✅ All 6 categories created correctly'
    ELSE '❌ Category count mismatch'
  END as categories_status
FROM public.marketplace_categories;

-- List all categories
SELECT 
  '📋 CATEGORY LIST:' as info,
  name, 
  icon, 
  description 
FROM public.marketplace_categories 
ORDER BY sort_order;

-- Check table structure for required columns
SELECT 
  '🏗️ TABLE STRUCTURE CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'college_name')
    THEN '✅ college_name column exists'
    ELSE '❌ college_name column missing'
  END as college_name_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'size')
    THEN '✅ size column exists'
    ELSE '❌ size column missing'
  END as size_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'is_sold')
    THEN '✅ is_sold column exists'
    ELSE '❌ is_sold column missing'
  END as sold_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'verification_status')
    THEN '✅ verification_status column exists'
    ELSE '❌ verification_status column missing'
  END as verification_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin')
    THEN '✅ is_admin column exists'
    ELSE '❌ is_admin column missing'
  END as admin_column;

-- Check function creation
SELECT 
  '⚙️ FUNCTION CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'mark_item_as_sold')
    THEN '✅ mark_item_as_sold function created'
    ELSE '❌ mark_item_as_sold function missing'
  END as sold_function,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'approve_marketplace_item')
    THEN '✅ approve_marketplace_item function created'
    ELSE '❌ approve function missing'
  END as approve_func,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'reject_marketplace_item')
    THEN '✅ reject_marketplace_item function created'
    ELSE '❌ reject function missing'
  END as reject_func;

-- Show item verification status counts
SELECT 
  '📊 ITEM STATUS COUNT:' as info,
  verification_status,
  COUNT(*) as count
FROM public.marketplace_items 
GROUP BY verification_status
ORDER BY verification_status;

-- Test authentication context
SELECT 
  '🔐 AUTHENTICATION TEST:' as info,
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
      SELECT COUNT(*) FROM public.marketplace_categories
    ) = 6 AND EXISTS (
      SELECT 1 FROM storage.buckets WHERE id = 'marketplace-images'
    ) AND EXISTS (
      SELECT 1 FROM pg_proc WHERE proname = 'mark_item_as_sold'
    ) AND EXISTS (
      SELECT 1 FROM pg_proc WHERE proname = 'approve_marketplace_item'
    )
    THEN '🎉 SUCCESS: Complete LearnConnect database setup completed successfully!'
    ELSE '⚠️ WARNING: Some issues may remain - check the output above'
  END as final_status;

-- ==========================================
-- STEP 10: INSTRUCTIONS AND NEXT STEPS
-- ==========================================

SELECT '📋 NEXT STEPS AND INSTRUCTIONS:' as info;
SELECT '1. Test user registration and login in your app' as step_1;
SELECT '2. Test marketplace item creation with image upload' as step_2;
SELECT '3. Verify that only approved items are visible to regular users' as step_3;
SELECT '4. Set up admin users by updating is_admin = true for specific user emails' as step_4;
SELECT '5. Test admin functionality for approving/rejecting items' as step_5;
SELECT '6. Test favorites functionality' as step_6;
SELECT '7. Test the mark as sold functionality' as step_7;
SELECT '8. Verify image uploads work to marketplace-images bucket' as step_8;

-- Sample admin setup instruction
SELECT '👨‍💼 TO MAKE A USER ADMIN:' as admin_setup;
SELECT 'UPDATE public.users SET is_admin = true WHERE email = ''your-admin-email@example.com'';' as admin_query_example;

-- Show current admin users (if any)
SELECT 
  '👨‍💼 CURRENT ADMIN USERS:' as admin_info,
  email,
  name,
  is_admin,
  created_at
FROM public.users 
WHERE is_admin = true
ORDER BY created_at;

SELECT '✨ LEARNCONNECT DATABASE SETUP COMPLETE!' as completion_message;
SELECT 'Your marketplace platform is now fully configured and ready to use.' as final_note;
SELECT 'All RLS policies, admin system, verification workflow, and storage are properly set up.' as security_note;

-- ==========================================
-- END OF COMPLETE LEARNCONNECT DATABASE SETUP
-- ==========================================

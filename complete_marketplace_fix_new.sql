-- ==========================================
-- COMPLETE MARKETPLACE DATABASE SETUP
-- ==========================================
-- This script creates the entire database schema from scratch
-- Run this script in Supabase SQL Editor as an authenticated user

-- ==========================================
-- STEP 1: CREATE DATABASE SCHEMA FROM SCRATCH
-- ==========================================

SELECT '🏗️ STEP 1: CREATING DATABASE SCHEMA FROM SCRATCH' as status;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
  total_sales INTEGER DEFAULT 0 CHECK (total_sales >= 0),
  total_purchases INTEGER DEFAULT 0 CHECK (total_purchases >= 0),
  is_verified BOOLEAN DEFAULT false,
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
  location TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  favorite_count INTEGER DEFAULT 0 CHECK (favorite_count >= 0),
  contact_info JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
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

SELECT '✅ Marketplace items table created' as items_status;

-- ==========================================
-- CREATE MARKETPLACE ITEM VIEWS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.marketplace_item_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on marketplace_item_views table
ALTER TABLE public.marketplace_item_views ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_item_views_item_id ON public.marketplace_item_views(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_item_views_viewer_id ON public.marketplace_item_views(viewer_id);

-- Create immutable function for date truncation (required for index expressions)
CREATE OR REPLACE FUNCTION public.immutable_date_trunc(text, timestamptz)
RETURNS date
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT date_trunc($1, $2)::date;
$$;

-- Create unique constraint for one view per user per item per day using immutable function
CREATE UNIQUE INDEX IF NOT EXISTS idx_marketplace_item_views_unique_daily 
ON public.marketplace_item_views(item_id, viewer_id, public.immutable_date_trunc('day', viewed_at));

SELECT '✅ Marketplace item views table created' as views_status;

-- ==========================================
-- CREATE USER RATINGS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rater_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rated_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(rater_id, rated_user_id, item_id),
  CHECK (rater_id != rated_user_id)
);

-- Enable RLS on user_ratings table
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_ratings_rated_user_id ON public.user_ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rater_id ON public.user_ratings(rater_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_item_id ON public.user_ratings(item_id);

SELECT '✅ User ratings table created' as ratings_status;

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
-- CREATE UPDATED_AT TRIGGERS
-- ==========================================

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

CREATE TRIGGER handle_user_ratings_updated_at
  BEFORE UPDATE ON public.user_ratings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

SELECT '✅ Database triggers created' as triggers_status;

-- ==========================================
-- STEP 2: CREATE USER PROFILES FOR EXISTING AUTH USERS
-- ==========================================

SELECT '👤 STEP 2: CREATING USER PROFILES FOR EXISTING AUTH USERS' as status;

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
  rating,
  total_sales,
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
  0.0 as rating,
  0 as total_sales,
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
-- STEP 3: CREATE COMPREHENSIVE RLS POLICIES
-- ==========================================

SELECT '🔒 STEP 3: CREATING RLS POLICIES' as status;

-- ==========================================
-- USERS TABLE POLICIES
-- ==========================================

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

-- Allow everyone to read active categories
CREATE POLICY "categories_select_active" ON public.marketplace_categories
  FOR SELECT USING (is_active = true);

SELECT '✅ Categories table policies created' as categories_policies_status;

-- ==========================================
-- MARKETPLACE_ITEMS TABLE POLICIES
-- ==========================================

-- Allow everyone to read available items or own items
CREATE POLICY "items_select_available_or_own" ON public.marketplace_items
  FOR SELECT USING (
    is_available = true OR 
    auth.uid() = seller_id
  );

-- Users can insert items as themselves
CREATE POLICY "items_insert_own" ON public.marketplace_items
  FOR INSERT WITH CHECK (
    auth.uid() = seller_id AND
    auth.uid() IS NOT NULL
  );

-- Users can update their own items
CREATE POLICY "items_update_own" ON public.marketplace_items
  FOR UPDATE USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Users can delete their own items
CREATE POLICY "items_delete_own" ON public.marketplace_items
  FOR DELETE USING (auth.uid() = seller_id);

SELECT '✅ Marketplace items policies created' as items_policies_status;

-- ==========================================
-- MARKETPLACE_ITEM_VIEWS TABLE POLICIES
-- ==========================================

-- Users can view their own views
CREATE POLICY "views_select_own" ON public.marketplace_item_views
  FOR SELECT USING (auth.uid() = viewer_id);

-- Users can insert their own views
CREATE POLICY "views_insert_own" ON public.marketplace_item_views
  FOR INSERT WITH CHECK (
    auth.uid() = viewer_id AND
    auth.uid() IS NOT NULL
  );

-- Users can update their own views
CREATE POLICY "views_update_own" ON public.marketplace_item_views
  FOR UPDATE USING (auth.uid() = viewer_id)
  WITH CHECK (auth.uid() = viewer_id);

-- Users can delete their own views
CREATE POLICY "views_delete_own" ON public.marketplace_item_views
  FOR DELETE USING (auth.uid() = viewer_id);

SELECT '✅ Item views policies created' as views_policies_status;

-- ==========================================
-- USER_RATINGS TABLE POLICIES
-- ==========================================

-- Everyone can read ratings (for displaying user reputation)
CREATE POLICY "ratings_select_all" ON public.user_ratings
  FOR SELECT USING (true);

-- Users can insert ratings for others (not themselves)
CREATE POLICY "ratings_insert_valid" ON public.user_ratings
  FOR INSERT WITH CHECK (
    auth.uid() = rater_id AND 
    auth.uid() != rated_user_id AND
    auth.uid() IS NOT NULL
  );

-- Users can update their own ratings
CREATE POLICY "ratings_update_own" ON public.user_ratings
  FOR UPDATE USING (auth.uid() = rater_id)
  WITH CHECK (auth.uid() = rater_id);

-- Users can delete their own ratings
CREATE POLICY "ratings_delete_own" ON public.user_ratings
  FOR DELETE USING (auth.uid() = rater_id);

SELECT '✅ User ratings policies created' as ratings_policies_status;

-- ==========================================
-- USER_FAVORITES TABLE POLICIES
-- ==========================================

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
-- STEP 4: SETUP STORAGE BUCKET AND POLICIES
-- ==========================================

SELECT '📁 STEP 4: SETTING UP STORAGE POLICIES' as status;

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
-- STEP 5: INSERT SAMPLE CATEGORIES
-- ==========================================

SELECT '📂 STEP 5: ADDING SAMPLE CATEGORIES' as status;

INSERT INTO public.marketplace_categories (name, description, icon, color, sort_order) VALUES
  ('Books', 'Textbooks, novels, and academic materials', '📚', '#3B82F6', 1),
  ('Electronics', 'Laptops, phones, gadgets, and accessories', '💻', '#10B981', 2),
  ('Stationery', 'Pens, notebooks, calculators, and supplies', '✏️', '#F59E0B', 3),
  ('Clothing', 'Shirts, jackets, shoes, and accessories', '👕', '#EF4444', 4),
  ('Furniture', 'Desks, chairs, storage, and room items', '🪑', '#8B5CF6', 5),
  ('Sports', 'Equipment, gear, and fitness items', '⚽', '#06B6D4', 6),
  ('Other', 'Miscellaneous items and general goods', '📦', '#6B7280', 7)
ON CONFLICT (name) DO NOTHING;

SELECT '✅ Sample categories added' as categories_sample_status;

-- ==========================================
-- STEP 6: VERIFICATION AND TESTING
-- ==========================================

SELECT '✅ STEP 6: VERIFICATION' as status;

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
WHERE tablename IN ('users', 'marketplace_items', 'marketplace_categories', 'marketplace_item_views', 'user_ratings', 'user_favorites')
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
    WHEN COUNT(*) > 0
    THEN '✅ Categories available'
    ELSE '❌ No categories found'
  END as categories_status
FROM public.marketplace_categories;

-- Test authentication context
SELECT 
  'AUTHENTICATION TEST:' as info,
  CASE 
    WHEN auth.uid() IS NOT NULL
    THEN '✅ Authentication context available'
    ELSE '❌ No authentication context'
  END as auth_status;

-- Final status
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
    )
    THEN '🎉 SUCCESS: Complete marketplace database setup completed!'
    ELSE '⚠️ WARNING: Some issues may remain - check the output above'
  END as final_status;

-- Instructions for next steps
SELECT '📋 NEXT STEPS:' as info;
SELECT '1. Test user registration in your app' as step_1;
SELECT '2. Test user login in your app' as step_2;
SELECT '3. Test marketplace item creation with image upload' as step_3;
SELECT '4. Check that profiles are auto-created for new users' as step_4;
SELECT '5. Verify image uploads work to marketplace-images bucket' as step_5;

SELECT '✨ Database setup complete! Your marketplace should now work properly.' as completion_message;

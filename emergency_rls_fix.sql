-- ==========================================
-- EMERGENCY FIX: RLS POLICY DEBUGGING & REPAIR
-- ==========================================
-- Run this script to diagnose and fix the RLS policy issues

-- ==========================================
-- STEP 1: CHECK CURRENT STATE
-- ==========================================

SELECT 'CURRENT AUTHENTICATION STATUS:' as info;

-- Check if user can be authenticated (simulate auth context)
SELECT 
  CASE 
    WHEN current_setting('request.jwt.claims', true) IS NOT NULL 
    THEN 'User is authenticated' 
    ELSE 'No authentication context' 
  END as auth_status;

-- ==========================================
-- STEP 2: CHECK EXISTING POLICIES
-- ==========================================

SELECT 'EXISTING RLS POLICIES:' as info;

-- Check users table policies
SELECT 'USERS TABLE:' as table_name;
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY policyname;

-- Check marketplace_items policies
SELECT 'MARKETPLACE_ITEMS TABLE:' as table_name;
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'marketplace_items' 
ORDER BY policyname;

-- ==========================================
-- STEP 3: NUCLEAR OPTION - DROP ALL POLICIES AND RECREATE
-- ==========================================

SELECT 'DROPPING ALL EXISTING POLICIES...' as action;

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;

-- Drop ALL existing policies on marketplace_items table
DROP POLICY IF EXISTS "Anyone can view available items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can insert own items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can update own items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can delete own items" ON marketplace_items;
DROP POLICY IF EXISTS "Enable read access for available items" ON marketplace_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON marketplace_items;
DROP POLICY IF EXISTS "Enable update for item owners" ON marketplace_items;
DROP POLICY IF EXISTS "Enable delete for item owners" ON marketplace_items;

-- ==========================================
-- STEP 4: CREATE SIMPLIFIED, WORKING POLICIES
-- ==========================================

SELECT 'CREATING NEW POLICIES...' as action;

-- USERS TABLE POLICIES
-- Allow public read access (for marketplace seller info)
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (auth.uid() = id);

-- MARKETPLACE_ITEMS TABLE POLICIES
-- Allow public read access to available items
CREATE POLICY "items_select_policy" ON marketplace_items
  FOR SELECT USING (is_available = true OR auth.uid() = seller_id);

-- Allow authenticated users to insert their own items
CREATE POLICY "items_insert_policy" ON marketplace_items
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Allow users to update their own items
CREATE POLICY "items_update_policy" ON marketplace_items
  FOR UPDATE USING (auth.uid() = seller_id);

-- Allow users to delete their own items
CREATE POLICY "items_delete_policy" ON marketplace_items
  FOR DELETE USING (auth.uid() = seller_id);

-- ==========================================
-- STEP 5: VERIFY POLICIES WERE CREATED
-- ==========================================

SELECT 'VERIFYING NEW POLICIES:' as info;

-- Check users policies
SELECT 'USERS POLICIES:' as table_name;
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY cmd, policyname;

-- Check marketplace_items policies
SELECT 'MARKETPLACE_ITEMS POLICIES:' as table_name;
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'marketplace_items' 
ORDER BY cmd, policyname;

-- ==========================================
-- STEP 6: TEST POLICIES
-- ==========================================

SELECT 'TESTING POLICIES:' as info;

-- Count policies
SELECT 
  'users' as table_name,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'users'
UNION ALL
SELECT 
  'marketplace_items' as table_name,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'marketplace_items';

-- Final status check
SELECT 
  CASE 
    WHEN (
      SELECT COUNT(*) FROM pg_policies 
      WHERE tablename = 'users' AND cmd = 'INSERT'
    ) > 0 AND (
      SELECT COUNT(*) FROM pg_policies 
      WHERE tablename = 'marketplace_items' AND cmd = 'INSERT'
    ) > 0
    THEN '✅ ALL POLICIES FIXED - Test your app now!'
    ELSE '❌ Still missing policies - check the output above'
  END as final_status;

-- ==========================================
-- STEP 7: ADDITIONAL MARKETPLACE TABLE POLICIES
-- ==========================================

-- Fix other marketplace tables too
DROP POLICY IF EXISTS "Anyone can view active categories" ON marketplace_categories;
CREATE POLICY "categories_select_policy" ON marketplace_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can view own views" ON marketplace_item_views;
DROP POLICY IF EXISTS "Users can insert own views" ON marketplace_item_views;
CREATE POLICY "views_select_policy" ON marketplace_item_views
  FOR SELECT USING (auth.uid() = viewer_id);
CREATE POLICY "views_insert_policy" ON marketplace_item_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

DROP POLICY IF EXISTS "Anyone can view ratings" ON user_ratings;
DROP POLICY IF EXISTS "Users can rate others" ON user_ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON user_ratings;
CREATE POLICY "ratings_select_policy" ON user_ratings
  FOR SELECT USING (true);
CREATE POLICY "ratings_insert_policy" ON user_ratings
  FOR INSERT WITH CHECK (auth.uid() = rater_id AND auth.uid() != rated_user_id);
CREATE POLICY "ratings_update_policy" ON user_ratings
  FOR UPDATE USING (auth.uid() = rater_id);

DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;
CREATE POLICY "favorites_select_policy" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_policy" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_policy" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

SELECT 'Emergency fix complete! All RLS policies have been reset and recreated.' as final_message;

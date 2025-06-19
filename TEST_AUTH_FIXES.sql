-- ==========================================
-- QUICK TEST SCRIPT FOR AUTH FIXES
-- ==========================================
-- Run this after the main database script to test user profile creation

SELECT '🧪 TESTING USER PROFILE CREATION' as status;

-- Test the handle_new_user function
SELECT 'Testing trigger function...' as test_info;

-- Check if the trigger exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created' 
      AND tgrelname = 'users'
    )
    THEN '✅ Trigger exists on auth.users'
    ELSE '❌ Trigger missing on auth.users'
  END as trigger_status;

-- Check if the function exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user')
    THEN '✅ handle_new_user function exists'
    ELSE '❌ handle_new_user function missing'
  END as function_status;

-- Test the get_or_create_user_profile function
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_or_create_user_profile')
    THEN '✅ get_or_create_user_profile function exists'
    ELSE '❌ get_or_create_user_profile function missing'
  END as profile_function_status;

-- Show current user profiles
SELECT 'CURRENT USER PROFILES:' as info;
SELECT 
  id,
  name,
  email,
  college,
  branch,
  year,
  semester,
  is_admin,
  created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 10;

-- Instructions for testing
SELECT '📋 TESTING INSTRUCTIONS:' as test_instructions;
SELECT '1. Try registering a new user with college/branch/year/semester info' as step_1;
SELECT '2. Check if all registration data gets stored in users table' as step_2;
SELECT '3. Try logging in - should show success message before redirect' as step_3;
SELECT '4. Verify user profile contains all registration data' as step_4;

SELECT '✅ Auth testing script completed' as completion;

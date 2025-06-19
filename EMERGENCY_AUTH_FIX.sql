-- ==========================================
-- EMERGENCY AUTH FIX - CREATE MISSING PROFILES
-- ==========================================
-- Run this script to create profiles for any auth users missing them

SELECT '🚨 EMERGENCY: Creating profiles for auth users without profiles' as status;

-- First, let's see who's missing profiles
SELECT 'AUTH USERS WITHOUT PROFILES:' as info;
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN u.id IS NULL THEN '❌ Missing Profile'
    ELSE '✅ Has Profile'
  END as profile_status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.deleted_at IS NULL
ORDER BY au.created_at;

-- Count missing profiles
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(u.id) as users_with_profiles,
  COUNT(*) - COUNT(u.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.deleted_at IS NULL;

-- Create profiles for missing users
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
SELECT 
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    SPLIT_PART(au.email, '@', 1),
    'User'
  ) as name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'college', 'Not specified') as college,
  COALESCE(au.raw_user_meta_data->>'branch', 'Not specified') as branch,
  COALESCE(au.raw_user_meta_data->>'year', 'Not specified') as year,
  COALESCE(au.raw_user_meta_data->>'semester', 'Not specified') as semester,
  COALESCE(au.raw_user_meta_data->>'phone', '') as phone,
  au.raw_user_meta_data->>'avatar_url',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.deleted_at IS NULL 
  AND u.id IS NULL  -- Only users without profiles
ON CONFLICT (id) DO NOTHING;

-- Verify fix
SELECT 'POST-FIX STATUS:' as info;
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(u.id) as users_with_profiles,
  COUNT(*) - COUNT(u.id) as still_missing_profiles,
  CASE 
    WHEN COUNT(*) = COUNT(u.id) THEN '✅ All users now have profiles!'
    ELSE '❌ Some users still missing profiles'
  END as fix_status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.deleted_at IS NULL;

-- Show newly created profiles
SELECT 'NEWLY CREATED PROFILES:' as info;
SELECT 
  name,
  email,
  college,
  branch,
  year,
  semester,
  created_at
FROM public.users 
WHERE updated_at > created_at  -- Profiles where updated_at was set to NOW()
ORDER BY updated_at DESC;

SELECT '✅ Emergency auth fix completed!' as completion;

-- ==========================================
-- DIAGNOSTIC SCRIPT FOR LEARNCONNECT DATABASE
-- ==========================================
-- Run this script to diagnose what's wrong with the database setup

-- ==========================================
-- CHECK 1: BASIC TABLE EXISTENCE
-- ==========================================

SELECT 'TABLE EXISTENCE CHECK:' as check_type;

SELECT 
  schemaname,
  tablename,
  hasrls as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- ==========================================
-- CHECK 2: CURRENT RLS POLICIES
-- ==========================================

SELECT 'CURRENT RLS POLICIES:' as check_type;

SELECT 
    policyname,
    cmd as command,
    permissive,
    qual as "USING clause",
    with_check as "WITH CHECK clause"
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY cmd, policyname;

-- ==========================================
-- CHECK 3: FUNCTION EXISTENCE
-- ==========================================

SELECT 'FUNCTION EXISTENCE CHECK:' as check_type;

SELECT 
  routine_name as function_name,
  routine_type as type,
  specific_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_email_confirmed', 'get_user_profile_safe')
ORDER BY routine_name;

-- ==========================================
-- CHECK 4: TRIGGER EXISTENCE
-- ==========================================

SELECT 'TRIGGER EXISTENCE CHECK:' as check_type;

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_confirmed')
ORDER BY trigger_name;

-- ==========================================
-- CHECK 5: PERMISSIONS
-- ==========================================

SELECT 'PERMISSIONS CHECK:' as check_type;

SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- ==========================================
-- CHECK 6: FUNCTION PERMISSIONS
-- ==========================================

SELECT 'FUNCTION PERMISSIONS CHECK:' as check_type;

SELECT 
  r.routine_name,
  r.routine_type,
  COALESCE(p.privilege_type, 'NO PERMISSIONS') as permissions
FROM information_schema.routines r
LEFT JOIN information_schema.routine_privileges p ON r.specific_name = p.specific_name
WHERE r.routine_schema = 'public' 
AND r.routine_name = 'get_user_profile_safe';

-- ==========================================
-- CHECK 7: TEST FUNCTION CALL
-- ==========================================

SELECT 'FUNCTION TEST:' as check_type;

-- Test if we can call the function (this might fail but will show the error)
DO $$
BEGIN
  BEGIN
    PERFORM public.get_user_profile_safe('00000000-0000-0000-0000-000000000000'::UUID);
    RAISE NOTICE 'Function call succeeded (or returned empty)';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Function call failed: %', SQLERRM;
  END;
END $$;

-- ==========================================
-- CHECK 8: AUTH SCHEMA ACCESS
-- ==========================================

SELECT 'AUTH SCHEMA CHECK:' as check_type;

-- Check if we can access auth.users table
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users')
    THEN 'auth.users table exists'
    ELSE 'auth.users table NOT found'
  END as auth_table_status;

-- ==========================================
-- CHECK 9: USER COUNT
-- ==========================================

SELECT 'USER COUNT CHECK:' as check_type;

SELECT 
  (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count;

-- ==========================================
-- CHECK 10: SAMPLE FUNCTION DEFINITION
-- ==========================================

SELECT 'FUNCTION DEFINITION CHECK:' as check_type;

SELECT 
  routine_name,
  data_type as return_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_user_profile_safe';

-- ==========================================
-- SUMMARY
-- ==========================================

SELECT 'DIAGNOSTIC SUMMARY:' as summary;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') > 0
    THEN '✅ RLS policies exist'
    ELSE '❌ No RLS policies found'
  END as rls_status,
  
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'get_user_profile_safe') > 0
    THEN '✅ get_user_profile_safe function exists'
    ELSE '❌ get_user_profile_safe function missing'
  END as function_status,
  
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') > 0
    THEN '✅ User creation trigger exists'
    ELSE '❌ User creation trigger missing'
  END as trigger_status;

SELECT 'Run this diagnostic script to see what needs to be fixed!' as instructions;

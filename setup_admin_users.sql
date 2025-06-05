-- ==========================================
-- SETUP INITIAL ADMIN USERS
-- ==========================================
-- This script helps set up initial admin users

SELECT '👨‍💼 Setting up initial admin users' as status;

-- Make specific users admin (replace with actual user emails)
-- UPDATE public.users 
-- SET is_admin = true 
-- WHERE email IN (
--   'admin@example.com',
--   'your-email@example.com'
-- );

-- Show current admin users
SELECT 
  'CURRENT ADMIN USERS:' as info,
  email,
  name,
  is_admin,
  created_at
FROM public.users 
WHERE is_admin = true
ORDER BY created_at;

-- Show verification statistics
SELECT 
  'VERIFICATION STATS:' as info,
  verification_status,
  COUNT(*) as count
FROM public.marketplace_items 
GROUP BY verification_status
ORDER BY verification_status;

SELECT '✅ Admin user setup completed!' as completion_message;
SELECT 'Uncomment and modify the UPDATE query above to make specific users admin' as instruction;

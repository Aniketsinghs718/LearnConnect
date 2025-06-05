-- ==========================================
-- ADMIN VERIFICATION SYSTEM SETUP
-- ==========================================
-- This script adds product verification functionality to the marketplace

SELECT '🛡️ Adding Admin Verification System' as status;

-- Add verification status to marketplace_items table
ALTER TABLE public.marketplace_items 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add is_admin field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_marketplace_items_verification_status ON public.marketplace_items(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_admin ON public.users(is_admin);

-- Update existing items to be approved (for backward compatibility)
UPDATE public.marketplace_items 
SET verification_status = 'approved' 
WHERE verification_status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';

-- Create RLS policies for admin access
-- Admins can see all items regardless of verification status
CREATE POLICY "admin_items_select_all" ON public.marketplace_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Admins can update verification status
CREATE POLICY "admin_items_update_verification" ON public.marketplace_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Update the existing select policy to only show approved items to non-admins
DROP POLICY IF EXISTS "items_select_available_or_own" ON public.marketplace_items;
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION approve_marketplace_item(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_marketplace_item(UUID, TEXT, TEXT) TO authenticated;

-- Verification queries
SELECT '✅ VERIFICATION RESULTS:' as status;

-- Check if columns were added
SELECT 
  'COLUMNS CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'verification_status')
    THEN '✅ verification_status column added'
    ELSE '❌ verification_status column missing'
  END as verification_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin')
    THEN '✅ is_admin column added'
    ELSE '❌ is_admin column missing'
  END as admin_column;

-- Check functions
SELECT 
  'FUNCTIONS CHECK:' as info,
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
  'ITEM STATUS COUNT:' as info,
  verification_status,
  COUNT(*) as count
FROM public.marketplace_items 
GROUP BY verification_status
ORDER BY verification_status;

SELECT '🎉 Admin verification system setup completed!' as completion_message;
SELECT 'Make sure to set is_admin = true for admin users in the users table' as admin_setup_note;

-- ==========================================
-- MARKETPLACE UPDATES - Remove Rating, Sales, Views & Update Categories
-- ==========================================

-- Remove rating, total_sales and views_count related fields from users table
ALTER TABLE public.users 
DROP COLUMN IF EXISTS rating,
DROP COLUMN IF EXISTS total_sales;

-- Remove views_count from marketplace_items table
ALTER TABLE public.marketplace_items 
DROP COLUMN IF EXISTS views_count,
DROP COLUMN IF EXISTS view_count;

-- Add size field for aprons (specific to workshop_apron and lab_apron categories)
ALTER TABLE public.marketplace_items 
ADD COLUMN IF NOT EXISTS size TEXT CHECK (size IN ('M', 'L', 'XL'));

-- Update location to be college_name instead of general location
ALTER TABLE public.marketplace_items 
RENAME COLUMN location TO college_name;

-- Remove marketplace_item_views table as we're removing view tracking
DROP TABLE IF EXISTS public.marketplace_item_views CASCADE;

-- Remove user_ratings table as we're removing rating system
DROP TABLE IF EXISTS public.user_ratings CASCADE;

-- Clear existing categories and add new ones
DELETE FROM public.marketplace_categories;

-- Insert new category structure
INSERT INTO public.marketplace_categories (name, description, icon, color, sort_order) VALUES
  ('Books', 'Textbooks, novels, and academic materials', '📚', '#3B82F6', 1),
  ('Calculator', 'Scientific and graphing calculators', '🔢', '#10B981', 2),
  ('Lab Apron', 'Laboratory aprons for science experiments', '🥼', '#F59E0B', 3),
  ('Workshop Apron', 'Workshop aprons for technical work', '👷', '#EF4444', 4),
  ('Accessories', 'General academic and study accessories', '🎒', '#8B5CF6', 5),
  ('Others', 'Miscellaneous items and general goods', '📦', '#6B7280', 6);

-- Update the marketplace items table structure to include is_sold field if not exists
ALTER TABLE public.marketplace_items 
ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT false;

-- Update existing items to ensure proper sold status
UPDATE public.marketplace_items 
SET is_sold = false 
WHERE is_sold IS NULL;

-- Add edit functionality - ensure users can update their own items
-- (RLS policies should already allow this, but let's verify)

-- Create or update RLS policy for item updates
DROP POLICY IF EXISTS "items_update_own" ON public.marketplace_items;
CREATE POLICY "items_update_own" ON public.marketplace_items
  FOR UPDATE USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Ensure mark as sold functionality works properly
-- Fix any potential issues with the sold status update

-- Add function to handle marking items as sold with proper logging
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION mark_item_as_sold(UUID) TO authenticated;

-- Verification queries
SELECT '✅ VERIFICATION RESULTS:' as status;

-- Check categories
SELECT 
  'CATEGORIES CHECK:' as info,
  COUNT(*) as category_count,
  CASE 
    WHEN COUNT(*) = 6
    THEN '✅ All 6 categories created correctly'
    ELSE '❌ Category count mismatch'
  END as categories_status
FROM public.marketplace_categories;

-- List all categories
SELECT name, icon, description FROM public.marketplace_categories ORDER BY sort_order;

-- Check table structure
SELECT 
  'TABLE STRUCTURE CHECK:' as info,
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
  END as sold_status;

-- Check removed columns
SELECT 
  'REMOVED FIELDS CHECK:' as info,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'rating')
    THEN '✅ rating removed from users'
    ELSE '❌ rating still exists in users'
  END as rating_removed,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_sales')
    THEN '✅ total_sales removed from users'
    ELSE '❌ total_sales still exists in users'
  END as sales_removed,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'views_count')
    THEN '✅ views_count removed from items'
    ELSE '❌ views_count still exists in items'
  END as views_removed;

-- Check function creation
SELECT 
  'FUNCTION CHECK:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'mark_item_as_sold')
    THEN '✅ mark_item_as_sold function created'
    ELSE '❌ mark_item_as_sold function missing'
  END as function_status;

SELECT '🎉 Marketplace updates completed! Please update your frontend code accordingly.' as completion_message;

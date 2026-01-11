-- Migration: Add daily specials support to menu_items table
-- Description: Adds fields to track daily special dishes with dates

-- Add is_daily_special column (boolean to mark if item is a daily special)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS is_daily_special BOOLEAN DEFAULT false;

-- Add special_date column (date when this item is featured as daily special)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS special_date DATE;

-- Add special_price column (optional discounted price for daily specials)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS special_price DECIMAL(10,2);

-- Create index for faster queries on daily specials
CREATE INDEX IF NOT EXISTS idx_menu_items_daily_special
ON menu_items(is_daily_special, special_date)
WHERE is_daily_special = true;

-- Comments for documentation
COMMENT ON COLUMN menu_items.is_daily_special IS 'Indicates if this item is currently a daily special';
COMMENT ON COLUMN menu_items.special_date IS 'Date when this item is featured as the daily special';
COMMENT ON COLUMN menu_items.special_price IS 'Optional special price when item is daily special (if different from regular price)';

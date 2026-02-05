-- Run this key in your Supabase SQL Editor to fix the "value too long" errors.
-- This changes the constrained VARCHAR(255) columns to TEXT, which allows unlimited length.

ALTER TABLE products ALTER COLUMN description TYPE text;
ALTER TABLE products ALTER COLUMN name TYPE text;
ALTER TABLE products ALTER COLUMN product_name TYPE text; 
ALTER TABLE products ALTER COLUMN image TYPE text;
ALTER TABLE products ALTER COLUMN image_url TYPE text;
ALTER TABLE products ALTER COLUMN urdu_name TYPE text;

-- Note: product_name and image_url are likely aliases or duplicates based on the code,
-- so we try to alter all potential column names. If a column doesn't exist, the command will fail safely for that line.

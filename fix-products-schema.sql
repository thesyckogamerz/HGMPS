-- Complete Products Table Schema Fix (Final Version for ID Identity)
-- This adds all missing columns AND handles the identity-to-text conversion for IDs

-- 1. Drop identity from ID column if it exists
-- This allows us to change the type from numeric BIGINT to string TEXT
ALTER TABLE public.products 
ALTER COLUMN id DROP IDENTITY IF EXISTS;

-- 2. Change ID column to TEXT to support slug-based IDs (like "ashwagandha-gold")
ALTER TABLE public.products 
ALTER COLUMN id TYPE TEXT;

-- 3. Add all missing columns required by the application
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'grams';

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS urdu_name TEXT;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS rating FLOAT8 DEFAULT 0;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Sync and update existing records
UPDATE public.products 
SET in_stock = (COALESCE(stock_quantity, 0) > 0)
WHERE in_stock IS NULL;

-- 5. Clean up legacy column naming consistency
UPDATE public.products 
SET 
    name = COALESCE(name, product_name),
    image = COALESCE(image, image_url)
WHERE name IS NULL OR image IS NULL;

-- 6. Add table documentation
COMMENT ON TABLE public.products IS 'E-commerce products with full details including variants, discounts, and stock management';

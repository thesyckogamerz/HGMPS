-- ============================================
-- AUREXA E-Commerce: Products Table RLS Policies
-- ============================================
-- This script enables Row Level Security on the products table
-- and creates policies to allow admin users to manage products
-- Execute this in your Supabase SQL Editor

-- 1. Enable Row Level Security on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS Policies for Admin Management
-- Allow admin (HGMPS@gmail.com) to view all products
CREATE POLICY "Admin can view all products" ON public.products
    FOR SELECT USING (auth.jwt() ->> 'email' = 'HGMPS@gmail.com');

-- Allow admin to insert new products
CREATE POLICY "Admin can insert products" ON public.products
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'HGMPS@gmail.com');

-- Allow admin to update products
CREATE POLICY "Admin can update products" ON public.products
    FOR UPDATE USING (auth.jwt() ->> 'email' = 'HGMPS@gmail.com');

-- Allow admin to delete products
CREATE POLICY "Admin can delete products" ON public.products
    FOR DELETE USING (auth.jwt() ->> 'email' = 'HGMPS@gmail.com');

-- 3. Optional: Allow all authenticated users to view products (for public access)
-- Uncomment the following if you want customers to view products
-- CREATE POLICY "Authenticated users can view products" ON public.products
--     FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Create indexes for better performance (if not already created)
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the policies were created successfully:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'products';
--
-- To check RLS status:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'products';

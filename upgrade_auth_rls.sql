-- ============================================
-- Hakeem Mohsin E-Commerce: Auth & RLS Upgrade Script
-- ============================================

-- 1. Add 'role' column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- 2. Update existing admin user to have 'admin' role
-- REPLACE 'your-admin-email@example.com' with the actual admin email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'HGMPS@gmail.com' OR email ILIKE '%admin%';

-- 3. Drop old restrictive policies
DROP POLICY IF EXISTS "Admin can view all products" ON public.products;
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access" ON public.products;

-- 4. Create new robust RLS policies for Products

-- Allow everyone to view products (Public Read)
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT USING (true);

-- Allow Admins to Insert/Update/Delete
-- This checks if the user has a profile with role='admin'
CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Update Profiles RLS to allow reading roles
-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles (optional, useful for user management)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- Hakeem Mohsin E-Commerce: Carts Table Setup
-- ============================================
-- This script creates the carts table for storing user shopping carts
-- Execute this in your Supabase SQL Editor

-- 1. Create the carts table
CREATE TABLE IF NOT EXISTS public.carts (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    items JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow users to view their own cart
CREATE POLICY "Users can view own cart" ON public.carts
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert/update/delete their own cart
CREATE POLICY "Users can manage own cart" ON public.carts
    FOR ALL USING (auth.uid() = user_id);

-- 4. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON public.carts(updated_at);

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the table was created successfully:
-- SELECT * FROM public.carts LIMIT 1;

-- To check the table structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'carts' AND table_schema = 'public';

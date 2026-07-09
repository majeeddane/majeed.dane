-- ============================================================
-- Fix: Ensure uploads bucket is PUBLIC and readable by everyone
-- Run this in Supabase SQL Editor if images don't show on site
-- ============================================================

-- 1. Make sure the bucket is set to public
UPDATE storage.buckets
SET public = true
WHERE id = 'uploads';

-- 2. Drop any conflicting SELECT policy and recreate it
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 3. Create a clear public read policy for ALL users (anon + authenticated)
CREATE POLICY "Anyone can read uploads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'uploads');

-- 4. Ensure anon INSERT is allowed (for browser uploads)
DROP POLICY IF EXISTS "Anon can upload to uploads" ON storage.objects;
CREATE POLICY "Anon can upload to uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'uploads');

-- 5. Allow update (needed for upsert)
DROP POLICY IF EXISTS "Anon can update uploads" ON storage.objects;
CREATE POLICY "Anon can update uploads" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'uploads');

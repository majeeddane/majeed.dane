-- ============================================================
-- Fix: Allow anonymous browser uploads to Supabase Storage
-- Run this once in Supabase SQL Editor
-- ============================================================
--
-- Problem: The previous policy "Service role upload" required
-- an authenticated role, blocking direct browser uploads using
-- the anon key. Vercel serverless functions have a ~4.5 MB body
-- limit, so routing uploads through /api/upload caused HTTP 413.
--
-- Solution: Allow anon INSERT on the uploads bucket so the
-- browser can upload directly without going through a serverless
-- function. The bucket is already public (readable by everyone).
-- ============================================================

-- Drop the old restrictive policy if it exists
DROP POLICY IF EXISTS "Service role upload" ON storage.objects;

-- Allow anyone (including anon) to upload into the uploads bucket
CREATE POLICY "Anon can upload to uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'uploads');

-- Keep the existing public read policy (SELECT)
-- "Public read uploads" was already created in setup.

-- Allow update (for upsert operations)
DROP POLICY IF EXISTS "Service role update" ON storage.objects;
CREATE POLICY "Anon can update uploads" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'uploads');

-- Optional: allow deletion via service role (keep tight)
-- "Service role delete" policy is kept as-is from original setup.

-- ==============================================================================
-- Supabase Storage Bucket & RLS Policy Setup for Forza Horizon 6 Cars Platform
-- ==============================================================================

-- 1. Create a public storage bucket named 'car-images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  10485760, -- 10MB limit per image file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public read access to car images
DROP POLICY IF EXISTS "Public Car Images Access" ON storage.objects;
CREATE POLICY "Public Car Images Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- 4. Policy: Allow service role / authenticated admins upload access
DROP POLICY IF EXISTS "Admin Insert Car Images" ON storage.objects;
CREATE POLICY "Admin Insert Car Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'car-images');

-- 5. Policy: Allow service role / authenticated admins update access
DROP POLICY IF EXISTS "Admin Update Car Images" ON storage.objects;
CREATE POLICY "Admin Update Car Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'car-images');

-- 6. Policy: Allow service role / authenticated admins delete access
DROP POLICY IF EXISTS "Admin Delete Car Images" ON storage.objects;
CREATE POLICY "Admin Delete Car Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'car-images');

/**
 * Direct-to-Supabase Storage upload utility.
 *
 * Why: Vercel Serverless Functions have a ~4.5 MB body-size limit on the Hobby
 * plan. Routing file uploads through /api/upload easily exceeds this and causes
 * HTTP 413 errors. Instead we upload directly from the browser using the public
 * anon key + Supabase Storage client SDK, which has no such limit.
 *
 * Prerequisites (one-time, run in Supabase SQL editor):
 *   CREATE POLICY "Anon upload" ON storage.objects
 *     FOR INSERT WITH CHECK (bucket_id = 'uploads');
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET = 'uploads';

// Singleton client for browser-side uploads
let _client: ReturnType<typeof createClient> | null = null;
function getAnonClient() {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

function generateFilename(originalName: string, purpose?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.includes('.')
    ? originalName.split('.').pop()!.toLowerCase()
    : 'bin';
  const prefix = purpose ? purpose.replace(/[^a-zA-Z0-9_-]/g, '_') : 'file';
  return `${prefix}_${timestamp}_${random}.${ext}`;
}

export interface UploadResult {
  url: string;
  filename: string;
  path: string;
}

/**
 * Upload a File/Blob directly from the browser to Supabase Storage.
 * Returns UploadResult on success, throws on error.
 */
export async function uploadFileDirect(
  file: File | Blob,
  purpose?: string,
  originalName?: string,
): Promise<UploadResult> {
  const name =
    originalName ?? (file instanceof File ? file.name : 'upload.bin');
  const filename = generateFilename(name, purpose);
  const mimeType =
    file.type ||
    (name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

  const supabase = getAnonClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error('[uploadFileDirect] Supabase error:', error);
    throw new Error(error.message || 'Upload to Supabase failed');
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  return {
    url: urlData.publicUrl,
    filename,
    path: data.path,
  };
}

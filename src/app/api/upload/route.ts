import { NextResponse } from 'next/server';
import { getServerSupabase, STORAGE_BUCKET } from '@/lib/supabase';

// Allowed MIME types
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  pdf: ['application/pdf'],
};

const ALL_ALLOWED_MIMES = [
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.pdf,
];

// Extension map for safe filenames
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

function generateUniqueFilename(originalName: string, purpose?: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = originalName.includes('.')
    ? originalName.split('.').pop()!.toLowerCase()
    : 'bin';

  const prefix = purpose ? purpose.replace(/[^a-zA-Z0-9_-]/g, '_') : 'file';
  return `${prefix}_${timestamp}_${randomStr}.${ext}`;
}

// POST - Upload a file to Supabase Storage
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const purpose = formData.get('purpose') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALL_ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types: ${ALL_ALLOWED_MIMES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const filename = generateUniqueFilename(file.name, purpose ?? undefined);

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage using service role
    const supabase = getServerSupabase();
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;

    return NextResponse.json(
      {
        success: true,
        file: {
          url: publicUrl,
          filename,
          originalName: file.name,
          mimetype: file.type,
          purpose: purpose ?? null,
        },
        // Also expose url at top level for convenience
        url: publicUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

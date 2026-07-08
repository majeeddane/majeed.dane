import { NextResponse } from 'next/server';
import { getServerSupabase, STORAGE_BUCKET } from '@/lib/supabase';

// Allowed MIME types
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  pdf: ['application/pdf'],
};

const ALL_ALLOWED_MIMES = [
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.pdf,
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 10MB.` },
        { status: 400 }
      );
    }

    // Validate MIME type - also allow empty MIME types for some browsers
    if (file.type && !ALL_ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types: ${ALL_ALLOWED_MIMES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Log upload attempt for debugging
    console.log(`[Upload] Starting upload: name=${file.name}, type=${file.type}, size=${file.size}, purpose=${purpose}`);

    // Generate a unique filename
    const filename = generateUniqueFilename(file.name, purpose ?? undefined);

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage using service role
    const supabase = getServerSupabase();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload] Supabase upload error:', JSON.stringify({
        message: uploadError.message,
        name: uploadError.name,
        statusCode: (uploadError as any).statusCode,
      }));
      return NextResponse.json(
        { error: `Upload to storage failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;

    // Verify the URL is accessible
    console.log(`[Upload] Success: ${filename} -> ${publicUrl}`);

    return NextResponse.json(
      {
        success: true,
        file: {
          url: publicUrl,
          filename,
          originalName: file.name,
          mimetype: file.type,
          purpose: purpose ?? null,
          path: uploadData?.path,
        },
        // Also expose url at top level for convenience
        url: publicUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('[Upload] Unexpected error:', errorMessage, errorStack);
    return NextResponse.json(
      { error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    );
  }
}

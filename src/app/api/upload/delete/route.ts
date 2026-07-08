import { NextResponse } from 'next/server';
import { getServerSupabase, STORAGE_BUCKET } from '@/lib/supabase';

// POST - Delete a file from Supabase Storage
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Extract the filename from the path (could be a full URL or just the filename)
    let filename = path;

    // If it's a full URL, extract just the filename part
    if (path.startsWith('http')) {
      try {
        const url = new URL(path);
        // The path after /uploads/ is the filename
        const pathParts = url.pathname.split('/uploads/');
        if (pathParts.length > 1) {
          filename = pathParts[1];
        }
      } catch {
        // If URL parsing fails, use the path as-is
      }
    }

    // Delete from Supabase Storage using service role
    const supabase = getServerSupabase();
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename]);

    if (deleteError) {
      console.error('[Upload Delete] Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: `Delete failed: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      filename,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Upload Delete] Error:', errorMessage);
    return NextResponse.json(
      { error: `Failed to delete file: ${errorMessage}` },
      { status: 500 }
    );
  }
}

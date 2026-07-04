import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

// POST file upload
export async function POST(request: Request) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const purpose = formData.get('purpose') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueName = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    // Save file record to database
    const uploadedFile = await db.uploadedFile.create({
      data: {
        filename: uniqueName,
        originalName: file.name,
        mimetype: file.type || 'application/octet-stream',
        purpose: purpose ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: uploadedFile.id,
        url: fileUrl,
        filename: uniqueName,
        originalName: file.name,
        mimetype: file.type,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

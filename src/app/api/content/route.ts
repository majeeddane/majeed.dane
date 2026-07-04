import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all content
export async function GET() {
  try {
    const content = await db.siteContent.findMany({
      orderBy: { key: 'asc' },
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT update content by key
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, valueAr, valueEn, type } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    const updated = await db.siteContent.upsert({
      where: { key },
      update: {
        ...(valueAr !== undefined && { valueAr }),
        ...(valueEn !== undefined && { valueEn }),
        ...(type !== undefined && { type }),
      },
      create: {
        key,
        valueAr: valueAr ?? null,
        valueEn: valueEn ?? null,
        type: type ?? 'text',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT batch update/create multiple content items
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Request body must be an array of {key, valueAr, valueEn} objects' },
        { status: 400 }
      );
    }

    const results = [];

    for (const item of body) {
      const { key, valueAr, valueEn } = item;

      if (!key) {
        results.push({ key: null, success: false, error: 'Key is required' });
        continue;
      }

      try {
        const updated = await db.siteContent.upsert({
          where: { key },
          update: {
            ...(valueAr !== undefined && { valueAr }),
            ...(valueEn !== undefined && { valueEn }),
          },
          create: {
            key,
            valueAr: valueAr ?? null,
            valueEn: valueEn ?? null,
            type: 'text',
          },
        });

        results.push({ key, success: true, data: updated });
      } catch (itemError) {
        console.error(`Error upserting content item with key "${key}":`, itemError);
        results.push({ key, success: false, error: 'Failed to upsert content item' });
      }
    }

    const allSuccess = results.every((r) => r.success);

    return NextResponse.json(
      { success: allSuccess, results },
      { status: allSuccess ? 200 : 207 }
    );
  } catch (error) {
    console.error('Error batch updating content:', error);
    return NextResponse.json(
      { error: 'Failed to batch update content' },
      { status: 500 }
    );
  }
}

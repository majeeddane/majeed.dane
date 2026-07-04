import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all portfolio items
export async function GET() {
  try {
    const items = await db.portfolioItem.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

// POST create new portfolio item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleAr, titleEn, category, imageUrl, order, visible } = body;

    if (!titleAr || !titleEn || !imageUrl) {
      return NextResponse.json(
        { error: 'titleAr, titleEn, and imageUrl are required' },
        { status: 400 }
      );
    }

    const item = await db.portfolioItem.create({
      data: {
        titleAr,
        titleEn,
        category: category ?? 'posts',
        imageUrl,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}

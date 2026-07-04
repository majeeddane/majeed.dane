import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update portfolio item by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, category, imageUrl, order, visible } = body;

    const existing = await db.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const updated = await db.portfolioItem.update({
      where: { id },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

// DELETE portfolio item by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    await db.portfolioItem.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Portfolio item deleted' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}

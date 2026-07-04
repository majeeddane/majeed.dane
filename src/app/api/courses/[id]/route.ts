import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update course by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, icon, order, visible } = body;

    const existing = await db.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const updated = await db.course.update({
      where: { id },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE course by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    await db.course.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}

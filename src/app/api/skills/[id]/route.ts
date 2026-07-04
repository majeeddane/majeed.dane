import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update skill by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, descAr, descEn, icon, level, category, order, visible } = body;

    const existing = await db.skill.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    const updated = await db.skill.update({
      where: { id },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(descAr !== undefined && { descAr }),
        ...(descEn !== undefined && { descEn }),
        ...(icon !== undefined && { icon }),
        ...(level !== undefined && { level }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.skill.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    await db.skill.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}

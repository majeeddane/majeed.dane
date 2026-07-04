import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update experience by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { companyAr, companyEn, descAr, descEn, order, visible } = body;

    const existing = await db.experience.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const updated = await db.experience.update({
      where: { id },
      data: {
        ...(companyAr !== undefined && { companyAr }),
        ...(companyEn !== undefined && { companyEn }),
        ...(descAr !== undefined && { descAr }),
        ...(descEn !== undefined && { descEn }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE experience by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.experience.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    await db.experience.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}

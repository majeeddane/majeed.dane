import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update client logo by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameAr, nameEn, logoUrl, order, visible } = body;

    const existing = await db.clientLogo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const updated = await db.clientLogo.update({
      where: { id },
      data: {
        ...(nameAr !== undefined && { nameAr }),
        ...(nameEn !== undefined && { nameEn }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE client logo by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.clientLogo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    await db.clientLogo.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

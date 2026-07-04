import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all client logos (ordered)
export async function GET() {
  try {
    const clients = await db.clientLogo.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST create new client logo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, logoUrl, order, visible } = body;

    if (!nameAr || !nameEn) {
      return NextResponse.json(
        { error: 'nameAr and nameEn are required' },
        { status: 400 }
      );
    }

    const client = await db.clientLogo.create({
      data: {
        nameAr,
        nameEn,
        logoUrl: logoUrl ?? null,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

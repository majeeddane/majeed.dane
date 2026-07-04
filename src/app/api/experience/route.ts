import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all experiences (ordered by order field)
export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST create new experience
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyAr, companyEn, descAr, descEn, order, visible } = body;

    if (!companyAr || !companyEn) {
      return NextResponse.json(
        { error: 'companyAr and companyEn are required' },
        { status: 400 }
      );
    }

    const experience = await db.experience.create({
      data: {
        companyAr,
        companyEn,
        descAr: descAr ?? '',
        descEn: descEn ?? '',
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}

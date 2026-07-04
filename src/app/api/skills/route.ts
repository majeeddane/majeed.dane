import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all skills (ordered)
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST create new skill
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleAr, titleEn, descAr, descEn, icon, level, category, order, visible } = body;

    if (!titleAr || !titleEn) {
      return NextResponse.json(
        { error: 'titleAr and titleEn are required' },
        { status: 400 }
      );
    }

    const skill = await db.skill.create({
      data: {
        titleAr,
        titleEn,
        descAr: descAr ?? null,
        descEn: descEn ?? null,
        icon: icon ?? null,
        level: level ?? 80,
        category: category ?? 'design',
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

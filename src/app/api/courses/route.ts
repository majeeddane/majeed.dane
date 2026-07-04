import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all courses (ordered)
export async function GET() {
  try {
    const courses = await db.course.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST create new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleAr, titleEn, icon, order, visible } = body;

    if (!titleAr || !titleEn) {
      return NextResponse.json(
        { error: 'titleAr and titleEn are required' },
        { status: 400 }
      );
    }

    const course = await db.course.create({
      data: {
        titleAr,
        titleEn,
        icon: icon ?? null,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

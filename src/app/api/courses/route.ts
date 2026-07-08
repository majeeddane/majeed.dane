import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all courses (ordered)
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('order');

    if (error) throw error;

    const normalized = (data || []).map((item: {
      id: string;
      title_ar: string;
      title_en: string;
      icon: string | null;
      order: number;
      visible: boolean;
    }) => ({
      id: item.id,
      titleAr: item.title_ar,
      titleEn: item.title_en,
      icon: item.icon,
      order: item.order,
      visible: item.visible,
    }));

    return NextResponse.json(normalized);
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

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title_ar: titleAr,
        title_en: titleEn,
        icon: icon ?? null,
        order: order ?? 0,
        visible: visible ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      titleAr: data.title_ar,
      titleEn: data.title_en,
      icon: data.icon,
      order: data.order,
      visible: data.visible,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

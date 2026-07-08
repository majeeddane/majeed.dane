import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all skills (ordered)
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order');

    if (error) throw error;

    const normalized = (data || []).map((item: {
      id: string;
      title_ar: string;
      title_en: string;
      desc_ar: string | null;
      desc_en: string | null;
      icon: string | null;
      level: number;
      category: string;
      order: number;
      visible: boolean;
    }) => ({
      id: item.id,
      titleAr: item.title_ar,
      titleEn: item.title_en,
      descAr: item.desc_ar,
      descEn: item.desc_en,
      icon: item.icon,
      level: item.level,
      category: item.category,
      order: item.order,
      visible: item.visible,
    }));

    return NextResponse.json(normalized);
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

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('skills')
      .insert({
        title_ar: titleAr,
        title_en: titleEn,
        desc_ar: descAr ?? null,
        desc_en: descEn ?? null,
        icon: icon ?? null,
        level: level ?? 80,
        category: category ?? 'design',
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
      descAr: data.desc_ar,
      descEn: data.desc_en,
      icon: data.icon,
      level: data.level,
      category: data.category,
      order: data.order,
      visible: data.visible,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

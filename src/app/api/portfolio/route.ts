import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all portfolio items
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('order');

    if (error) throw error;

    const normalized = (data || []).map((item: {
      id: string;
      title_ar: string;
      title_en: string;
      category: string;
      image_url: string;
      description_ar: string | null;
      description_en: string | null;
      project_url: string | null;
      order: number;
      visible: boolean;
    }) => ({
      id: item.id,
      titleAr: item.title_ar,
      titleEn: item.title_en,
      category: item.category,
      imageUrl: item.image_url,
      descriptionAr: item.description_ar,
      descriptionEn: item.description_en,
      projectUrl: item.project_url,
      order: item.order,
      visible: item.visible,
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

// POST create new portfolio item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleAr, titleEn, category, imageUrl, descriptionAr, descriptionEn, projectUrl, order, visible } = body;

    if (!titleAr || !titleEn) {
      return NextResponse.json(
        { error: 'titleAr and titleEn are required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        title_ar: titleAr,
        title_en: titleEn,
        category: category ?? 'posts',
        image_url: imageUrl || '',
        description_ar: descriptionAr ?? null,
        description_en: descriptionEn ?? null,
        project_url: projectUrl ?? null,
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
      category: data.category,
      imageUrl: data.image_url,
      descriptionAr: data.description_ar,
      descriptionEn: data.description_en,
      projectUrl: data.project_url,
      order: data.order,
      visible: data.visible,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}

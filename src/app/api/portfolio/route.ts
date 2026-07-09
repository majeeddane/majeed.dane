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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error fetching portfolio items:', msg);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items', detail: msg },
      { status: 500 }
    );
  }
}

// POST create new portfolio item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      titleAr,
      titleEn,
      category,
      imageUrl,
      descriptionAr,
      descriptionEn,
      projectUrl,
      order,
      visible,
    } = body;

    // Validate required fields
    if (!titleAr || typeof titleAr !== 'string' || titleAr.trim() === '') {
      return NextResponse.json(
        { error: 'titleAr is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!titleEn || typeof titleEn !== 'string' || titleEn.trim() === '') {
      return NextResponse.json(
        { error: 'titleEn is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    console.log('[Portfolio POST] Inserting:', {
      titleAr,
      titleEn,
      category,
      imageUrl: imageUrl ? '(set)' : '(empty)',
    });

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        title_ar: titleAr.trim(),
        title_en: titleEn.trim(),
        category: category ?? 'posts',
        image_url: imageUrl || '',
        description_ar: descriptionAr || null,
        description_en: descriptionEn || null,
        project_url: projectUrl || null,
        order: typeof order === 'number' ? order : 0,
        visible: visible !== undefined ? visible : true,
      })
      .select()
      .single();

    if (error) {
      console.error('[Portfolio POST] Supabase error:', JSON.stringify({
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }));
      return NextResponse.json(
        {
          error: 'Database error when creating portfolio item',
          detail: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log('[Portfolio POST] Success:', data.id);

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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[Portfolio POST] Unexpected error:', msg);
    return NextResponse.json(
      { error: 'Unexpected server error', detail: msg },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all experiences (ordered by order field)
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order');

    if (error) throw error;

    const normalized = (data || []).map((item: {
      id: string;
      company_ar: string;
      company_en: string;
      desc_ar: string;
      desc_en: string;
      order: number;
      visible: boolean;
      created_at: string;
    }) => ({
      id: item.id,
      companyAr: item.company_ar,
      companyEn: item.company_en,
      descAr: item.desc_ar,
      descEn: item.desc_en,
      order: item.order,
      visible: item.visible,
      createdAt: item.created_at,
    }));

    return NextResponse.json(normalized);
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

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('experiences')
      .insert({
        company_ar: companyAr,
        company_en: companyEn,
        desc_ar: descAr ?? '',
        desc_en: descEn ?? '',
        order: order ?? 0,
        visible: visible ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      companyAr: data.company_ar,
      companyEn: data.company_en,
      descAr: data.desc_ar,
      descEn: data.desc_en,
      order: data.order,
      visible: data.visible,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}

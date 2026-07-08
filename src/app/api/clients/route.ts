import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all client logos (ordered)
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .order('order');

    if (error) throw error;

    const normalized = (data || []).map((item: {
      id: string;
      name_ar: string;
      name_en: string;
      logo_url: string | null;
      order: number;
      visible: boolean;
    }) => ({
      id: item.id,
      nameAr: item.name_ar,
      nameEn: item.name_en,
      logoUrl: item.logo_url,
      order: item.order,
      visible: item.visible,
    }));

    return NextResponse.json(normalized);
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

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('client_logos')
      .insert({
        name_ar: nameAr,
        name_en: nameEn,
        logo_url: logoUrl ?? null,
        order: order ?? 0,
        visible: visible ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      nameAr: data.name_ar,
      nameEn: data.name_en,
      logoUrl: data.logo_url,
      order: data.order,
      visible: data.visible,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

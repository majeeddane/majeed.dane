import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET all content
export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('key');

    if (error) throw error;

    // Normalize field names for frontend compatibility
    const normalized = (data || []).map((item: {
      id: string;
      key: string;
      value_ar: string | null;
      value_en: string | null;
      type: string;
      created_at: string;
      updated_at: string;
    }) => ({
      id: item.id,
      key: item.key,
      valueAr: item.value_ar,
      valueEn: item.value_en,
      type: item.type,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT update content by key
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, valueAr, valueEn, type } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Check if exists
    const { data: existing } = await supabase
      .from('site_content')
      .select('id')
      .eq('key', key)
      .single();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('site_content')
        .update({
          ...(valueAr !== undefined && { value_ar: valueAr }),
          ...(valueEn !== undefined && { value_en: valueEn }),
          ...(type !== undefined && { type }),
          updated_at: new Date().toISOString(),
        })
        .eq('key', key)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('site_content')
        .insert({
          key,
          value_ar: valueAr ?? null,
          value_en: valueEn ?? null,
          type: type ?? 'text',
        })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      id: result.id,
      key: result.key,
      valueAr: result.value_ar,
      valueEn: result.value_en,
      type: result.type,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// PUT update skill by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, descAr, descEn, icon, level, category, order, visible } = body;

    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('skills')
      .update({
        ...(titleAr !== undefined && { title_ar: titleAr }),
        ...(titleEn !== undefined && { title_en: titleEn }),
        ...(descAr !== undefined && { desc_ar: descAr }),
        ...(descEn !== undefined && { desc_en: descEn }),
        ...(icon !== undefined && { icon }),
        ...(level !== undefined && { level }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}

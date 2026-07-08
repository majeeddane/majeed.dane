import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// PUT update course by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, icon, order, visible } = body;

    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('courses')
      .update({
        ...(titleAr !== undefined && { title_ar: titleAr }),
        ...(titleEn !== undefined && { title_en: titleEn }),
        ...(icon !== undefined && { icon }),
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
      icon: data.icon,
      order: data.order,
      visible: data.visible,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE course by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}

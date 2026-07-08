import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// PUT update portfolio item by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, category, imageUrl, descriptionAr, descriptionEn, projectUrl, order, visible } = body;

    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('portfolio_items')
      .update({
        ...(titleAr !== undefined && { title_ar: titleAr }),
        ...(titleEn !== undefined && { title_en: titleEn }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { image_url: imageUrl }),
        ...(descriptionAr !== undefined && { description_ar: descriptionAr }),
        ...(descriptionEn !== undefined && { description_en: descriptionEn }),
        ...(projectUrl !== undefined && { project_url: projectUrl }),
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
      category: data.category,
      imageUrl: data.image_url,
      descriptionAr: data.description_ar,
      descriptionEn: data.description_en,
      projectUrl: data.project_url,
      order: data.order,
      visible: data.visible,
    });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

// DELETE portfolio item by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();

    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Portfolio item deleted' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// PUT update experience by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { companyAr, companyEn, descAr, descEn, order, visible } = body;

    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('experiences')
      .update({
        ...(companyAr !== undefined && { company_ar: companyAr }),
        ...(companyEn !== undefined && { company_en: companyEn }),
        ...(descAr !== undefined && { desc_ar: descAr }),
        ...(descEn !== undefined && { desc_en: descEn }),
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
      companyAr: data.company_ar,
      companyEn: data.company_en,
      descAr: data.desc_ar,
      descEn: data.desc_en,
      order: data.order,
      visible: data.visible,
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE experience by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}

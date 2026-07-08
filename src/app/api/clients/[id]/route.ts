import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// PUT update client logo by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameAr, nameEn, logoUrl, order, visible } = body;

    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('client_logos')
      .update({
        ...(nameAr !== undefined && { name_ar: nameAr }),
        ...(nameEn !== undefined && { name_en: nameEn }),
        ...(logoUrl !== undefined && { logo_url: logoUrl }),
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
      nameAr: data.name_ar,
      nameEn: data.name_en,
      logoUrl: data.logo_url,
      order: data.order,
      visible: data.visible,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE client logo by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();

    const { error } = await supabase
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

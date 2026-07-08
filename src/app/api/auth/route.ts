import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'portfolio_salt_2024').digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// POST login - verify password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    const { data: admins, error } = await supabase
      .from('admin')
      .select('*')
      .limit(1);

    if (error) throw error;

    const admin = admins?.[0];

    if (!admin) {
      // No admin exists yet — create one with the provided password
      const hashed = hashPassword(password);
      const { data: newAdmin, error: createError } = await supabase
        .from('admin')
        .insert({ password: hashed })
        .select()
        .single();

      if (createError) throw createError;

      return NextResponse.json({
        success: true,
        message: 'Admin account created and logged in',
        adminId: newAdmin.id,
      });
    }

    const isValid = verifyPassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      adminId: admin.id,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// PUT change password
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { password, newPassword } = body;

    if (!password || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const { data: admins, error } = await supabase.from('admin').select('*').limit(1);
    if (error) throw error;

    const admin = admins?.[0];
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    if (!verifyPassword(password, admin.password)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const { error: updateError } = await supabase
      .from('admin')
      .update({ password: hashPassword(newPassword) })
      .eq('id', admin.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';

// POST login - verify password against Admin table
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

    const admin = await db.admin.findFirst();

    if (!admin) {
      // No admin exists yet — create one with the provided password
      const hashed = hashPassword(password);
      const newAdmin = await db.admin.create({
        data: { password: hashed },
      });
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

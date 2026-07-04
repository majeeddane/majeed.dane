import { NextResponse } from 'next/server';

// POST send contact message (returns success for now)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // For now, just log and return success
    // In the future, this could send an email, save to DB, etc.
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
    });
  } catch (error) {
    console.error('Error processing contact message:', error);
    return NextResponse.json(
      { error: 'Failed to process contact message' },
      { status: 500 }
    );
  }
}

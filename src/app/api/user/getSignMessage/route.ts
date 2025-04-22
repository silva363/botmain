import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    // Generate a random message for signing
    const message = `Sign this message to authenticate with MKR Bot. Nonce: ${Date.now()}`;

    return NextResponse.json({
      message
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Failed to generate sign message'
    }, { status: 500 });
  }
}



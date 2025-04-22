import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { validateEthAddress } from "../../../utils/validation";

export const revalidate = 0

// This is a mock API key - in production, you should use a secure key
const API_KEY = 'your-secure-api-key-123';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { message, address, signature } = data;

    // In a real application, you would verify the signature here
    // For demo purposes, we'll just return a success response
    const auth_token = `demo-token-${Date.now()}`;

    return NextResponse.json({
      status: true,
      auth_token,
      message: 'Authentication successful'
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Authentication failed'
    }, { status: 500 });
  }
}



import { NextResponse } from "next/server";
import axios from "axios";

export const revalidate = 0

export async function GET() {
  try {
    const response = {
      message: process.env.APP_NAME
    }

    return NextResponse.json(response);
  } catch (e: any) {
    if (e.response?.data?.message) {
      return NextResponse.json(e.response.data.message);
    }

    return new NextResponse('An error occurred', { status: 400 });
  }
}



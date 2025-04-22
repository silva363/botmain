import { NextResponse } from "next/server";
import axios from "axios";

export const revalidate = 0

export async function GET() {
  try {
    const response: any = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verifyStatus`)

    return NextResponse.json(response.data);
  } catch (e: any) {
    if (e.response?.data?.message) {
      return NextResponse.json(e.response.data.message);
    }

    return new NextResponse('An error occurred', { status: 400 });
  }
}



import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 30
export async function POST(request: NextRequest) {
  try {
    // Mock data for accepted tokens
    const mockData = [
      {
        id: 1,
        name: "Polygon",
        symbol: "MATIC",
        address: "0x0000000000000000000000000000000000000000"
      },
      {
        id: 2,
        name: "Wrapped Polygon",
        symbol: "WMATIC",
        address: "0x0000000000000000000000000000000000000001"
      }
    ];

    return NextResponse.json({
      status: true,
      data: mockData
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Failed to get accepted tokens'
    }, { status: 500 });
  }
}

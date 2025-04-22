import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Mock data for statistics
    const mockData = {
      symbol: "MATIC",
      accepted_tokens: 10,
      transactions: 100,
      bots: 5,
      bot_actives: 3,
      bot_inactives: 2,
      matic_success: 80,
      matic_fails: 10,
      matic_pending: 10,
      selected_token_success: 70,
      selected_token_fails: 20,
      selected_token_pending: 10,
      airdrops: 50,
      airdrop_success: 40,
      airdrop_fails: 10
    };

    return NextResponse.json({
      status: true,
      data: mockData
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Failed to get statistics'
    }, { status: 500 });
  }
}

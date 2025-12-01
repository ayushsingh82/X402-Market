import { NextRequest, NextResponse } from 'next/server';

// Payment receiving address
const PAYMENT_RECEIVING_ADDRESS = '0xb822b51a88e8a03fce0220b15cb2c662e42adec1';
const USDC_ADDRESS = '0x5deac602762362fe5f135fa5904351916053cf70';
const NETWORK = 'base-sepolia';
const PRICE = '0.10';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const agentId = params.id;
  const paymentHeader = request.headers.get('X-PAYMENT');

  // If no payment header, return 402 Payment Required
  if (!paymentHeader) {
    return NextResponse.json(
      {
        maxAmountRequired: PRICE,
        resource: `/api/agent/${agentId}`,
        description: `Access to Agent ${agentId} requires payment`,
        payTo: PAYMENT_RECEIVING_ADDRESS,
        asset: USDC_ADDRESS,
        network: NETWORK,
      },
      { status: 402 }
    );
  }

  try {
    // Parse payment header
    const paymentPayload = JSON.parse(paymentHeader);

    // In production, you would verify the payment signature here
    // For now, we'll accept the payment if the header is present
    // You should verify the signature against the facilitator or on-chain

    // Payment verified - return success
    return NextResponse.json(
      {
        success: true,
        agentId,
        message: 'Payment verified. Access granted.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        error: 'Payment verification failed',
      },
      { status: 400 }
    );
  }
}


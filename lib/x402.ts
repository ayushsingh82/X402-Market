import { type Address, type Hash, encodeAbiParameters, parseUnits, keccak256, toHex, type WalletClient } from 'viem';

// x402 Configuration
const PAYMENT_RECEIVING_ADDRESS = '0xb822b51a88e8a03fce0220b15cb2c662e42adec1' as Address;
const USDC_ADDRESS = '0x5deac602762362fe5f135fa5904351916053cf70' as Address; // USDC on Base Sepolia
const NETWORK = 'base-sepolia';
const FACILITATOR_URL = 'https://x402.org/facilitator';

// ERC-3009 TransferWithAuthorization types
const TRANSFER_WITH_AUTHORIZATION_TYPES = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' },
  ],
};

export interface PaymentDetails {
  maxAmountRequired: string;
  resource: string;
  description: string;
  payTo: string;
  asset: string;
  network: string;
}

export interface PaymentResult {
  success: boolean;
  paymentProof?: string;
  error?: string;
}

/**
 * Makes initial request to protected resource and handles 402 Payment Required response
 */
export async function requestPaymentDetails(
  resourceUrl: string
): Promise<PaymentDetails | null> {
  try {
    const response = await fetch(resourceUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.status === 402) {
      const paymentDetails = await response.json();
      return paymentDetails as PaymentDetails;
    }

    // If not 402, resource is already accessible
    if (response.ok) {
      return null;
    }

    throw new Error(`Unexpected status: ${response.status}`);
  } catch (error) {
    console.error('Error requesting payment details:', error);
    throw error;
  }
}

/**
 * Generates a nonce for the transfer authorization
 */
function generateNonce(from: Address, to: Address, value: bigint): Hash {
  const timestamp = Date.now();
  const data = encodeAbiParameters(
    [
      { type: 'address' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'uint256' },
    ],
    [from, to, value, BigInt(timestamp)]
  );
  return keccak256(data);
}

/**
 * Signs ERC-3009 TransferWithAuthorization message
 */
export async function signTransferWithAuthorization(
  walletClient: WalletClient,
  from: Address,
  to: Address,
  value: bigint,
  validAfter: bigint = BigInt(0),
  validBefore: bigint = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour validity
): Promise<{ signature: Hash; nonce: Hash }> {
  if (!walletClient.account) {
    throw new Error('Wallet not connected');
  }

  const nonce = generateNonce(from, to, value);

  const domain = {
    name: 'USD Coin',
    version: '2',
    chainId: walletClient.chain?.id || 84532, // Base Sepolia chain ID
    verifyingContract: USDC_ADDRESS,
  };

  const message = {
    from,
    to,
    value,
    validAfter,
    validBefore,
    nonce,
  };

  try {
    const signature = await walletClient.signTypedData({
      account: walletClient.account,
      domain,
      types: TRANSFER_WITH_AUTHORIZATION_TYPES,
      primaryType: 'TransferWithAuthorization',
      message,
    });

    return { signature, nonce };
  } catch (error) {
    console.error('Error signing transfer authorization:', error);
    throw error;
  }
}

/**
 * Creates X-PAYMENT header payload
 */
function createPaymentHeader(
  from: Address,
  to: Address,
  value: bigint,
  signature: Hash,
  nonce: Hash,
  validAfter: bigint,
  validBefore: bigint
): string {
  const paymentPayload = {
    from,
    to,
    value: value.toString(),
    validAfter: validAfter.toString(),
    validBefore: validBefore.toString(),
    nonce: nonce,
    signature,
  };

  return JSON.stringify(paymentPayload);
}

/**
 * Processes x402 payment flow
 */
export async function processX402Payment(
  walletClient: WalletClient,
  resourceUrl: string,
  amount: string = '0.10'
): Promise<PaymentResult> {
  try {
    if (!walletClient.account) {
      return { success: false, error: 'Wallet not connected' };
    }

    const from = walletClient.account.address;
    const to = PAYMENT_RECEIVING_ADDRESS;
    const value = parseUnits(amount, 6); // USDC has 6 decimals

    // Step 1: Check if payment already exists for this wallet
    const existingPayment = verifyPayment(resourceUrl, from);
    if (existingPayment) {
      // Payment already exists, no need to pay again
      return { success: true, paymentProof: 'existing' };
    }

    // Step 2: Request payment details
    // Use absolute URL for API routes
    const apiUrl = resourceUrl.startsWith('http') ? resourceUrl : `${window.location.origin}${resourceUrl}`;
    const paymentDetails = await requestPaymentDetails(apiUrl);

    if (!paymentDetails) {
      // Resource is already accessible
      return { success: true };
    }

    // Step 3: Sign transfer authorization
    const validAfter = BigInt(0);
    const validBefore = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour validity

    const { signature, nonce } = await signTransferWithAuthorization(
      walletClient,
      from,
      to,
      value,
      validAfter,
      validBefore
    );

    // Step 4: Create X-PAYMENT header
    const paymentHeader = createPaymentHeader(
      from,
      to,
      value,
      signature,
      nonce,
      validAfter,
      validBefore
    );

    // Step 5: Retry request with X-PAYMENT header
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-PAYMENT': paymentHeader,
      },
    });

    if (response.ok) {
      // Payment successful, store proof with wallet address
      const paymentProof = JSON.stringify({
        resource: resourceUrl,
        from,
        to,
        value: value.toString(),
        signature,
        nonce,
        timestamp: Date.now(),
        walletAddress: from.toLowerCase(), // Store wallet address for verification
      });

      // Store in localStorage for verification - key includes wallet address
      const paymentKey = `x402_payment_${resourceUrl}_${from.toLowerCase()}`;
      localStorage.setItem(paymentKey, paymentProof);

      return { success: true, paymentProof };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        error: `Payment failed: ${response.status} - ${errorText}`,
      };
    }
  } catch (error: any) {
    console.error('x402 payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
}

/**
 * Verifies if payment was made for a resource by a specific wallet
 */
export function verifyPayment(resourceUrl: string, walletAddress?: string): boolean {
  if (!walletAddress) {
    // If no wallet address provided, check if any payment exists (backward compatibility)
    // Try to find any payment for this resource
    const keys = Object.keys(localStorage);
    const matchingKey = keys.find(key => key.startsWith(`x402_payment_${resourceUrl}_`));
    
    if (!matchingKey) {
      return false;
    }
    
    const paymentProof = localStorage.getItem(matchingKey);
    if (!paymentProof) {
      return false;
    }

    try {
      const proof = JSON.parse(paymentProof);
      const oneHour = 60 * 60 * 1000;
      const isExpired = Date.now() - proof.timestamp > oneHour;

      if (isExpired) {
        localStorage.removeItem(matchingKey);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Check payment for specific wallet address
  const paymentKey = `x402_payment_${resourceUrl}_${walletAddress.toLowerCase()}`;
  const paymentProof = localStorage.getItem(paymentKey);

  if (!paymentProof) {
    return false;
  }

  try {
    const proof = JSON.parse(paymentProof);
    const oneHour = 60 * 60 * 1000;
    const isExpired = Date.now() - proof.timestamp > oneHour;

    if (isExpired) {
      localStorage.removeItem(paymentKey);
      return false;
    }

    // Verify wallet address matches
    if (proof.walletAddress?.toLowerCase() !== walletAddress.toLowerCase()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Clears payment proof for a resource (optionally for a specific wallet)
 */
export function clearPayment(resourceUrl: string, walletAddress?: string): void {
  if (walletAddress) {
    const paymentKey = `x402_payment_${resourceUrl}_${walletAddress.toLowerCase()}`;
    localStorage.removeItem(paymentKey);
  } else {
    // Clear all payments for this resource
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`x402_payment_${resourceUrl}_`)) {
        localStorage.removeItem(key);
      }
    });
  }
}


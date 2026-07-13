import { NextResponse } from 'next/server';

// Mock in-memory state for demonstration
let globalBalance = 1250.50;
const globalTransactions = [
  { id: 'tx-001', type: 'transfer', amount: -45.00, recipient: 'Cafeteria', date: new Date(Date.now() - 3600000).toISOString(), status: 'completed' },
  { id: 'tx-002', type: 'topup', amount: 500.00, recipient: 'Bank Deposit', date: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
  { id: 'tx-003', type: 'transfer', amount: -12.50, recipient: 'Library Print Services', date: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
];

export async function GET() {
  return NextResponse.json({
    balance: globalBalance,
    transactions: globalTransactions
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, recipient } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency

    const newTx = {
      id: `tx-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      type,
      amount: type === 'transfer' ? -amount : amount,
      recipient: type === 'transfer' ? recipient : 'Credit Card Deposit',
      date: new Date().toISOString(),
      status: 'completed'
    };

    if (type === 'transfer') {
      if (globalBalance < amount) {
        return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
      }
      globalBalance -= amount;
    } else if (type === 'topup') {
      globalBalance += amount;
    }

    globalTransactions.unshift(newTx); // add to top

    return NextResponse.json({
      ok: true,
      transaction: newTx,
      newBalance: globalBalance
    });

  } catch (error) {
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
}

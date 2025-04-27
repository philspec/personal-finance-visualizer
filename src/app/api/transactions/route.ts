import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/transaction';
import { transactionSchema } from '@/schemas/transactionSchema';

export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find();
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = transactionSchema.parse(body);

    await dbConnect();
    const newTransaction = await Transaction.create(parsed);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/transaction';
import { transactionSchema } from '@/schemas/transactionSchema';
import { ZodError } from 'zod';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Properly await the params object before accessing its properties
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = transactionSchema.parse(body);

    const updated = await Transaction.findByIdAndUpdate(id, parsed, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Properly await the params object before accessing its properties
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

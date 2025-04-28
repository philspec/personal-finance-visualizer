import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/budget';
import { budgetSchema } from '@/schemas/budgetSchema';
import { ZodError } from 'zod';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = budgetSchema.parse(body);

    const updated = await Budget.findByIdAndUpdate(id, parsed, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }

    const deleted = await Budget.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
} 
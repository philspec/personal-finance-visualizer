import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/budget';
import { budgetSchema } from '@/schemas/budgetSchema';

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find();
    return NextResponse.json(budgets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = budgetSchema.parse(body);
    console.log("Parsed budget in backend:", parsed);

    await dbConnect();
    const newBudget = await Budget.create(parsed);
    console.log("Saved budget:", newBudget);
    return NextResponse.json(newBudget, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
} 
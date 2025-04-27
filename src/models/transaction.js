// src/models/transaction.ts
import { Schema, models, model } from 'mongoose';


const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Transaction || model('Transaction', transactionSchema);

// src/schemas/transactionSchema.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  category: z.string().min(1),
  description: z.string().min(1),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

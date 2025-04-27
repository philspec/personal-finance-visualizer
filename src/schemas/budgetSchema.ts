import { z } from 'zod';

export const budgetSchema = z.object({
  category: z.string().min(1, {
    message: "Category is required",
  }),
  amount: z.number().positive({
    message: "Amount must be a positive number",
  }),
  month: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export type BudgetInput = z.infer<typeof budgetSchema>; 
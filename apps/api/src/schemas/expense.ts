import { z } from 'zod';

export const createExpenseSchema = z.object({
  description: z.string().trim().min(1).max(200),
  amountCents: z.number().int().positive().max(10_000_000),
  paidBy: z.number().int().positive(),
});

export const expenseSchema = z.object({
  id: z.number().int(),
  tripId: z.number().int(),
  description: z.string(),
  amountCents: z.number().int(),
  paidBy: z.number().int(),
  createdAt: z.string(),
});

export const costShareSchema = z.object({
  participantId: z.number().int(),
  name: z.string(),
  owedCents: z.number().int(),
  paidCents: z.number().int(),
  balanceCents: z.number().int(),
});

export const costSplitSchema = z.object({
  totalCents: z.number().int(),
  currency: z.literal('EUR'),
  shares: z.array(costShareSchema),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type ExpenseDto = z.infer<typeof expenseSchema>;
export type CostShareDto = z.infer<typeof costShareSchema>;
export type CostSplitDto = z.infer<typeof costSplitSchema>;

import type { ExpenseRow } from '../repositories/expenseRepository';
import type { ParticipantRow } from '../repositories/participantRepository';
import type { CostShareDto, CostSplitDto } from '../schemas/expense';

/** Splits the trip's expenses evenly between all participants, in integer cents. */
export function splitCosts(participants: readonly ParticipantRow[], expenses: readonly ExpenseRow[]): CostSplitDto {
  let totalCents = 0;
  const paidBy = new Map<number, number>();
  for (const expense of expenses) {
    totalCents += expense.amount_cents;
    paidBy.set(expense.paid_by, (paidBy.get(expense.paid_by) ?? 0) + expense.amount_cents);
  }
  if (participants.length === 0) return { totalCents, currency: 'EUR', shares: [] };

  const share = Math.floor(totalCents / participants.length);
  const shares: CostShareDto[] = participants.map((p) => {
    const paidCents = paidBy.get(p.id) ?? 0;
    return { participantId: p.id, name: p.name, owedCents: share, paidCents, balanceCents: paidCents - share };
  });

  return { totalCents, currency: 'EUR', shares };
}

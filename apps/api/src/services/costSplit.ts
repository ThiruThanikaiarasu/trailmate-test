import type { ExpenseRow } from '../repositories/expenseRepository';
import type { ParticipantRow } from '../repositories/participantRepository';
import type { CostShareDto, CostSplitDto } from '../schemas/expense';

/**
 * Splits the trip's expenses evenly between all participants. Amounts are integer cents;
 * when the total does not divide evenly, the leftover cents are owed by the trip owner
 * so that the shares always add up to the total.
 */
export function splitCosts(participants: readonly ParticipantRow[], expenses: readonly ExpenseRow[]): CostSplitDto {
  const totalCents = expenses.reduce((sum, e) => sum + e.amount_cents, 0);
  if (participants.length === 0) return { totalCents, currency: 'EUR', shares: [] };

  const paidBy = new Map<number, number>();
  for (const expense of expenses) {
    paidBy.set(expense.paid_by, (paidBy.get(expense.paid_by) ?? 0) + expense.amount_cents);
  }

  const baseShare = Math.floor(totalCents / participants.length);
  const remainder = totalCents - baseShare * participants.length;
  const owner = participants.find((p) => p.is_owner === 1) ?? participants[0];

  const shares: CostShareDto[] = participants.map((p) => {
    const owedCents = baseShare + (p.id === owner.id ? remainder : 0);
    const paidCents = paidBy.get(p.id) ?? 0;
    return { participantId: p.id, name: p.name, owedCents, paidCents, balanceCents: paidCents - owedCents };
  });

  return { totalCents, currency: 'EUR', shares };
}

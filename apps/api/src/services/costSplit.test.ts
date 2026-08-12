import type { ExpenseRow } from '../repositories/expenseRepository';
import type { ParticipantRow } from '../repositories/participantRepository';
import { splitCosts } from './costSplit';

const participant = (id: number, name: string, isOwner = false): ParticipantRow => ({
  id,
  trip_id: 1,
  name,
  email: null,
  is_owner: isOwner ? 1 : 0,
});

const expense = (id: number, amountCents: number, paidBy: number): ExpenseRow => ({
  id,
  trip_id: 1,
  description: `Expense ${id}`,
  amount_cents: amountCents,
  paid_by: paidBy,
  created_at: '2026-06-01T10:00:00.000Z',
});

describe('splitCosts', () => {
  it('returns no shares for a trip without participants', () => {
    expect(splitCosts([], [])).toEqual({ totalCents: 0, currency: 'EUR', shares: [] });
  });

  it('splits an evenly divisible total', () => {
    const people = [participant(1, 'Ana', true), participant(2, 'Ben'), participant(3, 'Cleo')];
    const split = splitCosts(people, [expense(1, 9000, 1)]);
    expect(split.totalCents).toBe(9000);
    expect(split.shares.map((s) => s.owedCents)).toEqual([3000, 3000, 3000]);
  });

  it('computes balances from what each person paid', () => {
    const people = [participant(1, 'Ana', true), participant(2, 'Ben')];
    const split = splitCosts(people, [expense(1, 6000, 1), expense(2, 2000, 2)]);
    expect(split.shares).toEqual([
      { participantId: 1, name: 'Ana', owedCents: 4000, paidCents: 6000, balanceCents: 2000 },
      { participantId: 2, name: 'Ben', owedCents: 4000, paidCents: 2000, balanceCents: -2000 },
    ]);
  });
});

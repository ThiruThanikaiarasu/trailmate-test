import type { Clock } from '../clock';
import { HttpError, notFound } from '../errors';
import type { Repositories } from '../repositories';
import type { ExpenseRow } from '../repositories/expenseRepository';
import type { CostSplitDto, CreateExpenseInput, ExpenseDto } from '../schemas/expense';
import { splitCosts } from './costSplit';

const toExpenseDto = (row: ExpenseRow): ExpenseDto => ({
  id: row.id,
  tripId: row.trip_id,
  description: row.description,
  amountCents: row.amount_cents,
  paidBy: row.paid_by,
  createdAt: row.created_at,
});

export class ExpenseService {
  constructor(
    private readonly repos: Repositories,
    private readonly clock: Clock,
  ) {}

  list(tripId: number): ExpenseDto[] {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    return this.repos.expenses.listByTrip(tripId).map(toExpenseDto);
  }

  add(tripId: number, input: CreateExpenseInput): ExpenseDto {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    const payer = this.repos.participants.findById(input.paidBy);
    if (!payer || payer.trip_id !== tripId) {
      throw new HttpError(400, 'VALIDATION_ERROR', 'paidBy must be a participant of this trip');
    }
    const row = this.repos.expenses.insert({
      trip_id: tripId,
      description: input.description,
      amount_cents: input.amountCents,
      paid_by: input.paidBy,
      created_at: this.clock.now().toISOString(),
    });
    return toExpenseDto(row);
  }

  remove(tripId: number, expenseId: number): void {
    if (!this.repos.expenses.delete(expenseId, tripId)) throw notFound('Expense');
  }

  costSplit(tripId: number): CostSplitDto {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    return splitCosts(this.repos.participants.listByTrip(tripId), this.repos.expenses.listByTrip(tripId));
  }
}

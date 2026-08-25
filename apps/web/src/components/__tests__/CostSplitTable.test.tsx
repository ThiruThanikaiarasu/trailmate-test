import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { CostSplitTable } from '../CostSplitTable';

describe('CostSplitTable', () => {
  it('lists what everyone paid and owes', () => {
    renderWithProviders(
      <CostSplitTable
        split={{
          totalCents: 6000,
          currency: 'EUR',
          shares: [
            { participantId: 2, name: 'Ben', owedCents: 3000, paidCents: 6000, balanceCents: 3000 },
            { participantId: 1, name: 'Maya', owedCents: 3000, paidCents: 0, balanceCents: -3000 },
          ],
        }}
      />,
    );
    const maya = screen.getByRole('row', { name: /Maya/ });
    expect(within(maya).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['€0.00', '€30.00', '-€30.00']);
    expect(screen.getByRole('row', { name: /Total/ })).toHaveTextContent('€60.00');
  });

  it('says when there is nothing to split', () => {
    renderWithProviders(<CostSplitTable split={{ totalCents: 0, currency: 'EUR', shares: [] }} />);
    expect(screen.getByText('No expenses yet.')).toBeInTheDocument();
  });
});

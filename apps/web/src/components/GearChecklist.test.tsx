import type { GearItem } from '@trailmate/shared';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../test/render';
import { GearChecklist } from './GearChecklist';

const item = (id: number, name: string, packed = false): GearItem => ({
  id,
  tripId: 1,
  name,
  category: 'other',
  weightGrams: null,
  quantity: 1,
  packed,
});

function setup(items: GearItem[]) {
  const handlers = { onToggle: vi.fn(), onRemove: vi.fn(), onAdd: vi.fn() };
  renderWithProviders(<GearChecklist items={items} {...handlers} />);
  return handlers;
}

describe('GearChecklist', () => {
  it('shows how many items are packed', () => {
    setup([item(1, 'Tent', true), item(2, 'Stove'), item(3, 'Map')]);
    expect(screen.getByRole('status')).toHaveTextContent('1 of 3 packed');
  });

  it('updates the counter when an item is ticked', async () => {
    const { onToggle } = setup([item(1, 'Tent'), item(2, 'Stove')]);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Stove' }));
    expect(onToggle).toHaveBeenCalledWith(2, true);
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2 packed');
  });

  it('adds an item with the chosen category', async () => {
    const { onAdd } = setup([]);
    await userEvent.type(screen.getByRole('textbox', { name: 'Item' }), 'Headlamp');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'other');
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }));
    expect(onAdd).toHaveBeenCalledWith({ name: 'Headlamp', category: 'other' });
  });

  it('removes an unpacked item', async () => {
    const { onRemove } = setup([item(1, 'Tent'), item(2, 'Stove')]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Stove' }));
    expect(onRemove).toHaveBeenCalledWith(2);
    expect(screen.queryByText('Stove')).not.toBeInTheDocument();
  });

  it('uses German labels', () => {
    renderWithProviders(<GearChecklist items={[item(1, 'Zelt', true)]} onToggle={vi.fn()} onRemove={vi.fn()} onAdd={vi.fn()} />, {
      locale: 'de',
    });
    expect(screen.getByRole('status')).toHaveTextContent('1 von 1 gepackt');
  });
});

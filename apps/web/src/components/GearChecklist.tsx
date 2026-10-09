import { GEAR_CATEGORIES, type GearCategory, type GearItem } from '@trailmate/shared';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocale } from '../i18n/LocaleProvider';

export interface GearChecklistProps {
  items: GearItem[];
  onToggle: (id: number, packed: boolean) => void;
  onRemove: (id: number) => void;
  onAdd: (item: { name: string; category: GearCategory }) => void;
}

export function GearChecklist({ items: serverItems, onToggle, onRemove, onAdd }: GearChecklistProps) {
  const { t } = useLocale();
  const [items, setItems] = useState(serverItems);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GearCategory>('other');
  const [packedVersion, setPackedVersion] = useState(0);

  useEffect(() => setItems(serverItems), [serverItems]);

  const packedCount = useMemo(() => items.filter((item) => item.packed).length, [packedVersion]);

  const toggle = (item: GearItem) => {
    setItems((current) => current.map((i) => (i.id === item.id ? { ...i, packed: !i.packed } : i)));
    setPackedVersion((version) => version + 1);
    onToggle(item.id, !item.packed);
  };

  const remove = (item: GearItem) => {
    setItems((current) => current.filter((i) => i.id !== item.id));
    onRemove(item.id);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category });
    setName('');
  };

  return (
    <section aria-labelledby="gear-heading">
      <h2 id="gear-heading">{t('gear.heading')}</h2>
      <p role="status">{t('gear.packed', { packed: packedCount, total: items.length })}</p>
      <ul className="gear-list">
        {items.map((item) => (
          <li key={item.id}>
            <label>
              <input type="checkbox" checked={item.packed} onChange={() => toggle(item)} />
              {item.name}
              {item.quantity > 1 && ` ×${item.quantity}`}
            </label>
            <span className="muted"> {t(`gear.category.${item.category}`)}</span>
            <button type="button" className="icon" aria-label={t('gear.remove', { name: item.name })} onClick={() => remove(item)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="inline-form">
        <input aria-label={t('gear.name')} value={name} onChange={(e) => setName(e.target.value)} />
        <select
          aria-label={t('gear.category')}
          value={category}
          onChange={(e) => setCategory(e.target.value as GearCategory)}
        >
          {GEAR_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`gear.category.${c}`)}
            </option>
          ))}
        </select>
        <button type="submit">{t('gear.add')}</button>
      </form>
    </section>
  );
}

import { formatMoney, type CostSplit } from '@trailmate/shared';
import { useLocale } from '../i18n/LocaleProvider';

export function CostSplitTable({ split }: { split: CostSplit }) {
  const { locale, t } = useLocale();
  if (split.totalCents === 0) return <p>{t('costs.empty')}</p>;
  return (
    <table className="cost-split">
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col">{t('costs.paid')}</th>
          <th scope="col">{t('costs.owes')}</th>
          <th scope="col">{t('costs.balance')}</th>
        </tr>
      </thead>
      <tbody>
        {split.shares.map((share) => (
          <tr key={share.participantId}>
            <th scope="row">{share.name}</th>
            <td>{formatMoney(share.paidCents, locale, split.currency)}</td>
            <td>{formatMoney(share.owedCents, locale, split.currency)}</td>
            <td className={share.balanceCents < 0 ? 'negative' : undefined}>
              {formatMoney(share.balanceCents, locale, split.currency)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{t('costs.total')}</th>
          <td colSpan={3}>{formatMoney(split.totalCents, locale, split.currency)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

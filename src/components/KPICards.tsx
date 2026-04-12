import type { ModelOutputs } from '../utils/types';
import { fmtPct, fmtMultiple } from '../utils/format';

interface Props {
  results: ModelOutputs;
}

const cards = [
  { label: 'IRR', key: 'irr' as const, fmt: fmtPct },
  { label: 'ROI', key: 'roi' as const, fmt: fmtPct },
  { label: 'MOIC', key: 'moic' as const, fmt: fmtMultiple },
  { label: 'Avg Annual CoC', key: 'avgCoC' as const, fmt: fmtPct },
];

const bgColors = [
  'bg-sage/20 border-sage/30',
  'bg-honey/20 border-honey/30',
  'bg-terracotta/20 border-terracotta/30',
  'bg-sage/20 border-sage/30',
];

export default function KPICards({ results }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <div
          key={card.key}
          className={`glow-hover rounded-xl border p-4 md:p-5 text-center backdrop-blur-sm ${bgColors[i]}`}
        >
          <div className="text-xs md:text-sm font-medium text-walnut-light uppercase tracking-wider mb-1">
            {card.label}
          </div>
          <div className="text-2xl md:text-3xl font-bold text-walnut">
            {card.fmt(results[card.key])}
          </div>
        </div>
      ))}
    </div>
  );
}

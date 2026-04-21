import { useState } from 'react';
import type { ModelOutputs } from '../utils/types';
import { fmtPct, fmtMultiple } from '../utils/format';
import InfoTooltip from './InfoTooltip';

interface Props {
  results: ModelOutputs;
}

const staticCards = [
  {
    label: 'IRR',
    key: 'irr' as const,
    fmt: fmtPct,
    tip: 'Annualized investor-level internal rate of return, computed as XIRR on the net monthly cash flows (equity contributions, distributions, and exit proceeds net of operator promote).',
    bg: 'bg-sage/20 border-sage/30',
  },
  {
    label: 'ROI',
    key: 'roi' as const,
    fmt: fmtPct,
    tip: 'Total return ÷ total equity, minus 1. Not annualized — this is the cumulative return over the full hold.',
    bg: 'bg-honey/20 border-honey/30',
  },
  {
    label: 'MOIC',
    key: 'moic' as const,
    fmt: fmtMultiple,
    tip: 'Multiple on invested capital: (total distributions + net exit proceeds to investors) ÷ total equity contributed.',
    bg: 'bg-terracotta/20 border-terracotta/30',
  },
];

type CoCMode = 'stabilized' | 'avg';

function CoCCard({ results }: { results: ModelOutputs }) {
  const [mode, setMode] = useState<CoCMode>('stabilized');
  const isStab = mode === 'stabilized';
  const value = isStab ? results.stabilizedCoC : results.avgCoC;
  const label = isStab ? 'Stabilized CoC' : 'Avg Annual CoC';
  const tip = isStab
    ? 'Stabilized cash-on-cash yield: last-12-month distributions ÷ total equity. The run-rate annual yield on investor equity once all locations are past ramp. Toggle to Avg to see the blended yield including ramp years.'
    : 'Average annual cash yield across the entire hold, ramp period included. More conservative than Stabilized CoC because early years carry no distributions. Toggle to Stabilized to see the run-rate yield.';

  return (
    <div className="glow-hover rounded-xl border p-4 md:p-5 text-center backdrop-blur-sm bg-sage/20 border-sage/30">
      <div className="text-xs md:text-sm font-medium text-walnut-light uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
        {label}
        <InfoTooltip content={tip} />
      </div>
      <div className="text-2xl md:text-3xl font-bold text-walnut">
        {fmtPct(value)}
      </div>
      <div className="mt-2 inline-flex gap-0.5 p-0.5 bg-walnut/5 rounded-md">
        {([
          { val: 'stabilized' as CoCMode, label: 'Stabilized' },
          { val: 'avg' as CoCMode, label: 'Avg' },
        ]).map(opt => (
          <button
            key={opt.val}
            onClick={() => setMode(opt.val)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              mode === opt.val
                ? 'bg-walnut text-cream shadow-sm'
                : 'text-walnut-light hover:text-walnut'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KPICards({ results }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {staticCards.map(card => (
        <div
          key={card.key}
          className={`glow-hover rounded-xl border p-4 md:p-5 text-center backdrop-blur-sm ${card.bg}`}
        >
          <div className="text-xs md:text-sm font-medium text-walnut-light uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            {card.label}
            <InfoTooltip content={card.tip} />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-walnut">
            {card.fmt(results[card.key])}
          </div>
        </div>
      ))}
      <CoCCard results={results} />
    </div>
  );
}

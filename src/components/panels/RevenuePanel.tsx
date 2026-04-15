import type { ModelInputs } from '../../utils/types';
import { vendorTotals } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import SliderRow, { DerivedRow } from '../SliderRow';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

const fmt$ = (v: number) => '$' + v.toLocaleString();
const fmtInt = (v: number) => String(v);

export default function RevenuePanel({ inputs, onChange }: Props) {
  const { numVendors, monthlyVendorRentPerLocation } = vendorTotals(inputs);
  const annual = monthlyVendorRentPerLocation * 12;

  const updateVendor = (idx: number, field: 'count' | 'rent', value: number) => {
    const next = [...inputs.vendors];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ ...inputs, vendors: next });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Revenue Model panel */}
      <div className="glass rounded-2xl p-5 md:p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sage/20 flex items-center justify-center text-sage">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h3.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3.375 3.375 0 0 0-3 3.285m11.625-3.285h-12a.375.375 0 1 1 0-.75h12a.375.375 0 0 1 0 .75Z" />
            </svg>
          </div>
          <h3 className="font-bold text-walnut">Revenue Model</h3>
          <span className="text-[10px] text-walnut-light ml-auto">per location</span>
        </div>

        {/* Vendor sliders grouped by category */}
        {inputs.vendors.map((v, i) => (
          <div key={i} className="mb-3 pb-3 border-b border-walnut/5 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-walnut">{v.name}</span>
              <span className="text-xs text-walnut-light tabular-nums">
                {fmtDollarFull(v.count * v.rent)}/mo
              </span>
            </div>
            <SliderRow
              label="Count"
              value={v.count}
              min={0} max={15} step={1}
              format={fmtInt}
              onChange={x => updateVendor(i, 'count', x)}
            />
            <SliderRow
              label="Rent / Month"
              value={v.rent}
              min={0} max={15_000} step={250}
              format={fmt$}
              onChange={x => updateVendor(i, 'rent', x)}
            />
          </div>
        ))}

        <div className="mt-auto pt-3 border-t border-walnut/10 space-y-1.5">
          <DerivedRow label="Vendors per Location" value={String(numVendors)} />
          <DerivedRow label="Monthly Rent Revenue" value={fmtDollarFull(monthlyVendorRentPerLocation)} />
          <DerivedRow label="Annual Rent Revenue" value={fmtDollarFull(annual)} accent />
        </div>
      </div>

      {/* Rent inclusivity toggle (small box below) */}
      <div className="glass rounded-2xl p-4">
        <div className="text-xs font-semibold text-walnut mb-2">Rent Structure</div>
        <p className="text-[10px] text-walnut-light mb-3 leading-relaxed">
          Does the vendor's monthly rent include utility pass-through costs?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Inclusive', sub: 'The Barn pays vendor utilities' },
            { val: false, label: 'Net of Utils', sub: 'Vendors pay their own' },
          ].map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => onChange({ ...inputs, rentIncludesUtilities: opt.val })}
              className={`rounded-xl px-3 py-2.5 text-center transition-all duration-300 cursor-pointer border ${
                inputs.rentIncludesUtilities === opt.val
                  ? 'bg-honey text-white border-honey shadow-sm shadow-honey/30'
                  : 'bg-white/40 text-walnut border-walnut/15 hover:bg-white/60 hover:border-honey/40'
              }`}
            >
              <div className="text-xs font-bold">{opt.label}</div>
              <div className={`text-[9px] mt-0.5 leading-tight ${
                inputs.rentIncludesUtilities === opt.val ? 'text-white/80' : 'text-walnut-light'
              }`}>
                {opt.sub}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

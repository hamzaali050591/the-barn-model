import type { ModelInputs, RevenueModel } from '../../utils/types';
import { vendorTotals } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import SliderRow, { DerivedRow } from '../SliderRow';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

const fmt$ = (v: number) => '$' + v.toLocaleString();
const fmtInt = (v: number) => String(v);
const fmtPct = (v: number) => v.toFixed(0) + '%';

const MODE_OPTIONS: { val: RevenueModel; label: string }[] = [
  { val: 'base', label: 'Base Rent' },
  { val: 'pct', label: '% of Sales' },
  { val: 'mixed', label: 'Base + %' },
];

export default function RevenuePanel({ inputs, onChange }: Props) {
  const { numVendors, monthlyVendorRentPerLocation } = vendorTotals(inputs);
  const annual = monthlyVendorRentPerLocation * 12;

  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const updateVendor = (idx: number, field: 'count' | 'rent' | 'sales', value: number) => {
    const next = [...inputs.vendors];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ ...inputs, vendors: next });
  };

  const mode = inputs.revenueModel;

  // Per-vendor calc helper for mode-aware subtotal display
  const vendorSubtotal = (v: typeof inputs.vendors[0]) => {
    if (mode === 'base') return v.count * v.rent;
    if (mode === 'pct') return v.count * v.sales * (inputs.pctOfSalesRate / 100);
    // mixed
    return v.count * inputs.mixedBaseRent + v.count * v.sales * (inputs.mixedPctRate / 100);
  };

  return (
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

      {/* Revenue model toggles */}
      <div className="grid grid-cols-3 gap-1.5 mb-4 p-1 bg-walnut/5 rounded-xl">
        {MODE_OPTIONS.map(opt => (
          <button
            key={opt.val}
            onClick={() => set('revenueModel', opt.val)}
            className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
              mode === opt.val
                ? 'bg-honey text-white shadow-sm shadow-honey/30'
                : 'text-walnut-light hover:text-walnut hover:bg-white/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Mode-specific global sliders */}
      {mode === 'pct' && (
        <div className="mb-3 pb-3 border-b border-walnut/10">
          <SliderRow
            label="% of Sales as Rent"
            value={inputs.pctOfSalesRate}
            min={1} max={50} step={1}
            format={fmtPct}
            onChange={v => set('pctOfSalesRate', v)}
          />
        </div>
      )}
      {mode === 'mixed' && (
        <div className="mb-3 pb-3 border-b border-walnut/10">
          <SliderRow
            label="Base Rent"
            sublabel="per vendor"
            value={inputs.mixedBaseRent}
            min={0} max={10_000} step={100}
            format={fmt$}
            onChange={v => set('mixedBaseRent', v)}
          />
          <SliderRow
            label="% of Sales"
            value={inputs.mixedPctRate}
            min={0} max={25} step={0.5}
            format={fmtPct}
            onChange={v => set('mixedPctRate', v)}
          />
        </div>
      )}

      {/* Vendor sliders */}
      {inputs.vendors.map((v, i) => (
        <div key={i} className="mb-3 pb-3 border-b border-walnut/5 last:border-0 last:mb-0 last:pb-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-walnut">{v.name}</span>
            <span className="text-xs text-walnut-light tabular-nums">
              {fmtDollarFull(vendorSubtotal(v))}/mo
            </span>
          </div>
          <SliderRow
            label="Count"
            value={v.count}
            min={0} max={15} step={1}
            format={fmtInt}
            onChange={x => updateVendor(i, 'count', x)}
          />
          {mode === 'base' ? (
            <SliderRow
              label="Rent / Month"
              value={v.rent}
              min={0} max={15_000} step={250}
              format={fmt$}
              onChange={x => updateVendor(i, 'rent', x)}
            />
          ) : (
            <SliderRow
              label="Sales / Month"
              value={v.sales}
              min={0} max={100_000} step={1_000}
              format={fmt$}
              onChange={x => updateVendor(i, 'sales', x)}
            />
          )}
        </div>
      ))}

      {/* Annual Rent Escalator */}
      <div className="mt-4 pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
          Annual Rent Escalator
        </div>
        <SliderRow
          label="Rent Escalator"
          value={inputs.rentEscalatorPct}
          min={0} max={6} step={0.25}
          format={v => v.toFixed(2) + '%'}
          info="Annual, compounding — applies to base rent only. Compounds from each location's open month. Base mode escalates full rent; Base+% mode escalates only the base portion. % of Sales does not escalate (assumes vendor sales stay flat)."
          onChange={v => set('rentEscalatorPct', v)}
        />
      </div>

      {/* Rent Structure (now inside, above KPIs) */}
      <div className="mt-4 pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
          Rent Structure
        </div>
        <p className="text-[10px] text-walnut-light mb-2 leading-relaxed">
          Does the vendor's rent include utility pass-through costs?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Inclusive', sub: 'The Barn pays vendor utilities' },
            { val: false, label: 'Net of Utils', sub: 'Vendors pay their own' },
          ].map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => set('rentIncludesUtilities', opt.val)}
              className={`rounded-xl px-3 py-2 text-center transition-all duration-300 cursor-pointer border ${
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

      {/* KPI cards (bottom-aligned) */}
      <div className="mt-auto pt-4 space-y-1.5">
        <DerivedRow label="Vendors per Location" value={String(numVendors)} />
        <DerivedRow label="Monthly Rent Revenue" value={fmtDollarFull(monthlyVendorRentPerLocation)} />
        <DerivedRow label="Annual Rent Revenue" value={fmtDollarFull(annual)} accent />
      </div>
    </div>
  );
}

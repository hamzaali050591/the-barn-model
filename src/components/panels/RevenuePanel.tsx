import type { ModelInputs } from '../../utils/types';
import { vendorTotals } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import { DerivedRow } from '../SliderRow';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

function MiniInput({ value, onChange, prefix }: { value: number; onChange: (v: number) => void; prefix?: string }) {
  return (
    <div className="inline-flex items-center gap-1">
      {prefix && <span className="text-walnut-light text-[10px]">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-16 bg-white/70 border border-walnut/20 rounded px-1.5 py-1 text-right tabular-nums text-xs text-walnut focus:outline-none focus:border-honey focus:ring-2 focus:ring-honey/20 transition-all"
      />
    </div>
  );
}

export default function RevenuePanel({ inputs, onChange }: Props) {
  const { numVendors, monthlyVendorRentPerLocation } = vendorTotals(inputs);
  const annual = monthlyVendorRentPerLocation * 12;

  const updateVendor = (idx: number, field: 'count' | 'rent', value: number) => {
    const next = [...inputs.vendors];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ ...inputs, vendors: next });
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

      <div className="overflow-hidden rounded-lg border border-walnut/10 mb-3">
        <table className="w-full text-xs">
          <thead className="bg-walnut/5">
            <tr>
              <th className="text-left px-2 py-1.5 font-semibold text-walnut-light">Category</th>
              <th className="text-center px-2 py-1.5 font-semibold text-walnut-light">#</th>
              <th className="text-right px-2 py-1.5 font-semibold text-walnut-light">Rent/mo</th>
              <th className="text-right px-2 py-1.5 font-semibold text-walnut-light">Total</th>
            </tr>
          </thead>
          <tbody>
            {inputs.vendors.map((v, i) => (
              <tr key={i} className="border-t border-walnut/5 row-hover">
                <td className="px-2 py-1.5 text-walnut">{v.name}</td>
                <td className="px-2 py-1.5 text-center">
                  <MiniInput value={v.count} onChange={x => updateVendor(i, 'count', x)} />
                </td>
                <td className="px-2 py-1.5 text-right">
                  <MiniInput value={v.rent} onChange={x => updateVendor(i, 'rent', x)} prefix="$" />
                </td>
                <td className="px-2 py-1.5 text-right font-semibold text-walnut tabular-nums">
                  {fmtDollarFull(v.count * v.rent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto pt-3 border-t border-walnut/10 space-y-1.5">
        <DerivedRow label={`Vendors per Location`} value={String(numVendors)} />
        <DerivedRow label="Monthly Rent Revenue" value={fmtDollarFull(monthlyVendorRentPerLocation)} />
        <DerivedRow label="Annual Rent Revenue" value={fmtDollarFull(annual)} accent />
      </div>
    </div>
  );
}

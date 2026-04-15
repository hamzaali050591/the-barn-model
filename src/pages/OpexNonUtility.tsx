import { useModel } from '../utils/ModelContext';
import type { NonUtilityConfig, LineItem } from '../utils/types';
import { nonUtilityBreakdown } from '../utils/engine';
import { fmtDollarFull } from '../utils/format';
import OpexDetailScaffold, { InputCell, CalcCell, DetailSection } from '../components/OpexDetailScaffold';

type CategoryKey = keyof NonUtilityConfig;

interface CategoryDef {
  key: CategoryKey;
  title: string;
  subtitle?: string;
}

const categories: CategoryDef[] = [
  { key: 'marketing', title: 'Marketing', subtitle: 'Does not scale with square footage — flat brand spend' },
  { key: 'cleaning', title: 'Cleaning / Hall Attendant' },
  { key: 'grease', title: 'Grease / Oil Services' },
  { key: 'security', title: 'Security' },
  { key: 'maintenance', title: 'Building Maintenance' },
  { key: 'insurance', title: 'Insurance' },
  { key: 'technology', title: 'Technology / Software' },
  { key: 'misc', title: 'Misc / Waste / Contingency' },
];

export default function OpexNonUtility() {
  const { inputs, setInputs } = useModel();
  const n = inputs.nonUtility;
  const bd = nonUtilityBreakdown(n);

  const updateLine = (cat: CategoryKey, idx: number, value: number) => {
    const arr: LineItem[] = [...n[cat]];
    arr[idx] = { ...arr[idx], monthly: value };
    setInputs({ ...inputs, nonUtility: { ...n, [cat]: arr } });
  };

  const catTotal = (cat: CategoryKey) => bd[cat];

  return (
    <OpexDetailScaffold
      title="Non-Utility OpEx — Detail"
      subtitle="All non-utility line items broken down by category"
    >

      {categories.map(cat => (
        <DetailSection key={cat.key} title={cat.title} subtitle={cat.subtitle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-walnut/10 bg-walnut/5 text-xs">
                  <th className="text-left px-3 py-2 font-semibold text-walnut-light">Component</th>
                  <th className="text-right px-3 py-2 font-semibold text-walnut-light w-32">Monthly</th>
                  <th className="text-right px-3 py-2 font-semibold text-walnut-light w-32">Annual</th>
                </tr>
              </thead>
              <tbody>
                {n[cat.key].map((item, i) => (
                  <tr key={i} className="border-b border-walnut/5">
                    <td className="px-3 py-1.5 text-walnut text-xs">{item.name}</td>
                    <td className="px-3 py-1.5"><InputCell value={item.monthly} step={50} onChange={v => updateLine(cat.key, i, v)} /></td>
                    <td className="px-3 py-1.5"><CalcCell value={item.monthly * 12} /></td>
                  </tr>
                ))}
                <tr className="bg-honey/10 font-semibold text-xs">
                  <td className="px-3 py-2 text-walnut">Subtotal &mdash; {cat.title}</td>
                  <td className="px-3 py-2"><CalcCell value={catTotal(cat.key)} /></td>
                  <td className="px-3 py-2"><CalcCell value={catTotal(cat.key) * 12} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </DetailSection>
      ))}

      {/* Grand Total */}
      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between py-2">
          <div className="text-sm font-bold text-walnut uppercase tracking-wider">Total Non-Utility OpEx</div>
          <div className="text-right">
            <div className="text-xs text-walnut-light">Monthly</div>
            <div className="text-xl font-bold text-walnut tabular-nums">{fmtDollarFull(bd.total)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-walnut-light">Annual</div>
            <div className="text-xl font-bold text-honey tabular-nums">{fmtDollarFull(bd.total * 12)}</div>
          </div>
        </div>
      </div>

    </OpexDetailScaffold>
  );
}

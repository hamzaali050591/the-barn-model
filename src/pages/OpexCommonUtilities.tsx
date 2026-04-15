import { useModel } from '../utils/ModelContext';
import { electricMonthly, waterMonthly } from '../utils/engine';
import OpexDetailScaffold, { InputCell, CalcCell, DetailSection } from '../components/OpexDetailScaffold';

const fmt$ = (v: number) => '$' + v.toFixed(2);

export default function OpexCommonUtilities() {
  const { inputs, setInputs } = useModel();
  const e = inputs.electric;
  const w = inputs.water;

  const eCalc = electricMonthly(e);
  const wCalc = waterMonthly(w);

  const updateEle = (patch: Partial<typeof e>) => setInputs({ ...inputs, electric: { ...e, ...patch } });
  const updateCommonLoad = (idx: number, field: 'kw' | 'duty' | 'hrs', value: number) => {
    const loads = [...e.commonArea];
    loads[idx] = { ...loads[idx], [field]: value };
    updateEle({ commonArea: loads });
  };

  const updateWater = (patch: Partial<typeof w>) => setInputs({ ...inputs, water: { ...w, ...patch } });
  const updateWaterCommon = (idx: number, value: number) => {
    const loads = [...w.commonArea];
    loads[idx] = { ...loads[idx], galPerDay: value };
    updateWater({ commonArea: loads });
  };

  const totalWaterCommonGal = w.commonArea.reduce((s, l) => s + l.galPerDay, 0);

  return (
    <OpexDetailScaffold title="Common Area Utilities — Detail" subtitle="Shared-space Electric and Water costs (paid by The Barn)">

      {/* Electric Common Area */}
      <DetailSection title="Common Area Electric" subtitle="HVAC, lighting, security, etc. — not pass-through to vendors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-walnut/10 bg-walnut/5 text-xs">
                <th className="text-left px-3 py-2 font-semibold text-walnut-light">Load</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">kW</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">Duty</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">Hrs/Day</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-24">Monthly kWh</th>
              </tr>
            </thead>
            <tbody>
              {e.commonArea.map((l, i) => (
                <tr key={i} className="border-b border-walnut/5">
                  <td className="px-3 py-1.5 text-walnut text-xs">{l.name}</td>
                  <td className="px-3 py-1.5"><InputCell value={l.kw} step={0.1} onChange={v => updateCommonLoad(i, 'kw', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={l.duty} step={0.05} onChange={v => updateCommonLoad(i, 'duty', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={l.hrs} onChange={v => updateCommonLoad(i, 'hrs', v)} /></td>
                  <td className="px-3 py-1.5"><CalcCell value={(l.kw * l.duty * l.hrs * 30).toFixed(1)} /></td>
                </tr>
              ))}
              <tr className="bg-honey/10 font-semibold text-xs">
                <td colSpan={4} className="px-3 py-2 text-walnut">Subtotal — Common Area (kWh/mo)</td>
                <td className="px-3 py-2"><CalcCell value={eCalc.commonKwh.toFixed(1)} /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-walnut-light italic mt-3">
          Uses the same electric rate scenario as vendor utilities (edit on the Vendor Utilities detail page).
          Active scenario: <span className="font-semibold text-walnut">{e.scenario}</span> &middot; Rate: <span className="font-semibold text-walnut">${eCalc.rate.toFixed(3)}/kWh</span>
        </p>
        <div className="mt-4 bg-honey/15 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-walnut">Common Area Electric (monthly)</div>
          <div className="text-lg font-bold text-honey tabular-nums">{fmt$(eCalc.common)}</div>
        </div>
      </DetailSection>

      {/* Water Common Area */}
      <DetailSection title="Common Area Water" subtitle="Restrooms, floor cleaning, hot water, landscaping">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-walnut/10 bg-walnut/5 text-xs">
                <th className="text-left px-3 py-2 font-semibold text-walnut-light">Load</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-32">Gallons / Day</th>
              </tr>
            </thead>
            <tbody>
              {w.commonArea.map((l, i) => (
                <tr key={i} className="border-b border-walnut/5">
                  <td className="px-3 py-1.5 text-walnut text-xs">{l.name}</td>
                  <td className="px-3 py-1.5"><InputCell value={l.galPerDay} step={10} onChange={v => updateWaterCommon(i, v)} /></td>
                </tr>
              ))}
              <tr className="bg-honey/10 font-semibold text-xs">
                <td className="px-3 py-2 text-walnut">Total Common Area Gal/Day</td>
                <td className="px-3 py-2"><CalcCell value={totalWaterCommonGal} /></td>
              </tr>
              <tr className="text-xs">
                <td className="px-3 py-1.5 text-walnut-light">Monthly Gallons</td>
                <td className="px-3 py-1.5"><CalcCell value={wCalc.commonGalMo.toFixed(0)} /></td>
              </tr>
              <tr className="text-xs">
                <td className="px-3 py-1.5 text-walnut-light">Monthly CCF (÷748)</td>
                <td className="px-3 py-1.5"><CalcCell value={wCalc.commonCCF.toFixed(2)} /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-walnut-light italic mt-3">
          Uses the same water rate scenario as vendor utilities (edit on the Vendor Utilities detail page).
          Active scenario: <span className="font-semibold text-walnut">{w.scenario}</span> &middot; Rate: <span className="font-semibold text-walnut">${wCalc.rate.toFixed(2)}/CCF</span>
        </p>
        <div className="mt-4 bg-honey/15 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-walnut">Common Area Water (monthly)</div>
          <div className="text-lg font-bold text-honey tabular-nums">{fmt$(wCalc.common)}</div>
        </div>
      </DetailSection>

      {/* Total */}
      <div className="glass rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider">Total Common Area Utilities</div>
          <div className="text-xs text-walnut-light">Electric + Water (monthly)</div>
        </div>
        <div className="text-2xl font-bold text-walnut tabular-nums">{fmt$(eCalc.common + wCalc.common)}</div>
      </div>

    </OpexDetailScaffold>
  );
}

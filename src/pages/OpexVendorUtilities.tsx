import { useModel } from '../utils/ModelContext';
import { gasMonthly, electricMonthly, waterMonthly } from '../utils/engine';
import type { Scenario } from '../utils/types';
import OpexDetailScaffold, { InputCell, CalcCell, DetailSection } from '../components/OpexDetailScaffold';

const fmt$ = (v: number) => '$' + v.toFixed(2);
const scenarios: { val: Scenario; label: string }[] = [
  { val: 'low', label: 'Low' },
  { val: 'mid', label: 'Mid' },
  { val: 'high', label: 'High' },
];

function ScenarioToggle<T extends { scenario: Scenario }>({
  config,
  onChange,
}: {
  config: T;
  onChange: (next: Scenario) => void;
}) {
  return (
    <div className="flex gap-1.5 bg-walnut/5 rounded-lg p-1 w-fit">
      {scenarios.map(s => (
        <button
          key={s.val}
          onClick={() => onChange(s.val)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            config.scenario === s.val
              ? 'bg-honey text-white shadow-sm shadow-honey/30'
              : 'text-walnut-light hover:text-walnut hover:bg-white/40'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function OpexVendorUtilities() {
  const { inputs, setInputs } = useModel();
  const g = inputs.gas;
  const e = inputs.electric;
  const w = inputs.water;

  const gasCalc = gasMonthly(g);
  const eCalc = electricMonthly(e);
  const wCalc = waterMonthly(w);

  const updateGas = (patch: Partial<typeof g>) => setInputs({ ...inputs, gas: { ...g, ...patch } });
  const updateGasEq = (idx: number, field: 'btu' | 'duty', value: number) => {
    const next = [...g.equipment];
    next[idx] = { ...next[idx], [field]: value };
    updateGas({ equipment: next });
  };
  const updateEle = (patch: Partial<typeof e>) => setInputs({ ...inputs, electric: { ...e, ...patch } });
  const updateEleLoad = (section: 'baseLoad' | 'foodAddOn', idx: number, field: 'kw' | 'duty' | 'hrs', value: number) => {
    const loads = [...e[section]];
    loads[idx] = { ...loads[idx], [field]: value };
    updateEle({ [section]: loads } as Partial<typeof e>);
  };
  const updateWater = (patch: Partial<typeof w>) => setInputs({ ...inputs, water: { ...w, ...patch } });

  return (
    <OpexDetailScaffold title="Vendor Utilities — Detail" subtitle="Gas · Electric · Water costs per vendor">

      {/* GAS */}
      <DetailSection title="Gas" subtitle="Applies only to Food Vendors — therm-based usage per vendor">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-walnut/10 bg-walnut/5 text-xs">
                <th className="text-left px-3 py-2 font-semibold text-walnut-light">Equipment</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-28">BTU/hr (Max)</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-24">Duty Cycle</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-28">Effective BTU/hr</th>
              </tr>
            </thead>
            <tbody>
              {g.equipment.map((eq, i) => (
                <tr key={i} className="border-b border-walnut/5">
                  <td className="px-3 py-1.5 text-walnut">{eq.name}</td>
                  <td className="px-3 py-1.5"><InputCell value={eq.btu} step={1000} onChange={v => updateGasEq(i, 'btu', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={eq.duty} step={0.05} onChange={v => updateGasEq(i, 'duty', v)} /></td>
                  <td className="px-3 py-1.5"><CalcCell value={eq.btu * eq.duty} /></td>
                </tr>
              ))}
              <tr className="bg-honey/10 font-semibold">
                <td colSpan={3} className="px-3 py-2 text-walnut">Total Effective BTU/hr per Food Vendor</td>
                <td className="px-3 py-2"><CalcCell value={gasCalc.totalEffectiveBTU} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div>
            <label className="text-xs text-walnut-light block mb-1">Hours/Day</label>
            <InputCell value={g.hoursPerDay} onChange={v => updateGas({ hoursPerDay: v })} />
          </div>
          <div>
            <label className="text-xs text-walnut-light block mb-1">Days/Month</label>
            <InputCell value={g.daysPerMonth} onChange={v => updateGas({ daysPerMonth: v })} />
          </div>
          <div>
            <div className="text-xs text-walnut-light mb-1">Monthly BTU</div>
            <div className="py-1"><CalcCell value={gasCalc.monthlyBTU.toFixed(0)} /></div>
          </div>
          <div>
            <div className="text-xs text-walnut-light mb-1">Monthly Therms</div>
            <div className="py-1"><CalcCell value={gasCalc.monthlyTherms.toFixed(2)} /></div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div>
            <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-1">Rate Scenarios ($/therm)</div>
            <div className="flex gap-2">
              <div><label className="text-[10px] text-walnut-light block">Low</label><InputCell value={g.lowRate} step={0.05} onChange={v => updateGas({ lowRate: v })} /></div>
              <div><label className="text-[10px] text-walnut-light block">Mid</label><InputCell value={g.midRate} step={0.05} onChange={v => updateGas({ midRate: v })} /></div>
              <div><label className="text-[10px] text-walnut-light block">High</label><InputCell value={g.highRate} step={0.05} onChange={v => updateGas({ highRate: v })} /></div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-1">Active Scenario</div>
            <ScenarioToggle config={g} onChange={s => updateGas({ scenario: s })} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="bg-honey/15 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Food Vendor</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(gasCalc.foodVendor)}/mo</div>
          </div>
          <div className="bg-walnut/5 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Non-Food Vendor</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(gasCalc.nonFoodVendor)}/mo</div>
          </div>
          <div className="bg-walnut/5 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Common Area</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(gasCalc.common)}/mo</div>
          </div>
        </div>
      </DetailSection>

      {/* ELECTRIC */}
      <DetailSection title="Electric" subtitle="Base load (all vendors) + food add-ons — kWh based, common area handled separately">
        <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-2">Per-Vendor Base Load (all vendors)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-walnut/10 bg-walnut/5 text-xs">
                <th className="text-left px-3 py-2 font-semibold text-walnut-light">Equipment</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">kW</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">Duty</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">Hrs/Day</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-24">Monthly kWh</th>
              </tr>
            </thead>
            <tbody>
              {e.baseLoad.map((l, i) => (
                <tr key={i} className="border-b border-walnut/5">
                  <td className="px-3 py-1.5 text-walnut text-xs">{l.name}</td>
                  <td className="px-3 py-1.5"><InputCell value={l.kw} step={0.1} onChange={v => updateEleLoad('baseLoad', i, 'kw', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={l.duty} step={0.05} onChange={v => updateEleLoad('baseLoad', i, 'duty', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={l.hrs} onChange={v => updateEleLoad('baseLoad', i, 'hrs', v)} /></td>
                  <td className="px-3 py-1.5"><CalcCell value={(l.kw * l.duty * l.hrs * 30).toFixed(1)} /></td>
                </tr>
              ))}
              <tr className="bg-honey/10 font-semibold text-xs">
                <td colSpan={4} className="px-3 py-2 text-walnut">Subtotal — Base per Vendor (kWh/mo)</td>
                <td className="px-3 py-2"><CalcCell value={eCalc.baseKwh.toFixed(1)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mt-5 mb-2">Food Vendor Add-Ons</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-walnut/10 bg-walnut/5 text-xs">
                <th className="text-left px-3 py-2 font-semibold text-walnut-light">Equipment</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">kW</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">Duty</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-20">Hrs/Day</th>
                <th className="text-right px-3 py-2 font-semibold text-walnut-light w-24">Monthly kWh</th>
              </tr>
            </thead>
            <tbody>
              {e.foodAddOn.map((l, i) => (
                <tr key={i} className="border-b border-walnut/5">
                  <td className="px-3 py-1.5 text-walnut text-xs">{l.name}</td>
                  <td className="px-3 py-1.5"><InputCell value={l.kw} step={0.1} onChange={v => updateEleLoad('foodAddOn', i, 'kw', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={l.duty} step={0.05} onChange={v => updateEleLoad('foodAddOn', i, 'duty', v)} /></td>
                  <td className="px-3 py-1.5"><InputCell value={l.hrs} onChange={v => updateEleLoad('foodAddOn', i, 'hrs', v)} /></td>
                  <td className="px-3 py-1.5"><CalcCell value={(l.kw * l.duty * l.hrs * 30).toFixed(1)} /></td>
                </tr>
              ))}
              <tr className="bg-honey/10 font-semibold text-xs">
                <td colSpan={4} className="px-3 py-2 text-walnut">Subtotal — Food Add-Ons (kWh/mo)</td>
                <td className="px-3 py-2"><CalcCell value={eCalc.foodAddKwh.toFixed(1)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div>
            <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-1">Rate Scenarios ($/kWh)</div>
            <div className="flex gap-2">
              <div><label className="text-[10px] text-walnut-light block">Low</label><InputCell value={e.lowRate} step={0.005} onChange={v => updateEle({ lowRate: v })} /></div>
              <div><label className="text-[10px] text-walnut-light block">Mid</label><InputCell value={e.midRate} step={0.005} onChange={v => updateEle({ midRate: v })} /></div>
              <div><label className="text-[10px] text-walnut-light block">High</label><InputCell value={e.highRate} step={0.005} onChange={v => updateEle({ highRate: v })} /></div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-1">Active Scenario</div>
            <ScenarioToggle config={e} onChange={s => updateEle({ scenario: s })} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="bg-honey/15 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Food Vendor</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(eCalc.foodVendor)}/mo</div>
          </div>
          <div className="bg-honey/15 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Non-Food Vendor</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(eCalc.nonFoodVendor)}/mo</div>
          </div>
          <div className="bg-walnut/5 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Common Area</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(eCalc.common)}/mo</div>
          </div>
        </div>
      </DetailSection>

      {/* WATER */}
      <DetailSection title="Water / Sewer" subtitle="Per-vendor gallons-per-day × rate per CCF (748 gal)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-walnut-light block mb-1">Food Vendor (gal/day)</label>
            <InputCell value={w.foodGalPerDay} onChange={v => updateWater({ foodGalPerDay: v })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-walnut-light block mb-1">Non-Food Vendor (gal/day)</label>
            <InputCell value={w.nonFoodGalPerDay} onChange={v => updateWater({ nonFoodGalPerDay: v })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-walnut-light block mb-1">Days / Month</label>
            <InputCell value={w.daysPerMonth} onChange={v => updateWater({ daysPerMonth: v })} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-walnut-light">
          <div>Food CCF/mo: <span className="font-semibold text-walnut">{wCalc.foodCCF.toFixed(2)}</span></div>
          <div>Non-Food CCF/mo: <span className="font-semibold text-walnut">{wCalc.nonFoodCCF.toFixed(2)}</span></div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div>
            <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-1">Rate Scenarios ($/CCF)</div>
            <div className="flex gap-2">
              <div><label className="text-[10px] text-walnut-light block">Low</label><InputCell value={w.lowRate} step={0.5} onChange={v => updateWater({ lowRate: v })} /></div>
              <div><label className="text-[10px] text-walnut-light block">Mid</label><InputCell value={w.midRate} step={0.5} onChange={v => updateWater({ midRate: v })} /></div>
              <div><label className="text-[10px] text-walnut-light block">High</label><InputCell value={w.highRate} step={0.5} onChange={v => updateWater({ highRate: v })} /></div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-walnut-light uppercase tracking-wider mb-1">Active Scenario</div>
            <ScenarioToggle config={w} onChange={s => updateWater({ scenario: s })} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="bg-honey/15 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Food Vendor</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(wCalc.foodVendor)}/mo</div>
          </div>
          <div className="bg-honey/15 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Non-Food Vendor</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(wCalc.nonFoodVendor)}/mo</div>
          </div>
          <div className="bg-walnut/5 rounded-lg px-3 py-2">
            <div className="text-[10px] text-walnut-light font-medium uppercase tracking-wider">Common Area</div>
            <div className="font-bold text-walnut tabular-nums">{fmt$(wCalc.common)}/mo</div>
          </div>
        </div>
        <p className="text-[10px] text-walnut-light italic mt-3">
          Sewer charged at 100% of metered water. 3-comp sink is a one-time install (not monthly).
        </p>
      </DetailSection>

    </OpexDetailScaffold>
  );
}

import { useState } from 'react';
import type { ModelInputs } from '../utils/types';

interface Props {
  inputs: ModelInputs;
  onChange: (inputs: ModelInputs) => void;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-medium text-walnut">{label}</label>
        <span className="text-sm font-semibold text-honey">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-walnut mb-1">{label}</label>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-xs text-walnut-light">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full bg-white/70 border border-walnut/20 rounded-md px-2 py-1.5 text-sm text-walnut focus:outline-none focus:border-honey"
        />
        {suffix && <span className="text-xs text-walnut-light">{suffix}</span>}
      </div>
    </div>
  );
}

const fmtDollar = (v: number) =>
  '$' + v.toLocaleString('en-US');
const fmtX = (v: number) => v + '\u00d7';
const fmtPSF = (v: number) => '$' + v + '/PSF';

export default function InputPanel({ inputs, onChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const setSchedule = (idx: number, val: number) => {
    const next = [...inputs.openSchedule];
    next[idx] = val;
    onChange({ ...inputs, openSchedule: next });
  };

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <h2 className="text-lg font-bold text-walnut mb-4">Assumptions</h2>

      <SliderInput
        label="Number of Locations"
        value={inputs.numLocations}
        min={1} max={10} step={1}
        format={v => String(v)}
        onChange={v => set('numLocations', v)}
      />
      <SliderInput
        label="Equity per Location"
        value={inputs.equityPerLocation}
        min={500_000} max={2_000_000} step={50_000}
        format={fmtDollar}
        onChange={v => set('equityPerLocation', v)}
      />
      <SliderInput
        label="Exit EBITDA Multiple"
        value={inputs.exitMultiple}
        min={3} max={10} step={0.5}
        format={fmtX}
        onChange={v => set('exitMultiple', v)}
      />
      <SliderInput
        label="Avg Monthly Vendor Rent / Location"
        value={inputs.monthlyVendorRent}
        min={50_000} max={150_000} step={1_000}
        format={fmtDollar}
        onChange={v => set('monthlyVendorRent', v)}
      />
      <SliderInput
        label="Master Lease $/PSF/yr"
        value={inputs.leasePSF}
        min={25} max={50} step={1}
        format={fmtPSF}
        onChange={v => set('leasePSF', v)}
      />

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full mt-2 py-2 text-sm font-medium text-honey hover:text-terracotta transition-colors flex items-center justify-center gap-1"
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced
        <span className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
          &#9662;
        </span>
      </button>

      {showAdvanced && (
        <div className="mt-3 pt-4 border-t border-walnut/10 space-y-1">
          <h3 className="text-xs font-bold text-walnut uppercase tracking-wider mb-2">Capital Stack</h3>
          <NumberInput label="GP Investment / Location" value={inputs.gpInvestment} onChange={v => set('gpInvestment', v)} prefix="$" />
          <NumberInput label="LP Investment / Location" value={inputs.lpInvestment} onChange={v => set('lpInvestment', v)} prefix="$" />

          <h3 className="text-xs font-bold text-walnut uppercase tracking-wider mb-2 mt-4">Operations</h3>
          <NumberInput label="Total SF per Location" value={inputs.sqft} onChange={v => set('sqft', v)} suffix="SF" />
          <NumberInput label="Monthly OpEx / Location" value={inputs.monthlyOpex} onChange={v => set('monthlyOpex', v)} prefix="$" />
          <NumberInput label="Monthly Membership Revenue" value={inputs.monthlyMembership} onChange={v => set('monthlyMembership', v)} prefix="$" />
          <NumberInput label="Operator Profit Share %" value={inputs.profitSharePct} onChange={v => set('profitSharePct', v)} suffix="%" />
          <NumberInput label="Corp Salary Base (1 location, annual)" value={inputs.salaryBase} onChange={v => set('salaryBase', v)} prefix="$" />
          <NumberInput label="Salary Increment / Additional Location" value={inputs.salaryStep} onChange={v => set('salaryStep', v)} prefix="$" />

          <h3 className="text-xs font-bold text-walnut uppercase tracking-wider mb-2 mt-4">Timeline</h3>
          <NumberInput label="Ramp Period (months)" value={inputs.rampMonths} onChange={v => set('rampMonths', v)} suffix="mo" />
          <NumberInput label="L1 Lease Holiday (months)" value={inputs.l1LeaseHolidayMonths} onChange={v => set('l1LeaseHolidayMonths', v)} suffix="mo" />
          <NumberInput label="Hold Period (months)" value={inputs.holdMonths} onChange={v => set('holdMonths', v)} suffix="mo" />

          <h3 className="text-xs font-bold text-walnut uppercase tracking-wider mb-2 mt-4">Open Schedule (month #)</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {inputs.openSchedule.slice(0, inputs.numLocations).map((m, i) => (
              <NumberInput
                key={i}
                label={`L${i + 1}`}
                value={m}
                onChange={v => setSchedule(i, v)}
                suffix="mo"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

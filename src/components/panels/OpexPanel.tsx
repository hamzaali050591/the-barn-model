import { useState } from 'react';
import type { ModelInputs } from '../../utils/types';
import { vendorTotals, opexPerLocation } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import SliderRow, { DerivedRow } from '../SliderRow';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

const fmt$ = (v: number) => '$' + v.toLocaleString();
const fmtPct = (v: number) => v.toFixed(0) + '%';

export default function OpexPanel({ inputs, onChange }: Props) {
  const [utilsOpen, setUtilsOpen] = useState(false);
  const [nonUtilsOpen, setNonUtilsOpen] = useState(false);

  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const { numVendors } = vendorTotals(inputs);
  const totalMonthly = opexPerLocation(inputs);

  const utilitiesPerVendor = inputs.gasPerVendor + inputs.electricPerVendor + inputs.waterPerVendor;
  const utilitiesTotal = numVendors * utilitiesPerVendor;
  const nonUtilitiesTotal =
    inputs.marketing + inputs.cleaning + inputs.security + inputs.maintenance;

  return (
    <div className="glass rounded-2xl p-5 md:p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
          </svg>
        </div>
        <h3 className="font-bold text-walnut">OpEx</h3>
        <span className="text-[10px] text-walnut-light ml-auto">per location</span>
      </div>

      {/* Utilities accordion */}
      <div className="mb-2">
        <button
          onClick={() => setUtilsOpen(!utilsOpen)}
          className="w-full flex items-center justify-between py-2 px-3 bg-walnut/5 rounded-md hover:bg-walnut/10 transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold text-walnut flex items-center gap-2">
            <span className={`transition-transform ${utilsOpen ? 'rotate-90' : ''}`}>▸</span>
            Utilities
            <span className="text-[10px] text-walnut-light font-normal">({numVendors} vendors × monthly)</span>
          </span>
          <span className="text-sm font-bold text-walnut tabular-nums">{fmtDollarFull(utilitiesTotal)}</span>
        </button>
        {utilsOpen && (
          <div className="mt-2 px-2 pt-1">
            <SliderRow
              label="Gas"
              sublabel="per vendor"
              value={inputs.gasPerVendor}
              min={0} max={500} step={10}
              format={fmt$}
              onChange={v => set('gasPerVendor', v)}
            />
            <SliderRow
              label="Electric"
              sublabel="per vendor"
              value={inputs.electricPerVendor}
              min={0} max={2_000} step={25}
              format={fmt$}
              onChange={v => set('electricPerVendor', v)}
            />
            <SliderRow
              label="Water"
              sublabel="per vendor"
              value={inputs.waterPerVendor}
              min={0} max={500} step={10}
              format={fmt$}
              onChange={v => set('waterPerVendor', v)}
            />
          </div>
        )}
      </div>

      {/* Non-Utilities accordion */}
      <div className="mb-2">
        <button
          onClick={() => setNonUtilsOpen(!nonUtilsOpen)}
          className="w-full flex items-center justify-between py-2 px-3 bg-walnut/5 rounded-md hover:bg-walnut/10 transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold text-walnut flex items-center gap-2">
            <span className={`transition-transform ${nonUtilsOpen ? 'rotate-90' : ''}`}>▸</span>
            Non-Utilities
            <span className="text-[10px] text-walnut-light font-normal">(flat per location)</span>
          </span>
          <span className="text-sm font-bold text-walnut tabular-nums">{fmtDollarFull(nonUtilitiesTotal)}</span>
        </button>
        {nonUtilsOpen && (
          <div className="mt-2 px-2 pt-1">
            <SliderRow
              label="Marketing"
              value={inputs.marketing}
              min={0} max={10_000} step={250}
              format={fmt$}
              onChange={v => set('marketing', v)}
            />
            <SliderRow
              label="Cleaning Staff"
              value={inputs.cleaning}
              min={0} max={10_000} step={250}
              format={fmt$}
              onChange={v => set('cleaning', v)}
            />
            <SliderRow
              label="Security Staff"
              value={inputs.security}
              min={0} max={10_000} step={250}
              format={fmt$}
              onChange={v => set('security', v)}
            />
            <SliderRow
              label="Building Maintenance"
              value={inputs.maintenance}
              min={0} max={10_000} step={250}
              format={fmt$}
              onChange={v => set('maintenance', v)}
            />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-walnut/10 space-y-1.5">
        <DerivedRow label="Total Monthly OpEx" value={fmtDollarFull(totalMonthly)} accent />
      </div>

      {/* Salary & profit share */}
      <div className="mt-4 pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
          Operator Compensation
        </div>
        <SliderRow
          label="Corp Salary Base"
          sublabel="1 location, annual"
          value={inputs.salaryBase}
          min={40_000} max={200_000} step={5_000}
          format={fmt$}
          onChange={v => set('salaryBase', v)}
        />
        <SliderRow
          label="Salary Increment"
          sublabel="per extra location"
          value={inputs.salaryStep}
          min={0} max={50_000} step={2_500}
          format={fmt$}
          onChange={v => set('salaryStep', v)}
        />
        <SliderRow
          label="Operator Profit Share"
          value={inputs.profitSharePct}
          min={0} max={30} step={1}
          format={fmtPct}
          onChange={v => set('profitSharePct', v)}
        />
      </div>
    </div>
  );
}

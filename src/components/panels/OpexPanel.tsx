import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ModelInputs } from '../../utils/types';
import { opexBreakdown } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import SliderRow, { DerivedRow } from '../SliderRow';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
  isRichmond?: boolean;
}

const fmt$ = (v: number) => '$' + v.toLocaleString();
const fmtPct = (v: number) => v.toFixed(0) + '%';

function DetailButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-1 text-[10px] font-semibold text-honey hover:text-terracotta bg-honey/10 hover:bg-honey/20 px-2 py-1 rounded-md border border-honey/20 hover:border-honey/40 transition-all cursor-pointer"
    >
      View Details
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}

function ReadonlyLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-3 py-1.5 text-xs">
      <span className="text-walnut-light">{label}</span>
      <span className="font-semibold text-walnut tabular-nums">{value}</span>
    </div>
  );
}

export default function OpexPanel({ inputs, onChange, isRichmond = false }: Props) {
  const [vendorUtilsOpen, setVendorUtilsOpen] = useState(false);
  const [commonUtilsOpen, setCommonUtilsOpen] = useState(false);
  const [nonUtilsOpen, setNonUtilsOpen] = useState(false);
  const navigate = useNavigate();

  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const bd = opexBreakdown(inputs);
  const { vendorUtilities, commonAreaUtilities, nonUtilities, total: totalMonthlyOpex, gas, electric, water, nu, foodVendorUtilTotal, nonFoodVendorUtilTotal } = bd;

  const monthlySalary = inputs.salaryBase / 12;
  const totalMonthlyExpenses = totalMonthlyOpex + monthlySalary;
  const totalAnnualExpenses = totalMonthlyExpenses * 12;

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

      {/* Vendor Utilities */}
      {inputs.rentIncludesUtilities ? (
        <div className="mb-2">
          <div className="flex items-center gap-2 py-2 px-3 bg-walnut/5 rounded-md">
            <button
              onClick={() => setVendorUtilsOpen(!vendorUtilsOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-walnut cursor-pointer hover:text-honey transition-colors"
            >
              <span className={`transition-transform ${vendorUtilsOpen ? 'rotate-90' : ''}`}>▸</span>
              Vendor Utilities
            </button>
            <DetailButton onClick={() => navigate('/model/opex/vendor-utilities')} />
            <span className="text-sm font-bold text-walnut tabular-nums ml-auto">{fmtDollarFull(vendorUtilities)}</span>
          </div>
          {vendorUtilsOpen && (
            <div className="mt-1 py-1.5 rounded-md bg-white/30">
              <div className="flex justify-between items-baseline px-3 pt-1">
                <span className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider">Per Food Vendor</span>
                <span className="text-xs font-bold text-walnut tabular-nums">{fmtDollarFull(foodVendorUtilTotal)}</span>
              </div>
              <ReadonlyLine label="Gas" value={fmtDollarFull(gas.foodVendor)} />
              <ReadonlyLine label="Electric" value={fmtDollarFull(electric.foodVendor)} />
              <ReadonlyLine label="Water" value={fmtDollarFull(water.foodVendor)} />
              <div className="flex justify-between items-baseline px-3 pt-2">
                <span className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider">Per Non-Food Vendor</span>
                <span className="text-xs font-bold text-walnut tabular-nums">{fmtDollarFull(nonFoodVendorUtilTotal)}</span>
              </div>
              <ReadonlyLine label="Gas" value={fmtDollarFull(gas.nonFoodVendor)} />
              <ReadonlyLine label="Electric" value={fmtDollarFull(electric.nonFoodVendor)} />
              <ReadonlyLine label="Water" value={fmtDollarFull(water.nonFoodVendor)} />
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2 py-2 px-3 bg-walnut/5 rounded-md border border-dashed border-walnut/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-walnut-light italic">
              Vendor Utilities
              <span className="text-[10px] font-normal ml-1">(vendors pay directly)</span>
            </span>
            <span className="text-sm font-semibold text-walnut-light tabular-nums">$0</span>
          </div>
        </div>
      )}

      {/* Common Area Utilities */}
      <div className="mb-2">
        <div className="flex items-center gap-2 py-2 px-3 bg-walnut/5 rounded-md">
          <button
            onClick={() => setCommonUtilsOpen(!commonUtilsOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-walnut cursor-pointer hover:text-honey transition-colors"
          >
            <span className={`transition-transform ${commonUtilsOpen ? 'rotate-90' : ''}`}>▸</span>
            Common Area Utilities
          </button>
          <DetailButton onClick={() => navigate('/model/opex/common-utilities')} />
          <span className="text-sm font-bold text-walnut tabular-nums ml-auto">{fmtDollarFull(commonAreaUtilities)}</span>
        </div>
        {commonUtilsOpen && (
          <div className="mt-1 py-1.5 rounded-md bg-white/30">
            <ReadonlyLine label="Electric" value={fmtDollarFull(electric.common)} />
            <ReadonlyLine label="Water" value={fmtDollarFull(water.common)} />
          </div>
        )}
      </div>

      {/* Non-Utilities */}
      <div className="mb-2">
        <div className="flex items-center gap-2 py-2 px-3 bg-walnut/5 rounded-md">
          <button
            onClick={() => setNonUtilsOpen(!nonUtilsOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-walnut cursor-pointer hover:text-honey transition-colors"
          >
            <span className={`transition-transform ${nonUtilsOpen ? 'rotate-90' : ''}`}>▸</span>
            Non-Utilities
          </button>
          <DetailButton onClick={() => navigate('/model/opex/non-utility')} />
          <span className="text-sm font-bold text-walnut tabular-nums ml-auto">{fmtDollarFull(nonUtilities)}</span>
        </div>
        {nonUtilsOpen && (
          <div className="mt-1 py-1.5 rounded-md bg-white/30">
            <ReadonlyLine label="Marketing" value={fmtDollarFull(nu.marketing)} />
            <ReadonlyLine label="Cleaning" value={fmtDollarFull(nu.cleaning)} />
            <ReadonlyLine label="Grease / Oil" value={fmtDollarFull(nu.grease)} />
            <ReadonlyLine label="Security" value={fmtDollarFull(nu.security)} />
            <ReadonlyLine label="Maintenance" value={fmtDollarFull(nu.maintenance)} />
            <ReadonlyLine label="Insurance" value={fmtDollarFull(nu.insurance)} />
            <ReadonlyLine label="Technology" value={fmtDollarFull(nu.technology)} />
            <ReadonlyLine label="Misc / Waste" value={fmtDollarFull(nu.misc)} />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-walnut/10 space-y-1.5">
        <DerivedRow label="Total Monthly OpEx" value={fmtDollarFull(totalMonthlyOpex)} accent />
      </div>

      {/* Operator Monthly Salary */}
      <div className="mt-4 pt-3 border-t border-walnut/10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider">
            Operator Monthly Salary
          </div>
          <div className="flex items-center gap-1.5 bg-honey/15 px-2.5 py-1 rounded-md">
            <span className="text-[10px] text-walnut-light font-medium">Monthly</span>
            <span className="text-sm font-bold text-honey tabular-nums">{fmtDollarFull(monthlySalary)}</span>
          </div>
        </div>
        <SliderRow
          label="Corp Salary Base"
          sublabel="1 location, annual"
          value={inputs.salaryBase}
          min={40_000} max={200_000} step={5_000}
          format={fmt$}
          onChange={v => set('salaryBase', v)}
        />
        {!isRichmond && (
          <SliderRow
            label="Salary Increment"
            sublabel="per extra location"
            value={inputs.salaryStep}
            min={0} max={50_000} step={2_500}
            format={fmt$}
            onChange={v => set('salaryStep', v)}
          />
        )}
        <SliderRow
          label="Operator Profit Share"
          value={inputs.profitSharePct}
          min={0} max={30} step={1}
          format={fmtPct}
          onChange={v => set('profitSharePct', v)}
        />
      </div>

      {/* Annual OpEx Escalator */}
      <div className="mt-4 pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
          Annual OpEx Escalator
        </div>
        <SliderRow
          label="OpEx Escalator"
          value={inputs.opexEscalatorPct}
          min={0} max={6} step={0.25}
          format={v => v.toFixed(2) + '%'}
          info="Annual, compounding — applies to vendor utilities, common-area utilities, non-utility OpEx, and operator salary. Compounds from each location's open month. Profit share is excluded (stays at the set % of NOI). Master lease has its own separate escalator."
          onChange={v => set('opexEscalatorPct', v)}
        />
      </div>

      {/* Total Monthly & Annual Expenses (bottom-aligned) */}
      <div className="mt-auto pt-4 border-t-2 border-honey/30 space-y-1.5">
        <div className="flex justify-between items-center py-2 px-3 rounded-md bg-walnut text-cream">
          <span className="text-xs font-medium uppercase tracking-wider">Total Monthly Expenses</span>
          <span className="text-sm font-bold tabular-nums">{fmtDollarFull(totalMonthlyExpenses)}</span>
        </div>
        <div className="flex justify-between items-center py-2 px-3 rounded-md bg-walnut text-cream">
          <span className="text-xs font-medium uppercase tracking-wider">Total Annual Expenses</span>
          <span className="text-sm font-bold tabular-nums">{fmtDollarFull(totalAnnualExpenses)}</span>
        </div>
      </div>
    </div>
  );
}

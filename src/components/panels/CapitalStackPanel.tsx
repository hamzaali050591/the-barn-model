import type { ModelInputs } from '../../utils/types';
import { capitalStack } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import SliderRow, { DerivedRow } from '../SliderRow';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

const fmt$ = (v: number) => '$' + v.toLocaleString();
const fmtPSF = (v: number) => '$' + v + '/PSF';
const fmtSf = (v: number) => v.toLocaleString() + ' sf';

export default function CapitalStackPanel({ inputs, onChange }: Props) {
  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const { tiTotal, investorEquityPerLocation, lpInvestment } = capitalStack(inputs);

  return (
    <div className="glass rounded-2xl p-5 md:p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-honey/20 flex items-center justify-center text-honey">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3.75 21V9.349M12 5.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        </div>
        <h3 className="font-bold text-walnut">Capital Stack</h3>
        <span className="text-[10px] text-walnut-light ml-auto">per location</span>
      </div>

      <SliderRow
        label="Total SF per Location"
        value={inputs.sqft}
        min={5_000} max={20_000} step={500}
        format={fmtSf}
        onChange={v => set('sqft', v)}
      />
      <SliderRow
        label="TI Allowance"
        value={inputs.tiPSF}
        min={20} max={50} step={1}
        format={fmtPSF}
        onChange={v => set('tiPSF', v)}
      />
      <SliderRow
        label="Master Lease"
        value={inputs.leasePSF}
        min={25} max={50} step={1}
        format={v => '$' + v + '/PSF/yr'}
        onChange={v => set('leasePSF', v)}
      />
      <SliderRow
        label="CapEx (Total Buildout)"
        value={inputs.capex}
        min={500_000} max={3_000_000} step={50_000}
        format={fmt$}
        onChange={v => set('capex', v)}
      />
      <SliderRow
        label="GP Investment"
        value={inputs.gpInvestment}
        min={0} max={500_000} step={25_000}
        format={fmt$}
        onChange={v => set('gpInvestment', v)}
      />

      <div className="mt-auto pt-3 border-t border-walnut/10 space-y-1.5">
        <DerivedRow label="Total TI (DPEG)" value={fmtDollarFull(tiTotal)} />
        <DerivedRow label="GP Investment" value={fmtDollarFull(inputs.gpInvestment)} />
        <DerivedRow label="LP Investment" value={fmtDollarFull(lpInvestment)} />
        <DerivedRow label="Investor Equity (GP+LP)" value={fmtDollarFull(investorEquityPerLocation)} accent />
      </div>
    </div>
  );
}

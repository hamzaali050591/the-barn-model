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

  const { totalCapex, tiTotal, investorEquityPerLocation, lpInvestment, debtUsedPerLocation } = capitalStack(inputs);
  const debtCapped = debtUsedPerLocation < inputs.debtPerLocation;

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
        label="Base Rent"
        value={inputs.baseRentPSF}
        min={20} max={45} step={1}
        format={v => '$' + v + '/PSF/yr'}
        info="Contract base rent paid to DPEG. Quoted in $/PSF/yr. Negotiated upfront with explicit escalation terms in the lease."
        onChange={v => set('baseRentPSF', v)}
      />
      <SliderRow
        label="Base Rent Escalator"
        value={inputs.baseRentEscalatorPct}
        min={0} max={6} step={0.25}
        format={v => v.toFixed(2) + '%'}
        info="Annual compounding bump on the base rent only, on each location's clock. Default 0% — flat base rent. Typical leases write 2–3% annual escalators or CPI."
        onChange={v => set('baseRentEscalatorPct', v)}
      />
      <SliderRow
        label="NNN (CAM + Tax + Insurance)"
        value={inputs.nnnPSF}
        min={0} max={15} step={0.5}
        format={v => '$' + v + '/PSF/yr'}
        info="Triple-net pass-throughs: common area maintenance + property tax + insurance. Reconciled annually based on landlord's actual costs. TX commercial property tax (~2.3% effective) is the biggest piece."
        onChange={v => set('nnnPSF', v)}
      />
      <SliderRow
        label="NNN Escalator"
        value={inputs.nnnEscalatorPct}
        min={0} max={6} step={0.25}
        format={v => v.toFixed(2) + '%'}
        info="Annual compounding bump on NNN only. NNN typically inflates faster than base rent because property tax + insurance both track underlying market increases. Insurance has been hardening 5–15%/yr post-2020 — stress-test up here."
        onChange={v => set('nnnEscalatorPct', v)}
      />
      <SliderRow
        label="CapEx (Buildout PSF)"
        value={inputs.capexPSF}
        min={50} max={300} step={5}
        format={fmtPSF}
        onChange={v => set('capexPSF', v)}
      />
      <SliderRow
        label="GP Investment"
        value={inputs.gpInvestment}
        min={0} max={500_000} step={25_000}
        format={fmt$}
        onChange={v => set('gpInvestment', v)}
      />
      <SliderRow
        label="Debt Leverage"
        value={inputs.debtPerLocation}
        min={0} max={1_000_000} step={100_000}
        format={fmt$}
        info="Per-location senior debt that replaces LP equity dollar-for-dollar. Funds at the capital-call month (3 months before open) and amortizes on a level monthly P&I schedule over the loan-term slider below. If the term outruns the hold, the remaining balance is paid off from gross exit proceeds (balloon). If the slider exceeds the available LP slot (CapEx − TI − GP), the model clamps debt at that ceiling."
        onChange={v => set('debtPerLocation', v)}
      />
      <SliderRow
        label="Debt Rate"
        value={inputs.debtRatePct}
        min={0} max={20} step={2}
        format={v => v.toFixed(0) + '%'}
        info="Annual interest rate on the senior debt. Applied to the outstanding balance each month. Positive leverage when this is below the operating return; negative leverage above it."
        onChange={v => set('debtRatePct', v)}
      />
      <SliderRow
        label="Loan Term"
        value={inputs.debtTermYears}
        min={5} max={20} step={5}
        format={v => v + ' yr'}
        info="Amortization period for the senior debt. Default 10-yr amort matches typical CRE term-loan structures: lower monthly P&I than a hold-period-matched loan, but a balloon balance remains at exit, paid off from gross exit proceeds before the operator promote and investor split."
        onChange={v => set('debtTermYears', v)}
      />

      <div className="mt-auto pt-3 border-t border-walnut/10 space-y-1.5">
        <DerivedRow label="Total TI (DPEG)" value={fmtDollarFull(tiTotal)} />
        <DerivedRow
          label={debtCapped ? 'Debt Financing (capped)' : 'Debt Financing'}
          value={fmtDollarFull(debtUsedPerLocation)}
        />
        <DerivedRow label="GP Investment" value={fmtDollarFull(inputs.gpInvestment)} />
        <DerivedRow label="LP Investment" value={fmtDollarFull(lpInvestment)} />
        <DerivedRow label="Investor Equity (LP+GP)" value={fmtDollarFull(investorEquityPerLocation)} />
        <DerivedRow label="Total CapEx" value={fmtDollarFull(totalCapex)} accent />
      </div>
    </div>
  );
}

import type { ModelInputs } from '../../utils/types';
import { capitalStack } from '../../utils/engine';
import { fmtDollarFull } from '../../utils/format';
import SliderRow, { DerivedRow } from '../SliderRow';
import InfoTooltip from '../InfoTooltip';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

const fmtX = (v: number) => v + '\u00d7';
const fmtMo = (v: number) => v + ' mo';
const fmtInt = (v: number) => String(v);

export default function InvestorPanel({ inputs, onChange }: Props) {
  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const setSchedule = (idx: number, val: number) => {
    const next = [...inputs.openSchedule];
    next[idx] = val;
    onChange({ ...inputs, openSchedule: next });
  };

  const { investorEquityPerLocation } = capitalStack(inputs);
  const totalInvestorEquity = investorEquityPerLocation * inputs.numLocations;

  return (
    <div className="glass rounded-2xl p-5 md:p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-walnut/15 flex items-center justify-center text-walnut">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="font-bold text-walnut">Deal Terms & Rollout</h3>
      </div>

      {/* Investor KPIs */}
      <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
        Investment
      </div>
      <SliderRow
        label="Number of Locations"
        value={inputs.numLocations}
        min={1} max={10} step={1}
        format={fmtInt}
        onChange={v => set('numLocations', v)}
      />
      <SliderRow
        label="Exit EBITDA Multiple"
        value={inputs.exitMultiple}
        min={1} max={8} step={0.5}
        format={fmtX}
        onChange={v => set('exitMultiple', v)}
      />

      {/* Timeline */}
      <div className="pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2 flex items-center gap-1">
          Timeline
          <InfoTooltip
            align="left"
            content="Investor equity for each location is called 3 months before that location opens, reflecting the buildout period when CapEx is actually spent."
          />
        </div>
        <SliderRow
          label="Ramp Period"
          sublabel="no distributions"
          info="The hall is fully pre-leased, so rent revenue starts at 100% from day 1. The ramp period lets the operating entity build a cash reserve before starting distributions. Distributions begin the month after ramp completes."
          value={inputs.rampMonths}
          min={0} max={12} step={1}
          format={fmtMo}
          onChange={v => set('rampMonths', v)}
        />
        <SliderRow
          label="L1 Lease Holiday"
          info="Landlord concession on L1 only (Richmond), structured as an upfront equity credit. Each month of holiday × monthly base rent reduces the L1 capital call dollar-for-dollar — investors literally write a smaller check. At default $26/PSF × 9,180 sf / 12 = ~$19.9K/mo: hol=3 saves ~$60K equity, hol=12 saves ~$239K. Credit is capped at L1's gross equity ask. Lease itself is charged in full from open onwards (NNN never waived)."
          value={inputs.l1LeaseHolidayMonths}
          min={0} max={12} step={1}
          format={fmtMo}
          onChange={v => set('l1LeaseHolidayMonths', v)}
        />
        <SliderRow
          label="Hold Period"
          value={inputs.holdMonths}
          min={0} max={72} step={6}
          format={fmtMo}
          onChange={v => set('holdMonths', v)}
        />
      </div>

      {/* Open Schedule */}
      <div className="pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
          Open Schedule (month #)
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0">
          {inputs.openSchedule.slice(0, inputs.numLocations).map((m, i) => (
            <SliderRow
              key={i}
              label={`Location ${i + 1}`}
              value={m}
              min={1} max={inputs.holdMonths} step={1}
              format={v => 'Mo ' + v}
              onChange={v => setSchedule(i, v)}
            />
          ))}
        </div>
      </div>

      {/* Investor Equity — bottom-aligned */}
      <div className="mt-auto pt-4 space-y-1.5">
        <DerivedRow
          label="Investor Equity / Location"
          value={fmtDollarFull(investorEquityPerLocation)}
        />
        <DerivedRow
          label="Total Investor Equity"
          value={fmtDollarFull(totalInvestorEquity)}
          accent
        />
      </div>
    </div>
  );
}

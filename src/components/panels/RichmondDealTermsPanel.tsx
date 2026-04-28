import type { ModelInputs } from '../../utils/types';
import SliderRow from '../SliderRow';
import InfoTooltip from '../InfoTooltip';

interface Props {
  inputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
  holdMonths: number;
  onHoldChange: (v: number) => void;
}

const fmtX = (v: number) => v + '×';
const fmtMo = (v: number) => v + ' mo';

export default function RichmondDealTermsPanel({ inputs, onChange, holdMonths, onHoldChange }: Props) {
  const set = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <div className="glass rounded-2xl p-5 md:p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-walnut/15 flex items-center justify-center text-walnut">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="font-bold text-walnut">Deal Terms &amp; Rollout</h3>
      </div>

      <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">
        Exit
      </div>
      <SliderRow
        label="Exit EBITDA Multiple"
        value={inputs.exitMultiple}
        min={1} max={8} step={0.5}
        format={fmtX}
        onChange={v => set('exitMultiple', v)}
      />
      <SliderRow
        label="Hold Period"
        value={holdMonths}
        min={0} max={72} step={6}
        format={fmtMo}
        onChange={onHoldChange}
      />

      <div className="pt-3 border-t border-walnut/10">
        <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2 flex items-center gap-1">
          Timeline
          <InfoTooltip
            align="left"
            content="Investor equity is called 3 months prior to each location's opening, reflecting the buildout period when CapEx is deployed. Richmond opens in month 4; the capital call occurs in month 1."
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
          value={inputs.l1LeaseHolidayMonths}
          min={0} max={12} step={1}
          format={fmtMo}
          onChange={v => set('l1LeaseHolidayMonths', v)}
        />
      </div>
    </div>
  );
}

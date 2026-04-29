import { useState, useMemo } from 'react';
import { runModel, runModelWith } from '../utils/engine';
import { fmtDollarFull, fmtPct } from '../utils/format';
import { useReveal } from '../utils/useReveal';
import { useModel } from '../utils/ModelContext';
import KPICards from '../components/KPICards';
import AnnualTable from '../components/AnnualTable';
import CashFlowChart from '../components/CashFlowChart';
import MonthlyDetail from '../components/MonthlyDetail';
import SensitivityTable from '../components/SensitivityTable';
import NavBar from '../components/NavBar';
import CapitalStackPanel from '../components/panels/CapitalStackPanel';
import RevenuePanel from '../components/panels/RevenuePanel';
import OpexPanel from '../components/panels/OpexPanel';
import InvestorPanel from '../components/panels/InvestorPanel';
import RichmondDealTermsPanel from '../components/panels/RichmondDealTermsPanel';
import InfoTooltip from '../components/InfoTooltip';

type ViewMode = 'richmond' | 'portfolio';

export default function Model() {
  const { inputs, setInputs } = useModel();
  const [viewMode, setViewMode] = useState<ViewMode>('richmond');
  const revealRef = useReveal();

  // Richmond mode overrides: 1 location; hold period adjustable via panel slider
  const [richmondHold, setRichmondHold] = useState<number>(36);

  const activeInputs = useMemo(() => {
    if (viewMode === 'richmond') {
      return {
        ...inputs,
        numLocations: 1,
        holdMonths: richmondHold,
        openSchedule: [4],
      };
    }
    return inputs;
  }, [inputs, viewMode, richmondHold]);

  const results = useMemo(() => runModel(activeInputs), [activeInputs]);

  const isRichmond = viewMode === 'richmond';

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/model" />

      <main className="max-w-7xl mx-auto px-3 md:px-6 py-5 md:py-8">
        {/* Header + view toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-walnut flex items-center gap-2">
              The Numbers
              <InfoTooltip
                align="left"
                size="md"
                content="Equity-only, pre-tax. No debt, no preferred return, no waterfall. Operator receives a 10% promote applied to both ongoing distributions and exit proceeds."
              />
            </h1>
            <p className="text-walnut-light text-sm mt-0.5">Interactive investor returns model</p>
          </div>

          {/* Richmond / Portfolio toggle */}
          <div className="flex items-center gap-1 p-1 bg-cream border border-walnut/15 rounded-xl shadow-sm">
            {([
              { val: 'richmond' as ViewMode, label: 'Richmond', sub: '1 location' },
              { val: 'portfolio' as ViewMode, label: 'Full Portfolio', sub: `${inputs.numLocations} locations` },
            ]).map(opt => (
              <button
                key={opt.val}
                onClick={() => setViewMode(opt.val)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  viewMode === opt.val
                    ? 'bg-walnut text-cream shadow-sm'
                    : 'text-walnut-light hover:text-walnut hover:bg-walnut/5'
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-[10px] font-normal ${viewMode === opt.val ? 'text-cream/60' : 'text-walnut-light/60'}`}>
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <section className="mb-6 md:mb-8">
          <KPICards results={results} />
        </section>

        {/* Summary row */}
        <section className="mb-6 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Equity',
              value: fmtDollarFull(results.totalEquity),
              tip: 'Sum of all investor capital contributions (GP + LP combined) across all locations. Each location is funded at CapEx minus TI allowance.',
            },
            {
              label: 'Total Distributions',
              value: fmtDollarFull(results.totalDistributions),
              tip: 'Cumulative cash distributions to investors over the hold, net of the operator’s 10% promote. Excludes exit proceeds.',
            },
            {
              label: 'Exit Proceeds',
              value: fmtDollarFull(results.exitProceeds),
              tip: 'Stabilized T12 EBITDA (with owner comp added back per industry PE normalization) × exit multiple, net of the operator’s 10% promote on the exit gain. This is the net cash to investors at exit.',
            },
            {
              label: 'Stabilized CoC',
              value: fmtPct(results.stabilizedCoC),
              tip: 'Stabilized cash-on-cash yield: last-12-month distributions ÷ total equity. The run-rate annual yield on investor equity once all locations are past ramp.',
            },
          ].map(item => (
            <div key={item.label} className="glass rounded-xl px-4 py-3 text-center">
              <div className="text-xs text-walnut-light font-medium flex items-center justify-center gap-1">
                {item.label}
                <InfoTooltip content={item.tip} />
              </div>
              <div className="text-lg font-bold text-walnut mt-0.5">{item.value}</div>
            </div>
          ))}
        </section>

        {/* Assumption panels */}
        <section className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold text-walnut">Assumptions</h2>
            <span className="text-xs text-walnut-light">
              Adjust any bar to see KPIs update live
            </span>
          </div>
          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            <CapitalStackPanel inputs={inputs} onChange={setInputs} />
            <RevenuePanel inputs={inputs} onChange={setInputs} />
            <OpexPanel inputs={inputs} onChange={setInputs} isRichmond={isRichmond} />
            {isRichmond ? (
              <RichmondDealTermsPanel
                inputs={inputs}
                onChange={setInputs}
                holdMonths={richmondHold}
                onHoldChange={setRichmondHold}
              />
            ) : (
              <InvestorPanel inputs={inputs} onChange={setInputs} />
            )}
          </div>
        </section>

        {/* Results */}
        <section className="space-y-5 md:space-y-6">
          <AnnualTable monthly={results.monthly} holdMonths={activeInputs.holdMonths} />
          <CashFlowChart monthly={results.monthly} />
          {isRichmond ? (
            /* Single-location sensitivity: just exit multiple */
            <div className="glass rounded-2xl p-4 md:p-5">
              <h3 className="text-base font-bold text-walnut mb-3">Sensitivity: IRR by Exit Multiple</h3>
              <div className="overflow-x-auto scroll-fade-x">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-walnut-light font-semibold">Exit Multiple</th>
                      {[1, 2, 3, 4, 5, 6].map(em => (
                        <th key={em} className={`px-3 py-2 text-center font-semibold ${em === activeInputs.exitMultiple ? 'text-honey' : 'text-walnut-light'}`}>
                          {em}&times;
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-walnut/5">
                      <td className="px-3 py-2 font-semibold text-walnut-light">IRR</td>
                      {[1, 2, 3, 4, 5, 6].map(em => {
                        const r = runModelWith(activeInputs, { exitMultiple: em });
                        const active = em === activeInputs.exitMultiple;
                        return (
                          <td key={em} className={`px-3 py-2 text-center tabular-nums ${active ? 'bg-honey text-white font-bold rounded-md' : 'text-walnut'}`}>
                            {fmtPct(r.irr)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-t border-walnut/5">
                      <td className="px-3 py-2 font-semibold text-walnut-light">MOIC</td>
                      {[1, 2, 3, 4, 5, 6].map(em => {
                        const r = runModelWith(activeInputs, { exitMultiple: em });
                        const active = em === activeInputs.exitMultiple;
                        return (
                          <td key={em} className={`px-3 py-2 text-center tabular-nums ${active ? 'bg-honey text-white font-bold rounded-md' : 'text-walnut'}`}>
                            {r.moic.toFixed(2)}x
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <SensitivityTable inputs={inputs} />
          )}
          <MonthlyDetail monthly={results.monthly} />
        </section>
      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">
            The Barn &mdash; Everybody&rsquo;s Welcome
          </p>
          <p className="text-walnut-light text-xs mt-2 max-w-xl mx-auto">
            This model is for illustrative purposes only and does not constitute an offer to sell
            or a solicitation of an offer to buy any securities. Projections are based on assumptions
            that may not reflect actual results.
          </p>
        </div>
      </footer>
    </div>
  );
}

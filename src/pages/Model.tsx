import { useState, useMemo } from 'react';
import { DEFAULT_INPUTS } from '../utils/types';
import type { ModelInputs } from '../utils/types';
import { runModel } from '../utils/engine';
import { fmtDollarFull, fmtPct } from '../utils/format';
import { useReveal } from '../utils/useReveal';
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

export default function Model() {
  const [inputs, setInputs] = useState<ModelInputs>(DEFAULT_INPUTS);
  const results = useMemo(() => runModel(inputs), [inputs]);
  const revealRef = useReveal();

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/model" />

      <main className="max-w-7xl mx-auto px-3 md:px-6 py-5 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-walnut">Financial Model</h1>
            <p className="text-walnut-light text-sm mt-0.5">Interactive investor returns model</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-walnut-light">
              {inputs.numLocations} locations &middot; {inputs.holdMonths / 12}yr hold
            </p>
            <p className="text-xs text-walnut-light">
              {fmtDollarFull(results.totalEquity)} total investor equity
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <section className="mb-6 md:mb-8 reveal">
          <KPICards results={results} />
        </section>

        {/* Summary row */}
        <section className="mb-6 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Equity', value: fmtDollarFull(results.totalEquity) },
            { label: 'Total Distributions', value: fmtDollarFull(results.totalDistributions) },
            { label: 'Exit Proceeds', value: fmtDollarFull(results.exitProceeds) },
            { label: 'Stabilized CoC', value: fmtPct(results.stabilizedCoC) },
          ].map(item => (
            <div key={item.label} className="glass rounded-xl px-4 py-3 text-center reveal">
              <div className="text-xs text-walnut-light font-medium">{item.label}</div>
              <div className="text-lg font-bold text-walnut mt-0.5">{item.value}</div>
            </div>
          ))}
        </section>

        {/* Assumption panels — horizontal, 4 columns */}
        <section className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold text-walnut">Assumptions</h2>
            <span className="text-xs text-walnut-light">
              Adjust any bar to see KPIs update live
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            <CapitalStackPanel inputs={inputs} onChange={setInputs} />
            <RevenuePanel inputs={inputs} onChange={setInputs} />
            <OpexPanel inputs={inputs} onChange={setInputs} />
            <InvestorPanel inputs={inputs} onChange={setInputs} />
          </div>
        </section>

        {/* Results */}
        <section className="space-y-5 md:space-y-6">
          <AnnualTable monthly={results.monthly} holdMonths={inputs.holdMonths} />
          <CashFlowChart monthly={results.monthly} />
          <SensitivityTable inputs={inputs} />
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

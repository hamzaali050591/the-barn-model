import { useState } from 'react';
import type { MonthlyRow } from '../utils/types';
import { fmtDollarFull } from '../utils/format';

interface Props {
  monthly: MonthlyRow[];
}

export default function MonthlyDetail({ monthly }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-2xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-lg md:text-xl font-bold text-walnut hover:bg-honey/10 transition-colors rounded-2xl group"
      >
        <span className="flex items-center gap-3">
          <svg className="w-6 h-6 text-honey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          Monthly Detail
          <span className="text-sm font-normal text-walnut-light">({monthly.length} months)</span>
        </span>
        <span className={`text-2xl transition-transform text-honey group-hover:scale-110 ${open ? 'rotate-180' : ''}`}>&#9662;</span>
      </button>

      {open && (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scroll-fade-x">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-cream z-10">
              <tr className="border-b border-walnut/10">
                {[
                  'Mo', '#Loc', '#Dist', 'Revenue', 'OpEx', 'Lease',
                  'EBITDA', 'Salary', 'Post-Sal', 'Dist NOI',
                  'Profit Sh', 'Distrib', 'Cap Call', 'Exit', 'Net CF',
                ].map(h => (
                  <th key={h} className="text-right px-2 py-1.5 font-semibold text-walnut-light whitespace-nowrap first:text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthly.map(r => (
                <tr key={r.month} className="border-b border-walnut/5 hover:bg-honey/5">
                  <td className="px-2 py-1 text-left font-medium">{r.month}</td>
                  <td className="px-2 py-1 text-right">{r.nActive}</td>
                  <td className="px-2 py-1 text-right">{r.nDistributing}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.revenue)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.opex)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.masterLease)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.preCompEBITDA)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.corpSalary)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.postSalaryEBITDA)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.distributableNOI)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.profitShare)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.distributions)}</td>
                  <td className={`px-2 py-1 text-right tabular-nums ${r.capitalCall < 0 ? 'text-terracotta' : ''}`}>
                    {fmtDollarFull(r.capitalCall)}
                  </td>
                  <td className="px-2 py-1 text-right tabular-nums">{fmtDollarFull(r.exitProceeds)}</td>
                  <td className={`px-2 py-1 text-right tabular-nums font-medium ${r.netCashFlow < 0 ? 'text-terracotta' : 'text-sage'}`}>
                    {fmtDollarFull(r.netCashFlow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

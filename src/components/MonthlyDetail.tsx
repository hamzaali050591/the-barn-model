import { useState } from 'react';
import type { MonthlyRow } from '../utils/types';
import { fmtDollarFull } from '../utils/format';

interface Props {
  monthly: MonthlyRow[];
}

export default function MonthlyDetail({ monthly }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-walnut/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-walnut hover:bg-walnut/5 transition-colors rounded-2xl"
      >
        <span>Monthly Detail ({monthly.length} months)</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>&#9662;</span>
      </button>

      {open && (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
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

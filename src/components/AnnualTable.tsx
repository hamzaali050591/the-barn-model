import type { MonthlyRow } from '../utils/types';
import { fmtDollarFull } from '../utils/format';

interface Props {
  monthly: MonthlyRow[];
  holdMonths: number;
}

interface AnnualData {
  label: string;
  locations: number;
  revenue: number;
  opex: number;
  masterLease: number;
  ebitda: number;
  corpSalary: number;
  postSalaryEBITDA: number;
  profitShare: number;
  distributions: number;
  capitalCalled: number;
  exitProceeds: number;
  netCashFlow: number;
}

export default function AnnualTable({ monthly, holdMonths }: Props) {
  const years = Math.ceil(holdMonths / 12);
  const annuals: AnnualData[] = [];

  for (let y = 0; y < years; y++) {
    const start = y * 12;
    const end = Math.min((y + 1) * 12, holdMonths);
    const rows = monthly.slice(start, end);
    if (rows.length === 0) continue;

    annuals.push({
      label: `Year ${y + 1}`,
      locations: rows[rows.length - 1].nActive,
      revenue: rows.reduce((s, r) => s + r.revenue, 0),
      opex: rows.reduce((s, r) => s + r.opex, 0),
      masterLease: rows.reduce((s, r) => s + r.masterLease, 0),
      ebitda: rows.reduce((s, r) => s + r.preCompEBITDA, 0),
      corpSalary: rows.reduce((s, r) => s + r.corpSalary, 0),
      postSalaryEBITDA: rows.reduce((s, r) => s + r.postSalaryEBITDA, 0),
      profitShare: rows.reduce((s, r) => s + r.profitShare, 0),
      distributions: rows.reduce((s, r) => s + r.distributions, 0),
      capitalCalled: rows.reduce((s, r) => s + r.capitalCall, 0),
      exitProceeds: rows.reduce((s, r) => s + r.exitProceeds, 0),
      netCashFlow: rows.reduce((s, r) => s + r.netCashFlow, 0),
    });
  }

  // Total column
  const total: AnnualData = {
    label: 'Total',
    locations: monthly[monthly.length - 1]?.nActive ?? 0,
    revenue: annuals.reduce((s, a) => s + a.revenue, 0),
    opex: annuals.reduce((s, a) => s + a.opex, 0),
    masterLease: annuals.reduce((s, a) => s + a.masterLease, 0),
    ebitda: annuals.reduce((s, a) => s + a.ebitda, 0),
    corpSalary: annuals.reduce((s, a) => s + a.corpSalary, 0),
    postSalaryEBITDA: annuals.reduce((s, a) => s + a.postSalaryEBITDA, 0),
    profitShare: annuals.reduce((s, a) => s + a.profitShare, 0),
    distributions: annuals.reduce((s, a) => s + a.distributions, 0),
    capitalCalled: annuals.reduce((s, a) => s + a.capitalCalled, 0),
    exitProceeds: annuals.reduce((s, a) => s + a.exitProceeds, 0),
    netCashFlow: annuals.reduce((s, a) => s + a.netCashFlow, 0),
  };

  const cols = [...annuals, total];

  const metricRows: { label: string; key: keyof AnnualData; isCurrency?: boolean }[] = [
    { label: '# Locations', key: 'locations' },
    { label: 'Revenue', key: 'revenue', isCurrency: true },
    { label: 'OpEx', key: 'opex', isCurrency: true },
    { label: 'Master Lease', key: 'masterLease', isCurrency: true },
    { label: 'EBITDA', key: 'ebitda', isCurrency: true },
    { label: 'Corp Salary', key: 'corpSalary', isCurrency: true },
    { label: 'Post-Salary EBITDA', key: 'postSalaryEBITDA', isCurrency: true },
    { label: 'Profit Share', key: 'profitShare', isCurrency: true },
    { label: 'Distributions', key: 'distributions', isCurrency: true },
    { label: 'Capital Called', key: 'capitalCalled', isCurrency: true },
    { label: 'Exit Proceeds', key: 'exitProceeds', isCurrency: true },
    { label: 'Net Cash Flow', key: 'netCashFlow', isCurrency: true },
  ];

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-walnut/10 overflow-x-auto">
      <h3 className="text-base font-bold text-walnut px-5 pt-4 pb-2">Annual Breakdown</h3>
      <table className="w-full text-xs md:text-sm">
        <thead>
          <tr className="border-b border-walnut/10">
            <th className="text-left px-3 md:px-5 py-2 font-semibold text-walnut-light"></th>
            {cols.map(c => (
              <th
                key={c.label}
                className={`text-right px-3 md:px-4 py-2 font-semibold ${
                  c.label === 'Total' ? 'text-walnut bg-honey/10' : 'text-walnut-light'
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metricRows.map((row, idx) => (
            <tr
              key={row.key}
              className={`border-b border-walnut/5 ${
                row.key === 'postSalaryEBITDA' || row.key === 'netCashFlow'
                  ? 'bg-sage/5 font-semibold'
                  : ''
              } ${idx % 2 === 0 ? '' : 'bg-walnut/[0.02]'}`}
            >
              <td className="px-3 md:px-5 py-1.5 text-walnut whitespace-nowrap">{row.label}</td>
              {cols.map(c => {
                const val = c[row.key] as number;
                return (
                  <td
                    key={c.label}
                    className={`text-right px-3 md:px-4 py-1.5 tabular-nums ${
                      c.label === 'Total' ? 'bg-honey/10 font-semibold' : ''
                    } ${val < 0 ? 'text-terracotta' : ''}`}
                  >
                    {row.isCurrency ? fmtDollarFull(val) : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

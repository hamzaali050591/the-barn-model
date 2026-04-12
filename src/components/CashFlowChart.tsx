import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyRow } from '../utils/types';

interface Props {
  monthly: MonthlyRow[];
}

export default function CashFlowChart({ monthly }: Props) {
  const data = monthly.map(r => ({
    month: r.month,
    'Cumulative Equity': r.cumulativeEquity,
    'Cumulative Distributions': r.cumulativeDistributions,
  }));

  const formatYAxis = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-walnut/10 p-4 md:p-5">
      <h3 className="text-base font-bold text-walnut mb-3">Cumulative Equity vs Distributions</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d4c8bc" opacity={0.5} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#5C4033' }}
            label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#5C4033' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#5C4033' }}
          />
          <Tooltip
            formatter={(value) => ['$' + Number(value).toLocaleString()]}
            labelFormatter={(label) => `Month ${label}`}
            contentStyle={{ borderRadius: 8, border: '1px solid #d4c8bc', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="Cumulative Equity"
            stroke="#C27D5B"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Cumulative Distributions"
            stroke="#8B9D77"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import NavBar from './NavBar';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function OpexDetailScaffold({ title, subtitle, children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      <NavBar current="/model" />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/model')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-walnut hover:text-honey transition-colors mb-5 cursor-pointer group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to The Numbers
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-walnut">{title}</h1>
          {subtitle && <p className="text-walnut-light text-sm mt-1">{subtitle}</p>}
          <p className="text-xs text-walnut-light italic mt-2">
            Yellow cells are raw inputs &mdash; edit to update the model. All other values are calculated.
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}

// Shared UI primitives for detail pages
export function InputCell({
  value,
  onChange,
  step = 1,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      min={min}
      onChange={e => onChange(Math.max(min, Number(e.target.value) || 0))}
      className="w-full bg-yellow-100 border border-yellow-300 text-blue-700 font-semibold rounded px-2 py-1 text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-honey/30 transition-all"
    />
  );
}

export function CalcCell({ value }: { value: string | number }) {
  return (
    <span className="font-mono text-walnut tabular-nums text-right block pr-2">
      {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
    </span>
  );
}

export function DetailSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6 mb-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-walnut">{title}</h2>
        {subtitle && <p className="text-xs text-walnut-light mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

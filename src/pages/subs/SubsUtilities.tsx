import { useNavigate } from 'react-router-dom';
import SubsNavBar from '../../components/SubsNavBar';
import { useReveal } from '../../utils/useReveal';

interface Col { key: string; label: string; align?: 'left' | 'right' }

function Table({ cols, rows, foot }: { cols: Col[]; rows: Record<string, string>[]; foot?: Record<string, string> }) {
  return (
    <div className="overflow-x-auto scroll-fade-x -mx-5 md:mx-0">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="border-b border-walnut/15">
            {cols.map(c => (
              <th key={c.key} className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-walnut-light ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-walnut/8 row-hover">
              {cols.map(c => (
                <td key={c.key} className={`px-3 py-2.5 ${c.align === 'right' ? 'text-right tabular-nums text-walnut' : 'text-walnut'} ${c.key === cols[0].key ? 'font-medium' : 'text-walnut-light'}`}>
                  {r[c.key] ?? ''}
                </td>
              ))}
            </tr>
          ))}
          {foot && (
            <tr className="border-t-2 border-walnut/30 font-bold">
              {cols.map(c => (
                <td key={c.key} className={`px-3 py-2.5 text-walnut ${c.align === 'right' ? 'text-right tabular-nums' : 'text-left'}`}>
                  {foot[c.key] ?? ''}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Card({ children, title }: { title: string; children: React.ReactNode }) {
  return (
    <section className="reveal glass rounded-2xl p-5 md:p-6">
      <h2 className="text-lg font-bold text-walnut mb-4 pb-2 border-b border-walnut/10">{title}</h2>
      {children}
    </section>
  );
}

export default function SubsUtilities() {
  const navigate = useNavigate();
  const revealRef = useReveal();

  const summary = [
    { tone: 'honey', cat: 'Gas', peak: '~2,992 CFH', peakLabel: 'peak connected (food row)', usage: '~3,121 therms / mo' },
    { tone: 'terracotta', cat: 'Electric', peak: '~147.9 kW', peakLabel: 'peak connected (whole building)', usage: '~46,285 kWh / mo' },
    { tone: 'sage', cat: 'Water / Sewer', peak: '~3,356 gal / day', peakLabel: 'building demand', usage: '~100,680 gal / mo' },
    { tone: 'walnut', cat: 'Grease Interceptor', peak: '1,500 gal (H-20)', peakLabel: 'two-compartment, precast', usage: 'Sized for 8 food stalls' },
  ];
  const toneRing: Record<string, string> = {
    honey: 'border-honey/30 bg-honey/10',
    terracotta: 'border-terracotta/30 bg-terracotta/10',
    sage: 'border-sage/30 bg-sage/10',
    walnut: 'border-walnut/20 bg-walnut/5',
  };
  const toneText: Record<string, string> = {
    honey: 'text-honey', terracotta: 'text-terracotta', sage: 'text-sage', walnut: 'text-walnut',
  };

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <SubsNavBar current="/subs/utility-loads" />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate('/subs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-light hover:text-honey transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          All scopes
        </button>

        <div className="mb-8">
          <span className="chip mb-4">Reference Data</span>
          <h1 className="text-2xl md:text-4xl font-bold text-walnut leading-tight">Utility Loads for Scoping</h1>
          <p className="text-walnut-light text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Connected loads and monthly usage for the Richmond buildout (Bldg F, L2 — left zone).
            Figures are <span className="font-semibold text-walnut">usage / load only — no pricing.</span> Peak / connected load
            sizes the service, pipe, and panel; monthly usage is the duty-cycled average. Equipment
            lists are representative per-stall builds — flag if your design differs.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            {['8 food stalls', '4 non-food stalls', '12 total vendors', '12 hrs/day', '30 days/mo'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full border border-walnut/15 bg-walnut/5 text-walnut font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {summary.map(s => (
            <div key={s.cat} className={`rounded-2xl border p-5 ${toneRing[s.tone]}`}>
              <div className="text-xs font-bold uppercase tracking-wide text-walnut-light">{s.cat}</div>
              <div className={`text-2xl font-bold tabular-nums mt-1 ${toneText[s.tone]}`}>{s.peak}</div>
              <div className="text-[11px] text-walnut-light">{s.peakLabel}</div>
              <div className="text-sm font-semibold text-walnut mt-2 tabular-nums">{s.usage}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* GAS */}
          <Card title="Gas — Load & Usage">
            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mb-2">Per food vendor stall — appliance load</h3>
            <Table
              cols={[
                { key: 'eq', label: 'Equipment' },
                { key: 'max', label: 'Max BTU/hr', align: 'right' },
                { key: 'duty', label: 'Duty', align: 'right' },
                { key: 'eff', label: 'Eff BTU/hr', align: 'right' },
              ]}
              rows={[
                { eq: '40 lb Fryer', max: '120,000', duty: '0.33', eff: '39,600' },
                { eq: '2 ft Flat-Top Griddle', max: '48,000', duty: '0.30', eff: '14,400' },
                { eq: '2 ft Charbroiler', max: '56,000', duty: '0.20', eff: '11,200' },
                { eq: '6-Burner Range', max: '150,000', duty: '0.23', eff: '34,500' },
              ]}
              foot={{ eq: 'Per stall', max: '374,000', duty: '', eff: '99,700' }}
            />
            <p className="text-xs text-walnut-light mt-2">Monthly usage per food vendor ≈ <span className="font-semibold text-walnut tabular-nums">359 therms/mo</span> (effective BTU/hr × 12 hrs × 30 days).</p>

            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mt-5 mb-2">Common area gas — building-level</h3>
            <Table
              cols={[{ key: 'load', label: 'Load' }, { key: 'th', label: 'Therms / mo', align: 'right' }]}
              rows={[
                { load: 'Commercial water heater (year-round)', th: '75' },
                { load: 'Space heating (annualized; peak Dec/Jan)', th: '175' },
              ]}
              foot={{ load: 'Total common area', th: '250' }}
            />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-honey/10 border border-honey/25 px-4 py-3">
                <div className="text-[11px] text-walnut-light">Peak connected — food row</div>
                <div className="font-bold text-walnut tabular-nums">2,992,000 BTU/hr · ~2,992 CFH</div>
              </div>
              <div className="rounded-xl bg-honey/10 border border-honey/25 px-4 py-3">
                <div className="text-[11px] text-walnut-light">Total gas usage — building</div>
                <div className="font-bold text-walnut tabular-nums">~3,121 therms / mo</div>
              </div>
            </div>
            <p className="text-xs text-walnut-light mt-3">
              <span className="font-semibold text-walnut">Service note:</span> SOW targets a CenterPoint upgrade to ~35,000 CFH (meter + regulator upsize). 90–180 day lead — critical path.
            </p>
          </Card>

          {/* ELECTRIC */}
          <Card title="Electric — Load & Usage">
            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mb-2">Base load — every vendor stall</h3>
            <Table
              cols={[
                { key: 'eq', label: 'Equipment' },
                { key: 'kw', label: 'Conn. kW', align: 'right' },
                { key: 'duty', label: 'Duty', align: 'right' },
                { key: 'hrs', label: 'Hrs/Day', align: 'right' },
                { key: 'kwh', label: 'kWh/mo', align: 'right' },
              ]}
              rows={[
                { eq: 'Double-door commercial fridge', kw: '1.8', duty: '0.45', hrs: '24', kwh: '583' },
                { eq: 'Double-door commercial freezer', kw: '2.2', duty: '0.53', hrs: '24', kwh: '840' },
                { eq: '2 refrigerated prep tables', kw: '1.0', duty: '0.38', hrs: '24', kwh: '274' },
                { eq: 'Stall lighting + POS / misc', kw: '0.5', duty: '0.75', hrs: '12', kwh: '135' },
              ]}
              foot={{ eq: 'Base connected', kw: '5.5', duty: '', hrs: '', kwh: '1,831' }}
            />

            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mt-5 mb-2">Food add-ons — food stalls only</h3>
            <Table
              cols={[
                { key: 'eq', label: 'Equipment' },
                { key: 'kw', label: 'Conn. kW', align: 'right' },
                { key: 'duty', label: 'Duty', align: 'right' },
                { key: 'hrs', label: 'Hrs/Day', align: 'right' },
                { key: 'kwh', label: 'kWh/mo', align: 'right' },
              ]}
              rows={[
                { eq: 'Steam table / warmers', kw: '1.5', duty: '0.60', hrs: '12', kwh: '324' },
                { eq: 'Heat lamp', kw: '0.5', duty: '0.53', hrs: '12', kwh: '95' },
                { eq: 'Rice cooker', kw: '1.0', duty: '0.23', hrs: '12', kwh: '83' },
              ]}
              foot={{ eq: 'Add-on connected', kw: '3.0', duty: '', hrs: '', kwh: '502' }}
            />

            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mt-5 mb-2">Common area — building-wide</h3>
            <Table
              cols={[
                { key: 'eq', label: 'Equipment' },
                { key: 'kw', label: 'Conn. kW', align: 'right' },
                { key: 'duty', label: 'Duty', align: 'right' },
                { key: 'hrs', label: 'Hrs/Day', align: 'right' },
                { key: 'kwh', label: 'kWh/mo', align: 'right' },
              ]}
              rows={[
                { eq: 'HVAC (40 tons, 70% duty)', kw: '48.0', duty: '0.70', hrs: '16', kwh: '16,128' },
                { eq: 'Exhaust / make-up air', kw: '1.6', duty: '1.00', hrs: '12', kwh: '576' },
                { eq: 'Ambient lighting', kw: '4.0', duty: '1.00', hrs: '12', kwh: '1,440' },
                { eq: 'Hot water heater', kw: '2.0', duty: '1.00', hrs: '16', kwh: '960' },
                { eq: 'Sound system', kw: '0.5', duty: '1.00', hrs: '12', kwh: '180' },
                { eq: 'Restrooms (exhaust, lights)', kw: '0.5', duty: '1.00', hrs: '12', kwh: '180' },
                { eq: 'Security cameras / WiFi / office', kw: '1.0', duty: '1.00', hrs: '24', kwh: '720' },
                { eq: 'Overnight security lighting', kw: '0.3', duty: '1.00', hrs: '12', kwh: '108' },
              ]}
              foot={{ eq: 'Common connected', kw: '57.9', duty: '', hrs: '', kwh: '20,292' }}
            />

            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mt-5 mb-2">Per-stall & building summary</h3>
            <Table
              cols={[
                { key: 'lbl', label: '' },
                { key: 'kw', label: 'Connected kW (peak)', align: 'right' },
                { key: 'kwh', label: 'kWh / mo', align: 'right' },
              ]}
              rows={[
                { lbl: 'Per food vendor (base + add-ons)', kw: '8.5', kwh: '2,334' },
                { lbl: 'Per non-food vendor (base only)', kw: '5.5', kwh: '1,831' },
                { lbl: 'Common area', kw: '57.9', kwh: '20,292' },
              ]}
              foot={{ lbl: 'Whole building', kw: '147.9', kwh: '46,285' }}
            />
            <p className="text-xs text-walnut-light mt-3">
              <span className="font-semibold text-walnut">Sizing note:</span> connected kW drives service / panel sizing. At 208V 3φ, Amps ≈ kW×1000 ÷ 360. Electrician to apply demand factors.
            </p>
          </Card>

          {/* WATER */}
          <Card title="Water / Sewer — Load & Usage">
            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mb-2">Per vendor</h3>
            <Table
              cols={[
                { key: 'lbl', label: '' },
                { key: 'gpd', label: 'gal / day', align: 'right' },
                { key: 'gpm', label: 'gal / mo', align: 'right' },
              ]}
              rows={[
                { lbl: 'Per food vendor', gpd: '263', gpm: '7,890' },
                { lbl: 'Per non-food vendor', gpd: '118', gpm: '3,540' },
              ]}
            />

            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mt-5 mb-2">Common area loads</h3>
            <Table
              cols={[{ key: 'load', label: 'Load' }, { key: 'gpd', label: 'gal / day', align: 'right' }]}
              rows={[
                { load: 'Restrooms (~300 customers/day)', gpd: '600' },
                { load: 'Floor cleaning / mop sinks', gpd: '100' },
                { load: 'Hot water system losses / misc', gpd: '50' },
                { load: 'Outdoor hose / landscaping', gpd: '30' },
              ]}
              foot={{ load: 'Total common', gpd: '780' }}
            />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-sage/10 border border-sage/25 px-4 py-3">
                <div className="text-[11px] text-walnut-light">Total water — building</div>
                <div className="font-bold text-walnut tabular-nums">~3,356 gal / day</div>
              </div>
              <div className="rounded-xl bg-sage/10 border border-sage/25 px-4 py-3">
                <div className="text-[11px] text-walnut-light">Total water — building</div>
                <div className="font-bold text-walnut tabular-nums">~100,680 gal / mo</div>
              </div>
            </div>
            <p className="text-xs text-walnut-light mt-3">
              <span className="font-semibold text-walnut">Sizing note:</span> peak demand handled by two commercial gas tankless units + BMS-tied recirc loop (per Plumbing SOW), sized for 12-vendor + 2-restroom peak.
            </p>
          </Card>

          {/* GREASE & SERVICES */}
          <Card title="Grease Trap & Service Connections">
            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mb-2">Grease interceptor</h3>
            <Table
              cols={[{ key: 'item', label: 'Item' }, { key: 'spec', label: 'Spec / Capacity' }]}
              rows={[
                { item: 'Type', spec: 'Underground precast, two-compartment' },
                { item: 'Capacity', spec: '1,500 gallon' },
                { item: 'Rating', spec: 'H-20 traffic-rated' },
                { item: 'Sized for', spec: '8 food stalls' },
                { item: 'Tie-in', spec: 'Municipal sewer + sample well + access risers' },
              ]}
            />

            <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-light mt-5 mb-2">Service connections / givens</h3>
            <Table
              cols={[{ key: 'item', label: 'Item' }, { key: 'spec', label: 'Spec' }]}
              rows={[
                { item: 'Gas service (target)', spec: 'Upgrade to ~35,000 CFH — CenterPoint meter + regulator upsize' },
                { item: 'Gas per stall', spec: 'Per-stall manifold, 4 connections each + shut-off valves' },
                { item: 'Gas lead time', spec: '90–180 days — critical path' },
                { item: 'Landlord stub — water', spec: '2" cold water' },
                { item: 'Landlord stub — waste', spec: '4" waste' },
                { item: 'Landlord stub — vent', spec: '4" vent' },
                { item: 'Electric peak (connected)', spec: 'See Electric — building connected kW drives service / panel' },
                { item: 'Hot water', spec: 'Two commercial gas tankless units + BMS-tied recirc loop' },
              ]}
            />
          </Card>
        </div>
      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">The Barn &mdash; Everybody&rsquo;s Welcome</p>
          <p className="text-walnut-light text-xs mt-1">Building F Level 2 &middot; Marcel Harvest Green &middot; Richmond, TX</p>
        </div>
      </footer>
    </div>
  );
}

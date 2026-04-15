import { useState } from 'react';
import NavBar from '../components/NavBar';
import { useReveal } from '../utils/useReveal';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 reveal">
      <h2 className="text-xl md:text-2xl font-bold text-walnut mb-4 pb-2 border-b border-walnut/10">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ title, description, icon }: { title: string; description: string; icon?: string }) {
  return (
    <div className="glass rounded-xl p-5 reveal">
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <h3 className="font-semibold text-walnut mb-1.5">{title}</h3>
      <p className="text-sm text-walnut-light leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-honey">{value}</div>
      <div className="text-xs text-walnut-light mt-1">{label}</div>
    </div>
  );
}

// ── Interactive cell ──
function NumCell({
  value,
  onChange,
  prefix,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {prefix && <span className="text-walnut-light text-xs">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-20 bg-white/70 border border-walnut/20 rounded-md px-2 py-1 text-right tabular-nums text-walnut focus:outline-none focus:border-honey focus:ring-2 focus:ring-honey/20 transition-all"
      />
    </div>
  );
}

const fmt$ = (n: number) => '$' + n.toLocaleString('en-US');

// ── Scale Vision Timeline (tick marks 1-48 with opening circles) ──
function TimelineVis({ locations }: { locations: { name: string; month: number }[] }) {
  const months = 48;
  const maxMonth = months;
  return (
    <div className="w-full py-10 px-4 md:px-6">
      <div className="relative">
        {/* Main line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-walnut rounded-full" />

        {/* Tick marks */}
        <div className="relative flex justify-between items-center h-6">
          {Array.from({ length: months }, (_, i) => {
            const m = i + 1;
            const isMajor = m === 1 || m % 12 === 0;
            return (
              <div
                key={m}
                className={`bg-walnut rounded-full ${
                  isMajor ? 'w-0.5 h-4' : 'w-px h-2'
                }`}
                style={{ opacity: isMajor ? 1 : 0.5 }}
              />
            );
          })}
        </div>

        {/* Year labels under major ticks */}
        <div className="flex justify-between text-[10px] text-walnut-light font-medium mt-1">
          {[1, 12, 24, 36, 48].map(m => (
            <div key={m} className="text-center" style={{ position: 'absolute', left: `${((m - 1) / (maxMonth - 1)) * 100}%`, transform: 'translateX(-50%)' }}>
              M{m}
            </div>
          ))}
        </div>

        {/* Location circles positioned above the line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          {locations.map((loc, i) => {
            const pct = ((loc.month - 1) / (maxMonth - 1)) * 100;
            const above = i % 2 === 0;
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
              >
                {/* Vertical connector */}
                <div
                  className={`w-0.5 bg-honey/40 absolute left-1/2 -translate-x-1/2 ${above ? '-top-8' : 'top-7'}`}
                  style={{ height: '22px' }}
                />
                {/* Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg absolute left-1/2 -translate-x-1/2 ${
                    i === 0 ? 'bg-honey ring-4 ring-honey/30' : 'bg-walnut'
                  } ${above ? '-top-[54px]' : 'top-7'}`}
                >
                  L{i + 1}
                </div>
                {/* Label */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-[10px] text-walnut-light font-medium whitespace-nowrap ${
                    above ? '-top-20' : 'top-20'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-walnut">{loc.name}</div>
                    <div>Mo {loc.month}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface VendorRow {
  cat: string;
  n: number;
  rent: number;
}

export default function Strategy() {
  const revealRef = useReveal();

  // Interactive vendor model
  const [vendors, setVendors] = useState<VendorRow[]>([
    { cat: 'Food Vendors', n: 8, rent: 7000 },
    { cat: 'Health Bar', n: 1, rent: 6000 },
    { cat: 'Desserts', n: 1, rent: 6000 },
    { cat: 'Drinks', n: 2, rent: 6000 },
  ]);

  const updateVendor = (idx: number, field: 'n' | 'rent', value: number) => {
    const next = [...vendors];
    next[idx] = { ...next[idx], [field]: value };
    setVendors(next);
  };

  // Calculations
  const totalVendors = vendors.reduce((s, v) => s + v.n, 0);
  const totalMonthlyRent = vendors.reduce((s, v) => s + v.n * v.rent, 0);
  const totalAnnualRent = totalMonthlyRent * 12;
  const totalDeposit = vendors.reduce((s, v) => s + v.n * v.rent * 2, 0);

  // Scale Vision locations
  const scaleLocations = [
    { name: 'Richmond', month: 1 },
    { name: 'Fulshear', month: 13 },
    { name: 'Frisco', month: 17 },
    { name: 'Plano', month: 21 },
    { name: 'San Antonio', month: 25 },
    { name: 'Location 6', month: 29 },
    { name: 'Location 7', month: 33 },
  ];

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/strategy" />

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src="/barn-interior.jpg" alt="The Barn interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-walnut/80 to-walnut/20" />
        <div className="absolute bottom-6 left-6 md:left-10">
          <h1 className="text-3xl md:text-4xl font-bold text-cream">Strategy & Vision</h1>
          <p className="text-cream/70 text-sm md:text-base mt-1">The Barn — Where Neighborhoods Gather</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* The Opportunity */}
        <Section title="The Opportunity">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card
              icon="📈"
              title="Explosive Growth"
              description="Richmond and Fort Bend County are among the fastest-growing suburban corridors in Houston. High-income families and professionals are moving in, with major brands like HEB and Target validating the market."
            />
            <Card
              icon="🏠"
              title='The "Third Place" Gap'
              description="Residents have homes and work, but lack a community-oriented destination that matches their quality of life. There is nothing like this in the area — The Barn fills that critical gap."
            />
            <Card
              icon="🏗️"
              title="A Differentiated Asset"
              description="DPEG owns the property and the residential density is built. The Barn provides a unique anchor tenant that drives foot traffic to the entire commercial area — a concept no franchise can replicate."
            />
          </div>
        </Section>

        {/* The Concept */}
        <Section title="The Concept">
          <p className="text-walnut-light leading-relaxed mb-6">
            A curated, tech-enabled food hall positioned as the neighborhood gathering place. Designed to become
            part of the community's weekly routine — a place where families come for the food, stay for the atmosphere,
            and come back because it feels like theirs.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card
              title="Curated Culinary"
              description={`${totalVendors} unique local vendors. No chains. Personally curated by the operator — relationship-driven, not open-call. Every stall is a draw on its own.`}
            />
            <Card
              title="Community Hub"
              description="The neighborhood's living room. A place to meet, relax, eat, and stay — without the pressure to leave."
            />
            <Card
              title="Family First"
              description={`Designed for parents, kids, and teens. "Let's go to The Barn" becomes part of the weekly routine for families.`}
            />
            <Card
              title="Live & Local"
              description="Weekly live music, kids activities, yoga classes, local vendor pop-up markets, and seasonal community events."
            />
          </div>
        </Section>

        {/* Key Metrics */}
        <Section title="Richmond at a Glance">
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Stat value="10,000" label="Square Feet" />
              <Stat value={String(totalVendors)} label="Vendor Stalls" />
              <Stat value="160" label="Seats" />
              <Stat value="$1.5M" label="Total Buildout" />
            </div>
          </div>
        </Section>

        {/* Vendor Model — Interactive */}
        <Section title="Vendor Model">
          <p className="text-walnut-light text-sm mb-4">
            Adjust vendor counts and rent to explore scenarios. Totals update live.
          </p>
          <div className="glass rounded-2xl overflow-hidden mb-4 reveal">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-walnut/10 bg-walnut/5">
                  <th className="text-left px-5 py-3 font-semibold text-walnut">Category</th>
                  <th className="text-center px-5 py-3 font-semibold text-walnut"># Vendors</th>
                  <th className="text-right px-5 py-3 font-semibold text-walnut">Rent/Month</th>
                  <th className="text-right px-5 py-3 font-semibold text-walnut">Total/Month</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((row, i) => (
                  <tr key={i} className="border-b border-walnut/5 row-hover">
                    <td className="px-5 py-2.5 text-walnut">{row.cat}</td>
                    <td className="px-5 py-2.5 text-center text-walnut">
                      <NumCell value={row.n} onChange={v => updateVendor(i, 'n', v)} />
                    </td>
                    <td className="px-5 py-2.5 text-right text-walnut tabular-nums">
                      <NumCell value={row.rent} onChange={v => updateVendor(i, 'rent', v)} prefix="$" />
                    </td>
                    <td className="px-5 py-2.5 text-right font-semibold text-walnut tabular-nums">
                      {fmt$(row.n * row.rent)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-honey/10 border-t-2 border-honey/20">
                  <td className="px-5 py-3 font-bold text-walnut">Total Monthly Rent</td>
                  <td className="px-5 py-3 text-center font-bold text-walnut tabular-nums">{totalVendors}</td>
                  <td className="px-5 py-3"></td>
                  <td className="px-5 py-3 text-right font-bold text-walnut tabular-nums">{fmt$(totalMonthlyRent)}</td>
                </tr>
                <tr className="bg-honey/15">
                  <td className="px-5 py-3 font-bold text-walnut">Total Annual Rent</td>
                  <td className="px-5 py-3"></td>
                  <td className="px-5 py-3"></td>
                  <td className="px-5 py-3 text-right font-bold text-walnut tabular-nums">{fmt$(totalAnnualRent)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deposit calculation */}
          <div className="glass rounded-2xl p-5 md:p-6 mb-4 reveal">
            <h3 className="font-bold text-walnut mb-2">Vendor Deposits Collected at Lease Signing</h3>
            <p className="text-xs text-walnut-light mb-4 leading-relaxed">
              Each vendor pays 2× monthly rent upfront at lease signing — one month's rent applied toward Month 1 rent on launch,
              plus an equal security deposit held by The Barn.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-walnut-light font-medium uppercase tracking-wider mb-1">Prepaid Month 1 Rent</div>
                <div className="text-2xl font-bold text-walnut tabular-nums">{fmt$(totalMonthlyRent)}</div>
                <div className="text-[10px] text-walnut-light mt-0.5">Applied at launch</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-walnut-light font-medium uppercase tracking-wider mb-1">Security Deposits</div>
                <div className="text-2xl font-bold text-walnut tabular-nums">{fmt$(totalMonthlyRent)}</div>
                <div className="text-[10px] text-walnut-light mt-0.5">Held by The Barn</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1 bg-honey/15 rounded-xl py-2 -m-1">
                <div className="text-xs text-walnut font-medium uppercase tracking-wider mb-1">Total Collected</div>
                <div className="text-2xl font-bold text-honey tabular-nums">{fmt$(totalDeposit)}</div>
                <div className="text-[10px] text-walnut-light mt-0.5">{totalVendors} vendors × 2× monthly rent</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-3">
            <Card title="3-Year Leases" description="Stability and locked-in revenue with 6-month performance reviews." />
            <Card title="2× Rent Deposit" description="One month's rent prepaid to month 1, plus equal security deposit held by The Barn." />
            <Card title="Rolling Waitlist" description="3-4 pre-vetted backup vendors ready to step in at all times." />
            <Card title="Independent Ops" description="Vendors manage staff & permits. The Barn handles common areas & marketing." />
          </div>
        </Section>

        {/* Tech Advantage */}
        <Section title="Tech-Enabled Platform">
          <p className="text-walnut-light leading-relaxed mb-4">
            Data-driven from Day 1. Every decision at every future location is powered by real operational data — not guesswork.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-walnut mb-3">Customer-Facing App</h3>
              <ul className="space-y-2 text-sm text-walnut-light">
                <li>Order ahead from multiple vendors</li>
                <li>Order at the table from your phone</li>
                <li>AI-powered personalized recommendations</li>
                <li>Loyalty and rewards program</li>
                <li>Push notifications for events & new vendors</li>
              </ul>
            </div>
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-walnut mb-3">Internal Operations</h3>
              <ul className="space-y-2 text-sm text-walnut-light">
                <li>Real-time sales dashboards</li>
                <li>Automated vendor billing & rent collection</li>
                <li>Foot traffic analytics & predictive performance</li>
                <li>Energy and utility usage monitoring</li>
                <li>Digital vendor communication hub</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Scale Vision with Timeline */}
        <Section title="Scale Vision">
          <p className="text-walnut-light leading-relaxed mb-6">
            The Barn — Richmond is the proof of concept. The long-term vision is 7 locations across
            emerging Texas suburbs over 4 years, each running on the same tech infrastructure, brand identity,
            and operating model. Data from Richmond informs decisions at every future site.
          </p>

          {/* Circle row (locations) */}
          <div className="glass rounded-2xl p-6 mb-4">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {scaleLocations.map((loc, i) => (
                <div key={loc.name} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                    i === 0 ? 'bg-honey text-white ring-4 ring-honey/20' : 'bg-walnut/10 text-walnut-light'
                  }`}>
                    L{i + 1}
                  </div>
                  <div className="text-xs text-walnut-light">{loc.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline tick-mark visual */}
          <div className="glass rounded-2xl p-4 md:p-6 reveal overflow-x-auto">
            <h3 className="text-sm font-bold text-walnut mb-1">Opening Timeline</h3>
            <p className="text-xs text-walnut-light mb-2">Month-by-month rollout across 48 months (4 years)</p>
            <div className="min-w-[700px]">
              <TimelineVis locations={scaleLocations} />
            </div>
          </div>
        </Section>

        {/* Brand Identity */}
        <Section title="Brand Identity">
          <div className="glass rounded-2xl p-6">
            <p className="text-walnut-light italic mb-6 text-center">
              "The house in the neighborhood where everyone ends up. The door's always open."
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {[
                { name: 'Cream', hex: '#FAF8F5' },
                { name: 'Walnut', hex: '#5C4033' },
                { name: 'Honey', hex: '#C49A6C' },
                { name: 'Sage', hex: '#8B9D77' },
                { name: 'Terracotta', hex: '#C27D5B' },
              ].map(c => (
                <div key={c.name} className="text-center">
                  <div
                    className="w-14 h-14 rounded-full mx-auto mb-1 border border-walnut/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="text-xs font-medium text-walnut">{c.name}</div>
                  <div className="text-[10px] text-walnut-light">{c.hex}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-walnut mb-2">The Barn Is</h4>
                <ul className="space-y-1 text-walnut-light">
                  <li>The place your neighborhood needed</li>
                  <li>Where families build weekly routines</li>
                  <li>Modern and tech-forward but never cold</li>
                  <li>Nostalgic without being gimmicky</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-walnut mb-2">The Barn Is Not</h4>
                <ul className="space-y-1 text-walnut-light">
                  <li>A food court — no trays, no mall energy</li>
                  <li>A bar scene that happens to serve food</li>
                  <li>Expensive or exclusionary</li>
                  <li>A franchise feel — rooted in community</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">The Barn &mdash; Everybody&rsquo;s Welcome</p>
          <p className="text-walnut-light text-xs mt-1">Richmond, TX &middot; Partnership Proposal</p>
        </div>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import NavBar from '../components/NavBar';

interface Zone {
  name: string;
  sqft: number;
  pct: number;
  color: string;
  description: string;
  details?: string[];
}

const zones: Zone[] = [
  {
    name: 'Vendor Stalls',
    sqft: 2960,
    pct: 29.6,
    color: 'bg-honey',
    description: '8 food (280sf) + 1 health bar (280sf) + 1 desserts (220sf) + 1 drinks (220sf)',
    details: [
      'Food vendors (F1-F8): 280sf each — front half operating, back half storage behind internal wall',
      'Health bar: 280sf — long-format counter, customer-facing from multiple sides, no back storage',
      'Desserts & Drinks: 220sf each — compact counters, lighter operational footprint',
      'Positioned in center core for equal visibility and natural browsing loop',
    ],
  },
  {
    name: 'Seating (160 seats)',
    sqft: 1750,
    pct: 17.5,
    color: 'bg-sage',
    description: 'Counter stools, communal farm tables, family tables',
    details: [
      'Counter seating: 60 seats along floor-to-ceiling windows (both side walls), ~6.7sf/seat',
      'Communal farm tables: 50 seats — solid walnut, matte black hairpin legs, 8-10 per table, ~13sf/seat',
      'Family tables: 50 seats — 4-tops & 6-tops, positioned near kids zone, ~14sf/seat',
    ],
  },
  {
    name: 'Circulation & Walkways',
    sqft: 1700,
    pct: 17.0,
    color: 'bg-walnut/40',
    description: 'Main aisles, vendor queue space, general flow',
    details: [
      'Main aisles between vendor core & seating: 700sf',
      'Vendor queue / ordering space: 500sf',
      'Secondary circulation between seating zones: 500sf',
    ],
  },
  {
    name: 'Multi-Purpose Turf Zone',
    sqft: 1250,
    pct: 12.5,
    color: 'bg-terracotta',
    description: 'Live music, pop-ups, yoga, kids activities, community events',
    details: [
      'Artificial turf flooring — zero permanent fixtures',
      'Friday: Live music with removable stage',
      'Saturday: Yoga and wellness classes',
      'Sunday: Local artisan pop-up market',
      'Weekdays: Trivia, game nights, community events',
    ],
  },
  {
    name: 'Kids Play Zone',
    sqft: 800,
    pct: 8.0,
    color: 'bg-sage/70',
    description: 'Sandbox, turf area, toddler play — visible from work counter',
    details: [
      'Large sandbox: 350sf — centerpiece of kids zone',
      'Turf / green play area: 300sf — soft turf for toddlers',
      'Low climbing / activity features: 150sf — age-appropriate structures',
      'Direct sightline from work/coffee counter for parents',
    ],
  },
  {
    name: 'Restrooms + Admin',
    sqft: 580,
    pct: 5.8,
    color: 'bg-walnut/30',
    description: "Men's, women's, family/accessible, admin/storage office",
    details: [
      "Women's: 200sf (4 stalls + sinks)",
      "Men's: 160sf (2 stalls + 2 urinals + sinks)",
      'Family/accessible: 70sf (single room, changing table, ADA)',
      'Admin office/storage: 150sf',
    ],
  },
  {
    name: 'Work / Coffee Counter',
    sqft: 400,
    pct: 4.0,
    color: 'bg-honey/60',
    description: 'Laptop-ready counter with outlets, bordering kids zone',
    details: [
      'Long walnut counter, individual seats with backs',
      'Power outlet at every spot — accommodates 15-20 laptop users',
      'Intentionally positioned bordering kids zone for parent sightlines',
      'Core differentiator: dedicated parent-work / kids-play combo',
    ],
  },
  {
    name: 'Feature Wall',
    sqft: 200,
    pct: 2.0,
    color: 'bg-terracotta/60',
    description: 'Herringbone wood, neon sign, greenery, photo bench',
    details: [
      '~14\' wide x 14\' deep — first thing every guest sees',
      'Herringbone walnut chevron backdrop',
      '"Everybody\'s Welcome" neon sign in warm honey/cream glow',
      'Flanking vertical greenery panels',
      'Photo bench seats 4-5 people — social sharing engine',
    ],
  },
  {
    name: 'Buffer (Unallocated)',
    sqft: 360,
    pct: 3.6,
    color: 'bg-cream border border-walnut/20',
    description: 'Absorbed into wider walkways or zones during build',
  },
];

const designDecisions = [
  {
    q: 'Why vendors are in the center core',
    a: 'Most food halls put vendors on perimeter walls. The Barn flips that — the left and right walls have floor-to-ceiling windows with views. That\'s premium real estate for guests, not kitchens. Center placement gives every stall equal visibility and lets guests browse in a natural loop.',
  },
  {
    q: 'Why counter seating faces the windows',
    a: 'Natural light and views make this 2nd-floor location special. Counter seating along windows is the most space-efficient way to give 60 guests access to the premium experience while creating visual rhythm from outside.',
  },
  {
    q: 'Why the work counter borders the kids zone',
    a: 'Intentional parent-child sightline design. A parent at the work counter can see their kids playing in the sandbox. No other food hall in suburban Texas offers this. It turns a 45-minute lunch into a 2-hour stay.',
  },
  {
    q: 'Why the turf zone has no permanent fixtures',
    a: 'Maximum flexibility. The same 1,250sf hosts live music Friday night, yoga Saturday morning, and a pop-up market Sunday. Modular design means the space reinvents itself constantly — always a reason to come back.',
  },
  {
    q: 'Why the feature wall is at the entry',
    a: 'First impression and last memory. The warm neon glow of "Everybody\'s Welcome" sets the tone immediately. The photo bench generates organic social sharing — brand marketing that costs nothing after installation.',
  },
];

export default function LayoutPage() {
  const [expandedZone, setExpandedZone] = useState<number | null>(null);
  const [showDecisions, setShowDecisions] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <NavBar current="/layout" />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-walnut">Space Layout & Specifications</h1>
          <p className="text-walnut-light text-sm mt-1">10,000 sq ft &middot; 2nd Floor &middot; 125ft (W) x 80ft (D)</p>
        </div>

        {/* Floor Plan Schematic */}
        <section className="mb-8">
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-walnut/10 p-4 md:p-6">
            <h2 className="text-lg font-bold text-walnut mb-4">Floor Plan</h2>
            <div className="bg-cream rounded-xl border border-walnut/10 p-3 md:p-5 font-mono text-[10px] md:text-xs leading-relaxed overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Top row */}
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 bg-terracotta/20 border border-terracotta/30 rounded-lg p-2 text-center">
                    <div className="font-bold text-walnut">MULTI-PURPOSE TURF ZONE</div>
                    <div className="text-walnut-light">1,250 sf</div>
                  </div>
                  <div className="w-24 bg-walnut/10 border border-walnut/20 rounded-lg p-2 text-center">
                    <div className="font-bold text-walnut text-[9px]">RESTROOMS + ADMIN</div>
                    <div className="text-walnut-light">580 sf</div>
                  </div>
                  <div className="flex-1 bg-sage/20 border border-sage/30 rounded-lg p-2 text-center">
                    <div className="font-bold text-walnut">KIDS PLAY ZONE</div>
                    <div className="text-walnut-light">800 sf</div>
                  </div>
                </div>

                {/* Work counter */}
                <div className="flex mb-2">
                  <div className="flex-1"></div>
                  <div className="w-2/3 bg-honey/15 border border-honey/30 rounded-lg p-1.5 text-center">
                    <span className="font-bold text-walnut">WORK / COFFEE COUNTER</span>
                    <span className="text-walnut-light ml-2">400 sf</span>
                    <span className="text-walnut-light ml-2 text-[9px]">← sightline to kids zone →</span>
                  </div>
                  <div className="flex-1"></div>
                </div>

                {/* Vendor core + seating */}
                <div className="flex gap-2 mb-2">
                  {/* Left seating */}
                  <div className="w-28 flex flex-col gap-1">
                    <div className="text-[8px] text-walnut-light text-center">■ WINDOWS ■</div>
                    <div className="bg-sage/15 border border-sage/20 rounded-lg p-2 text-center flex-1">
                      <div className="font-bold text-walnut text-[9px]">COMMUNAL FARM TABLES</div>
                      <div className="text-walnut-light">50 seats</div>
                      <div className="text-walnut-light">650 sf</div>
                    </div>
                    <div className="bg-walnut/5 border border-walnut/10 rounded p-1 text-center">
                      <div className="text-[9px] text-walnut">COUNTER</div>
                      <div className="text-walnut-light">30 seats</div>
                    </div>
                  </div>

                  {/* Vendor core */}
                  <div className="flex-1 bg-honey/10 border border-honey/20 rounded-xl p-2">
                    <div className="text-center font-bold text-walnut mb-1">VENDOR CORE — 2,960 sf</div>
                    <div className="text-center text-[9px] text-walnut-light mb-1">Back row (storage side)</div>
                    <div className="grid grid-cols-4 gap-1 mb-1">
                      {['F1','F2','F3','F4'].map(v => (
                        <div key={v} className="bg-honey/20 border border-honey/30 rounded p-1 text-center">
                          <div className="font-bold text-walnut">{v}</div>
                          <div className="text-[9px] text-walnut-light">280sf</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-[9px] text-walnut-light my-0.5">■■ central aisle ■■</div>
                    <div className="grid grid-cols-4 gap-1 mb-1">
                      {['F5','F6','F7','F8'].map(v => (
                        <div key={v} className="bg-honey/20 border border-honey/30 rounded p-1 text-center">
                          <div className="font-bold text-walnut">{v}</div>
                          <div className="text-[9px] text-walnut-light">280sf</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-[9px] text-walnut-light mb-1">Front row (customer-facing)</div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="bg-terracotta/15 border border-terracotta/25 rounded p-1 text-center">
                        <div className="font-bold text-walnut">HB</div>
                        <div className="text-[9px] text-walnut-light">280sf</div>
                      </div>
                      <div className="bg-terracotta/15 border border-terracotta/25 rounded p-1 text-center">
                        <div className="font-bold text-walnut">DS</div>
                        <div className="text-[9px] text-walnut-light">220sf</div>
                      </div>
                      <div className="bg-terracotta/15 border border-terracotta/25 rounded p-1 text-center">
                        <div className="font-bold text-walnut">DR</div>
                        <div className="text-[9px] text-walnut-light">220sf</div>
                      </div>
                    </div>
                  </div>

                  {/* Right seating */}
                  <div className="w-28 flex flex-col gap-1">
                    <div className="text-[8px] text-walnut-light text-center">■ WINDOWS ■</div>
                    <div className="bg-sage/15 border border-sage/20 rounded-lg p-2 text-center flex-1">
                      <div className="font-bold text-walnut text-[9px]">FAMILY TABLES</div>
                      <div className="text-walnut-light">50 seats</div>
                      <div className="text-walnut-light">700 sf</div>
                    </div>
                    <div className="bg-walnut/5 border border-walnut/10 rounded p-1 text-center">
                      <div className="text-[9px] text-walnut">COUNTER</div>
                      <div className="text-walnut-light">30 seats</div>
                    </div>
                  </div>
                </div>

                {/* Feature wall + entry */}
                <div className="flex justify-center mb-1">
                  <div className="w-48 bg-terracotta/15 border border-terracotta/25 rounded-lg p-2 text-center">
                    <div className="font-bold text-walnut">FEATURE WALL</div>
                    <div className="text-walnut-light text-[9px]">"Everybody's Welcome" — 200 sf</div>
                  </div>
                </div>
                <div className="text-center font-bold text-walnut">▲ ENTRY ▲</div>
              </div>
            </div>
          </div>
        </section>

        {/* Space Allocation Breakdown */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-walnut mb-4">Space Allocation</h2>

          {/* Visual bar chart */}
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-walnut/10 p-4 md:p-6 mb-4">
            <div className="flex rounded-xl overflow-hidden h-10 mb-4">
              {zones.map((z, i) => (
                <div
                  key={i}
                  className={`${z.color} relative group cursor-pointer transition-all hover:opacity-80`}
                  style={{ width: `${z.pct}%` }}
                  onClick={() => setExpandedZone(expandedZone === i ? null : i)}
                  title={`${z.name}: ${z.sqft}sf (${z.pct}%)`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {zones.map((z, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${z.color}`} />
                  <span className="text-walnut-light">{z.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zone cards */}
          <div className="space-y-2">
            {zones.map((z, i) => (
              <div
                key={i}
                className={`bg-white/60 backdrop-blur rounded-xl border transition-all cursor-pointer ${
                  expandedZone === i ? 'border-honey/50 shadow-sm' : 'border-walnut/10'
                }`}
                onClick={() => setExpandedZone(expandedZone === i ? null : i)}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-4 h-4 rounded ${z.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-walnut text-sm">{z.name}</span>
                    <span className="text-walnut-light text-xs ml-2 hidden sm:inline">{z.description}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-walnut text-sm tabular-nums">{z.sqft.toLocaleString()} sf</span>
                    <span className="text-walnut-light text-xs ml-2">{z.pct}%</span>
                  </div>
                  <span className={`text-walnut-light text-xs transition-transform ${expandedZone === i ? 'rotate-180' : ''}`}>
                    &#9662;
                  </span>
                </div>
                {expandedZone === i && z.details && (
                  <div className="px-4 pb-3 pt-0 border-t border-walnut/5">
                    <p className="text-xs text-walnut-light mb-2 sm:hidden">{z.description}</p>
                    <ul className="space-y-1">
                      {z.details.map((d, j) => (
                        <li key={j} className="text-xs text-walnut-light pl-7">
                          <span className="text-honey mr-1.5">&#8226;</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-3 mt-2 bg-honey/10 rounded-xl border border-honey/20">
            <span className="font-bold text-walnut">Total</span>
            <span className="font-bold text-walnut tabular-nums">10,000 sf &middot; 100%</span>
          </div>
        </section>

        {/* Seating breakdown */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-walnut mb-4">Seating Specifications</h2>
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-walnut/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-walnut/10 bg-walnut/5">
                  <th className="text-left px-5 py-3 font-semibold text-walnut">Type</th>
                  <th className="text-center px-3 py-3 font-semibold text-walnut">Seats</th>
                  <th className="text-right px-3 py-3 font-semibold text-walnut">Sq Ft</th>
                  <th className="text-right px-3 py-3 font-semibold text-walnut">SF/Seat</th>
                  <th className="text-left px-5 py-3 font-semibold text-walnut hidden md:table-cell">Location</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Counter Stools', seats: 60, sqft: 400, per: '6.7', loc: 'Side windows (L&R)' },
                  { type: 'Farm Tables (8-10 seat)', seats: 50, sqft: 650, per: '13', loc: 'Left wing' },
                  { type: 'Family Tables (4-6 tops)', seats: 50, sqft: 700, per: '14', loc: 'Right wing' },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-walnut/5">
                    <td className="px-5 py-2.5 text-walnut">{r.type}</td>
                    <td className="px-3 py-2.5 text-center text-walnut tabular-nums">{r.seats}</td>
                    <td className="px-3 py-2.5 text-right text-walnut tabular-nums">{r.sqft}</td>
                    <td className="px-3 py-2.5 text-right text-walnut-light tabular-nums">{r.per}</td>
                    <td className="px-5 py-2.5 text-walnut-light text-xs hidden md:table-cell">{r.loc}</td>
                  </tr>
                ))}
                <tr className="bg-honey/10">
                  <td className="px-5 py-2.5 font-bold text-walnut">Total</td>
                  <td className="px-3 py-2.5 text-center font-bold text-walnut">160</td>
                  <td className="px-3 py-2.5 text-right font-bold text-walnut tabular-nums">1,750</td>
                  <td className="px-3 py-2.5 text-right font-bold text-walnut">11</td>
                  <td className="px-5 py-2.5 hidden md:table-cell"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Design Decisions */}
        <section className="mb-8">
          <button
            onClick={() => setShowDecisions(!showDecisions)}
            className="flex items-center gap-2 text-lg font-bold text-walnut mb-4 cursor-pointer hover:text-honey transition-colors"
          >
            Design Decisions & Rationale
            <span className={`text-sm transition-transform ${showDecisions ? 'rotate-180' : ''}`}>&#9662;</span>
          </button>
          {showDecisions && (
            <div className="space-y-3">
              {designDecisions.map((d, i) => (
                <div key={i} className="bg-white/60 backdrop-blur rounded-xl border border-walnut/10 p-4">
                  <h3 className="font-semibold text-walnut text-sm mb-1">{d.q}</h3>
                  <p className="text-xs text-walnut-light leading-relaxed">{d.a}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">The Barn &mdash; Everybody&rsquo;s Welcome</p>
          <p className="text-walnut-light text-xs mt-1">10,000 sq ft &middot; 2nd Floor &middot; Richmond, TX</p>
        </div>
      </footer>
    </div>
  );
}

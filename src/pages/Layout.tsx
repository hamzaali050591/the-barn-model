import { useState } from 'react';
import NavBar from '../components/NavBar';
import { useReveal } from '../utils/useReveal';

type Version = 'v1' | 'v2';

interface Zone {
  name: string;
  sqft: number;
  pct: number;
  color: string;
  description: string;
  details?: string[];
}

interface VersionSpec {
  label: string;
  shortLabel: string;
  tagline: string;
  dims: string;
  totalSqft: number;
  zones: Zone[];
}

const V1_TOTAL = 9180;
const V2_TOTAL = 14500;

const pct = (sf: number, total: number) => Math.round((sf / total) * 1000) / 10;

const v1Zones: Zone[] = [
  {
    name: 'Food Stall Row (8 stalls)',
    sqft: 2240,
    pct: pct(2240, V1_TOTAL),
    color: 'bg-honey',
    description: '8 stalls @ 10ft × 28ft = 280sf each, single linear row along core wall',
    details: [
      'Row footprint: 80ft × 28ft = 2,240sf, runs north–south along the core wall',
      'Internal geometry: 8ft hood-covered cooking zone at back (against core) + 2ft flanking prep = 10ft wide',
      'Cooking line at back, prep middle, customer counter at front (facing west into the hall)',
      'Continuous shared hood — UL 300 fire suppression per-stall nozzle zones + auto gas shut-off',
      'Hood exhaust vents UP through central TPO roof zone (shortest possible duct run)',
      '"Heavy Warm minus Refrigeration" buildout: prep counter, 3-comp sink, hand sink, floor drains, FRP walls — vendor brings cooking + refrigeration',
    ],
  },
  {
    name: 'Non-Cooking Kiosks (4)',
    sqft: 940,
    pct: pct(940, V1_TOTAL),
    color: 'bg-terracotta',
    description: 'Health bar + coffee + 2 dessert — distributed through gathering zone',
    details: [
      'Health bar: 280sf single-sided kiosk — Bucket 3 Heavy Warm (hand sink + 3-comp + floor drain)',
      'Coffee / drinks: 220sf single-sided kiosk — Bucket 3 Heavy Warm',
      'Dessert #1: 220sf fully open island (counter all sides) — Bucket 2 Medium Warm',
      'Dessert #2: 220sf fully open island — Bucket 2 Medium Warm',
      'No gas, no hood, no fire suppression on kiosks — electrical + water + waste drain only',
      'Distributed through the western gathering zone as visual anchors — NOT placed against core wall',
    ],
  },
  {
    name: 'Gathering / Dining / Common',
    sqft: 4700,
    pct: pct(4700, V1_TOTAL),
    color: 'bg-sage',
    description: 'Communal farm tables, family tables, high-tops, lounge zones — windows on 3 sides',
    details: [
      'Communal farm tables (signature) — solid walnut, matte black hairpin legs, 8–10 seats each',
      'Family tables — 4-tops and 6-tops scattered near windows',
      'High-top counter seating along the west, north, and south window walls',
      'Lounge / living-room style seating in corners near window views',
      'Warm amber lighting throughout — Edison string lights, warm pendants, LED counter strips',
    ],
  },
  {
    name: 'Circulation + BOH',
    sqft: 800,
    pct: pct(800, V1_TOTAL),
    color: 'bg-walnut/40',
    description: 'Aisles, queue space, back-of-house receiving, light storage',
    details: [
      'Main aisle running parallel to the food row — generous queue depth',
      'Secondary circulation through the gathering zone',
      'Back-of-house receiving / light storage adjacent to core',
    ],
  },
  {
    name: 'Restrooms (ADA)',
    sqft: 500,
    pct: pct(500, V1_TOTAL),
    color: 'bg-walnut/30',
    description: "Men's, women's, family/accessible — adjacent to core",
    details: [
      "Women's restroom (ADA)",
      "Men's restroom (ADA)",
      'Family / accessible restroom',
      'Preliminary figure — confirm against final schematic design',
    ],
  },
  {
    name: 'Feature Wall',
    sqft: null as unknown as number,
    pct: 0,
    color: 'bg-terracotta/60',
    description: 'Herringbone wood · dimensional Barn logo · "Everybody\'s Welcome" neon · greenery — at entry',
    details: [
      'Herringbone walnut backdrop',
      '"Everybody\'s Welcome" neon sign in warm honey/cream glow',
      'Flanking vertical greenery panels',
      'Photo-op destination — absorbed within gathering zone footprint',
    ],
  },
];

const v2Zones: Zone[] = [
  {
    name: 'Food Stall Rows — Mirrored (16 stalls)',
    sqft: 4480,
    pct: pct(4480, V2_TOTAL),
    color: 'bg-honey',
    description: 'Two islands of 8 stalls each, flanking the central core — mirrored Path A',
    details: [
      'Left island: 8 stalls along WEST face of core wall (F1L–F8L)',
      'Right island: 8 stalls along EAST face of core wall (F1R–F8R)',
      'Each stall identical to V1: 10ft × 28ft = 280sf',
      'Each row: 80ft × 28ft = 2,240sf — combined 4,480sf',
      'Two separate shared hood systems — both vent through central TPO roof zone',
      'Two UL 300 fire suppression systems — one per island',
    ],
  },
  {
    name: 'Non-Cooking Kiosks (6 approx.)',
    sqft: 1440,
    pct: pct(1440, V2_TOTAL),
    color: 'bg-terracotta',
    description: 'Expanded preliminary program — split across both zones',
    details: [
      'Health bar (280sf) — Bucket 3',
      'Coffee / drinks (220sf) — Bucket 3',
      '3 dessert kiosks @ 220sf each — Bucket 2 (fully open islands)',
      'Specialty kiosk option (200–280sf) — juice bar / bakery / TBD, Bucket 2/3',
      'Distributed across both zones so each side has its own food + kiosk mix',
    ],
  },
  {
    name: 'Gathering / Dining / Common',
    sqft: 6280,
    pct: pct(6280, V2_TOTAL),
    color: 'bg-sage',
    description: 'Gathering opens outward to all 4 window walls — two halls flanking the core',
    details: [
      'Left gathering zone opens to west, north, south windows',
      'Right gathering zone opens to east, north, south windows',
      'Signature communal farm tables, family tables, high-tops, lounge nooks on both sides',
      'Warm amber lighting — Edison string lights across both halls',
    ],
  },
  {
    name: 'Circulation + BOH',
    sqft: 1500,
    pct: pct(1500, V2_TOTAL),
    color: 'bg-walnut/40',
    description: 'Expanded — aisles on both sides + shared BOH / receiving at core',
    details: [
      'Dedicated aisle per island parallel to each food row',
      'Shared BOH / receiving adjacent to the central core',
      'Secondary circulation between gathering zones',
    ],
  },
  {
    name: 'Restrooms (both zones)',
    sqft: 800,
    pct: pct(800, V2_TOTAL),
    color: 'bg-walnut/30',
    description: 'Two restroom cores — one per zone — adjacent to central core',
    details: [
      "Left zone: men's, women's, family/accessible",
      "Right zone: men's, women's, family/accessible",
      'Preliminary figures — confirm against final schematic design',
    ],
  },
];

const versions: Record<Version, VersionSpec> = {
  v1: {
    label: 'Version 1 — 10K Left Zone (PRIMARY)',
    shortLabel: 'V1 · Left Zone',
    tagline:
      'Left zone of Level 2 only. Path A: single row of 8 food stalls along the core wall; gathering opens west to three window walls. Basis for the Richmond deal + first SOW.',
    dims: '~9,180 sq ft · Left zone of Level 2 · ~102ft × 90ft',
    totalSqft: V1_TOTAL,
    zones: v1Zones,
  },
  v2: {
    label: 'Version 2 — Full L2 (~14,500+ sf)',
    shortLabel: 'V2 · Full Space',
    tagline:
      'Full Level 2 — both zones flanking the central core. Mirrored Path A: two food islands, 16 stalls, expanded 6-kiosk program. Larger proposal for the DPEG pitch.',
    dims: '~14,500 sq ft · Full Level 2 · ~196ft × 90ft',
    totalSqft: V2_TOTAL,
    zones: v2Zones,
  },
};

const designDecisions = [
  {
    q: 'Why the food row is anchored to the core wall (Path A)',
    a: 'Every perimeter wall on Level 2 is storefront glazing — there are no solid exterior walls. The core wall is the only non-window interior wall in each zone. Placing the cooking line against the core puts every stall within feet of the plumbing stubs (2″ CW + 4″ Waste + 4″ Vent per zone), seconds from the Mech/Elec room, and directly under the central TPO flat-roof zone where hood exhaust MUST penetrate. Any other placement lengthens MEP runs and blocks premium window views for guests.',
  },
  {
    q: 'Why hood exhaust only penetrates the central TPO roof zone',
    a: 'The Level 2 roof is dual-material: sloped standing-seam metal on the long sides, and flat TPO membrane in the center above the mechanical area. The sloped metal cannot be penetrated without major complications and warranty risk, so every hood stack has to land in the central TPO zone. That constraint alone is enough to lock the food row to the core wall.',
  },
  {
    q: 'Why "Heavy Warm minus Refrigeration" is the buildout package',
    a: 'The Barn delivers the heavy, infrastructure-locked stuff — stud framing, hood + fire suppression, FRP walls, floor drains, 3-comp + hand sinks, utility stub-outs sized for 4 equipment connections per stall — and the vendor brings their cooking equipment and their choice of refrigeration (under-counter, reach-in, or walk-in). It lowers our per-stall CapEx, gives each vendor creative room on their equipment spec, and avoids over-building for the wrong cuisine.',
  },
  {
    q: 'Why kiosks are NOT placed against the core wall',
    a: 'Kiosks have no gas, no hood, and no fire suppression — they do not need the core-wall MEP cluster. Placing them in the western gathering zone (V1) or across both halls (V2) turns them into visual anchors that pull guests through the space and create natural activation points between the signature farm tables and the food row.',
  },
  {
    q: 'Why we are proposing two versions',
    a: 'Version 1 is the primary scope — the Richmond deal, the first SOW, and the CapEx model are all built around ~9,180 sf in the left zone. Version 2 is the mirrored full-L2 proposal for the pitch conversation with DPEG: same DNA, doubled. Keeping both in the package lets us move fast on V1 while keeping V2 on the table.',
  },
  {
    q: 'Why the gas service upgrade is the #1 critical-path item',
    a: 'Current Building F gas service per P02.F00 is 7,000 CFH total at 5 PSI for all tenants. The Barn alone needs 32,000–35,000 CFH peak (V1) or 64,000–70,000 CFH (V2). DPEG has confirmed CenterPoint can deliver the upgrade, but utility scheduling has long lead times. If we don\'t book the upgrade early in Discovery/Design, permits will hold.',
  },
];

function InfoBadge({ text, tone = 'honey' as 'honey' | 'terracotta' | 'sage' }: { text: string; tone?: 'honey' | 'terracotta' | 'sage' }) {
  const toneMap = {
    honey: 'bg-honey/15 border-honey/30 text-walnut',
    terracotta: 'bg-terracotta/15 border-terracotta/30 text-walnut',
    sage: 'bg-sage/15 border-sage/30 text-walnut',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${toneMap[tone]}`}>
      {text}
    </span>
  );
}

function GasFlagCallout() {
  return (
    <div className="rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <div className="text-terracotta text-xl leading-none">▲</div>
        <div>
          <div className="font-bold text-walnut text-sm mb-1">
            CRITICAL INFRASTRUCTURE — Gas Service Upgrade Required
          </div>
          <p className="text-xs text-walnut-light leading-relaxed">
            Per P02.F00, current Bldg F gas service is <span className="font-semibold text-walnut">7,000 CFH @ 5 PSI</span> for all tenants.
            The Barn peak load estimate: <span className="font-semibold text-walnut">32,000–35,000 CFH</span> (V1, 8 stalls) or{' '}
            <span className="font-semibold text-walnut">64,000–70,000 CFH</span> (V2, 16 stalls).
            CenterPoint upgrade is <span className="font-semibold text-walnut">confirmed available by DPEG</span> — budget, lead time, and utility
            coordination to be finalized during Discovery/Design. Must be scheduled early to avoid holding buildout permits.
          </p>
        </div>
      </div>
    </div>
  );
}

function ShellContextCard() {
  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <h2 className="text-lg font-bold text-walnut mb-3">Building Context — Shell Conditions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-walnut-light leading-relaxed">
        <ul className="space-y-1.5">
          <li><span className="text-walnut font-semibold">Building F Level 2:</span> ~196ft × ~90ft ≈ 17,640 sf gross</li>
          <li><span className="text-walnut font-semibold">Split:</span> two zones separated by central core (~30ft × 30ft)</li>
          <li><span className="text-walnut font-semibold">Left zone:</span> ~102ft × 90ft ≈ 9,180 sf (V1 scope)</li>
          <li><span className="text-walnut font-semibold">Right zone:</span> ~85ft × 90ft ≈ 7,650 sf</li>
          <li><span className="text-walnut font-semibold">Column grid:</span> F.1–F.8 east–west at ~28ft bay spacing (F.5 in core)</li>
        </ul>
        <ul className="space-y-1.5">
          <li><span className="text-walnut font-semibold">Glazing:</span> all 4 perimeter sides — NO solid exterior walls</li>
          <li><span className="text-walnut font-semibold">Core wall:</span> only solid interior wall — all cooking lines anchor here</li>
          <li><span className="text-walnut font-semibold">Ceiling:</span> exposed wood trusses (preserved — "elevated barn")</li>
          <li><span className="text-walnut font-semibold">Roof:</span> sloped standing-seam metal long sides + central flat TPO (only valid penetration zone)</li>
          <li><span className="text-walnut font-semibold">Terraces:</span> notched corners with outdoor setbacks</li>
        </ul>
      </div>
    </div>
  );
}

function StallCell({ label, kind = 'food' as 'food' | 'kiosk-h' | 'kiosk-m' | 'core' }: { label: string; kind?: 'food' | 'kiosk-h' | 'kiosk-m' | 'core' }) {
  const map = {
    food: 'bg-honey/25 border-honey/40 text-walnut',
    'kiosk-h': 'bg-terracotta/20 border-terracotta/40 text-walnut',
    'kiosk-m': 'bg-sage/20 border-sage/40 text-walnut',
    core: 'bg-walnut/20 border-walnut/40 text-walnut',
  };
  return (
    <div className={`rounded border px-1 py-1 text-center font-bold text-[10px] ${map[kind]}`}>
      {label}
    </div>
  );
}

function V1FloorPlan() {
  return (
    <div className="bg-cream rounded-xl border border-walnut/10 p-3 md:p-4 overflow-hidden">
      <img
        src="/renderings/15-birdseye-blueprint.jpg"
        alt="The Barn — Richmond V1 birdseye layout blueprint, ~9,180 sf left zone with 8 food stalls, 4 kiosks, gathering zone, and restrooms"
        className="w-full h-auto rounded-lg"
        loading="eager"
      />
      <div className="mt-3 text-[10px] md:text-xs text-walnut-light flex flex-wrap gap-x-4 gap-y-1 justify-center">
        <span>◾ Core wall = only non-window wall · anchor for MEP + hood exhaust</span>
        <span>◾ Hood vents through central TPO roof zone above core</span>
      </div>
    </div>
  );
}

function V2FloorPlan() {
  return (
    <div className="bg-cream rounded-xl border border-walnut/10 p-3 md:p-5 font-mono text-[10px] md:text-xs leading-relaxed overflow-x-auto scroll-fade-x">
      <p className="text-[10px] text-walnut-light mb-2 md:hidden font-sans">↔ scroll to see the full floor plan</p>
      <div className="min-w-[700px]">
        <div className="text-center text-[9px] text-walnut-light mb-1">■ WINDOWS (North) ■</div>

        <div className="flex gap-1 items-stretch">
          <div className="text-[9px] text-walnut-light self-center rotate-180 [writing-mode:vertical-rl]">■ WINDOWS ■</div>

          {/* Left gathering */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-sage/15 border border-sage/25 rounded-lg p-2 flex-1">
              <div className="font-bold text-walnut text-center text-[10px]">LEFT GATHERING</div>
              <div className="text-center text-[9px] text-walnut-light mb-2">~3,140sf · communal · family · lounge</div>
              <div className="grid grid-cols-2 gap-1">
                <StallCell label="HB 280sf" kind="kiosk-h" />
                <StallCell label="D1 220sf" kind="kiosk-m" />
              </div>
            </div>
            <div className="bg-walnut/10 border border-walnut/20 rounded p-1.5 text-center">
              <div className="font-bold text-walnut text-[9px]">L-RR ~400sf</div>
            </div>
          </div>

          {/* Left food island */}
          <div className="w-24 bg-honey/10 border border-honey/30 rounded-lg p-1.5">
            <div className="text-center font-bold text-walnut text-[9px] mb-1">LEFT ISLAND</div>
            <div className="text-center text-[8px] text-walnut-light mb-1">8 × 280sf</div>
            <div className="flex flex-col gap-1">
              {['F1L','F2L','F3L','F4L','F5L','F6L','F7L','F8L'].map(v => (
                <StallCell key={v} label={v} kind="food" />
              ))}
            </div>
          </div>

          {/* Core */}
          <div className="w-16 bg-walnut/30 border border-walnut/40 rounded flex flex-col items-center justify-center p-1">
            <div className="text-[9px] text-cream font-bold text-center leading-tight">CORE</div>
            <div className="text-[8px] text-cream/80 text-center leading-tight mt-1">Mech · Elev · Stairs</div>
            <div className="text-[8px] text-cream/80 text-center leading-tight mt-1">↑ TPO hood zone</div>
          </div>

          {/* Right food island */}
          <div className="w-24 bg-honey/10 border border-honey/30 rounded-lg p-1.5">
            <div className="text-center font-bold text-walnut text-[9px] mb-1">RIGHT ISLAND</div>
            <div className="text-center text-[8px] text-walnut-light mb-1">8 × 280sf</div>
            <div className="flex flex-col gap-1">
              {['F1R','F2R','F3R','F4R','F5R','F6R','F7R','F8R'].map(v => (
                <StallCell key={v} label={v} kind="food" />
              ))}
            </div>
          </div>

          {/* Right gathering */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-sage/15 border border-sage/25 rounded-lg p-2 flex-1">
              <div className="font-bold text-walnut text-center text-[10px]">RIGHT GATHERING</div>
              <div className="text-center text-[9px] text-walnut-light mb-2">~3,140sf · communal · family · lounge</div>
              <div className="grid grid-cols-2 gap-1">
                <StallCell label="C 220sf" kind="kiosk-h" />
                <StallCell label="D2 220sf" kind="kiosk-m" />
                <StallCell label="D3 220sf" kind="kiosk-m" />
                <StallCell label="SP TBD" kind="kiosk-m" />
              </div>
            </div>
            <div className="bg-walnut/10 border border-walnut/20 rounded p-1.5 text-center">
              <div className="font-bold text-walnut text-[9px]">R-RR ~400sf</div>
            </div>
          </div>

          <div className="text-[9px] text-walnut-light self-center [writing-mode:vertical-rl]">■ WINDOWS ■</div>
        </div>

        <div className="text-center text-[9px] text-walnut-light mt-2">■ WINDOWS (South) ■</div>

        <div className="mt-3 text-[9px] text-walnut-light text-center">
          Mirrored Path A — 16 food stalls + 6 kiosks · two hood systems converge on central TPO roof zone
        </div>
      </div>
    </div>
  );
}

export default function LayoutPage() {
  const [version, setVersion] = useState<Version>('v1');
  const [expandedZone, setExpandedZone] = useState<number | null>(null);
  const [showDecisions, setShowDecisions] = useState(false);
  const revealRef = useReveal();

  const spec = versions[version];
  const displayZones = spec.zones.filter(z => z.sqft);

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/layout" />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-walnut">Space Layout & Specifications</h1>
              <p className="text-walnut-light text-sm mt-1">{spec.dims}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <InfoBadge text="Path A — food row at core wall" tone="honey" />
                <InfoBadge text="All 4 sides glazed" tone="sage" />
                <InfoBadge text="Exposed wood trusses" tone="terracotta" />
              </div>
            </div>

            {/* Version toggle */}
            <div className="flex gap-0 bg-walnut/5 border border-walnut/10 rounded-full p-1 text-xs">
              {(['v1','v2'] as Version[]).map(v => (
                <button
                  key={v}
                  onClick={() => { setVersion(v); setExpandedZone(null); }}
                  className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                    version === v
                      ? 'bg-honey text-cream shadow-sm'
                      : 'text-walnut-light hover:text-walnut'
                  }`}
                >
                  {versions[v].shortLabel}
                </button>
              ))}
            </div>
          </div>
          <p className="text-walnut-light text-sm mt-4 leading-relaxed max-w-3xl">{spec.tagline}</p>
        </div>

        {/* Shell context */}
        <section className="mb-6">
          <ShellContextCard />
        </section>

        {/* Floor plan */}
        <section className="mb-8">
          <div className="glass rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-lg font-bold text-walnut">Floor Plan — {spec.shortLabel}</h2>
              <div className="flex gap-2 text-[10px]">
                <InfoBadge text="🟫 Food stall (hot line)" tone="honey" />
                <InfoBadge text="🟧 Kiosk (Bucket 3)" tone="terracotta" />
                <InfoBadge text="🟩 Kiosk (Bucket 2)" tone="sage" />
              </div>
            </div>
            {version === 'v1' ? <V1FloorPlan /> : <V2FloorPlan />}
          </div>
        </section>

        {/* Gas flag */}
        <section className="mb-8">
          <GasFlagCallout />
        </section>

        {/* Space Allocation */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-walnut mb-4">Space Allocation — {spec.shortLabel}</h2>

          <div className="glass rounded-2xl p-4 md:p-6 mb-4 reveal">
            <div className="flex rounded-xl overflow-hidden h-10 mb-4">
              {displayZones.map((z, i) => (
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
              {displayZones.map((z, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${z.color}`} />
                  <span className="text-walnut-light">{z.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {spec.zones.map((z, i) => (
              <div
                key={i}
                className={`glass rounded-xl transition-all cursor-pointer ${
                  expandedZone === i ? 'border-honey/50 !shadow-lg !shadow-honey/10' : ''
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
                    {z.sqft ? (
                      <>
                        <span className="font-bold text-walnut text-sm tabular-nums">{z.sqft.toLocaleString()} sf</span>
                        <span className="text-walnut-light text-xs ml-2">{z.pct}%</span>
                      </>
                    ) : (
                      <span className="text-walnut-light text-xs italic">within gathering</span>
                    )}
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

          <div className="flex items-center justify-between px-4 py-3 mt-2 bg-honey/10 rounded-xl border border-honey/20">
            <span className="font-bold text-walnut">Total</span>
            <span className="font-bold text-walnut tabular-nums">~{spec.totalSqft.toLocaleString()} sf &middot; 100%</span>
          </div>

          <p className="text-xs text-walnut-light italic mt-2">
            Restroom and BOH figures are preliminary — confirm against final schematic design.
          </p>
        </section>

        {/* MEP anchor rationale */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-walnut mb-4">MEP Anchor Rationale</h2>
          <div className="glass rounded-2xl p-4 md:p-6">
            <p className="text-sm text-walnut-light leading-relaxed mb-3">
              Every decision in both Path A configurations is driven by minimizing MEP runs and preserving window real estate for guests.
              The shell conditions make the core wall the unambiguously correct anchor for the cooking line:
            </p>
            <ul className="space-y-2 text-xs text-walnut-light">
              <li><span className="text-walnut font-semibold">Plumbing stubs at core wall —</span> 2″ CW + 4″ Waste + 4″ Vent per zone. Fire sprinkler 4″ riser delivered.</li>
              <li><span className="text-walnut font-semibold">Electrical panels inside core —</span> 1,200A @ 277/480V 3-phase to Bldg F; HF-2 (600A) + LF2(2) (225A) panels in the Level 2 Mech/Elec room.</li>
              <li><span className="text-walnut font-semibold">HVAC 100% tenant scope —</span> MAU clusters in central mech zone next to hood exhaust.</li>
              <li><span className="text-walnut font-semibold">Roof penetrations locked to central TPO —</span> sloped standing-seam metal cannot be penetrated without major complications.</li>
              <li><span className="text-walnut font-semibold">Grease interceptor —</span> tenant scope; location coordinated with sanitary stub at core.</li>
              <li><span className="text-walnut font-semibold">Glazing on all 4 sides —</span> a perimeter cooking line would block windows AND require significantly longer MEP runs.</li>
            </ul>
          </div>
        </section>

        {/* Design decisions */}
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
                <div key={i} className="glass rounded-xl p-4 hover-lift">
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
          <p className="text-walnut-light text-xs mt-1">Building F Level 2 &middot; Marcel Harvest Green &middot; Richmond, TX</p>
        </div>
      </footer>
    </div>
  );
}

import NavBar from '../components/NavBar';
import { useReveal } from '../utils/useReveal';

interface Rendering {
  src: string;
  title: string;
  caption: string;
  alt: string;
}

const renderings: Rendering[] = [
  {
    src: '/renderings/01-hero.jpg',
    title: 'The Barn — Richmond',
    caption: 'Where Neighborhoods Gather. Communal tables under exposed wood trusses, Edison string lights overhead, vendor stalls lining the perimeter — golden-hour warmth made permanent.',
    alt: 'The Barn Richmond hero — communal table, families dining, vendor stalls, warm interior with logo signage',
  },
  {
    src: '/renderings/02-golden-hour.jpg',
    title: 'Golden Hour',
    caption: 'Late-afternoon light pours through the storefront glazing on three sides. The hall feels naturally lit until the string lights take over.',
    alt: 'Interior at golden hour with warm sunlight through storefront windows',
  },
  {
    src: '/renderings/03-night-vibe.jpg',
    title: 'After Dark',
    caption: 'Edison strings, warm pendants, under-counter LED strips — every fixture is 2700K dimmable. The room glows without ever feeling like a restaurant.',
    alt: 'Interior at night with Edison string lights and warm ambient glow',
  },
  {
    src: '/renderings/04-external-bldg.jpg',
    title: 'Building F — From the Street',
    caption: 'Cooperstown brick, slate-gray standing-seam metal, gable ends facing the Harlem Rd corner. The shell already reads as a barn — no facade work needed to sell the brand.',
    alt: 'Exterior view of Building F at Marcel Harvest Green',
  },
  {
    src: '/renderings/05-entrance-inside.jpg',
    title: 'Walking In',
    caption: 'The first moment of arrival — open sightline straight through the gathering hall to the food row at the core wall.',
    alt: 'View from the entrance looking into the gathering hall',
  },
  {
    src: '/renderings/06-feature-wall.jpg',
    title: 'Feature Wall',
    caption: 'Herringbone reclaimed wood · dimensional Barn logo in walnut + matte brass · "Everybody\'s Welcome" LED faux-neon · flanking greenery panels. The signature photo-op.',
    alt: 'Feature wall with herringbone wood, dimensional logo, neon sign, and greenery',
  },
  {
    src: '/renderings/07-window-seating.jpg',
    title: 'Window Seating',
    caption: 'Custom bench seating along the west, north, and south window walls — ~40 seats with the best views of Marcel Harvest Green.',
    alt: 'Custom window-bench seating along storefront glazing',
  },
  {
    src: '/renderings/08-live-music.jpg',
    title: 'Live Music Night',
    caption: 'A neighborhood evening — local musicians, families lingering past dinner, the room programmed for community first and revenue second.',
    alt: 'Live music night with crowd and performer in the hall',
  },
  {
    src: '/renderings/09-community-story.jpg',
    title: 'Community Story Time',
    caption: 'Saturday morning programming for kids and families — the kind of recurring activation that turns a food hall into a neighborhood living room.',
    alt: 'Children and families gathered for story time in the hall',
  },
  {
    src: '/renderings/10-vendor-line.jpg',
    title: 'Vendor Line — Path A',
    caption: 'Eight food stalls in a single row anchored to the core wall. Cooking at the back, prep in the middle, customer counter facing the gathering. Continuous shared hood, UL 300 fire suppression.',
    alt: 'Eight food vendor stalls in a row along the core wall',
  },
  {
    src: '/renderings/11-food-vendor-closeup.jpg',
    title: 'Food Vendor — Up Close',
    caption: '10 ft × 28 ft per stall. Heavy Warm minus Refrigeration: The Barn delivers the hood, FRP, sinks, and utility stubs. The vendor brings the cooking equipment and the soul.',
    alt: 'Close-up of a food vendor stall',
  },
  {
    src: '/renderings/12-kiosk-vendor-closeup.jpg',
    title: 'Kiosk — Bucket 2',
    caption: 'Open island format — counter on all sides. Warm wood + matte black, customer-facing millwork, no gas or hood. Dessert, coffee, specialty drinks.',
    alt: 'Close-up of a kiosk vendor with open island format',
  },
  {
    src: '/renderings/13-vendor-pov.jpg',
    title: 'Vendor POV',
    caption: 'From the line cook\'s view — open sightline to the gathering hall. Vendors aren\'t hidden behind a kitchen wall; they\'re part of the room.',
    alt: 'View from inside a vendor stall looking out at customers',
  },
  {
    src: '/renderings/14-birdseye-rendering.jpg',
    title: 'Birds-Eye — V1 Left Zone',
    caption: '~9,180 sq ft of the left zone of Bldg F Level 2. Food row along the core, gathering opening west to the window walls, kiosks distributed as anchors through the hall.',
    alt: 'Birds-eye rendered view of the V1 left-zone layout',
  },
  {
    src: '/renderings/15-birdseye-blueprint.jpg',
    title: 'Birds-Eye — Blueprint Overlay',
    caption: 'The same plan in technical form — Path A geometry, MEP anchor points, hood-exhaust path through the central TPO roof zone.',
    alt: 'Blueprint-style overlay of the same birds-eye view',
  },
  {
    src: '/renderings/16-customer-app-ui.jpg',
    title: 'The Barn App — Customer',
    caption: 'Order-ahead from any vendor · at-the-table ordering · loyalty rewards · weekly programming feed. Every visit is logged, every guest is known.',
    alt: 'Customer-facing Barn app — Home, Recommended, Rewards, and This Week screens',
  },
  {
    src: '/renderings/17-barn-ops-ui-1.jpg',
    title: 'Barn Ops — Hall Dashboard',
    caption: 'Real-time view of every vendor — sales, traffic, dwell time, satisfaction. Operator decisions based on data, not intuition.',
    alt: 'Operator dashboard showing real-time vendor metrics',
  },
  {
    src: '/renderings/18-barn-ops-ui-2.jpg',
    title: 'Barn Ops — Vendor Detail',
    caption: 'Per-vendor drilldown — energy attribution, queue length, repeat-customer rate. The kind of operational visibility that traditional food halls never had.',
    alt: 'Operator dashboard with per-vendor detail and analytics',
  },
];

function RenderingFrame({ r, idx }: { r: Rendering; idx: number }) {
  return (
    <section className="reveal">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-xs text-honey font-semibold tabular-nums">
          {String(idx + 1).padStart(2, '0')}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-walnut">{r.title}</h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-walnut/10 shadow-lg shadow-walnut/10 bg-walnut/5">
        <img
          src={r.src}
          alt={r.alt}
          loading={idx < 2 ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      <p className="text-sm md:text-base text-walnut-light leading-relaxed mt-4 max-w-3xl">
        {r.caption}
      </p>
    </section>
  );
}

export default function Renderings() {
  const revealRef = useReveal();

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/renderings" />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-walnut">Renderings</h1>
          <p className="text-walnut-light text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            What it looks like, what it feels like, and how it works — the room, the vendors, the
            birds-eye plan, and the tech that ties it all together.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap text-[10px]">
            <span className="px-2 py-0.5 rounded-full border border-honey/30 bg-honey/15 text-walnut font-semibold">18 renderings</span>
            <span className="px-2 py-0.5 rounded-full border border-sage/30 bg-sage/15 text-walnut font-semibold">Richmond V1 · 9,180 sf</span>
            <span className="px-2 py-0.5 rounded-full border border-terracotta/30 bg-terracotta/15 text-walnut font-semibold">AI-rendered concept · not photographs</span>
          </div>
        </div>

        <div className="space-y-12 md:space-y-16">
          {renderings.map((r, i) => <RenderingFrame key={r.src} r={r} idx={i} />)}
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

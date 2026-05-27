import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, Section, LiftCard, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

function Stat({ value, label, accent = 'honey' }: { value: string; label: string; accent?: 'honey' | 'sage' | 'terracotta' }) {
  const colorMap = {
    honey: 'text-honey',
    sage: 'text-sage',
    terracotta: 'text-terracotta',
  };
  return (
    <div className="text-center">
      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums ${colorMap[accent]}`}>{value}</div>
      <div className="text-[10px] md:text-[11px] text-walnut-light mt-1.5 uppercase tracking-wider font-semibold leading-tight">{label}</div>
    </div>
  );
}

const whyCards = [
  {
    icon: '🎯',
    t: 'No real competition',
    d: "Closest comparable food hall is 15+ miles away in Houston. Local dining is dominated by chains — there's a wide-open gap for a curated independent hall.",
  },
  {
    icon: '🚶',
    t: 'Built-in foot traffic',
    d: 'Marcel Harvest Green is part of a master-planned community with daily commuter and resident traffic — the customers already live here.',
  },
  {
    icon: '🏛️',
    t: 'A real building, not a strip center',
    d: 'Exposed wood trusses, perimeter glass, an outdoor terrace, and a 14′-8″ floor-to-ceiling clear height. This is a destination on its own.',
  },
  {
    icon: '🌳',
    t: 'Year-round community',
    d: 'Suburban families with disposable income — the most resilient food-hall customer profile. Weekday lunch, weekend brunch, and family dinners every night.',
  },
];

export default function VendorRichmond() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/richmond" />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="02 · The Location"
          title="Richmond, TX"
          subtitle="The flagship location. One of the fastest-growing suburban corridors in Texas, with a young, high-income family base and no real food-hall alternative for 15+ miles."
        />

        <Section eyebrow="The Site" title="Building F, Level 2 — Marcel Harvest Green.">
          <LiftCard className="rounded-3xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-7">
              <div>
                <div className="text-[10px] font-semibold text-honey uppercase tracking-[0.16em] mb-2">Address</div>
                <div className="text-base text-walnut font-semibold leading-snug">
                  Building F, Level 2<br />
                  Marcel Harvest Green<br />
                  18806 W Airport Blvd<br />
                  Richmond, TX 77406
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-honey uppercase tracking-[0.16em] mb-2">The Building</div>
                <p className="text-sm text-walnut-light leading-relaxed">
                  Brand new mixed-use building inside Harvest Green — a master-planned community with
                  ~3,500 homes built and another ~1,500 in development. Level 2 has full-perimeter
                  storefront glazing, exposed wood trusses, and a usable outdoor terrace.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-walnut/10 stagger-on-view">
              <Stat value="9,180" label="Square Feet" accent="honey" />
              <Stat value="12" label="Vendor Counters" accent="sage" />
              <Stat value="164" label="L2 Occupant Load" accent="terracotta" />
              <Stat value="2026" label="Target Open" accent="honey" />
            </div>
          </LiftCard>
        </Section>

        <Section eyebrow="The Trade Area" title="A market that's been waiting for this.">
          <LiftCard className="rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-7 stagger-on-view">
              <Stat value="~250K" label="3-mi Population" accent="honey" />
              <Stat value="$115K+" label="Median HH Income" accent="sage" />
              <Stat value="2.3×" label="vs State Growth Rate" accent="terracotta" />
              <Stat value="~15 mi" label="Nearest Food Hall" accent="honey" />
            </div>
            <p className="text-sm text-walnut-light leading-relaxed">
              Fort Bend County is consistently ranked one of the fastest-growing and highest-income
              counties in Texas. Richmond, Fulshear, and the surrounding master-planned communities
              skew young, family-heavy, and chronically under-served for quality casual dining. National
              chains (HEB, Target, Costco) have already validated the corridor.
            </p>
            <p className="text-xs text-walnut-light/70 italic mt-3">
              Demographic numbers above are approximate trade-area summaries — final marketing kit
              includes the full demographic report.
            </p>
          </LiftCard>
        </Section>

        <Section eyebrow="Why It Works" title="Why this site works for vendors.">
          <div className="grid md:grid-cols-2 gap-4 stagger-on-view">
            {whyCards.map((c) => (
              <LiftCard key={c.t} className="rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-honey/15 flex items-center justify-center text-2xl flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-walnut text-base mb-1.5">{c.t}</h3>
                    <p className="text-sm text-walnut-light leading-relaxed">{c.d}</p>
                  </div>
                </div>
              </LiftCard>
            ))}
          </div>
        </Section>

        <Section eyebrow="The Retail Center" title="Marcel Harvest Green — the whole development.">
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            The full retail center brochure from Marcel Harvest Green — context on the broader
            development, surrounding tenants, and the trade area we'll share with.
          </p>
          <div className="space-y-6 stagger-on-view">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-3xl p-2 img-zoom lift-card overflow-hidden">
                <img
                  src={`/brochure-page-${n}.jpg`}
                  alt={`Marcel Harvest Green brochure — page ${n}`}
                  loading="lazy"
                  className="w-full rounded-2xl shadow-sm shadow-walnut/10 block"
                />
              </div>
            ))}
          </div>
        </Section>

        <PageFooter />
      </main>
    </div>
  );
}

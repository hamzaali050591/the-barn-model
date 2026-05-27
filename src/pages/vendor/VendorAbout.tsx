import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, Section, LiftCard, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

const conceptCards = [
  {
    title: 'Curated, Not Open-Call',
    description: "Every operator is hand-picked. We're building a lineup that complements each other, not competes — relationship-driven, not RFP-driven.",
  },
  {
    title: 'Neighborhood-First',
    description: 'The Barn belongs to Richmond. Local concepts get priority, and the vibe is built to make families feel welcome — not transient diners passing through.',
  },
  {
    title: 'Operator-Friendly',
    description: 'We deliver hard infrastructure (hood, suppression, plumbing stub-outs, electrical) so you bring equipment and brand, not a buildout headache.',
  },
  {
    title: 'Tech-Enabled Management',
    description: 'A shared management platform with anonymized hall sales, marketing spend, reviews, and traffic — visible to every operator so the hall runs on data, not guesswork.',
  },
];

const transparencyCards = [
  {
    icon: '📈',
    title: 'Anonymized Hall Sales',
    body: 'Monthly sales for every stall, shared with every vendor — with concept names removed. You see exactly where you rank, the spread across the hall, and seasonal trends, without knowing whose numbers belong to whom.',
  },
  {
    icon: '💰',
    title: 'Transparent Marketing Spend',
    body: 'Where every marketing dollar goes — the monthly budget, the channels, and the campaign performance, published openly. No hidden "marketing fee" with vague deliverables.',
  },
  {
    icon: '⭐',
    title: 'Live Google Review Dashboard',
    body: 'Hall-wide ratings, plus a per-vendor breakdown for your own reviews. Pulled fresh every day so you can react to feedback in hours, not weeks.',
  },
  {
    icon: '📊',
    title: 'Daily Operator Dashboards',
    body: 'One platform with foot traffic, hall ratings, marketing performance, and shared revenue metrics. Updated daily. Visible to every operator in the hall.',
  },
];

function TimelineVis({ locations }: { locations: { name: string; month: number }[] }) {
  const months = 48;
  const maxMonth = months;
  const openingMonths = new Set(locations.map(l => l.month));
  return (
    <div className="w-full py-12 px-4 md:px-6">
      <div className="relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-walnut rounded-full" />

        <div className="relative flex justify-between items-center h-6">
          {Array.from({ length: months }, (_, i) => {
            const m = i + 1;
            const isOpening = openingMonths.has(m);
            return (
              <div
                key={m}
                className={`bg-walnut rounded-full ${isOpening ? 'w-0.5 h-4' : 'w-px h-2'}`}
                style={{ opacity: isOpening ? 1 : 0.4 }}
              />
            );
          })}
        </div>

        <div className="relative mt-1">
          {locations.map((loc) => (
            <div
              key={loc.month}
              className="absolute text-[10px] text-walnut font-semibold"
              style={{ left: `${((loc.month - 1) / (maxMonth - 1)) * 100}%`, transform: 'translateX(-50%)' }}
            >
              Mo {loc.month}
            </div>
          ))}
        </div>

        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          {locations.map((loc, i) => {
            const pct = ((loc.month - 1) / (maxMonth - 1)) * 100;
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
              >
                <div
                  className="w-0.5 bg-honey/40 absolute left-1/2 -translate-x-1/2 -top-8"
                  style={{ height: '22px' }}
                />
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg absolute left-1/2 -translate-x-1/2 -top-[62px] text-center leading-tight px-1 transition-transform duration-500 hover:scale-110 ${
                    i === 0 ? 'bg-honey ring-4 ring-honey/30' : 'bg-walnut'
                  }`}
                >
                  {loc.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const scaleLocations = [
  { name: 'Richmond', month: 1 },
  { name: 'Fulshear', month: 13 },
  { name: 'Frisco', month: 17 },
  { name: 'Plano', month: 21 },
  { name: 'San Antonio', month: 25 },
  { name: 'Location 6', month: 29 },
  { name: 'Location 7', month: 33 },
];

export default function VendorAbout() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/about" />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="01 · The Brand"
          title="The Barn"
          meta="18806 W Airport Blvd · Richmond, TX 77406"
        />

        <Section eyebrow="The Concept" title="A neighborhood place, on purpose.">
          <p className="text-walnut-light text-base md:text-lg leading-relaxed mb-7 max-w-3xl reveal">
            A curated, neighborhood-first food hall in Richmond, TX — built around the idea that the
            best meals happen in places that feel like home: warm, communal, locally owned, and
            unmistakably ours. A hand-picked lineup of independent operators sharing one beautifully
            designed space, with wraparound second-floor window views and a terrace overlooking the
            neighborhood. Built to be the kind of place where families accidentally make their
            favorite memories.
          </p>

          <div className="rounded-3xl overflow-hidden border border-walnut/10 shadow-2xl shadow-walnut/20 bg-black aspect-video mb-8 reveal-scale">
            <video
              src="/renderings/the-barn-final-compressed.mp4"
              poster="/renderings/01-hero.jpg"
              controls
              preload="metadata"
              playsInline
              className="w-full h-full block"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 stagger-on-view">
            {conceptCards.map((c) => (
              <LiftCard key={c.title} className="rounded-2xl p-6">
                <h3 className="font-bold text-walnut text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-walnut-light leading-relaxed">{c.description}</p>
              </LiftCard>
            ))}
          </div>
        </Section>

        <Section eyebrow="How We Operate" title="Shared transparency between operator and vendor.">
          <p className="text-walnut-light leading-relaxed mb-8 max-w-3xl reveal">
            Most halls run the operator as a black box — vendors guess at the marketing budget, the
            foot traffic, and how their stall stacks up against the rest. We don't. Every operator
            running a stall in The Barn has the same visibility into the hall's performance that we do.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 stagger-on-view mb-5">
            {transparencyCards.map((c) => (
              <LiftCard key={c.title} className="rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-sage/15 text-sage flex items-center justify-center text-xl shadow-inner shadow-sage/10">
                    {c.icon}
                  </div>
                  <h3 className="font-bold text-walnut text-base">{c.title}</h3>
                </div>
                <p className="text-sm text-walnut-light leading-relaxed">{c.body}</p>
              </LiftCard>
            ))}
          </div>
          <LiftCard className="rounded-2xl p-6 md:p-7 relative overflow-hidden">
            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-honey via-terracotta to-honey/30" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-honey/15 text-honey flex items-center justify-center text-xl shadow-inner shadow-honey/10">
                📱
              </div>
              <h3 className="font-bold text-walnut text-base">Customer Experience Layer</h3>
            </div>
            <p className="text-sm text-walnut-light leading-relaxed">
              Built on top of the same platform: customer-facing order-ahead, table-side ordering, and
              a hall-wide loyalty program that drives repeat visits to every stall. Better customer
              experience for the diner, more repeat visits for you.
            </p>
          </LiftCard>
        </Section>

        <Section eyebrow="The Long View" title="Future locations.">
          <p className="text-walnut-light leading-relaxed mb-4 max-w-3xl reveal">
            Richmond is the flagship, but the longer plan is to expand across Texas suburbs — Fulshear,
            Frisco, Plano, San Antonio, and two more sites over roughly the next four years. Each
            location uses the same operating model, the same tech, and where it makes sense, the same
            vendor roster.
          </p>
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            Strong Richmond operators get first look at future locations. If you've ever wanted to
            scale your concept without doing 7 buildouts yourself, this is a path.
          </p>

          <LiftCard className="rounded-3xl p-5 md:p-7 overflow-x-auto scroll-fade-x">
            <div className="flex items-center gap-3 mb-1">
              <span className="block w-2 h-2 rounded-full bg-honey pulse-honey" />
              <h3 className="text-sm font-bold text-walnut tracking-wide uppercase">Opening Timeline</h3>
            </div>
            <p className="text-[10px] text-walnut-light mb-2 md:hidden">↔ scroll to see all 7 locations</p>
            <div className="min-w-[700px]">
              <TimelineVis locations={scaleLocations} />
            </div>
          </LiftCard>
        </Section>

        <PageFooter />
      </main>
    </div>
  );
}

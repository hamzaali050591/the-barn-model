import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, Section, LiftCard, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

function ChecklistRow({ items, tone }: { items: string[]; tone: 'sage' | 'honey' }) {
  const dotClass = tone === 'sage' ? 'bg-sage' : 'bg-honey';
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass} ring-2 ring-current/20`} />
          <span className="text-sm text-walnut-light leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function DeliverySplit({
  delivers,
  brings,
  deliversIcon,
  bringsIcon,
  bringsLabel,
}: {
  delivers: string[];
  brings: string[];
  deliversIcon: string;
  bringsIcon: string;
  bringsLabel: string;
}) {
  return (
    <div className="relative grid md:grid-cols-2 gap-4 md:gap-0">
      <LiftCard className="rounded-2xl md:rounded-r-none p-6 md:p-7 md:border-r-0 relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-sage/15 text-sage flex items-center justify-center text-xl shadow-inner shadow-sage/10">
            {deliversIcon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-sage font-bold mb-0.5">We Deliver</div>
            <h3 className="font-bold text-walnut">The Barn provides</h3>
          </div>
        </div>
        <ChecklistRow items={delivers} tone="sage" />
      </LiftCard>

      <div
        aria-hidden
        className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-cream border-2 border-honey/40 items-center justify-center shadow-lg shadow-honey/20"
      >
        <svg className="w-5 h-5 text-honey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0-4-4m4 4-4 4m-4 6H4m0 0 4 4m-4-4 4-4" />
        </svg>
      </div>

      <LiftCard className="rounded-2xl md:rounded-l-none p-6 md:p-7 relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-honey/15 text-honey flex items-center justify-center text-xl shadow-inner shadow-honey/10">
            {bringsIcon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-honey font-bold mb-0.5">You Bring</div>
            <h3 className="font-bold text-walnut">{bringsLabel}</h3>
          </div>
        </div>
        <ChecklistRow items={brings} tone="honey" />
      </LiftCard>
    </div>
  );
}

const barnDeliversFood = [
  'Type I hood + UL 300 fire suppression',
  'FRP walls, sealed floors, floor drains',
  '3-compartment sink + hand sinks',
  'Dedicated electrical subpanel sized for your equipment',
  'Water supply + sewer connection',
  'Gas manifold sized for ~4 cooking-equipment connections',
  'Walk-up counter with utility access tucked behind',
  'Branded stall frontage built to your concept',
];

const vendorBringsFood = [
  'All cooking equipment (range, fryer, griddle, charbroiler, oven, etc.)',
  'All refrigeration — your choice of under-counter, reach-in, or walk-in',
  'Smallwares, prep tools, POS hardware',
  'Inventory + ingredients',
  'Your team',
  'Your menu, recipes, and brand assets',
];

const barnDeliversKiosk = [
  'Dedicated electrical subpanel',
  'Water supply + sewer connection',
  'Sealed floors + sealed walls',
  'Counter shell built to your brand',
];

const vendorBringsKiosk = [
  'All equipment (espresso machine, blender, freezers, display cases, etc.)',
  'Smallwares + POS',
  'Inventory + supplies',
  'Your team and menu',
];

const sharedOps = [
  { icon: '🧹', title: 'Cleaning', body: 'Common-area cleaning, restroom upkeep, trash, and dish-area sanitation handled by The Barn.' },
  { icon: '🗑️', title: 'Trash & Grease', body: 'Shared waste hauling and grease trap service — your stall is on the schedule from day one.' },
  { icon: '⚡', title: 'Utilities', body: "Gas, electric, and water are bundled into your monthly rent — you don't run individual accounts." },
  { icon: '🛡️', title: 'Security', body: 'After-hours security, alarm monitoring, and shared loss-prevention coverage.' },
  { icon: '📣', title: 'Marketing', body: 'The Barn drives hall-wide marketing — every dollar pulls customers to your counter.' },
  { icon: '📊', title: 'Management Platform', body: 'Shared dashboards with anonymized hall sales, marketing spend, Google reviews, and traffic — updated daily, visible to every operator.' },
];

export default function VendorStall() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/stall" />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="05 · The Buildout"
          title="Your Stall"
          subtitle="We deliver heavy infrastructure so you can show up with equipment and a brand — and open faster than a freestanding restaurant could."
        />

        <Section eyebrow="The Footprint" title="A stall built for line-of-sight.">
          <LiftCard className="rounded-3xl p-6 sm:p-7 md:p-10">
            <div className="grid grid-cols-3 gap-3 sm:gap-8 text-center stagger-on-view">
              <div>
                <div className="text-xl sm:text-3xl md:text-5xl font-bold text-honey tabular-nums leading-none">10′×28′</div>
                <div className="text-[9px] sm:text-[11px] text-walnut-light mt-2 uppercase tracking-[0.14em] font-semibold leading-tight">Stall Dimensions</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl md:text-5xl font-bold text-sage tabular-nums leading-none">280 sf</div>
                <div className="text-[9px] sm:text-[11px] text-walnut-light mt-2 uppercase tracking-[0.14em] font-semibold leading-tight">Per Food Stall</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl md:text-5xl font-bold text-terracotta tabular-nums leading-none">8 + 4</div>
                <div className="text-[9px] sm:text-[11px] text-walnut-light mt-2 uppercase tracking-[0.14em] font-semibold leading-tight">Food + Kiosks</div>
              </div>
            </div>
            <p className="text-sm md:text-base text-walnut-light leading-relaxed mt-7 md:mt-8 max-w-2xl mx-auto text-center">
              Stalls are arranged in a single linear row along the core wall — cooking at the back,
              prep in the middle, customer counter at the front. The hall opens outward toward
              full-perimeter glazing, so every stall has line-of-sight to the gathering area.
            </p>
          </LiftCard>
        </Section>

        <Section eyebrow="Food Stalls" title='"Heavy Warm minus Refrigeration."'>
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            The Barn handles every piece of permanent infrastructure that would normally take 6+ months
            and $300K+ to build in a standalone space. You bring the equipment that makes your concept yours.
          </p>
          <DeliverySplit
            delivers={barnDeliversFood}
            brings={vendorBringsFood}
            deliversIcon="🏗️"
            bringsIcon="🍳"
            bringsLabel="Equipment & brand"
          />
        </Section>

        <Section eyebrow="Kiosks" title="Coffee, dessert, specialty drinks.">
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            Kiosks are non-cooking concepts (coffee, ice cream, baked goods, juice, etc.). They sit
            outside the main food line and have a simpler build — no gas, no hood, no fire suppression.
          </p>
          <DeliverySplit
            delivers={barnDeliversKiosk}
            brings={vendorBringsKiosk}
            deliversIcon="🏗️"
            bringsIcon="☕"
            bringsLabel="Equipment & brand"
          />
        </Section>

        <Section eyebrow="Shared Operations" title="Handled for you.">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 stagger-on-view">
            {sharedOps.map((b) => (
              <LiftCard key={b.title} className="rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-walnut/8 text-walnut flex items-center justify-center text-lg">
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-walnut text-base">{b.title}</h3>
                </div>
                <p className="text-sm text-walnut-light leading-relaxed">{b.body}</p>
              </LiftCard>
            ))}
          </div>
        </Section>

        <PageFooter />
      </main>
    </div>
  );
}

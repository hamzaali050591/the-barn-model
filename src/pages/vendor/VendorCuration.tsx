import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, Section, LiftCard, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

const stallMix = [
  { count: 8, label: 'Food Stalls', sub: 'Hot, cooking, full-service stalls — savory mains and meal-anchor concepts.', tone: 'bg-honey/15 text-honey ring-honey/30' },
  { count: 1, label: 'Coffee / Espresso', sub: 'A daytime anchor — drives morning and afternoon traffic.', tone: 'bg-sage/15 text-sage ring-sage/30' },
  { count: 1, label: 'Bakery / Pastry', sub: 'Morning pastries, breads, and grab-and-go.', tone: 'bg-walnut/15 text-walnut ring-walnut/25' },
  { count: 2, label: 'Dessert / Sweet', sub: 'Ice cream, gelato, treats — the reason families stay an extra 20 minutes.', tone: 'bg-terracotta/15 text-terracotta ring-terracotta/30' },
];

const lookingFor = [
  { icon: '👤', t: 'Operators, not just concepts', d: 'We want owner-operators who will be in the stall, on the floor, leading their team. Not absentee licenses or pop-up brands.' },
  { icon: '🎯', t: 'A point of view', d: 'A clear, narrow concept that you can describe in one sentence. The more focused, the better.' },
  { icon: '✅', t: 'Proven execution', d: 'Existing food trucks, ghost kitchens, catering operations, or restaurants are ideal. First-time operators considered case-by-case.' },
  { icon: '✨', t: 'Brand polish', d: 'Your visual identity, signage, packaging, and online presence should match the level of the hall. We can help — but the foundation needs to be there.' },
  { icon: '🏘️', t: 'Local roots', d: 'Priority goes to operators based in Richmond, Fort Bend County, and the greater Houston area. Local stories are part of the brand.' },
  { icon: '🤝', t: 'Co-tenant fit', d: 'Categories are exclusive — only one BBQ, one taqueria, one burger, etc. We want stalls to complement, not compete.' },
];

const processSteps = [
  { t: 'Apply', d: 'Fill out the short application on the Apply page. Tell us about your concept, your story, and where you operate today.' },
  { t: 'Tasting & Conversation', d: 'If your concept fits the gap, we set up a tasting and a conversation. This is mutual — you should know if this hall is right for you.' },
  { t: 'Category Hold', d: "If we agree it's a fit, we hold your category and lock terms. No bidding, no waitlist gamesmanship." },
  { t: 'Term Sheet & Lease', d: 'Plain-English term sheet → standard commercial lease. 2–3 weeks from handshake to signed lease.' },
  { t: 'Build & Brand', d: 'We coordinate with the GC on your stall infrastructure while you finalize equipment and branding.' },
  { t: 'Open', d: 'Soft open with staff training, then the doors open. Your first customers walk in.' },
];

export default function VendorCuration() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/curation" />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="03 · The Curation"
          title="Who Belongs Here"
          subtitle="The Barn is curated, not open-call. The lineup is designed so every stall draws its own customers — and so the whole hall reads as one neighborhood place, not a directory of tenants."
        />

        <Section eyebrow="The Lineup" title="The vendor mix.">
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            12 total counters in V1 — 8 food stalls and 4 kiosk-style concepts. The categories below are
            our target lineup; final names confirmed during curation.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 stagger-on-view">
            {stallMix.map((s) => (
              <LiftCard key={s.label} className="rounded-2xl p-6 text-center">
                <div className={`w-14 h-14 rounded-full ${s.tone} flex items-center justify-center font-bold text-2xl mx-auto mb-3 ring-4 tabular-nums`}>
                  {s.count}
                </div>
                <h3 className="font-bold text-walnut mb-1">{s.label}</h3>
                <p className="text-xs text-walnut-light leading-relaxed">{s.sub}</p>
              </LiftCard>
            ))}
          </div>
        </Section>

        <Section eyebrow="The Operator" title="What we're looking for.">
          <div className="grid md:grid-cols-2 gap-4 stagger-on-view">
            {lookingFor.map((c) => (
              <LiftCard key={c.t} className="rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-honey/15 text-honey flex items-center justify-center text-xl flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-walnut text-base mb-1">{c.t}</h3>
                    <p className="text-sm text-walnut-light leading-relaxed">{c.d}</p>
                  </div>
                </div>
              </LiftCard>
            ))}
          </div>
        </Section>

        <Section eyebrow="From Conversation to Open" title="The curation process.">
          <ol className="space-y-3">
            {processSteps.map((s, i) => (
              <li key={s.t} className="reveal-l">
                <LiftCard className="rounded-2xl p-5 md:p-6">
                  <div className="flex items-start gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-honey to-terracotta text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-honey/30">
                        {i + 1}
                      </div>
                      {i < processSteps.length - 1 && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-honey/60 to-transparent" />
                      )}
                    </div>
                    <div className="pt-1">
                      <div className="font-bold text-walnut text-base mb-1">{s.t}</div>
                      <div className="text-sm text-walnut-light leading-relaxed">{s.d}</div>
                    </div>
                  </div>
                </LiftCard>
              </li>
            ))}
          </ol>
        </Section>

        <PageFooter />
      </main>
    </div>
  );
}

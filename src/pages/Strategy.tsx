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
// ── Scale Vision Timeline (tick marks 1-48 with opening circles) ──
function TimelineVis({ locations }: { locations: { name: string; month: number }[] }) {
  const months = 48;
  const maxMonth = months;
  const openingMonths = new Set(locations.map(l => l.month));
  return (
    <div className="w-full py-12 px-4 md:px-6">
      <div className="relative">
        {/* Main line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-walnut rounded-full" />

        {/* Tick marks — only highlight ones with opening locations */}
        <div className="relative flex justify-between items-center h-6">
          {Array.from({ length: months }, (_, i) => {
            const m = i + 1;
            const isOpening = openingMonths.has(m);
            return (
              <div
                key={m}
                className={`bg-walnut rounded-full ${
                  isOpening ? 'w-0.5 h-4' : 'w-px h-2'
                }`}
                style={{ opacity: isOpening ? 1 : 0.4 }}
              />
            );
          })}
        </div>

        {/* Month labels only for opening months */}
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

        {/* Location circles — above the line, city name inside */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          {locations.map((loc, i) => {
            const pct = ((loc.month - 1) / (maxMonth - 1)) * 100;
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
              >
                {/* Vertical connector */}
                <div
                  className="w-0.5 bg-honey/40 absolute left-1/2 -translate-x-1/2 -top-8"
                  style={{ height: '22px' }}
                />
                {/* Circle with city name */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg absolute left-1/2 -translate-x-1/2 -top-[62px] text-center leading-tight px-1 ${
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

export default function Strategy() {
  const revealRef = useReveal();

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
              description="12 unique local vendors. No chains. Personally curated by the operator — relationship-driven, not open-call. Every stall is a draw on its own."
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
              <Stat value="12" label="Vendor Stalls" />
              <Stat value="$960K" label="Annual Rent Revenue" />
              <Stat value="$1.5M" label="Total Buildout" />
            </div>
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

          {/* Timeline tick-mark visual */}
          <div className="glass rounded-2xl p-4 md:p-6 reveal overflow-x-auto">
            <h3 className="text-sm font-bold text-walnut mb-1">Opening Timeline</h3>
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

import { useNavigate } from 'react-router-dom';
import SubsNavBar from '../../components/SubsNavBar';
import { useReveal } from '../../utils/useReveal';
import { SUB_SCOPES, ICONS } from '../../data/subsScopes';

const projectStats = [
  { value: '~9,180', label: 'sq ft · Bldg F, Level 2' },
  { value: '12', label: 'vendor stalls (8 food + 4 kiosk)' },
  { value: '200', label: 'seat capacity' },
  { value: '10', label: 'trade scopes out to bid' },
];

export default function SubsLanding() {
  const navigate = useNavigate();
  const revealRef = useReveal();

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <SubsNavBar current="/subs" />

      {/* Hero overview */}
      <div className="relative overflow-hidden bg-walnut">
        <div className="absolute inset-0">
          <img src="/feature-wall.jpg" alt="The Barn — Everybody's Welcome" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-walnut/70 via-walnut/75 to-walnut/95" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-10 md:pt-16 md:pb-14">
          <span className="chip mb-5">Subcontractor Bid Package</span>
          <h1 className="display-title text-3xl md:text-5xl text-cream max-w-3xl">
            The Barn — Richmond
          </h1>
          <p className="text-cream/80 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            We&rsquo;re building out a ~9,180 sq ft curated food hall on Level 2 of Building F at
            Marcel Harvest Green in Richmond, TX — a single open hall with 8 food stalls, 4 kiosks,
            and seating for 200 under exposed wood trusses. Below are the trade scopes of work
            we&rsquo;re seeking bids on. Each is a high-level scope for discussion — figures are
            yours to quote.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-3xl">
            {projectStats.map(s => (
              <div key={s.label} className="glass-dark rounded-xl px-4 py-3 text-cream">
                <div className="text-2xl md:text-3xl font-bold text-honey tabular-nums">{s.value}</div>
                <div className="text-[11px] text-cream/60 leading-tight mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Concept film */}
        <section className="reveal mb-12 md:mb-16">
          <div className="section-mark mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-walnut">Concept Film</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-walnut/10 shadow-lg shadow-walnut/10 bg-black aspect-video">
            <video
              src="/renderings/the-barn-final-compressed.mp4"
              poster="/renderings/01-hero.jpg"
              controls
              preload="metadata"
              playsInline
              className="w-full h-full block"
            />
          </div>
          <p className="text-sm md:text-base text-walnut-light leading-relaxed mt-4 max-w-3xl">
            A short walkthrough of the Richmond concept — the room, the vendors, the feel. It shows
            the finished space your trade is helping build. Best with sound on.
          </p>
        </section>

        {/* Scope buttons */}
        <section className="reveal">
          <div className="section-mark mb-1">
            <h2 className="text-xl md:text-2xl font-bold text-walnut">Scopes of Work</h2>
          </div>
          <p className="text-sm text-walnut-light mb-6 max-w-2xl">
            Tap a trade to see its full scope. Each is drawn from the Richmond buildout package —
            specs and line-item detail only, no budget figures.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUB_SCOPES.map(scope => (
              <button
                key={scope.slug}
                onClick={() => navigate(`/subs/${scope.slug}`)}
                className="group glass lift-card rounded-2xl p-5 text-left cursor-pointer flex flex-col"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-honey/15 text-honey flex items-center justify-center group-hover:bg-honey/25 transition-colors">
                    {scope.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-walnut leading-tight">{scope.label}</h3>
                    <p className="text-[11px] text-honey font-semibold mt-0.5">{scope.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-walnut-light leading-relaxed mt-3">{scope.blurb}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut mt-4 group-hover:text-honey transition-colors">
                  View scope
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </button>
            ))}

            {/* Utility Loads card */}
            <button
              onClick={() => navigate('/subs/utility-loads')}
              className="group glass lift-card rounded-2xl p-5 text-left cursor-pointer flex flex-col border-honey/30"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-sage/15 text-sage flex items-center justify-center group-hover:bg-sage/25 transition-colors">
                  {ICONS.gauge}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-walnut leading-tight">Utility Loads</h3>
                  <p className="text-[11px] text-sage font-semibold mt-0.5">Gas · Electric · Water · Grease</p>
                </div>
              </div>
              <p className="text-sm text-walnut-light leading-relaxed mt-3">
                Building-wide connected loads and monthly usage for sizing service, pipe, and panels —
                per-stall and common-area breakdowns. Loads only, no pricing.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut mt-4 group-hover:text-honey transition-colors">
                View loads
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4 mt-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">The Barn &mdash; Everybody&rsquo;s Welcome</p>
          <p className="text-walnut-light text-xs mt-1">Building F Level 2 &middot; Marcel Harvest Green &middot; Richmond, TX</p>
        </div>
      </footer>
    </div>
  );
}

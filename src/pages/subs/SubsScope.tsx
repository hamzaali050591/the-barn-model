import { useParams, useNavigate, Navigate } from 'react-router-dom';
import SubsNavBar from '../../components/SubsNavBar';
import { useReveal } from '../../utils/useReveal';
import { getScope, SUB_SCOPES } from '../../data/subsScopes';

export default function SubsScope() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const revealRef = useReveal();
  const scope = getScope(slug);

  if (!scope) return <Navigate to="/subs" replace />;

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <SubsNavBar current={`/subs/${scope.slug}`} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate('/subs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-light hover:text-honey transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          All scopes
        </button>

        {/* Header */}
        <div className="mb-8">
          <span className="chip mb-4">Scope of Work</span>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-honey/15 text-honey flex items-center justify-center">
              {scope.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-walnut leading-tight">{scope.title}</h1>
            </div>
          </div>
          <p className="text-walnut-light text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{scope.blurb}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 rounded-full border border-walnut/15 bg-walnut/5 text-walnut text-xs font-medium">
              The Barn — Richmond
            </span>
            <span className="px-3 py-1 rounded-full border border-walnut/15 bg-walnut/5 text-walnut text-xs font-medium">
              Bldg F, Level 2 (Left Zone) · Marcel Harvest Green
            </span>
            {scope.meta.map(m => (
              <span key={m.label} className="px-3 py-1 rounded-full border border-honey/30 bg-honey/10 text-walnut text-xs font-medium">
                <span className="text-walnut-light">{m.label}:</span> {m.value}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {scope.sections.map(section => (
            <section key={section.title} className="reveal glass rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-walnut/5 border-b border-walnut/10">
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-walnut">{section.title}</h2>
              </div>
              <div className="divide-y divide-walnut/8">
                {section.items.map(li => (
                  <div key={li.n} className="px-5 py-4 flex gap-4 row-hover">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-honey/15 text-honey text-xs font-bold flex items-center justify-center tabular-nums mt-0.5">
                      {li.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-walnut text-[15px]">{li.item}</h3>
                      <p className="text-sm text-walnut-light leading-relaxed mt-1">{li.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Note */}
        <div className="mt-6 rounded-xl border border-sage/30 bg-sage/10 px-5 py-4 flex gap-3">
          <svg className="w-5 h-5 text-sage shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <div>
            <p className="text-sm text-walnut leading-relaxed"><span className="font-semibold">Coordination:</span> {scope.note}</p>
            <p className="text-xs text-walnut-light mt-2">
              High-level scope for discussion. Bidders supply their own labor &amp; materials and provide pricing.
            </p>
          </div>
        </div>

        {/* Quick switch to other scopes */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-walnut-light mb-3">Other scopes</p>
          <div className="flex flex-wrap gap-2">
            {SUB_SCOPES.filter(s => s.slug !== scope.slug).map(s => (
              <button
                key={s.slug}
                onClick={() => navigate(`/subs/${s.slug}`)}
                className="px-3 py-1.5 rounded-full border border-walnut/15 bg-white/40 text-walnut text-xs font-medium hover:border-honey/45 hover:bg-honey/10 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/subs/utility-loads')}
              className="px-3 py-1.5 rounded-full border border-sage/30 bg-sage/10 text-walnut text-xs font-medium hover:border-sage/55 hover:bg-sage/20 transition-colors cursor-pointer"
            >
              Utility Loads
            </button>
          </div>
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

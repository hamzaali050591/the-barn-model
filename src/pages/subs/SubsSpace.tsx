import { useNavigate } from 'react-router-dom';
import SubsNavBar from '../../components/SubsNavBar';
import { useReveal } from '../../utils/useReveal';

interface Plate {
  src: string;
  title: string;
  caption: string;
  alt: string;
}

const plates: Plate[] = [
  {
    src: '/subs/building-f-exterior.jpg',
    title: 'Building F — Exterior',
    caption:
      'The shell as delivered — Building F at Marcel Harvest Green. Our suite is the ~15,240 SF second floor: Cooperstown brick, slate-gray standing-seam metal, gable ends, and floor-to-ceiling storefront glazing on all four sides.',
    alt: 'Exterior photographs of Building F at Marcel Harvest Green',
  },
  {
    src: '/subs/building-f-shell-plan.jpg',
    title: 'Level 2 Shell Plan',
    caption:
      'The Level 2 shell as-delivered (Tenant Buildout NIC) with the landlord SF breakdown. The Barn — Richmond V1 occupies the left zone (~9,180 SF). The interior photos show the open shell: exposed wood trusses, perimeter glazing, slab floor.',
    alt: 'Building F Level 2 shell floor plan with square-footage breakdown and interior shell photos',
  },
  {
    src: '/renderings/15-birdseye-blueprint.jpg',
    title: 'The Barn — V1 Layout Plan (Left Zone)',
    caption:
      'Our buildout overlay on the left zone — 8 food stalls along the core wall under a shared 80-ft hood, 4 kiosks floating through the ~4,700 SF gathering hall, two ADA restrooms, outdoor terraces, and the MEP givens (gas upgrade to 35,000 CFH, plumbing stub, hood-exhaust TPO roof zone). ~9,180 SF total suite.',
    alt: 'Birds-eye blueprint of The Barn Richmond V1 left-zone layout plan',
  },
];

function PlateFrame({ p, idx }: { p: Plate; idx: number }) {
  return (
    <section className="reveal">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-xs text-honey font-semibold tabular-nums">
          {String(idx + 1).padStart(2, '0')}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-walnut">{p.title}</h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-walnut/10 shadow-lg shadow-walnut/10 bg-white">
        <img
          src={p.src}
          alt={p.alt}
          loading={idx < 1 ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      <p className="text-sm md:text-base text-walnut-light leading-relaxed mt-4 max-w-3xl">
        {p.caption}
      </p>
    </section>
  );
}

export default function SubsSpace() {
  const navigate = useNavigate();
  const revealRef = useReveal();

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <SubsNavBar current="/subs/space" />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate('/subs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-light hover:text-honey transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          All scopes
        </button>

        <div className="mb-10">
          <span className="chip mb-4">The Space</span>
          <h1 className="text-3xl md:text-4xl font-bold text-walnut">The Space</h1>
          <p className="flex items-center gap-2 text-honey font-semibold text-sm md:text-base mt-3">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            Building F, Level 2 · Marcel Harvest Green · 18806 W Airport Blvd, Richmond, TX 77406
          </p>
          <p className="text-walnut-light text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            The building, the shell we&rsquo;re building into, and our V1 layout plan — context for
            every trade scope. The Barn — Richmond occupies the left zone of Level 2.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap text-[10px]">
            <span className="px-2 py-0.5 rounded-full border border-honey/30 bg-honey/15 text-walnut font-semibold">~9,180 SF suite (V1 left zone)</span>
            <span className="px-2 py-0.5 rounded-full border border-sage/30 bg-sage/15 text-walnut font-semibold">Exposed wood trusses</span>
            <span className="px-2 py-0.5 rounded-full border border-terracotta/30 bg-terracotta/15 text-walnut font-semibold">Storefront glazing on all 4 sides</span>
          </div>
        </div>

        <div className="space-y-12 md:space-y-16">
          {plates.map((p, i) => <PlateFrame key={p.src} p={p} idx={i} />)}
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

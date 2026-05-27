import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

const renderings = [
  { src: '/renderings/01-hero.jpg', title: 'The Hall', caption: 'Warm wood, exposed trusses, and full-perimeter glass — the room your customers will want to come back to.' },
  { src: '/renderings/02-golden-hour.jpg', title: 'Golden Hour', caption: 'The light coming through the perimeter glazing late in the day. This is the room at its best.' },
  { src: '/renderings/04-external-bldg.jpg', title: 'Exterior', caption: 'Brick, standing-seam metal, and gable ends facing the Harlem Rd corner. Inherently barn-like, on purpose.' },
  { src: '/renderings/07-window-seating.jpg', title: 'Window Seating', caption: 'Bright, family-friendly, designed for lingering. The opposite of a food court.' },
  { src: '/renderings/10-vendor-line.jpg', title: 'Vendor Counters', caption: 'Stall fronts are designed for visibility — your brand reads from across the room.' },
  { src: '/renderings/15-birdseye-blueprint.jpg', title: 'Floor Plan — V1', caption: 'Path A: a single linear row of stalls along the core wall, gathering opens out to the windows.' },
];

export default function VendorVibe() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/vibe" />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="04 · The Mood"
          title="The Vibe"
          subtitle="Concept renderings of The Barn — Richmond. The look, the materials, and the feeling we're building for your customers to step into."
        />

        <div className="space-y-12 sm:space-y-16 md:space-y-24">
          {renderings.map((r, i) => (
            <figure key={r.src} className="reveal-scale group">
              <div className="flex items-center gap-3 mb-3 sm:mb-4 px-1">
                <span className="stage-track tabular-nums whitespace-nowrap">
                  {String(i + 1).padStart(2, '0')} / {String(renderings.length).padStart(2, '0')}
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-honey/40 to-transparent" />
              </div>

              <div className="rounded-2xl sm:rounded-3xl overflow-hidden img-zoom shadow-xl sm:shadow-2xl shadow-walnut/15 ring-1 ring-walnut/5 bg-walnut/5">
                <img
                  src={r.src}
                  alt={r.title}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="w-full block"
                />
              </div>

              <figcaption className="mt-4 sm:mt-5 px-1 md:px-2 max-w-3xl">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-walnut mb-1.5 sm:mb-2 display-title">
                  {r.title}
                </div>
                <div className="text-sm sm:text-base text-walnut-light leading-relaxed">{r.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-20 glass rounded-3xl p-7 md:p-9 text-center reveal-scale border border-honey/15">
          <div className="flex items-center justify-center gap-3 text-walnut/30 mb-4">
            <span className="block w-12 h-px bg-honey/30" />
            <span className="w-1.5 h-1.5 rotate-45 bg-honey/60" />
            <span className="block w-12 h-px bg-honey/30" />
          </div>
          <p className="text-walnut-light leading-relaxed max-w-2xl mx-auto">
            These are concept renderings — final finishes and signage will be confirmed in the construction
            documents phase. The intent shown here (materials, palette, scale) is locked.
          </p>
        </div>

        <PageFooter />
      </main>
    </div>
  );
}

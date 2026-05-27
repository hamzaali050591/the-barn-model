import { useEffect, useRef } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, meta }: PageHeroProps) {
  return (
    <header className="relative mb-10 md:mb-16 text-center pt-4 md:pt-10">
      <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none -z-0 overflow-hidden">
        <div
          aria-hidden
          className="w-56 h-56 md:w-72 md:h-72 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(196,154,108,0.35), transparent 70%)' }}
        />
      </div>

      <div className="fade-up relative">
        <span className="chip pulse-honey">{eyebrow}</span>
      </div>

      <h1 className="fade-up fade-up-d1 display-title text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl mt-4 md:mt-5 relative px-2">
        {title}
      </h1>

      {meta && (
        <div className="fade-up fade-up-d2 mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-honey font-semibold tracking-wide relative px-2 leading-relaxed">
          {meta}
        </div>
      )}

      {subtitle && (
        <p className="fade-up fade-up-d2 text-sm md:text-base text-walnut-light max-w-2xl mx-auto leading-relaxed mt-4 md:mt-6 relative px-2">
          {subtitle}
        </p>
      )}

      <div className="fade-up fade-up-d3 mt-6 md:mt-7 flex justify-center relative">
        <div className="flex items-center gap-2.5 text-walnut/30">
          <span className="block w-10 md:w-12 h-px bg-gradient-to-r from-transparent to-honey/40" />
          <span className="w-1.5 h-1.5 rotate-45 bg-honey/60" />
          <span className="block w-10 md:w-12 h-px bg-gradient-to-l from-transparent to-honey/40" />
        </div>
      </div>
    </header>
  );
}

interface SectionProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

export function Section({ eyebrow, title, lead, children }: SectionProps) {
  return (
    <section className="mb-12 md:mb-20">
      <div className="mb-5 md:mb-8 reveal">
        {eyebrow && (
          <div className="stage-track mb-2 text-[10px] md:text-xs">{eyebrow}</div>
        )}
        <h2 className="display-title text-xl sm:text-2xl md:text-3xl flex items-baseline gap-3">
          <span className="block h-[3px] w-6 md:w-7 bg-honey rounded-full translate-y-[-5px] md:translate-y-[-6px] flex-shrink-0" aria-hidden />
          <span>{title}</span>
        </h2>
        {lead && (
          <p className="text-sm md:text-base text-walnut-light leading-relaxed mt-3 max-w-3xl">
            {lead}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

interface LiftCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
}

export function LiftCard({ children, className = '', as: As = 'div' }: LiftCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <As
      ref={ref as React.RefObject<HTMLDivElement> & React.RefObject<HTMLElement>}
      className={`glass lift-card ${className}`}
    >
      {children}
    </As>
  );
}

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return (
    <div className={`divider-mark ${className}`} aria-hidden>
      <div className="diamond" />
    </div>
  );
}

export function PageFooter() {
  return (
    <footer className="border-t border-walnut/10 mt-16 md:mt-24 py-8 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-3 text-walnut/30">
          <span className="block w-8 h-px bg-honey/30" />
          <span className="text-base font-bold tracking-tight text-walnut">The Barn</span>
          <span className="block w-8 h-px bg-honey/30" />
        </div>
        <p className="text-xs text-walnut-light/70">
          Everybody&rsquo;s Welcome &middot; Richmond, TX &middot; Opening 2026
        </p>
      </div>
    </footer>
  );
}

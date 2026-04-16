import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveals = el.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    // Start observing
    reveals.forEach((r) => observer.observe(r));

    // After a micro-task, add reveal-ready (this enables the opacity:0 CSS).
    // Elements already in viewport will get 'visible' from the observer's
    // initial callback before the CSS transition kicks in, so they appear
    // instantly. Elements below the fold will fade in on scroll.
    requestAnimationFrame(() => {
      el.classList.add('reveal-ready');

      // Safety net: after 1.5s, force-reveal anything still invisible
      // (handles edge cases where observer didn't fire)
      setTimeout(() => {
        reveals.forEach((r) => r.classList.add('visible'));
      }, 1500);
    });

    return () => {
      observer.disconnect();
      el.classList.remove('reveal-ready');
    };
  }, []);

  return ref;
}

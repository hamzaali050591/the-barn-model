import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const selector = '.reveal, .reveal-l, .reveal-r, .reveal-scale, .stagger-on-view';
    const reveals = el.querySelectorAll(selector);
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((r) => observer.observe(r));

    requestAnimationFrame(() => {
      el.classList.add('reveal-ready');

      setTimeout(() => {
        reveals.forEach((r) => r.classList.add('visible'));
      }, 1800);
    });

    return () => {
      observer.disconnect();
      el.classList.remove('reveal-ready');
    };
  }, []);

  return ref;
}

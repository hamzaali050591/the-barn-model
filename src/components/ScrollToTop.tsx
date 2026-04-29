import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Restore scroll position to top on every route change. React Router preserves
// scroll position by default, which causes the "I came back to a page and
// it's scrolled where I left it" behavior. This makes navigation feel like
// a fresh page load on every click.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

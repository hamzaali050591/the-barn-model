import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  current: string;
}

const links = [
  { path: '/strategy', label: 'The Vision' },
  { path: '/renderings', label: 'The Vibe' },
  { path: '/layout', label: 'The Layout' },
  { path: '/capex', label: 'CapEx' },
  { path: '/opex', label: 'OpEx' },
  { path: '/model', label: 'The Numbers' },
];

export default function NavBar({ current }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="nav-glass text-cream sticky top-0 z-50 border-b border-cream/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => go('/')}
          className="text-xl font-bold tracking-tight hover:text-honey transition-all duration-300 cursor-pointer hover:scale-105"
        >
          The Barn
        </button>

        {/* Desktop nav (md+) */}
        <nav className="hidden md:flex gap-1">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                current === link.path
                  ? 'bg-cream/15 text-honey shadow-sm shadow-honey/10'
                  : 'text-cream/70 hover:text-cream hover:bg-cream/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-cream hover:bg-cream/10 transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[57px] bg-walnut/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav className="md:hidden absolute left-0 right-0 top-full nav-glass border-b border-cream/10 z-50 px-4 py-3 flex flex-col gap-1">
            {links.map(link => (
              <button
                key={link.path}
                onClick={() => go(link.path)}
                className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer ${
                  current === link.path
                    ? 'bg-cream/15 text-honey shadow-sm shadow-honey/10'
                    : 'text-cream/80 hover:text-cream hover:bg-cream/10 active:bg-cream/15'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}

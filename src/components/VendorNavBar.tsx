import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  current: string;
}

const links = [
  { path: '/vendors/about', label: 'The Barn' },
  { path: '/vendors/richmond', label: 'Richmond' },
  { path: '/vendors/curation', label: 'Who Belongs' },
  { path: '/vendors/vibe', label: 'The Vibe' },
  { path: '/vendors/stall', label: 'Your Stall' },
  { path: '/vendors/terms', label: 'Lease Overview' },
  { path: '/vendors/apply', label: 'Apply' },
];

export default function VendorNavBar({ current }: Props) {
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
          onClick={() => go('/vendors')}
          className="text-xl font-bold tracking-tight hover:text-honey transition-all duration-300 cursor-pointer hover:scale-105"
        >
          The Barn <span className="text-honey/80 text-sm font-medium">· Vendors</span>
        </button>

        <nav className="hidden md:flex gap-0.5">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`group relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                current === link.path
                  ? 'text-honey'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                current === link.path
                  ? 'bg-cream/12'
                  : 'bg-transparent group-hover:bg-cream/8'
              }`} />
              <span className="relative">{link.label}</span>
              <span className={`absolute left-3 right-3 bottom-1 h-px transition-all duration-300 ${
                current === link.path
                  ? 'bg-honey/70 scale-x-100'
                  : 'bg-honey/0 scale-x-0 group-hover:bg-honey/40 group-hover:scale-x-100'
              }`} />
            </button>
          ))}
        </nav>

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

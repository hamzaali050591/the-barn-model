import { useNavigate } from 'react-router-dom';

interface Props {
  current: string;
}

const links = [
  { path: '/strategy', label: 'Strategy' },
  { path: '/model', label: 'Financial Model' },
  { path: '/layout', label: 'Space Layout' },
  { path: '/capex', label: 'CapEx' },
  { path: '/opex', label: 'OpEx' },
];

export default function NavBar({ current }: Props) {
  const navigate = useNavigate();

  return (
    <header className="nav-glass text-cream sticky top-0 z-50 border-b border-cream/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold tracking-tight hover:text-honey transition-all duration-300 cursor-pointer hover:scale-105"
        >
          The Barn
        </button>
        <nav className="flex gap-1">
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
      </div>
    </header>
  );
}

import { useNavigate } from 'react-router-dom';

interface Props {
  current: string;
}

const links = [
  { path: '/strategy', label: 'Strategy' },
  { path: '/model', label: 'Financial Model' },
  { path: '/layout', label: 'Space Layout' },
];

export default function NavBar({ current }: Props) {
  const navigate = useNavigate();

  return (
    <header className="bg-walnut text-cream sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold tracking-tight hover:text-honey transition-colors cursor-pointer"
        >
          The Barn
        </button>
        <nav className="flex gap-1">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                current === link.path
                  ? 'bg-cream/15 text-honey'
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

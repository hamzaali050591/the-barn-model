import { useNavigate } from 'react-router-dom';

const navButtons = [
  {
    label: 'Strategy',
    subtitle: 'The Vision & Plan',
    path: '/strategy',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    label: 'Financial Model',
    subtitle: 'Interactive Returns',
    path: '/model',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: 'Space Layout',
    subtitle: 'Floor Plan & Specs',
    path: '/layout',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
      </svg>
    ),
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-walnut flex flex-col">
      {/* Hero section with feature wall image */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/feature-wall.jpg"
            alt="The Barn — Everybody's Welcome"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-walnut/40 via-walnut/50 to-walnut/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Navigation buttons */}
          <div className="fade-up fade-up-d2 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {navButtons.map((btn) => (
              <button
                key={btn.path}
                onClick={() => navigate(btn.path)}
                className="group w-full sm:w-56 glass-dark rounded-2xl px-6 py-5 text-cream cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-honey group-hover:scale-110 transition-transform duration-300 float-anim">
                    {btn.icon}
                  </div>
                  <span className="text-base font-semibold">{btn.label}</span>
                  <span className="text-xs text-cream/50">{btn.subtitle}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tagline now below buttons */}
          <p className="fade-up fade-up-d3 text-sm md:text-base text-cream/70 max-w-lg mx-auto mt-10">
            A curated, tech-enabled food hall designed to be the community gathering place
            for Richmond and Fort Bend County.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 nav-glass py-4 text-center border-t border-cream/10">
        <p className="text-cream/40 text-xs">
          The Barn &mdash; Everybody&rsquo;s Welcome &middot; Richmond, TX
        </p>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

const navButtons = [
  {
    label: 'The Barn',
    subtitle: 'Concept & Brand',
    path: '/vendors/about',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 12 3l9.75 9M4.5 9.75v9.75a.75.75 0 0 0 .75.75H9.75v-6h4.5v6h4.5a.75.75 0 0 0 .75-.75V9.75M8.25 21h7.5" />
      </svg>
    ),
  },
  {
    label: 'Richmond',
    subtitle: 'The Site & Market',
    path: '/vendors/richmond',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    label: 'Who Belongs',
    subtitle: 'Curation Philosophy',
    path: '/vendors/curation',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    label: 'The Vibe',
    subtitle: 'See the Space',
    path: '/vendors/vibe',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
  {
    label: 'Your Stall',
    subtitle: "What's Included",
    path: '/vendors/stall',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.19a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    ),
  },
  {
    label: 'Lease Overview',
    subtitle: 'Rent & Terms',
    path: '/vendors/terms',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    label: 'Apply',
    subtitle: 'Get in Touch',
    path: '/vendors/apply',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function VendorLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100svh] bg-walnut flex flex-col overflow-hidden">
      <div className="relative flex-1 flex flex-col items-center justify-end px-4 pb-8 sm:pb-12 md:pb-16 pt-16 sm:pt-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/feature-wall.jpg"
            alt="The Barn — Everybody's Welcome"
            className="w-full h-full object-cover ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-walnut/30 via-walnut/10 to-walnut/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-walnut/40 via-transparent to-transparent" />
        </div>

        <div className="flex-1" />

        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          <div className="fade-up mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-honey/15 text-honey text-[10px] sm:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.18em] uppercase border border-honey/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-honey pulse-honey" />
              For Prospective Vendors
            </span>
          </div>

          <div className="fade-up fade-up-d2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
            {navButtons.map((btn, i) => (
              <button
                key={btn.path}
                onClick={() => navigate(btn.path)}
                className="group glass-dark rounded-xl sm:rounded-2xl px-3 py-4 sm:px-4 sm:py-5 text-cream cursor-pointer relative overflow-hidden active:scale-[0.97] transition-transform"
                style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-honey/0 to-honey/0 group-hover:from-honey/10 group-hover:to-terracotta/10 transition-all duration-500" />
                <div className="relative flex flex-col items-center gap-2 sm:gap-2.5">
                  <div className="text-honey group-hover:scale-110 group-hover:rotate-[-4deg] transition-transform duration-500 float-anim">
                    {btn.icon}
                  </div>
                  <span className="text-[13px] sm:text-sm md:text-base font-semibold leading-tight">{btn.label}</span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-cream/50 leading-tight">{btn.subtitle}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-honey/0 to-transparent group-hover:via-honey/80 transition-all duration-500" />
              </button>
            ))}
          </div>

          <div className="fade-up fade-up-d4 mt-8 sm:mt-10 flex items-center justify-center gap-3 text-cream/40">
            <span className="block w-8 sm:w-12 h-px bg-cream/20" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.25em] uppercase font-semibold">Scroll · Explore · Apply</span>
            <span className="block w-8 sm:w-12 h-px bg-cream/20" />
          </div>
        </div>
      </div>

      <div className="relative z-10 nav-glass py-3 sm:py-4 text-center border-t border-cream/10 px-4">
        <p className="text-cream/40 text-[11px] sm:text-xs tracking-wide">
          The Barn &mdash; Everybody&rsquo;s Welcome &middot; Richmond, TX &middot; Opening 2026
        </p>
      </div>
    </div>
  );
}

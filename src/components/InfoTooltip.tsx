import { useState } from 'react';

interface Props {
  content: string;
  align?: 'left' | 'right' | 'center';
  size?: 'sm' | 'md';
}

export default function InfoTooltip({ content, align = 'center', size = 'sm' }: Props) {
  const [open, setOpen] = useState(false);

  const alignClass =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <span
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center text-walnut-light/70 hover:text-honey cursor-help transition-colors"
        onClick={e => e.preventDefault()}
        aria-label="More info"
      >
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
      {open && (
        <span
          role="tooltip"
          className={`absolute z-50 top-full mt-1.5 ${alignClass} w-64 rounded-lg bg-walnut text-cream text-[11px] leading-snug font-normal px-3 py-2 shadow-lg shadow-walnut/30 pointer-events-none`}
        >
          {content}
        </span>
      )}
    </span>
  );
}

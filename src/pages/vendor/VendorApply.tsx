import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, Section, LiftCard, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

const whatToSend = [
  { k: 'Concept name + category', v: 'What you make, in one sentence.' },
  { k: 'Your story', v: "Who you are, where you're operating today, and what brought you to this concept." },
  { k: 'Menu or sample menu', v: 'PDF, link, photos, whatever you have.' },
  { k: 'Operating history', v: "Food truck, ghost kitchen, restaurant, catering, pop-ups. Anywhere you've run service." },
  { k: 'Instagram / website', v: 'So we can see your brand in the wild.' },
  { k: 'Equipment list', v: 'A rough list of the cooking and refrigeration equipment your concept needs, so we can plan your stall buildout.' },
];

const timeline = [
  { t: 'Week 1', d: "We read your submission. If it looks like a fit, we'll reach out to schedule a tasting and walk-through." },
  { t: 'Week 2–3', d: 'Tasting, hall walkthrough, and a real conversation about whether this is right for both of us.' },
  { t: 'Week 4', d: 'Term sheet — plain English, no surprises.' },
  { t: 'Weeks 5–7', d: 'Lease drafting, equipment planning, and stall buildout coordination.' },
];

export default function VendorApply() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/apply" />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="07 · The Step"
          title="Apply"
          subtitle="Tell us about your concept. If it looks like a fit, we'll reach out within a week to set up a tasting and a conversation."
        />

        <Section eyebrow="The Brief" title="What to send.">
          <LiftCard className="rounded-3xl p-7 md:p-8">
            <ul className="space-y-4 stagger-on-view">
              {whatToSend.map((item) => (
                <li key={item.k} className="flex items-start gap-4">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-honey flex-shrink-0 ring-2 ring-honey/20" />
                  <div className="text-sm leading-relaxed">
                    <span className="font-bold text-walnut block mb-0.5">{item.k}</span>
                    <span className="text-walnut-light">{item.v}</span>
                  </div>
                </li>
              ))}
            </ul>
          </LiftCard>
        </Section>

        <Section eyebrow="The Inbox" title="Get in touch.">
          <LiftCard className="rounded-3xl p-6 sm:p-8 md:p-10 text-center relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(196,154,108,0.4), transparent 70%)' }}
            />
            <div className="relative">
              <p className="text-sm md:text-base text-walnut-light leading-relaxed mb-6 sm:mb-7 max-w-md mx-auto">
                Send your info directly to the operator. We read every email.
              </p>
              <a
                href="mailto:vendors@thebarn.example?subject=Vendor%20Application%20%E2%80%94%20The%20Barn%20Richmond"
                className="btn-primary w-full sm:w-auto max-w-full"
                style={{ minHeight: '52px' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="truncate">vendors@thebarn.example</span>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <p className="text-xs text-walnut-light/70 mt-6 sm:mt-7 italic px-2">
                Replace this address with your real intake email — or swap the button for a Typeform / Tally / Formspree embed.
              </p>
            </div>
          </LiftCard>
        </Section>

        <Section eyebrow="The Timeline" title="What happens next.">
          <ol className="space-y-3">
            {timeline.map((s, i) => (
              <li key={s.t} className="reveal-l">
                <LiftCard className="rounded-2xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="px-2.5 sm:px-3 h-11 sm:h-12 min-w-[3rem] sm:min-w-[3.5rem] rounded-xl bg-gradient-to-br from-honey to-terracotta text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg shadow-honey/30 whitespace-nowrap">
                        {s.t}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="absolute top-11 sm:top-12 left-1/2 -translate-x-1/2 w-px h-5 sm:h-6 bg-gradient-to-b from-honey/60 to-transparent" />
                      )}
                    </div>
                    <div className="pt-1.5 sm:pt-2 text-sm text-walnut-light leading-relaxed">
                      {s.d}
                    </div>
                  </div>
                </LiftCard>
              </li>
            ))}
          </ol>
        </Section>

        <PageFooter />
      </main>
    </div>
  );
}

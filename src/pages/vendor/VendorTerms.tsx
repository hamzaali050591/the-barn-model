import VendorNavBar from '../../components/VendorNavBar';
import { PageHero, Section, LiftCard, PageFooter } from '../../components/VendorPage';
import { useReveal } from '../../utils/useReveal';

const leaseTerms = [
  { k: 'Initial Term', v: '3 years' },
  { k: 'Renewal Options', v: '2 × 2-year renewals' },
  { k: 'Deposit', v: "First month's rent + 1 month's rent as security deposit" },
  { k: 'Operating Hours', v: 'Hall hours: 11am – 10pm, 7 days' },
  { k: 'Exclusivity', v: 'Category exclusivity within the hall' },
  { k: 'Utilities', v: 'Included in rent — electric, water, gas' },
  { k: 'CAM / NNN', v: 'Included in rent — no pass-through' },
  { k: 'Property Tax', v: 'Included in rent' },
];

const firstNinety = [
  { t: 'Initial Meeting', d: 'We walk you through the hall, the concept, and confirm fit. You walk us through your concept, menu, and operating history.' },
  { t: 'Term Sheet', d: 'A short, plain-English term sheet covering rent, lease length, and any concept-specific items.' },
  { t: 'Lease Signing', d: 'Standard commercial lease. We aim for negotiations to close in 2–3 weeks.' },
  { t: 'Equipment & Design', d: "You finalize your equipment list and stall branding. We coordinate with the GC so your stall is plumbed and powered for your exact spec." },
  { t: 'Soft Open', d: 'Two weeks of staff training and friends-and-family service before the hall opens to the public.' },
];

export default function VendorTerms() {
  const revealRef = useReveal();
  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <VendorNavBar current="/vendors/terms" />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <PageHero
          eyebrow="06 · The Deal"
          title="Lease Overview"
          subtitle="A single all-in monthly rent, a clear deposit structure, and no hidden pass-throughs."
        />

        <Section eyebrow="The Rent" title="Base rent — all in.">
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            A single flat monthly rent. Inclusive of electric, water, gas, all shared-area utilities,
            property tax, and CAM/NNN pass-throughs. No surprise add-ons.
          </p>
          <div className="grid md:grid-cols-2 gap-4 md:gap-5 stagger-on-view">
            <LiftCard className="rounded-3xl p-6 sm:p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-honey/15 text-honey flex items-center justify-center text-2xl shadow-inner shadow-honey/10 flex-shrink-0">🍳</div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-honey font-bold mb-0.5">Hot Cooking Stalls</div>
                  <h3 className="font-bold text-walnut text-base">Food Vendors</h3>
                </div>
              </div>
              <p className="text-sm text-walnut-light leading-relaxed mb-5 flex-1">
                Full cooking stalls with hood, fire suppression, gas, and full plumbing infrastructure.
              </p>
              <div className="border-t border-walnut/10 pt-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-walnut tabular-nums">
                  $6,500 <span className="text-walnut-light/60 font-medium text-lg sm:text-xl">–</span> $7,000
                </div>
                <div className="text-[11px] sm:text-xs text-walnut-light mt-1 uppercase tracking-wider font-semibold">per month, all-in</div>
              </div>
            </LiftCard>

            <LiftCard className="rounded-3xl p-6 sm:p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sage/15 text-sage flex items-center justify-center text-2xl shadow-inner shadow-sage/10 flex-shrink-0">☕</div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-sage font-bold mb-0.5">Non-Cooking Concepts</div>
                  <h3 className="font-bold text-walnut text-base">Dessert & Specialty Drinks</h3>
                </div>
              </div>
              <p className="text-sm text-walnut-light leading-relaxed mb-5 flex-1">
                Coffee, ice cream, baked goods, juice, and other non-cooking concepts. Electrical and
                water only — no gas, hood, or fire suppression required.
              </p>
              <div className="border-t border-walnut/10 pt-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-walnut tabular-nums">
                  $5,000 <span className="text-walnut-light/60 font-medium text-lg sm:text-xl">–</span> $5,500
                </div>
                <div className="text-[11px] sm:text-xs text-walnut-light mt-1 uppercase tracking-wider font-semibold">per month, all-in</div>
              </div>
            </LiftCard>
          </div>
          <p className="text-xs text-walnut-light/70 mt-5 text-center italic">
            Ranges above are starting points for conversation, not posted prices. Final rent is concept-by-concept.
          </p>
        </Section>

        <Section eyebrow="The Terms" title="Lease at a glance.">
          <LiftCard className="rounded-3xl p-7 md:p-9">
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 stagger-on-view">
              {leaseTerms.map((row) => (
                <div key={row.k} className="flex flex-col">
                  <div className="text-[10px] font-bold text-honey uppercase tracking-[0.18em] mb-1">{row.k}</div>
                  <div className="text-base text-walnut font-semibold leading-snug">{row.v}</div>
                </div>
              ))}
            </div>
          </LiftCard>
        </Section>

        <Section eyebrow="The Math" title="What you pay for.">
          <p className="text-walnut-light leading-relaxed mb-7 max-w-3xl reveal">
            The full list of what a vendor actually needs to bring cash for. Most of it is recoverable —
            either applied to rent, returned at lease end, or yours to keep.
          </p>

          <div className="space-y-5 stagger-on-view">
            <LiftCard className="rounded-3xl p-6 sm:p-7 md:p-8">
              <div className="mb-5">
                <div className="text-[10px] font-bold text-honey uppercase tracking-[0.18em] mb-1">Due Before Opening</div>
                <h3 className="font-bold text-walnut text-xl sm:text-2xl mb-3">Deposit at Signing</h3>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-walnut tabular-nums">
                  $10,000 <span className="text-walnut-light/60 font-medium text-lg sm:text-xl">–</span> $14,000
                </div>
              </div>

              <div className="space-y-4 mt-5 pt-5 border-t border-walnut/10">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 rounded-lg bg-honey/15 text-honey flex items-center justify-center text-base font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-sm text-walnut-light leading-relaxed min-w-0">
                    <div className="font-bold text-walnut mb-0.5">First month's rent</div>
                    $5,000–$7,000 depending on stall type. <span className="text-honey font-semibold">Applied directly</span> to
                    your first month of operations.
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 rounded-lg bg-sage/15 text-sage flex items-center justify-center text-base font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-sm text-walnut-light leading-relaxed min-w-0">
                    <div className="font-bold text-walnut mb-0.5">Security deposit</div>
                    Equivalent to one month's rent. <span className="text-sage font-semibold">Fully refundable</span> at lease end,
                    assuming the stall is returned in good condition.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-walnut/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-sage uppercase tracking-[0.18em] mb-1">Kiosks</div>
                  <div className="text-lg sm:text-xl md:text-2xl text-walnut font-bold tabular-nums">$10,000 – $11,000</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-honey uppercase tracking-[0.18em] mb-1">Food Vendors</div>
                  <div className="text-lg sm:text-xl md:text-2xl text-walnut font-bold tabular-nums">$13,000 – $14,000</div>
                </div>
              </div>
            </LiftCard>

            <LiftCard className="rounded-3xl p-6 sm:p-7 md:p-8">
              <div className="mb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                  <div className="text-[10px] font-bold text-walnut/50 uppercase tracking-[0.18em]">Cooking, refrigeration, smallwares</div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-sage/15 text-sage font-bold border border-sage/30 whitespace-nowrap">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Yours to Keep
                  </span>
                </div>
                <h3 className="font-bold text-walnut text-xl sm:text-2xl">Equipment</h3>
              </div>
              <p className="text-sm text-walnut-light leading-relaxed">
                Everything you'd buy for any restaurant — your cookline, your refrigeration, your POS, your
                smallwares. <span className="font-bold text-walnut">If you ever leave, you take it all with you.</span> The
                Barn supplies the heavy infrastructure (hood, suppression, plumbing, electrical); your equipment is yours.
              </p>
            </LiftCard>

            <LiftCard className="rounded-3xl p-6 sm:p-7 md:p-8">
              <div className="mb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                  <div className="text-[10px] font-bold text-walnut/50 uppercase tracking-[0.18em]">Your concept's identity</div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-sage/15 text-sage font-bold border border-sage/30 whitespace-nowrap">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Yours to Keep
                  </span>
                </div>
                <h3 className="font-bold text-walnut text-xl sm:text-2xl">Signage & Stall Branding</h3>
              </div>
              <p className="text-sm text-walnut-light leading-relaxed">
                The lit signage, menu boards, and any concept-specific decor on your stall front. Designed
                and paid for by you so it perfectly matches your brand.
                <span className="font-bold text-walnut"> Yours to take with you if you ever move on.</span>
              </p>
            </LiftCard>
          </div>
        </Section>

        <Section eyebrow="What Happens" title="The first 90 days.">
          <ol className="space-y-3">
            {firstNinety.map((s, i) => (
              <li key={s.t} className="reveal-l">
                <LiftCard className="rounded-2xl p-5 md:p-6">
                  <div className="flex items-start gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-honey to-terracotta text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-honey/30">
                        {i + 1}
                      </div>
                      {i < firstNinety.length - 1 && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-honey/60 to-transparent" />
                      )}
                    </div>
                    <div className="pt-1">
                      <div className="font-bold text-walnut text-base mb-1">{s.t}</div>
                      <div className="text-sm text-walnut-light leading-relaxed">{s.d}</div>
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

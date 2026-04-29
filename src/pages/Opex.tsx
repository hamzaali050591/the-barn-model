import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useModel } from '../utils/ModelContext';
import { gasMonthly, electricMonthly, waterMonthly, nonUtilityBreakdown, vendorTotals, opexBreakdown } from '../utils/engine';
import { fmtDollarFull } from '../utils/format';
import { useReveal } from '../utils/useReveal';

type Tone = 'honey' | 'sage' | 'terracotta' | 'walnut';

const toneStyles: Record<Tone, { dot: string; chip: string }> = {
  honey: { dot: 'bg-honey', chip: 'bg-honey/15 text-walnut border-honey/30' },
  sage: { dot: 'bg-sage', chip: 'bg-sage/15 text-walnut border-sage/30' },
  terracotta: { dot: 'bg-terracotta', chip: 'bg-terracotta/15 text-walnut border-terracotta/30' },
  walnut: { dot: 'bg-walnut/40', chip: 'bg-walnut/10 text-walnut border-walnut/20' },
};

interface DisplayLine {
  name: string;
  monthly: number;
  detail?: string;
}
interface SubBlock {
  key: string;
  title: string;
  description?: string;
  lines: DisplayLine[];
  subtotal: number;
}
interface Block {
  num: string;
  title: string;
  description: string;
  subtotal: number;
  tone: Tone;
  detailRoute: string;
  lines?: DisplayLine[];
  subblocks?: SubBlock[];
  footnote?: string;
}

function LineRow({ line }: { line: DisplayLine }) {
  const [open, setOpen] = useState(false);
  const expandable = !!line.detail;
  return (
    <div className="border-b border-walnut/5 last:border-b-0">
      <button
        onClick={() => expandable && setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${expandable ? 'hover:bg-honey/5 cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-xs text-walnut min-w-0 truncate">{line.name}</span>
        {expandable && (
          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-honey/20 text-honey transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} aria-hidden>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        )}
        <span className="ml-auto text-xs font-bold text-walnut tabular-nums shrink-0">{fmtDollarFull(line.monthly)}<span className="text-[10px] font-normal text-walnut-light">/mo</span></span>
      </button>
      {expandable && open && (
        <div className="px-3 pb-3 -mt-1">
          <p className="text-[11px] text-walnut-light leading-relaxed pl-1">{line.detail}</p>
        </div>
      )}
    </div>
  );
}

function SubBlockCard({ sub, tone }: { sub: SubBlock; tone: Tone }) {
  const [open, setOpen] = useState(false);
  const ts = toneStyles[tone];
  return (
    <div className="bg-white/40 rounded-lg border border-walnut/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer hover:bg-honey/5 transition-colors rounded-lg"
      >
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${ts.chip} shrink-0`}>{sub.key}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-walnut text-xs flex items-center gap-2">
            <span className="truncate">{sub.title}</span>
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-honey/20 text-honey transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} aria-hidden>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          {sub.description && <div className="text-[11px] text-walnut-light mt-0.5 hidden md:block">{sub.description}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-walnut text-sm tabular-nums">{fmtDollarFull(sub.subtotal)}<span className="text-[10px] font-normal text-walnut-light">/mo</span></div>
          <div className="text-[10px] text-walnut-light tabular-nums">{fmtDollarFull(sub.subtotal * 12)}/yr</div>
        </div>
      </button>
      {open && (
        <div className="border-t border-walnut/5">
          {sub.description && <p className="text-[11px] text-walnut-light leading-relaxed px-4 pt-2 md:hidden">{sub.description}</p>}
          {sub.lines.map((line, i) => <LineRow key={i} line={line} />)}
        </div>
      )}
    </div>
  );
}

function BlockCard({ block }: { block: Block }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ts = toneStyles[block.tone];

  return (
    <div className={`glass rounded-2xl transition-all ${open ? '!shadow-lg !shadow-honey/10' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <span className={`w-9 h-9 rounded-lg ${ts.dot} text-cream font-bold flex items-center justify-center text-sm shrink-0`}>
          {block.num}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-walnut text-sm flex items-center gap-2">
            <span className="truncate">{block.title}</span>
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-honey/25 text-honey transition-transform shrink-0 ring-1 ring-honey/30 ${open ? 'rotate-180' : ''}`} aria-hidden>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          <div className="text-xs text-walnut-light mt-0.5 hidden md:block">{block.description}</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); navigate(block.detailRoute); }}
          className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-honey hover:text-terracotta bg-honey/10 hover:bg-honey/20 px-2 py-1 rounded-md border border-honey/20 hover:border-honey/40 transition-all cursor-pointer mr-2 shrink-0"
        >
          Edit Details
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <div className="text-right shrink-0">
          <div className="font-bold text-walnut tabular-nums">{fmtDollarFull(block.subtotal)}<span className="text-xs font-normal text-walnut-light">/mo</span></div>
          <div className="text-[10px] text-walnut-light tabular-nums">{fmtDollarFull(block.subtotal * 12)}/yr</div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-walnut/5">
          <p className="text-xs text-walnut-light leading-relaxed mt-3 mb-3 md:hidden">{block.description}</p>
          <div className="sm:hidden mb-3">
            <button
              onClick={() => navigate(block.detailRoute)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-honey bg-honey/10 px-2 py-1 rounded-md border border-honey/20 cursor-pointer"
            >
              Edit Details &rarr;
            </button>
          </div>

          {block.lines && (
            <div className="bg-white/40 rounded-lg overflow-hidden">
              {block.lines.map((line, i) => <LineRow key={i} line={line} />)}
            </div>
          )}

          {block.subblocks && (
            <div className="space-y-2">
              {block.subblocks.map(sb => <SubBlockCard key={sb.key} sub={sb} tone={block.tone} />)}
            </div>
          )}

          {block.footnote && (
            <p className="text-[10px] text-walnut-light italic mt-3 leading-relaxed">{block.footnote}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Opex() {
  const { inputs } = useModel();
  const revealRef = useReveal();

  const { numFoodVendors, numNonFoodVendors } = vendorTotals(inputs);
  const gas = gasMonthly(inputs.gas);
  const electric = electricMonthly(inputs.electric);
  const water = waterMonthly(inputs.water);
  const nu = nonUtilityBreakdown(inputs.nonUtility);
  const bd = opexBreakdown(inputs);

  const monthlySalary = inputs.salaryBase / 12;
  const totalMonthlyExpenses = bd.total + monthlySalary;

  // Vendor utilities sub-breakdown
  const foodGasTotal = numFoodVendors * gas.foodVendor;
  const foodElecTotal = numFoodVendors * electric.foodVendor;
  const foodWaterTotal = numFoodVendors * water.foodVendor;
  const nonFoodElecTotal = numNonFoodVendors * electric.nonFoodVendor;
  const nonFoodWaterTotal = numNonFoodVendors * water.nonFoodVendor;

  const vendorUtilSubblocks: SubBlock[] = inputs.rentIncludesUtilities ? [
    {
      key: 'gas',
      title: 'Gas',
      description: `Food vendors only (${numFoodVendors} stalls). Therm-based usage: ${gas.monthlyTherms.toFixed(1)} therms/mo per food vendor at $${gas.rate.toFixed(2)}/therm (${inputs.gas.scenario}).`,
      lines: [
        { name: `Food Vendors (${numFoodVendors} × ${fmtDollarFull(gas.foodVendor)}/mo)`, monthly: foodGasTotal, detail: 'Per-vendor cost: BTU/hr × duty cycle × hours/day × days/month ÷ 100,000 BTU/therm × rate.' },
        { name: `Non-Food Vendors (${numNonFoodVendors} × $0/mo)`, monthly: 0, detail: 'Kiosks have no gas service per SOW Cat 2e — electrical + water only.' },
      ],
      subtotal: foodGasTotal,
    },
    {
      key: 'electric',
      title: 'Electric',
      description: `Per-vendor base load (refrigeration, lighting, POS) + food add-ons (warmers, heat lamps, rice cooker). Rate: $${electric.rate.toFixed(3)}/kWh (${inputs.electric.scenario}).`,
      lines: [
        { name: `Food Vendors (${numFoodVendors} × ${fmtDollarFull(electric.foodVendor)}/mo)`, monthly: foodElecTotal, detail: `Per food vendor: ${electric.foodVendorKwh.toFixed(1)} kWh/mo (${electric.baseKwh.toFixed(0)} base + ${electric.foodAddKwh.toFixed(0)} food add-ons).` },
        { name: `Non-Food Vendors (${numNonFoodVendors} × ${fmtDollarFull(electric.nonFoodVendor)}/mo)`, monthly: nonFoodElecTotal, detail: `Per non-food vendor: ${electric.nonFoodVendorKwh.toFixed(1)} kWh/mo (base load only — no food add-ons).` },
      ],
      subtotal: foodElecTotal + nonFoodElecTotal,
    },
    {
      key: 'water',
      title: 'Water / Sewer',
      description: `Per-vendor gallons-per-day at $${water.rate.toFixed(2)}/CCF (${inputs.water.scenario}). Sewer charged at 100% of metered water.`,
      lines: [
        { name: `Food Vendors (${numFoodVendors} × ${fmtDollarFull(water.foodVendor)}/mo)`, monthly: foodWaterTotal, detail: `${inputs.water.foodGalPerDay} gal/day × ${inputs.water.daysPerMonth} days = ${(inputs.water.foodGalPerDay * inputs.water.daysPerMonth).toLocaleString()} gal/mo (${water.foodCCF.toFixed(2)} CCF) per food vendor.` },
        { name: `Non-Food Vendors (${numNonFoodVendors} × ${fmtDollarFull(water.nonFoodVendor)}/mo)`, monthly: nonFoodWaterTotal, detail: `${inputs.water.nonFoodGalPerDay} gal/day × ${inputs.water.daysPerMonth} days = ${(inputs.water.nonFoodGalPerDay * inputs.water.daysPerMonth).toLocaleString()} gal/mo (${water.nonFoodCCF.toFixed(2)} CCF) per non-food vendor.` },
      ],
      subtotal: foodWaterTotal + nonFoodWaterTotal,
    },
  ] : [];

  const commonSubblocks: SubBlock[] = [
    {
      key: 'gas-common',
      title: 'Common Area Gas',
      description: `Building-level gas: water heater (year-round) + space heating (annualized). Rate: $${gas.rate.toFixed(2)}/therm (${inputs.gas.scenario}). Total: ${gas.commonTherms} therms/mo.`,
      lines: inputs.gas.commonArea.map(l => ({
        name: l.name,
        monthly: l.monthlyTherms * gas.rate,
        detail: `${l.monthlyTherms} therms/mo × $${gas.rate.toFixed(2)}/therm.`,
      })),
      subtotal: gas.common,
    },
    {
      key: 'elec',
      title: 'Common Area Electric',
      description: `HVAC, lighting, security, etc. — paid by The Barn. Rate: $${electric.rate.toFixed(3)}/kWh (${inputs.electric.scenario}). Total: ${electric.commonKwh.toFixed(0)} kWh/mo.`,
      lines: inputs.electric.commonArea.map(l => ({
        name: l.name,
        monthly: l.kw * l.duty * l.hrs * 30 * electric.rate,
        detail: `${l.kw} kW × ${l.duty} duty × ${l.hrs} hrs/day × 30 days = ${(l.kw * l.duty * l.hrs * 30).toFixed(0)} kWh/mo.`,
      })),
      subtotal: electric.common,
    },
    {
      key: 'water',
      title: 'Common Area Water',
      description: `Restrooms, floor cleaning, hot water, landscaping. Rate: $${water.rate.toFixed(2)}/CCF (${inputs.water.scenario}). Total: ${water.commonCCF.toFixed(2)} CCF/mo.`,
      lines: inputs.water.commonArea.map(l => ({
        name: l.name,
        monthly: (l.galPerDay * inputs.water.daysPerMonth / 748) * water.rate,
        detail: `${l.galPerDay} gal/day × ${inputs.water.daysPerMonth} days ÷ 748 gal/CCF × $${water.rate.toFixed(2)}/CCF.`,
      })),
      subtotal: water.common,
    },
  ];

  const nonUtilSubblocks: SubBlock[] = [
    { key: 'mkt', title: 'Marketing', description: 'Brand spend — does not scale with square footage.', lines: inputs.nonUtility.marketing.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.marketing },
    { key: 'cln', title: 'Cleaning / Hall Attendant', lines: inputs.nonUtility.cleaning.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.cleaning },
    { key: 'gre', title: 'Grease / Oil Services', lines: inputs.nonUtility.grease.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.grease },
    { key: 'sec', title: 'Security', lines: inputs.nonUtility.security.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.security },
    { key: 'mnt', title: 'Building Maintenance', lines: inputs.nonUtility.maintenance.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.maintenance },
    { key: 'ins', title: 'Insurance', lines: inputs.nonUtility.insurance.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.insurance },
    { key: 'tec', title: 'Technology / Software', lines: inputs.nonUtility.technology.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.technology },
    { key: 'msc', title: 'Misc / Waste / Contingency', lines: inputs.nonUtility.misc.map(l => ({ name: l.name, monthly: l.monthly })), subtotal: nu.misc },
  ];

  const blocks: Block[] = [
    {
      num: '1',
      title: 'Vendor Utilities',
      description: inputs.rentIncludesUtilities
        ? `Pass-through utilities embedded in vendor rent — gas, electric, water across ${numFoodVendors} food + ${numNonFoodVendors} non-food vendors.`
        : 'Vendors pay utilities directly — no Barn-side OpEx in this rent structure.',
      subtotal: bd.vendorUtilities,
      tone: 'honey',
      detailRoute: '/model/opex/vendor-utilities',
      subblocks: vendorUtilSubblocks,
      footnote: inputs.rentIncludesUtilities
        ? 'Rates and equipment loads are editable on the Vendor Utilities detail page (linked above).'
        : 'Rent-includes-utilities toggle is off in the model — vendors pay utilities directly. Toggle on the Revenue panel of the Numbers tab to capture as Barn OpEx.',
    },
    {
      num: '2',
      title: 'Common Area Utilities',
      description: 'Electric (HVAC, lighting, security) + water (restrooms, cleaning, landscaping) for shared spaces — paid by The Barn.',
      subtotal: bd.commonAreaUtilities,
      tone: 'sage',
      detailRoute: '/model/opex/common-utilities',
      subblocks: commonSubblocks,
      footnote: 'Common area uses the same scenario rate as vendor utilities. Edit equipment loads on the Common Area Utilities detail page.',
    },
    {
      num: '3',
      title: 'Non-Utilities',
      description: 'Marketing, cleaning, grease services, security, maintenance, insurance, technology, misc — all line-item driven.',
      subtotal: bd.nonUtilities,
      tone: 'terracotta',
      detailRoute: '/model/opex/non-utility',
      subblocks: nonUtilSubblocks,
      footnote: 'Edit individual line items on the Non-Utility OpEx detail page.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/opex" />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-walnut">Operating Expenses — Per Location</h1>
          <p className="text-walnut-light text-sm mt-1">
            Full monthly OpEx picture · Vendor Utilities · Common Area · Non-Utilities · live values from the Numbers tab
          </p>
          <div className="flex gap-2 mt-3 flex-wrap text-[10px]">
            <span className="px-2 py-0.5 rounded-full border border-honey/30 bg-honey/15 text-walnut font-semibold tabular-nums">{fmtDollarFull(bd.total)}/mo OpEx</span>
            <span className="px-2 py-0.5 rounded-full border border-sage/30 bg-sage/15 text-walnut font-semibold tabular-nums">{fmtDollarFull(monthlySalary)}/mo Operator Salary</span>
            <span className="px-2 py-0.5 rounded-full border border-terracotta/30 bg-terracotta/15 text-walnut font-semibold tabular-nums">{fmtDollarFull(totalMonthlyExpenses * 12)}/yr All-In</span>
          </div>
        </div>

        {/* Summary card */}
        <section className="mb-6">
          <div className="glass rounded-2xl p-5 md:p-6">
            <h2 className="text-lg font-bold text-walnut mb-4">Monthly Roll-Up</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-walnut/5">
                <span className="text-walnut-light">Vendor Utilities</span>
                <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(bd.vendorUtilities)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-walnut/5">
                <span className="text-walnut-light">Common Area Utilities</span>
                <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(bd.commonAreaUtilities)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-walnut/5">
                <span className="text-walnut-light">Non-Utilities</span>
                <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(bd.nonUtilities)}</span>
              </div>
              <div className="flex justify-between py-2 mt-1 bg-honey/15 rounded-md px-3">
                <span className="font-semibold uppercase tracking-wider text-xs text-walnut">Total Monthly OpEx</span>
                <span className="font-bold text-walnut tabular-nums">{fmtDollarFull(bd.total)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-walnut/5 mt-2">
                <span className="text-walnut-light">Operator Monthly Salary</span>
                <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(monthlySalary)}</span>
              </div>
              <div className="flex justify-between py-2 mt-1 bg-walnut text-cream rounded-md px-3">
                <span className="font-semibold uppercase tracking-wider text-xs">Total Monthly Expenses</span>
                <span className="font-bold tabular-nums">{fmtDollarFull(totalMonthlyExpenses)}</span>
              </div>
              <div className="flex justify-between py-2 mt-1 bg-walnut text-cream rounded-md px-3">
                <span className="font-semibold uppercase tracking-wider text-xs">Total Annual Expenses</span>
                <span className="font-bold tabular-nums">{fmtDollarFull(totalMonthlyExpenses * 12)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-walnut">Breakdown by Category</h2>
            <p className="text-[11px] text-walnut-light italic">Click a category to expand · click a line item for the calculation</p>
          </div>
          <div className="space-y-3">
            {blocks.map(block => <BlockCard key={block.num} block={block} />)}
          </div>
        </section>

        <section className="mb-8">
          <div className="glass rounded-2xl p-5 md:p-6">
            <h2 className="text-lg font-bold text-walnut mb-3">How OpEx Flows Into the Model</h2>
            <ul className="space-y-2 text-xs text-walnut-light leading-relaxed">
              <li><span className="text-walnut font-semibold">Per-location basis.</span> Every figure here is one location’s monthly OpEx. Portfolio runs in the Numbers tab multiply by active locations each month.</li>
              <li><span className="text-walnut font-semibold">Vendor utilities pass through rent.</span> When the &ldquo;rent includes utilities&rdquo; toggle is on (default), vendor utility costs are Barn OpEx; when off, vendors pay directly and this category is $0.</li>
              <li><span className="text-walnut font-semibold">Scenario rates.</span> Gas, electric, and water each have low/mid/high rates. Active scenario is set on the Vendor Utilities detail page and applies to common area as well.</li>
              <li><span className="text-walnut font-semibold">Non-utility line items are static.</span> They do not scale with vendor count or sqft — they flex only when you edit them on the Non-Utility detail page.</li>
              <li><span className="text-walnut font-semibold">Operator salary is below the OpEx line</span> in the engine (subtracted from preCompEBITDA to derive postSalaryEBITDA), but shown here for the full expense picture.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">The Barn &mdash; Everybody&rsquo;s Welcome</p>
          <p className="text-walnut-light text-xs mt-1">Building F Level 2 &middot; Marcel Harvest Green &middot; Richmond, TX</p>
        </div>
      </footer>
    </div>
  );
}

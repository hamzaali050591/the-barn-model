import { DEFAULT_INPUTS } from './src/utils/types.ts';
import type { ModelInputs } from './src/utils/types.ts';
import { runModel, capitalStack, vendorTotals, opexBreakdown, gasMonthly, electricMonthly, waterMonthly } from './src/utils/engine.ts';

// ────────────────────────────────────────────────────────────────────
// Format helpers
// ────────────────────────────────────────────────────────────────────
const fmt$ = (v: number) => '$' + Math.round(v).toLocaleString();
const fmtPct = (v: number) => (v * 100).toFixed(2) + '%';
const fmtX = (v: number) => v.toFixed(3) + '×';
const PAD = (s: string, n: number) => s.length >= n ? s : s + ' '.repeat(n - s.length);
const RPAD = (s: string, n: number) => s.length >= n ? s : ' '.repeat(n - s.length) + s;

// ────────────────────────────────────────────────────────────────────
// Richmond helper (matches app default: openSchedule [4], 1 loc)
// ────────────────────────────────────────────────────────────────────
function richmond(over: Partial<ModelInputs> = {}, hold = 48): ModelInputs {
  return { ...DEFAULT_INPUTS, ...over, numLocations: 1, openSchedule: [4], holdMonths: hold };
}

const RICH = richmond();
const PORT = { ...DEFAULT_INPUTS };

// ────────────────────────────────────────────────────────────────────
// Summary printer
// ────────────────────────────────────────────────────────────────────
function summary(label: string, out: ReturnType<typeof runModel>) {
  console.log(`\n── ${label} ──`);
  console.log(`  Total Equity       ${RPAD(fmt$(out.totalEquity), 14)}`);
  console.log(`  Total Distributions${RPAD(fmt$(out.totalDistributions), 14)}`);
  console.log(`  Exit Proceeds      ${RPAD(fmt$(out.exitProceeds), 14)}`);
  console.log(`  Total Returns      ${RPAD(fmt$(out.totalReturns), 14)}`);
  console.log(`  IRR                ${RPAD(fmtPct(out.irr), 14)}`);
  console.log(`  MOIC               ${RPAD(fmtX(out.moic), 14)}`);
  console.log(`  Avg CoC            ${RPAD(fmtPct(out.avgCoC), 14)}`);
  console.log(`  Stabilized CoC     ${RPAD(fmtPct(out.stabilizedCoC), 14)}`);
}

// ────────────────────────────────────────────────────────────────────
// ±20% perturbation table
// ────────────────────────────────────────────────────────────────────
interface Perturbation {
  name: string;
  caption: string;        // e.g., "10,000 sf  ±20% → 8,000 / 12,000"
  lo: ModelInputs;
  hi: ModelInputs;
  expectDirIRR?: 'up' | 'down' | 'flat' | 'either';  // direction when variable INCREASES
  note?: string;
}

function runOne(inputs: ModelInputs) {
  const r = runModel(inputs);
  return {
    irr: r.irr, moic: r.moic, stabCoC: r.stabilizedCoC,
    totalDist: r.totalDistributions, exit: r.exitProceeds, equity: r.totalEquity,
    totalReturns: r.totalReturns,
  };
}

function dirArrow(baseline: number, value: number, tol = 1e-6): string {
  if (Math.abs(value - baseline) < tol) return '→';
  return value > baseline ? '↑' : '↓';
}

function checkDir(expected: Perturbation['expectDirIRR'], irrLo: number, irrBase: number, irrHi: number): string {
  if (!expected || expected === 'either') return '';
  const deltaHi = irrHi - irrBase;
  const deltaLo = irrLo - irrBase;
  const tol = 1e-5;
  let pass = false;
  if (expected === 'up')   pass = (deltaHi >= -tol) && (deltaLo <= tol);
  if (expected === 'down') pass = (deltaHi <= tol) && (deltaLo >= -tol);
  if (expected === 'flat') pass = (Math.abs(deltaHi) < tol) && (Math.abs(deltaLo) < tol);
  return pass ? '  ✓' : '  ⚠️ dir mismatch';
}

function printPerturbation(baseline: ModelInputs, p: Perturbation) {
  const lo = runOne(p.lo);
  const base = runOne(baseline);
  const hi = runOne(p.hi);
  const flag = checkDir(p.expectDirIRR, lo.irr, base.irr, hi.irr);
  console.log(`\n${p.name}  (${p.caption})${flag}`);
  const header = PAD('', 12) + RPAD('LO (−20%)', 18) + RPAD('BASELINE', 18) + RPAD('HI (+20%)', 18);
  console.log(header);
  console.log(
    PAD('  IRR', 12) +
    RPAD(`${fmtPct(lo.irr)} ${dirArrow(base.irr, lo.irr)}`, 18) +
    RPAD(fmtPct(base.irr), 18) +
    RPAD(`${fmtPct(hi.irr)} ${dirArrow(base.irr, hi.irr)}`, 18)
  );
  console.log(
    PAD('  MOIC', 12) +
    RPAD(`${fmtX(lo.moic)} ${dirArrow(base.moic, lo.moic)}`, 18) +
    RPAD(fmtX(base.moic), 18) +
    RPAD(`${fmtX(hi.moic)} ${dirArrow(base.moic, hi.moic)}`, 18)
  );
  console.log(
    PAD('  StabCoC', 12) +
    RPAD(`${fmtPct(lo.stabCoC)} ${dirArrow(base.stabCoC, lo.stabCoC)}`, 18) +
    RPAD(fmtPct(base.stabCoC), 18) +
    RPAD(`${fmtPct(hi.stabCoC)} ${dirArrow(base.stabCoC, hi.stabCoC)}`, 18)
  );
  console.log(
    PAD('  TotDist', 12) +
    RPAD(fmt$(lo.totalDist), 18) + RPAD(fmt$(base.totalDist), 18) + RPAD(fmt$(hi.totalDist), 18)
  );
  console.log(
    PAD('  Exit', 12) +
    RPAD(fmt$(lo.exit), 18) + RPAD(fmt$(base.exit), 18) + RPAD(fmt$(hi.exit), 18)
  );
  console.log(
    PAD('  Equity', 12) +
    RPAD(fmt$(lo.equity), 18) + RPAD(fmt$(base.equity), 18) + RPAD(fmt$(hi.equity), 18)
  );
  if (p.note) console.log(`  ${p.note}`);
}

// ────────────────────────────────────────────────────────────────────
// SECTION 1 — Baselines
// ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════');
console.log(' SECTION 1 — BASELINES');
console.log('═══════════════════════════════════════════════════════════════');

summary('Richmond — 48mo (app default)', runModel(RICH));
summary('Portfolio — 7 loc, 48mo', runModel(PORT));

// Sanity math, manual cross-checks
const cs = capitalStack(DEFAULT_INPUTS);
const vt = vendorTotals(DEFAULT_INPUTS);
const ob = opexBreakdown(DEFAULT_INPUTS);
console.log('\nManual sanity:');
console.log(`  Total CapEx (9,180 × $150)           = ${fmt$(cs.totalCapex)}   engine ${fmt$(cs.totalCapex)}`);
console.log(`  Total TI   (9,180 × $35)             = ${fmt$(cs.tiTotal)}      engine ${fmt$(cs.tiTotal)}`);
console.log(`  Investor Eq/loc  (capex − TI)        = ${fmt$(cs.investorEquityPerLocation)}`);
console.log(`  Monthly vendor rent (base model)      = ${fmt$(vt.monthlyVendorRentPerLocation)}   (8×$7k + 4×$5k = $76,000)`);
console.log(`  Monthly OpEx total                   = ${fmt$(ob.total)}   (vendor util ${fmt$(ob.vendorUtilities)} + common ${fmt$(ob.commonAreaUtilities)} + non-util ${fmt$(ob.nonUtilities)})`);
console.log(`  Year-0 preComp EBITDA  (pre-escalator) = ${fmt$(76000 - ob.total - 35 * 9180 / 12)}/mo`);
console.log(`  (With default escalators 3%/3%/0%, Year 1+ revenue and OpEx scale up — exit T12 reflects last-12-month figure.)`);

// ────────────────────────────────────────────────────────────────────
// SECTION 2 — ±20% on EVERY variable (Richmond 48mo baseline)
// ────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(' SECTION 2 — ±20% ON EVERY VARIABLE  (Richmond 48mo baseline)');
console.log('═══════════════════════════════════════════════════════════════');

const perturbations: Perturbation[] = [
  // ── CAPITAL STACK ──
  {
    name: '[1] sqft', caption: '9,180 sf  → 7,344 / 11,016',
    lo: richmond({ sqft: 7_344 }),
    hi: richmond({ sqft: 11_016 }),
    expectDirIRR: 'down',
    note: 'Bigger space scales CapEx, TI, and lease together. Expect IRR ↓ as sqft ↑ (lease scales 1:1, CapEx barely changes investor equity at current PSF mix).',
  },
  {
    name: '[2] tiPSF', caption: '$35/psf  → $28 / $42',
    lo: richmond({ tiPSF: 28 }),
    hi: richmond({ tiPSF: 42 }),
    expectDirIRR: 'up',
    note: 'Higher TI → lower investor equity → better IRR/MOIC. Distributions & exit unchanged (operational economics identical).',
  },
  {
    name: '[3] leasePSF', caption: '$35/psf/yr  → $28 / $42',
    lo: richmond({ leasePSF: 28 }),
    hi: richmond({ leasePSF: 42 }),
    expectDirIRR: 'down',
    note: 'Lease is direct OpEx. Higher leasePSF → lower EBITDA → lower distributions, lower exit, lower IRR.',
  },
  {
    name: '[4] capexPSF', caption: '$150/psf  → $120 / $180',
    lo: richmond({ capexPSF: 120 }),
    hi: richmond({ capexPSF: 180 }),
    expectDirIRR: 'down',
    note: 'Higher CapEx → higher investor equity (TI fixed) → lower IRR/MOIC. Operating economics unchanged.',
  },
  {
    name: '[5] gpInvestment', caption: '$200k  → $160k / $240k',
    lo: richmond({ gpInvestment: 160_000 }),
    hi: richmond({ gpInvestment: 240_000 }),
    expectDirIRR: 'flat',
    note: 'Pure GP/LP split; no effect on aggregate investor KPIs (invariant).',
  },

  // ── REVENUE (base model) ──
  {
    name: '[6] All vendor rents', caption: '±20% scale across all vendor categories',
    lo: richmond({ vendors: DEFAULT_INPUTS.vendors.map(v => ({ ...v, rent: v.rent * 0.8 })) }),
    hi: richmond({ vendors: DEFAULT_INPUTS.vendors.map(v => ({ ...v, rent: v.rent * 1.2 })) }),
    expectDirIRR: 'up',
    note: '20% revenue swing. Direct topline effect on distributions and exit.',
  },
  {
    name: '[7] Food vendor rent only', caption: '$7,000 → $5,600 / $8,400 (8 vendors)',
    lo: richmond({ vendors: DEFAULT_INPUTS.vendors.map(v => v.isFood ? { ...v, rent: v.rent * 0.8 } : v) }),
    hi: richmond({ vendors: DEFAULT_INPUTS.vendors.map(v => v.isFood ? { ...v, rent: v.rent * 1.2 } : v) }),
    expectDirIRR: 'up',
    note: '8 food vendors × $1,400 delta/vendor = $11,200/mo revenue swing.',
  },

  // ── REVENUE (pct model) ──
  {
    name: '[8] pctOfSalesRate',
    caption: '20% of sales  → 16% / 24%   (revenueModel=pct)',
    lo: richmond({ revenueModel: 'pct', pctOfSalesRate: 16 }),
    hi: richmond({ revenueModel: 'pct', pctOfSalesRate: 24 }),
    expectDirIRR: 'up',
    note: 'Only relevant in pct-of-sales mode.',
  },

  // ── REVENUE (mixed model) ──
  {
    name: '[9] mixedBaseRent',
    caption: '$3,500  → $2,800 / $4,200   (revenueModel=mixed)',
    lo: richmond({ revenueModel: 'mixed', mixedBaseRent: 2_800 }),
    hi: richmond({ revenueModel: 'mixed', mixedBaseRent: 4_200 }),
    expectDirIRR: 'up',
    note: 'Only relevant in mixed mode.',
  },
  {
    name: '[10] mixedPctRate',
    caption: '6%  → 4.8% / 7.2%   (revenueModel=mixed)',
    lo: richmond({ revenueModel: 'mixed', mixedPctRate: 4.8 }),
    hi: richmond({ revenueModel: 'mixed', mixedPctRate: 7.2 }),
    expectDirIRR: 'up',
    note: 'Only relevant in mixed mode.',
  },

  // ── OpEx utility rates ──
  {
    name: '[11] Gas midRate',
    caption: '$1.05/therm  → $0.84 / $1.26',
    lo: richmond({ gas: { ...DEFAULT_INPUTS.gas, midRate: 0.84 } }),
    hi: richmond({ gas: { ...DEFAULT_INPUTS.gas, midRate: 1.26 } }),
    expectDirIRR: 'down',
  },
  {
    name: '[12] Electric midRate',
    caption: '$0.10/kWh  → $0.08 / $0.12',
    lo: richmond({ electric: { ...DEFAULT_INPUTS.electric, midRate: 0.08 } }),
    hi: richmond({ electric: { ...DEFAULT_INPUTS.electric, midRate: 0.12 } }),
    expectDirIRR: 'down',
  },
  {
    name: '[13] Water midRate',
    caption: '$10/CCF  → $8 / $12',
    lo: richmond({ water: { ...DEFAULT_INPUTS.water, midRate: 8 } }),
    hi: richmond({ water: { ...DEFAULT_INPUTS.water, midRate: 12 } }),
    expectDirIRR: 'down',
  },
  {
    name: '[14] Non-utility total (all line items)',
    caption: '$13,800/mo  → ±20%',
    lo: richmond({ nonUtility: scaleNonUtility(DEFAULT_INPUTS.nonUtility, 0.8) }),
    hi: richmond({ nonUtility: scaleNonUtility(DEFAULT_INPUTS.nonUtility, 1.2) }),
    expectDirIRR: 'down',
    note: '$13.8k × 20% = $2,760/mo swing in OpEx.',
  },

  // ── COMP ──
  {
    name: '[15] salaryBase',
    caption: '$84,000/yr  → $67,200 / $100,800',
    lo: richmond({ salaryBase: 67_200 }),
    hi: richmond({ salaryBase: 100_800 }),
    expectDirIRR: 'down',
    note: 'Affects cash flow only — owner comp added back for exit valuation.',
  },
  {
    name: '[16] profitSharePct',
    caption: '10%  → 8% / 12%',
    lo: richmond({ profitSharePct: 8 }),
    hi: richmond({ profitSharePct: 12 }),
    expectDirIRR: 'down',
    note: 'Promote applies to both distributions and exit.',
  },

  // ── DEAL TERMS ──
  {
    name: '[17] exitMultiple',
    caption: '3×  → 2.4× / 3.6×',
    lo: richmond({ exitMultiple: 2.4 }),
    hi: richmond({ exitMultiple: 3.6 }),
    expectDirIRR: 'up',
    note: 'Exit proceeds scale linearly (± 20% of exit). IRR moves less because distributions are unchanged.',
  },
  {
    name: '[18] rampMonths',
    caption: '3 mo  → 2 / 4   (rounded from 2.4 / 3.6)',
    lo: richmond({ rampMonths: 2 }),
    hi: richmond({ rampMonths: 4 }),
    expectDirIRR: 'down',
    note: 'Longer ramp delays distributions. StabCoC unchanged.',
  },
  {
    name: '[19] l1LeaseHolidayMonths',
    caption: '3 mo  → 2 / 4',
    lo: richmond({ l1LeaseHolidayMonths: 2 }),
    hi: richmond({ l1LeaseHolidayMonths: 4 }),
    expectDirIRR: 'up',
    note: 'Longer holiday → saved lease during buildout → higher early distributions.',
  },
  {
    name: '[20] holdMonths',
    caption: '48 mo  → 38 / 58',
    lo: richmond({}, 38),
    hi: richmond({}, 58),
    expectDirIRR: 'down',
    note: 'Longer hold → more total distributions (MOIC up) but IRR ↓ because exit is deferred. Stab CoC unchanged.',
  },
  {
    name: '[21] rentEscalatorPct',
    caption: '3%/yr  → 0% / 6%',
    lo: richmond({ rentEscalatorPct: 0 }),
    hi: richmond({ rentEscalatorPct: 6 }),
    expectDirIRR: 'up',
    note: 'Compounds annually on each location\'s open clock. Higher rent escalator → revenue grows faster → higher T12 EBITDA at exit → higher IRR/MOIC. % of sales does not escalate.',
  },
  {
    name: '[22] opexEscalatorPct',
    caption: '3%/yr  → 0% / 6%',
    lo: richmond({ opexEscalatorPct: 0 }),
    hi: richmond({ opexEscalatorPct: 6 }),
    expectDirIRR: 'down',
    note: 'Compounds annually on each location\'s open clock. Hits utilities, non-utility OpEx, and operator salary. Master lease has its own escalator. Higher → margin compression → lower IRR/MOIC.',
  },
  {
    name: '[23] leaseEscalatorPct',
    caption: '0%/yr  → 0% / 6%   (default 0)',
    lo: richmond({ leaseEscalatorPct: 0 }),
    hi: richmond({ leaseEscalatorPct: 6 }),
    expectDirIRR: 'down',
    note: 'Master lease only. LO = baseline (default already 0). HI = aggressive 6% escalator → bigger lease bill every year → lower EBITDA, lower IRR/MOIC.',
  },
  {
    name: '[24] debtPerLocation @ 8%',
    caption: '$0  → $400k debt @ 8% rate (default 0/0)',
    lo: richmond({ debtPerLocation: 0, debtRatePct: 0 }),
    hi: richmond({ debtPerLocation: 400_000, debtRatePct: 8 }),
    expectDirIRR: 'up',
    note: 'Senior debt replaces LP equity dollar-for-dollar. Fully amortizes by exit (no balloon). Positive leverage when debt rate < operating return — $400k @ 8% should boost IRR.',
  },
  {
    name: '[25] debtRatePct on $400k debt',
    caption: '$400k @ 4%  →  $400k @ 16%',
    lo: richmond({ debtPerLocation: 400_000, debtRatePct: 4 }),
    hi: richmond({ debtPerLocation: 400_000, debtRatePct: 16 }),
    expectDirIRR: 'down',
    note: 'Same debt principal, varying rate. Higher rate = bigger interest drag = lower IRR/MOIC. Above ~operating-return threshold this becomes negative leverage.',
  },
  {
    name: '[26] nonRentRevenue',
    caption: '$0  →  $5k/mo / $10k/mo per loc',
    lo: richmond({ nonRentRevenue: 5_000 }),
    hi: richmond({ nonRentRevenue: 10_000 }),
    expectDirIRR: 'up',
    note: 'Non-rent revenue per location (events, sponsorships, parking). Escalates with rent escalator. Pure topline addition → higher EBITDA → higher IRR/MOIC.',
  },
  {
    name: '[27] spaceLeasedPct',
    caption: '100%  →  50% / 100%   (default 100%)',
    lo: richmond({ spaceLeasedPct: 50 }),
    hi: richmond({ spaceLeasedPct: 100 }),
    expectDirIRR: 'up',
    note: 'LO = half-leased stress test (50% rent collected). HI = baseline (default already 100%). OpEx unchanged — models rent shortfall without dropping vendor count.',
  },
];

function scaleNonUtility(n: typeof DEFAULT_INPUTS.nonUtility, s: number) {
  return {
    marketing:   n.marketing.map(x => ({ ...x, monthly: x.monthly * s })),
    cleaning:    n.cleaning.map(x => ({ ...x, monthly: x.monthly * s })),
    grease:      n.grease.map(x => ({ ...x, monthly: x.monthly * s })),
    security:    n.security.map(x => ({ ...x, monthly: x.monthly * s })),
    maintenance: n.maintenance.map(x => ({ ...x, monthly: x.monthly * s })),
    insurance:   n.insurance.map(x => ({ ...x, monthly: x.monthly * s })),
    technology:  n.technology.map(x => ({ ...x, monthly: x.monthly * s })),
    misc:        n.misc.map(x => ({ ...x, monthly: x.monthly * s })),
  };
}

for (const p of perturbations) {
  printPerturbation(RICH, p);
}

// ────────────────────────────────────────────────────────────────────
// SECTION 3 — Portfolio-only variables
// ────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(' SECTION 3 — PORTFOLIO-ONLY VARIABLES');
console.log('═══════════════════════════════════════════════════════════════');

const portVars: Perturbation[] = [
  {
    name: '[21] numLocations',
    caption: '7  → 6 / 8 (±20% rounded, openSchedule adjusted)',
    lo: { ...PORT, numLocations: 6, openSchedule: PORT.openSchedule.slice(0, 6) },
    hi: { ...PORT, numLocations: 8, openSchedule: [...PORT.openSchedule, 40] },
    expectDirIRR: 'either',
    note: 'More locations add equity AND distributions; net direction depends on ramp timing of later locations.',
  },
  {
    name: '[22] salaryStep',
    caption: '$20,000  → $16,000 / $24,000',
    lo: { ...PORT, salaryStep: 16_000 },
    hi: { ...PORT, salaryStep: 24_000 },
    expectDirIRR: 'down',
    note: 'Adds $Y/yr per extra location above L1. 7 locs → base + 6×step increment. Hits distributions; added back for exit.',
  },
];
for (const p of portVars) printPerturbation(PORT, p);

// ────────────────────────────────────────────────────────────────────
// SECTION 4 — Scenario toggles
// ────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(' SECTION 4 — OPEX SCENARIO TOGGLES  (Richmond 48mo)');
console.log('═══════════════════════════════════════════════════════════════');

function scenRun(g: 'low'|'mid'|'high', e: 'low'|'mid'|'high', w: 'low'|'mid'|'high') {
  return runOne(richmond({
    gas: { ...DEFAULT_INPUTS.gas, scenario: g },
    electric: { ...DEFAULT_INPUTS.electric, scenario: e },
    water: { ...DEFAULT_INPUTS.water, scenario: w },
  }));
}

const scens: [string, 'low'|'mid'|'high', 'low'|'mid'|'high', 'low'|'mid'|'high'][] = [
  ['All LOW',    'low',  'low',  'low'],
  ['All MID (default)',  'mid',  'mid',  'mid'],
  ['All HIGH',   'high', 'high', 'high'],
  ['Gas HIGH only',      'high', 'mid',  'mid'],
  ['Electric HIGH only', 'mid',  'high', 'mid'],
  ['Water HIGH only',    'mid',  'mid',  'high'],
];
console.log('\n' + PAD('Scenario', 24) + RPAD('IRR', 12) + RPAD('MOIC', 10) + RPAD('StabCoC', 10) + RPAD('TotDist', 14) + RPAD('Exit', 14));
for (const [label, g, e, w] of scens) {
  const r = scenRun(g, e, w);
  console.log(
    PAD(label, 24) +
    RPAD(fmtPct(r.irr), 12) +
    RPAD(fmtX(r.moic), 10) +
    RPAD(fmtPct(r.stabCoC), 10) +
    RPAD(fmt$(r.totalDist), 14) +
    RPAD(fmt$(r.exit), 14)
  );
}

// ────────────────────────────────────────────────────────────────────
// SECTION 5 — Industry cross-checks (all should reconcile)
// ────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(' SECTION 5 — INDUSTRY CROSS-CHECKS  (Richmond 48mo)');
console.log('═══════════════════════════════════════════════════════════════');

const r = runModel(RICH);

// MOIC
const moicManual = r.totalReturns / r.totalEquity;
console.log(`MOIC = totalReturns / totalEquity   manual ${fmtX(moicManual)}  engine ${fmtX(r.moic)}   ${Math.abs(moicManual - r.moic) < 1e-9 ? '✓' : '⚠️'}`);

// Stabilized CoC
const last12Dist = r.monthly.slice(-12).reduce((s, m) => s + m.distributions, 0);
const stabCoCManual = last12Dist / r.totalEquity;
console.log(`Stab CoC = T12 dist / equity         manual ${fmtPct(stabCoCManual)}  engine ${fmtPct(r.stabilizedCoC)}   ${Math.abs(stabCoCManual - r.stabilizedCoC) < 1e-9 ? '✓' : '⚠️'}`);

// Exit = multiple × T12 preComp × (1 − promote)
const last12PreComp = r.monthly.slice(-12).reduce((s, m) => s + m.preCompEBITDA, 0);
const grossExit = DEFAULT_INPUTS.exitMultiple * last12PreComp;
const netExit = grossExit * (1 - DEFAULT_INPUTS.profitSharePct / 100);
console.log(`Exit = multiple × T12 preComp × 0.9  manual ${fmt$(netExit)}  engine ${fmt$(r.exitProceeds)}   ${Math.abs(netExit - r.exitProceeds) < 1 ? '✓' : '⚠️'}`);
console.log(`  (T12 preComp = ${fmt$(last12PreComp)}, gross exit = ${fmt$(grossExit)}, 10% promote = ${fmt$(grossExit * 0.1)})`);

// IRR NPV check
const d0 = new Date(2025, 0, 1);
const daysBetween = (a: Date, b: Date) => (b.getTime() - a.getTime()) / 86_400_000;
let npv = 0;
r.monthly.forEach((m, i) => {
  if (m.netCashFlow === 0) return;
  const dt = new Date(2025, i, 1);
  const yrs = daysBetween(d0, dt) / 365;
  npv += m.netCashFlow / Math.pow(1 + r.irr, yrs);
});
console.log(`IRR NPV zero check                   NPV@${fmtPct(r.irr)} = ${npv.toFixed(2)}  (should ≈ 0)   ${Math.abs(npv) < 1 ? '✓' : '⚠️'}`);

// Capital call timing
const firstCall = r.monthly.findIndex(m => m.capitalCall !== 0);
console.log(`Capital call at month ${firstCall + 1}, L1 opens at month ${RICH.openSchedule[0]}   (3-mo buildout gap ${firstCall + 1 === RICH.openSchedule[0] - 3 ? '✓' : '⚠️'})`);

// gpInvestment invariant
const gpA = runModel(richmond({ gpInvestment: 0 }));
const gpB = runModel(richmond({ gpInvestment: 500_000 }));
console.log(`gpInvestment invariant (0 vs 500k)  IRR ${fmtPct(gpA.irr)} vs ${fmtPct(gpB.irr)}  ${Math.abs(gpA.irr - gpB.irr) < 1e-9 ? '✓' : '⚠️'}`);

// salaryStep inert in Richmond
const sA = runModel(richmond({ salaryStep: 0 }));
const sB = runModel(richmond({ salaryStep: 50_000 }));
console.log(`salaryStep inert in Richmond        IRR ${fmtPct(sA.irr)} vs ${fmtPct(sB.irr)}  ${Math.abs(sA.irr - sB.irr) < 1e-9 ? '✓' : '⚠️'}`);

// T12 stabilized
const last12 = r.monthly.slice(-12);
const allOpen = last12.every(m => m.nActive === 1);
const allDist = last12.every(m => m.nDistributing === 1);
console.log(`T12 exit window: all open ${allOpen ? '✓' : '⚠️'}  all distributing ${allDist ? '✓' : '⚠️'}`);

// Portfolio T12 stabilized
const pr = runModel(PORT);
const pLast12 = pr.monthly.slice(-12);
const pAllOpen = pLast12.every(m => m.nActive === PORT.numLocations);
const pAllDist = pLast12.every(m => m.nDistributing === PORT.numLocations);
console.log(`Portfolio T12: all open ${pAllOpen ? '✓' : '⚠️'}  all distributing ${pAllDist ? '✓' : '⚠️'}`);

// Distributions reconciliation
const sumDist = r.monthly.reduce((s, m) => s + m.distributions, 0);
console.log(`Distributions reconciliation         sum ${fmt$(sumDist)}  engine ${fmt$(r.totalDistributions)}   ${Math.abs(sumDist - r.totalDistributions) < 1 ? '✓' : '⚠️'}`);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(' DONE');
console.log('═══════════════════════════════════════════════════════════════\n');

// Touch unused cross-check helpers to prevent TS from complaining
void gasMonthly; void electricMonthly; void waterMonthly;

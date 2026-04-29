// One-off ±10% sensitivity audit across every UI-exposed slider.
// Run: npx tsx _audit_pm10.ts
//
// For each slider:
//   - lo: perturbed -10% from default (rounded to slider step where needed)
//   - hi: perturbed +10% from default
//   - For inputs whose default is 0 or sit at slider boundary, use a
//     meaningful perturbative value instead (e.g., 0 → +1k for nonRent).
// Reports IRR, MOIC, StabCoC, Avg CoC, TotDist, Exit, Equity for lo/base/hi
// and validates expected direction.

import { DEFAULT_INPUTS, type ModelInputs } from './src/utils/types';
import { runModel } from './src/utils/engine';

const fmtPct = (v: number) => isFinite(v) ? (v * 100).toFixed(2) + '%' : '   —  ';
const fmtMx  = (v: number) => isFinite(v) ? v.toFixed(3) + 'x' : '   —  ';
const fmt$   = (v: number) => isFinite(v) ? '$' + Math.round(v).toLocaleString() : '   —  ';

const RICH = (overrides: Partial<ModelInputs> = {}): ModelInputs => ({
  ...DEFAULT_INPUTS, numLocations: 1, openSchedule: [4], holdMonths: 48, ...overrides,
});
const PORT = (overrides: Partial<ModelInputs> = {}): ModelInputs => ({
  ...DEFAULT_INPUTS, ...overrides,
});

interface Test {
  label: string;
  lo: ModelInputs;
  base: ModelInputs;
  hi: ModelInputs;
  loVal: string;
  baseVal: string;
  hiVal: string;
  expect: 'up' | 'down' | 'either' | 'flat';
  note?: string;
}

// ── Helper: perturb a vendor's rent/sales/count
const perturbVendor = (idx: number, field: 'count'|'rent'|'sales', mult: number, base: ModelInputs = DEFAULT_INPUTS): ModelInputs => {
  const next = [...base.vendors];
  const orig = next[idx][field];
  const newVal = field === 'count' ? Math.max(0, Math.round(orig * mult)) : orig * mult;
  next[idx] = { ...next[idx], [field]: newVal };
  return { ...base, vendors: next };
};
const setVendor = (idx: number, field: 'count'|'rent'|'sales', value: number, base: ModelInputs = DEFAULT_INPUTS): ModelInputs => {
  const next = [...base.vendors];
  next[idx] = { ...next[idx], [field]: value };
  return { ...base, vendors: next };
};

const tests: Test[] = [
  // ── CAPITAL STACK ──
  {
    label: 'sqft',
    lo: RICH({ sqft: 8262 }), base: RICH(), hi: RICH({ sqft: 10098 }),
    loVal: '8,262 sf', baseVal: '9,180 sf', hiVal: '10,098 sf',
    expect: 'down',
    note: 'Bigger sqft scales CapEx + lease faster than TI offset → IRR ↓.',
  },
  {
    label: 'tiPSF',
    lo: RICH({ tiPSF: 31.5 }), base: RICH(), hi: RICH({ tiPSF: 38.5 }),
    loVal: '$31.50/PSF', baseVal: '$35/PSF', hiVal: '$38.50/PSF',
    expect: 'up',
    note: 'Higher TI = lower investor equity = better IRR.',
  },
  {
    label: 'baseRentPSF',
    lo: RICH({ baseRentPSF: 23.4 }), base: RICH(), hi: RICH({ baseRentPSF: 28.6 }),
    loVal: '$23.40/PSF', baseVal: '$26/PSF', hiVal: '$28.60/PSF',
    expect: 'down',
    note: 'Higher base rent → bigger lease cost → lower EBITDA.',
  },
  {
    label: 'nnnPSF',
    lo: RICH({ nnnPSF: 8.1 }), base: RICH(), hi: RICH({ nnnPSF: 9.9 }),
    loVal: '$8.10/PSF', baseVal: '$9/PSF', hiVal: '$9.90/PSF',
    expect: 'down',
    note: 'Higher NNN → bigger pass-through cost → lower EBITDA.',
  },
  {
    label: 'capexPSF',
    lo: RICH({ capexPSF: 135 }), base: RICH(), hi: RICH({ capexPSF: 165 }),
    loVal: '$135/PSF', baseVal: '$150/PSF', hiVal: '$165/PSF',
    expect: 'down',
    note: 'Higher CapEx → larger investor equity (TI fixed) → IRR ↓.',
  },
  {
    label: 'gpInvestment',
    lo: RICH({ gpInvestment: 180_000 }), base: RICH(), hi: RICH({ gpInvestment: 220_000 }),
    loVal: '$180k', baseVal: '$200k', hiVal: '$220k',
    expect: 'flat',
    note: 'Pure GP/LP split — invariant for aggregate investor IRR.',
  },
  {
    label: 'debtPerLocation (0 → $100k @ 0%)',
    lo: RICH(), base: RICH(), hi: RICH({ debtPerLocation: 100_000 }),
    loVal: '$0 (default)', baseVal: '$0 (default)', hiVal: '$100k debt @ 0% rate',
    expect: 'up',
    note: 'Adding debt at 0% rate (perturbative — default is $0). Reduces equity → IRR ↑.',
  },
  {
    label: 'debtRatePct (0 → 4% on $400k debt)',
    lo: RICH({ debtPerLocation: 400_000, debtRatePct: 0 }),
    base: RICH({ debtPerLocation: 400_000, debtRatePct: 0 }),
    hi: RICH({ debtPerLocation: 400_000, debtRatePct: 4 }),
    loVal: '$400k @ 0%', baseVal: '$400k @ 0%', hiVal: '$400k @ 4%',
    expect: 'down',
    note: 'On a fixed $400k debt, raising rate from 0% to 4% adds interest drag → IRR ↓.',
  },

  // ── REVENUE ──
  {
    label: 'Food Vendor count (8 → 7/9)',
    lo: setVendor(0, 'count', 7), base: DEFAULT_INPUTS, hi: setVendor(0, 'count', 9),
    loVal: '7 vendors', baseVal: '8 vendors', hiVal: '9 vendors',
    expect: 'up',
    note: 'More food vendors → more rent → higher IRR.',
  },
  {
    label: 'Food Vendor rent ($7000 → $6300/$7700)',
    lo: setVendor(0, 'rent', 6300), base: DEFAULT_INPUTS, hi: setVendor(0, 'rent', 7700),
    loVal: '$6,300/mo', baseVal: '$7,000/mo', hiVal: '$7,700/mo',
    expect: 'up',
    note: 'Higher per-vendor rent → higher IRR.',
  },
  {
    label: 'Non-Food Vendor count (4 → 3/5)',
    lo: setVendor(1, 'count', 3), base: DEFAULT_INPUTS, hi: setVendor(1, 'count', 5),
    loVal: '3 kiosks', baseVal: '4 kiosks', hiVal: '5 kiosks',
    expect: 'up',
    note: 'Note: 4 × 0.9 = 3.6 rounds to 4 (no change), so using ±1 step.',
  },
  {
    label: 'Non-Food Vendor rent ($5000 → $4500/$5500)',
    lo: setVendor(1, 'rent', 4500), base: DEFAULT_INPUTS, hi: setVendor(1, 'rent', 5500),
    loVal: '$4,500/mo', baseVal: '$5,000/mo', hiVal: '$5,500/mo',
    expect: 'up',
  },
  {
    label: 'Food Vendor sales ($35k → $31.5k/$38.5k) — only matters in pct mode',
    lo: setVendor(0, 'sales', 31_500, { ...DEFAULT_INPUTS, revenueModel: 'pct' }),
    base: { ...DEFAULT_INPUTS, revenueModel: 'pct' },
    hi: setVendor(0, 'sales', 38_500, { ...DEFAULT_INPUTS, revenueModel: 'pct' }),
    loVal: '$31.5k', baseVal: '$35k', hiVal: '$38.5k',
    expect: 'up',
  },
  {
    label: 'pctOfSalesRate (20% → 18%/22%) — pct mode only',
    lo: { ...DEFAULT_INPUTS, revenueModel: 'pct', pctOfSalesRate: 18 },
    base: { ...DEFAULT_INPUTS, revenueModel: 'pct' },
    hi: { ...DEFAULT_INPUTS, revenueModel: 'pct', pctOfSalesRate: 22 },
    loVal: '18%', baseVal: '20%', hiVal: '22%',
    expect: 'up',
  },
  {
    label: 'mixedBaseRent ($3500 → $3150/$3850) — mixed mode only',
    lo: { ...DEFAULT_INPUTS, revenueModel: 'mixed', mixedBaseRent: 3150 },
    base: { ...DEFAULT_INPUTS, revenueModel: 'mixed' },
    hi: { ...DEFAULT_INPUTS, revenueModel: 'mixed', mixedBaseRent: 3850 },
    loVal: '$3,150', baseVal: '$3,500', hiVal: '$3,850',
    expect: 'up',
  },
  {
    label: 'mixedPctRate (6% → 5.4%/6.6%) — mixed mode only',
    lo: { ...DEFAULT_INPUTS, revenueModel: 'mixed', mixedPctRate: 5.4 },
    base: { ...DEFAULT_INPUTS, revenueModel: 'mixed' },
    hi: { ...DEFAULT_INPUTS, revenueModel: 'mixed', mixedPctRate: 6.6 },
    loVal: '5.4%', baseVal: '6%', hiVal: '6.6%',
    expect: 'up',
  },
  {
    label: 'nonRentRevenue (0 → $1000/mo)',
    lo: RICH(), base: RICH(), hi: RICH({ nonRentRevenue: 1000 }),
    loVal: '$0', baseVal: '$0', hiVal: '$1,000/mo',
    expect: 'up',
    note: 'Default is $0 — perturb up by adding $1k/mo.',
  },
  {
    label: 'spaceLeasedPct (100% → 90%, max 100% so no +)',
    lo: RICH({ spaceLeasedPct: 90 }), base: RICH(), hi: RICH(),
    loVal: '90%', baseVal: '100%', hiVal: '100% (capped)',
    expect: 'up',
    note: 'Lower lease-up = less rent → IRR ↓ at LO. HI is at slider max.',
  },

  // ── ESCALATORS ──
  {
    label: 'rentEscalatorPct (3% → 2.7%/3.3%)',
    lo: RICH({ rentEscalatorPct: 2.7 }), base: RICH(), hi: RICH({ rentEscalatorPct: 3.3 }),
    loVal: '2.7%/yr', baseVal: '3%/yr', hiVal: '3.3%/yr',
    expect: 'up',
  },
  {
    label: 'opexEscalatorPct (3% → 2.7%/3.3%)',
    lo: RICH({ opexEscalatorPct: 2.7 }), base: RICH(), hi: RICH({ opexEscalatorPct: 3.3 }),
    loVal: '2.7%/yr', baseVal: '3%/yr', hiVal: '3.3%/yr',
    expect: 'down',
    note: 'Higher opex escalation → lower EBITDA over time.',
  },
  {
    label: 'baseRentEscalatorPct (0 → 1%, perturbative)',
    lo: RICH(), base: RICH(), hi: RICH({ baseRentEscalatorPct: 1 }),
    loVal: '0% (default)', baseVal: '0% (default)', hiVal: '1%/yr',
    expect: 'down',
    note: 'Higher base rent escalation → bigger lease bill over time.',
  },
  {
    label: 'nnnEscalatorPct (2% → 1.8%/2.2%)',
    lo: RICH({ nnnEscalatorPct: 1.8 }), base: RICH(), hi: RICH({ nnnEscalatorPct: 2.2 }),
    loVal: '1.8%/yr', baseVal: '2%/yr', hiVal: '2.2%/yr',
    expect: 'down',
  },

  // ── OPERATOR / PROMOTE ──
  {
    label: 'salaryBase ($84k → $75.6k/$92.4k)',
    lo: RICH({ salaryBase: 75_600 }), base: RICH(), hi: RICH({ salaryBase: 92_400 }),
    loVal: '$75.6k/yr', baseVal: '$84k/yr', hiVal: '$92.4k/yr',
    expect: 'down',
    note: 'Higher salary cost → lower distributions. Added back for exit valuation.',
  },
  {
    label: 'salaryStep ($20k → $18k/$22k) — portfolio only',
    lo: PORT({ salaryStep: 18_000 }), base: PORT(), hi: PORT({ salaryStep: 22_000 }),
    loVal: '$18k/loc', baseVal: '$20k/loc', hiVal: '$22k/loc',
    expect: 'down',
    note: 'Tested in portfolio mode (inert in Richmond).',
  },
  {
    label: 'profitSharePct (10% → 9%/11%)',
    lo: RICH({ profitSharePct: 9 }), base: RICH(), hi: RICH({ profitSharePct: 11 }),
    loVal: '9%', baseVal: '10%', hiVal: '11%',
    expect: 'down',
    note: 'Higher promote → less to investors → lower investor IRR.',
  },

  // ── DEAL TERMS ──
  {
    label: 'numLocations (7 → 6/8) — portfolio only',
    lo: PORT({ numLocations: 6, openSchedule: [4, 16, 20, 24, 28, 32] }),
    base: PORT(),
    hi: PORT({ numLocations: 8, openSchedule: [4, 16, 20, 24, 28, 32, 36, 40] }),
    loVal: '6 locs', baseVal: '7 locs', hiVal: '8 locs',
    expect: 'either',
    note: 'Net effect ambiguous — added equity vs added distributions.',
  },
  {
    label: 'exitMultiple (3× → 2.7×/3.3×)',
    lo: RICH({ exitMultiple: 2.7 }), base: RICH(), hi: RICH({ exitMultiple: 3.3 }),
    loVal: '2.7×', baseVal: '3×', hiVal: '3.3×',
    expect: 'up',
  },
  {
    label: 'rampMonths (3 → 2/4) — ±1 since 3×0.9 rounds to 3',
    lo: RICH({ rampMonths: 2 }), base: RICH(), hi: RICH({ rampMonths: 4 }),
    loVal: '2 mo', baseVal: '3 mo', hiVal: '4 mo',
    expect: 'down',
  },
  {
    label: 'l1LeaseHolidayMonths (3 → 2/4) — ±1',
    lo: RICH({ l1LeaseHolidayMonths: 2 }), base: RICH(), hi: RICH({ l1LeaseHolidayMonths: 4 }),
    loVal: '2 mo', baseVal: '3 mo', hiVal: '4 mo',
    expect: 'up',
  },
  {
    label: 'holdMonths (48 → 42/54) — slider step is 6',
    lo: RICH({ holdMonths: 42 }), base: RICH(), hi: RICH({ holdMonths: 54 }),
    loVal: '42 mo', baseVal: '48 mo', hiVal: '54 mo',
    expect: 'either',
    note: 'Direction depends on exit/operating-cash balance under current escalators.',
  },
];

// ── Run + report ──
console.log('═'.repeat(110));
console.log(' THE BARN — ±10% SENSITIVITY AUDIT (every UI slider)');
console.log('═'.repeat(110));

interface Result { irr: number; moic: number; stabCoC: number; avgCoC: number; totDist: number; exit: number; equity: number; }
const compute = (i: ModelInputs): Result => {
  const r = runModel(i);
  return {
    irr: r.irr, moic: r.moic, stabCoC: r.stabilizedCoC, avgCoC: r.avgCoC,
    totDist: r.totalDistributions, exit: r.exitProceeds, equity: r.totalEquity,
  };
};

const checkDir = (expect: Test['expect'], lo: number, base: number, hi: number, moicLo: number, moicHi: number): { pass: boolean; flag: string } => {
  if (expect === 'either') return { pass: true, flag: '✓' };
  const tol = 1e-5;
  // If any IRR is non-finite (XIRR couldn't converge — degenerate cash-flow
  // profile in that scenario, deal too broken to have a real IRR), fall back
  // to MOIC for the direction check. MOIC is always a real number.
  const useMoic = !isFinite(lo) || !isFinite(base) || !isFinite(hi);
  const a = useMoic ? moicLo : lo;
  const b = useMoic ? moicHi : hi;
  const baseVal = useMoic ? (lo + hi) / 2 : base; // proxy baseline for the MOIC fallback path
  const dHi = b - baseVal, dLo = a - baseVal;
  if (expect === 'flat') {
    return { pass: Math.abs(dLo) < tol && Math.abs(dHi) < tol, flag: useMoic ? '✓ (via MOIC)' : '✓' };
  }
  if (expect === 'up') {
    const pass = useMoic ? (b > a) : (dHi >= -tol && dLo <= tol);
    return { pass, flag: pass ? (useMoic ? '✓ (NaN→MOIC)' : '✓') : '⚠️ ' };
  }
  if (expect === 'down') {
    const pass = useMoic ? (b < a) : (dHi <= tol && dLo >= -tol);
    return { pass, flag: pass ? (useMoic ? '✓ (NaN→MOIC)' : '✓') : '⚠️ ' };
  }
  return { pass: false, flag: '⚠️ ' };
};

let pass = 0, fail = 0;
for (const t of tests) {
  const lo = compute(t.lo);
  const base = compute(t.base);
  const hi = compute(t.hi);
  const { pass: p, flag } = checkDir(t.expect, lo.irr, base.irr, hi.irr, lo.moic, hi.moic);
  if (p) pass++; else fail++;

  const dHi = (lo.irr === base.irr && hi.irr === base.irr) ? '→' : (hi.irr > base.irr + 1e-6 ? '↑' : (hi.irr < base.irr - 1e-6 ? '↓' : '→'));
  const dLo = (lo.irr === base.irr) ? '→' : (lo.irr < base.irr - 1e-6 ? '↓' : (lo.irr > base.irr + 1e-6 ? '↑' : '→'));

  console.log('');
  console.log(`${flag} [${t.expect.toUpperCase().padEnd(6)}] ${t.label}`);
  console.log(`   ${'LO'.padEnd(20)}${t.loVal.padEnd(28)}${'BASE'.padEnd(20)}${t.baseVal.padEnd(28)}${'HI'.padEnd(20)}${t.hiVal}`);
  console.log(`   ${'IRR'.padEnd(20)}${(fmtPct(lo.irr) + ' ' + dLo).padEnd(28)}${' '.padEnd(20)}${fmtPct(base.irr).padEnd(28)}${' '.padEnd(20)}${fmtPct(hi.irr) + ' ' + dHi}`);
  console.log(`   ${'MOIC'.padEnd(20)}${fmtMx(lo.moic).padEnd(28)}${' '.padEnd(20)}${fmtMx(base.moic).padEnd(28)}${' '.padEnd(20)}${fmtMx(hi.moic)}`);
  console.log(`   ${'Stab CoC'.padEnd(20)}${fmtPct(lo.stabCoC).padEnd(28)}${' '.padEnd(20)}${fmtPct(base.stabCoC).padEnd(28)}${' '.padEnd(20)}${fmtPct(hi.stabCoC)}`);
  console.log(`   ${'Tot Dist'.padEnd(20)}${fmt$(lo.totDist).padEnd(28)}${' '.padEnd(20)}${fmt$(base.totDist).padEnd(28)}${' '.padEnd(20)}${fmt$(hi.totDist)}`);
  console.log(`   ${'Exit'.padEnd(20)}${fmt$(lo.exit).padEnd(28)}${' '.padEnd(20)}${fmt$(base.exit).padEnd(28)}${' '.padEnd(20)}${fmt$(hi.exit)}`);
  console.log(`   ${'Equity'.padEnd(20)}${fmt$(lo.equity).padEnd(28)}${' '.padEnd(20)}${fmt$(base.equity).padEnd(28)}${' '.padEnd(20)}${fmt$(hi.equity)}`);
  if (t.note) console.log(`   note: ${t.note}`);
}

console.log('');
console.log('═'.repeat(110));
console.log(` SUMMARY: ${pass} passed, ${fail} failed across ${tests.length} sliders`);
console.log('═'.repeat(110));

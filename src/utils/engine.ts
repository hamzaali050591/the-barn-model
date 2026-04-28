import type {
  ModelInputs, MonthlyRow, ModelOutputs,
  GasConfig, ElectricConfig, WaterConfig, NonUtilityConfig, Scenario,
} from './types';
import { xirrFromMonthly } from './xirr';

// ── Capital Stack ──
export function capitalStack(inputs: ModelInputs) {
  const totalCapex = inputs.sqft * inputs.capexPSF;
  const tiTotal = inputs.sqft * inputs.tiPSF;
  const equitySlot = Math.max(0, totalCapex - tiTotal);
  const gpUsed = Math.min(inputs.gpInvestment, equitySlot);
  const debtSlot = Math.max(0, equitySlot - gpUsed);
  const debtUsedPerLocation = Math.min(Math.max(0, inputs.debtPerLocation), debtSlot);
  const investorEquityPerLocation = Math.max(0, equitySlot - debtUsedPerLocation);
  const lpInvestment = Math.max(0, investorEquityPerLocation - gpUsed);
  return { totalCapex, tiTotal, investorEquityPerLocation, lpInvestment, debtUsedPerLocation };
}

// ── Debt amortization (fully amortizing — no balloon at exit) ──
// Returns the level monthly P&I payment given principal P, monthly rate r,
// and term in months n. If r=0, it's straight principal-only paydown.
function levelPayment(principal: number, monthlyRate: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return principal * (monthlyRate * factor) / (factor - 1);
}

// ── Revenue ──
// Splits monthly vendor rent into:
//   - escalatingRent: portion that grows with the rent escalator (base rents)
//   - flatRent: portion that does not (% of sales — assumed sales stay flat)
// In 'base' mode all rent escalates; in 'pct' mode none escalates;
// in 'mixed' mode only the base-rent component escalates.
export function vendorTotals(inputs: ModelInputs) {
  const numVendors = inputs.vendors.reduce((s, v) => s + v.count, 0);
  const numFoodVendors = inputs.vendors.reduce((s, v) => s + (v.isFood ? v.count : 0), 0);
  const numNonFoodVendors = numVendors - numFoodVendors;

  let escalatingRent = 0;
  let flatRent = 0;

  if (inputs.revenueModel === 'base') {
    escalatingRent = inputs.vendors.reduce((s, v) => s + v.count * v.rent, 0);
  } else if (inputs.revenueModel === 'pct') {
    const totalSales = inputs.vendors.reduce((s, v) => s + v.count * v.sales, 0);
    flatRent = totalSales * (inputs.pctOfSalesRate / 100);
  } else {
    const totalSales = inputs.vendors.reduce((s, v) => s + v.count * v.sales, 0);
    escalatingRent = numVendors * inputs.mixedBaseRent;
    flatRent = totalSales * (inputs.mixedPctRate / 100);
  }

  const monthlyVendorRentPerLocation = escalatingRent + flatRent;

  return {
    numVendors, numFoodVendors, numNonFoodVendors,
    monthlyVendorRentPerLocation,
    escalatingRent, flatRent,
  };
}

// ── Detailed OpEx calculations (match spreadsheet formulas) ──

function scenarioRate(config: { lowRate: number; midRate: number; highRate: number; scenario: Scenario }): number {
  if (config.scenario === 'low') return config.lowRate;
  if (config.scenario === 'high') return config.highRate;
  return config.midRate;
}

export function gasMonthly(g: GasConfig) {
  const totalEffectiveBTU = g.equipment.reduce((s, e) => s + e.btu * e.duty, 0);
  const monthlyBTU = totalEffectiveBTU * g.hoursPerDay * g.daysPerMonth;
  const monthlyTherms = monthlyBTU / 100_000;
  const rate = scenarioRate(g);
  const foodVendor = monthlyTherms * rate;
  return {
    totalEffectiveBTU, monthlyBTU, monthlyTherms, rate,
    foodVendor,
    nonFoodVendor: 0,
    common: 0,
  };
}

function kwhForLoads(loads: { kw: number; duty: number; hrs: number }[], daysPerMonth = 30): number {
  return loads.reduce((s, l) => s + l.kw * l.duty * l.hrs * daysPerMonth, 0);
}

export function electricMonthly(e: ElectricConfig) {
  const baseKwh = kwhForLoads(e.baseLoad);
  const foodAddKwh = kwhForLoads(e.foodAddOn);
  const commonKwh = kwhForLoads(e.commonArea);
  const foodVendorKwh = baseKwh + foodAddKwh;
  const nonFoodVendorKwh = baseKwh;
  const rate = scenarioRate(e);
  return {
    baseKwh, foodAddKwh, commonKwh, foodVendorKwh, nonFoodVendorKwh, rate,
    foodVendor: foodVendorKwh * rate,
    nonFoodVendor: nonFoodVendorKwh * rate,
    common: commonKwh * rate,
  };
}

export function waterMonthly(w: WaterConfig) {
  const foodGalMo = w.foodGalPerDay * w.daysPerMonth;
  const nonFoodGalMo = w.nonFoodGalPerDay * w.daysPerMonth;
  const commonGalDay = w.commonArea.reduce((s, l) => s + l.galPerDay, 0);
  const commonGalMo = commonGalDay * w.daysPerMonth;
  // CCF = 748 gal
  const foodCCF = foodGalMo / 748;
  const nonFoodCCF = nonFoodGalMo / 748;
  const commonCCF = commonGalMo / 748;
  const rate = scenarioRate(w);
  return {
    foodGalMo, nonFoodGalMo, commonGalDay, commonGalMo,
    foodCCF, nonFoodCCF, commonCCF, rate,
    foodVendor: foodCCF * rate,
    nonFoodVendor: nonFoodCCF * rate,
    common: commonCCF * rate,
  };
}

function sumLineItems(items: { monthly: number }[]): number {
  return items.reduce((s, l) => s + l.monthly, 0);
}

export function nonUtilityBreakdown(n: NonUtilityConfig) {
  const marketing = sumLineItems(n.marketing);
  const cleaning = sumLineItems(n.cleaning);
  const grease = sumLineItems(n.grease);
  const security = sumLineItems(n.security);
  const maintenance = sumLineItems(n.maintenance);
  const insurance = sumLineItems(n.insurance);
  const technology = sumLineItems(n.technology);
  const misc = sumLineItems(n.misc);
  const total = marketing + cleaning + grease + security + maintenance + insurance + technology + misc;
  return { marketing, cleaning, grease, security, maintenance, insurance, technology, misc, total };
}

// ── OpEx breakdown ──
export function opexBreakdown(inputs: ModelInputs) {
  const { numFoodVendors, numNonFoodVendors } = vendorTotals(inputs);
  const gas = gasMonthly(inputs.gas);
  const electric = electricMonthly(inputs.electric);
  const water = waterMonthly(inputs.water);
  const nu = nonUtilityBreakdown(inputs.nonUtility);

  const foodVendorUtilTotal = gas.foodVendor + electric.foodVendor + water.foodVendor;
  const nonFoodVendorUtilTotal = gas.nonFoodVendor + electric.nonFoodVendor + water.nonFoodVendor;

  const vendorUtilities = inputs.rentIncludesUtilities
    ? (numFoodVendors * foodVendorUtilTotal + numNonFoodVendors * nonFoodVendorUtilTotal)
    : 0;

  const commonAreaUtilities = electric.common + water.common;
  const nonUtilities = nu.total;

  const total = vendorUtilities + commonAreaUtilities + nonUtilities;

  return {
    vendorUtilities, commonAreaUtilities, nonUtilities, total,
    gas, electric, water, nu,
    foodVendorUtilTotal, nonFoodVendorUtilTotal,
  };
}

export function opexPerLocation(inputs: ModelInputs): number {
  return opexBreakdown(inputs).total;
}

// ── Monthly cash flow engine ──
export function runModel(inputs: ModelInputs): ModelOutputs {
  const {
    numLocations, exitMultiple, leasePSF, sqft, profitSharePct,
    salaryBase, salaryStep, rampMonths, l1LeaseHolidayMonths, holdMonths,
    rentEscalatorPct, opexEscalatorPct, leaseEscalatorPct,
    debtRatePct,
  } = inputs;

  const schedule = inputs.openSchedule.slice(0, numLocations);
  const { tiTotal, investorEquityPerLocation, lpInvestment, debtUsedPerLocation } = capitalStack(inputs);
  const { numVendors, monthlyVendorRentPerLocation, escalatingRent, flatRent } = vendorTotals(inputs);
  const monthlyOpexPerLocation = opexPerLocation(inputs);

  const monthly: MonthlyRow[] = [];
  let cumulativeEquity = 0;
  let cumulativeDistributions = 0;
  const monthlyLeasePerLocation = (leasePSF * sqft) / 12;
  const profitShareRate = profitSharePct / 100;
  const rentEsc = 1 + rentEscalatorPct / 100;
  const opexEsc = 1 + opexEscalatorPct / 100;
  const leaseEsc = 1 + leaseEscalatorPct / 100;
  const l1OpenMonth = schedule[0] ?? 1;

  // Debt schedule per location: loan funds at the capital-call month
  // (max(1, openMonth - 3)) and fully amortizes by holdMonths so balance = 0
  // at exit. Term = holdMonths - callMonth + 1.
  const monthlyDebtRate = debtRatePct / 100 / 12;
  const debtSchedules = schedule.map(om => {
    const callMonth = Math.max(1, om - 3);
    const termMonths = Math.max(0, holdMonths - callMonth + 1);
    const payment = levelPayment(debtUsedPerLocation, monthlyDebtRate, termMonths);
    return { callMonth, termMonths, payment, balance: debtUsedPerLocation };
  });

  for (let m = 1; m <= holdMonths; m++) {
    const nActive = schedule.filter(om => om <= m).length;
    const nDistributing = schedule.filter(om => om <= m - rampMonths).length;

    let revenue = 0;
    let opex = 0;
    let masterLease = 0;
    for (const om of schedule) {
      if (om > m) continue;
      const yearsOpen = Math.floor((m - om) / 12);
      const rentFactor = Math.pow(rentEsc, yearsOpen);
      const opexFactor = Math.pow(opexEsc, yearsOpen);
      const leaseFactor = Math.pow(leaseEsc, yearsOpen);
      revenue += escalatingRent * rentFactor + flatRent;
      opex += monthlyOpexPerLocation * opexFactor;
      let locLease = monthlyLeasePerLocation * leaseFactor;
      if (om === l1OpenMonth && m >= om && m < om + l1LeaseHolidayMonths) {
        locLease = 0;
      }
      masterLease += locLease;
    }

    const preCompEBITDA = revenue - opex - masterLease;
    const salaryYearsOpen = nActive > 0 ? Math.floor((m - l1OpenMonth) / 12) : 0;
    const salaryFactor = Math.pow(opexEsc, Math.max(0, salaryYearsOpen));
    const corpSalary = nActive > 0 ? ((salaryBase + salaryStep * (nActive - 1)) / 12) * salaryFactor : 0;
    const postSalaryEBITDA = preCompEBITDA - corpSalary;

    let interestExpense = 0;
    let debtPrincipalPaid = 0;
    let debtServicePayment = 0;
    for (const ds of debtSchedules) {
      if (m < ds.callMonth || m >= ds.callMonth + ds.termMonths) continue;
      if (ds.balance <= 0 || ds.payment <= 0) continue;
      const interest = ds.balance * monthlyDebtRate;
      const principal = Math.min(ds.balance, ds.payment - interest);
      interestExpense += interest;
      debtPrincipalPaid += principal;
      debtServicePayment += ds.payment;
      ds.balance = Math.max(0, ds.balance - principal);
    }

    const postDebtEBITDA = postSalaryEBITDA - debtServicePayment;
    const distributableNOI = nActive > 0 ? (nDistributing / nActive) * postDebtEBITDA : 0;
    const profitShare = Math.max(0, distributableNOI) * profitShareRate;
    const distributions = Math.max(0, distributableNOI - profitShare);

    const locationsCallingCapital = schedule.filter(om => Math.max(1, om - 3) === m).length;
    const capitalCall = -locationsCallingCapital * investorEquityPerLocation;

    let exitProceeds = 0;
    let exitProfitShare = 0;
    if (m === holdMonths) {
      const trailing = monthly.slice(Math.max(0, monthly.length - 11));
      let t12PreComp = preCompEBITDA;
      for (const r of trailing) t12PreComp += r.preCompEBITDA;
      const grossExit = exitMultiple * t12PreComp;
      exitProfitShare = Math.max(0, grossExit) * profitShareRate;
      exitProceeds = grossExit - exitProfitShare;
    }

    const netCashFlow = distributions + capitalCall + exitProceeds;
    cumulativeEquity += Math.abs(capitalCall);
    cumulativeDistributions += distributions;

    monthly.push({
      month: m, nActive, nDistributing, revenue, opex, masterLease,
      preCompEBITDA, corpSalary, postSalaryEBITDA,
      interestExpense, debtPrincipalPaid, debtServicePayment,
      distributableNOI,
      profitShare, distributions, capitalCall, exitProceeds, exitProfitShare, netCashFlow,
      cumulativeEquity, cumulativeDistributions,
    });
  }

  const totalEquity = monthly.reduce((s, r) => s + Math.abs(r.capitalCall), 0);
  const totalDistributions = monthly.reduce((s, r) => s + r.distributions, 0);
  const exitProceedsTotal = monthly.reduce((s, r) => s + r.exitProceeds, 0);
  const totalReturns = totalDistributions + exitProceedsTotal;
  const roi = totalEquity > 0 ? (totalReturns - totalEquity) / totalEquity : 0;
  const moic = totalEquity > 0 ? totalReturns / totalEquity : 0;
  const avgCoC = totalEquity > 0 ? totalDistributions / totalEquity / (holdMonths / 12) : 0;

  const lastMonth = monthly[monthly.length - 1];
  let stabilizedAnnualDist = 0;
  if (lastMonth && lastMonth.nDistributing > 0) {
    const last12 = monthly.slice(-12);
    stabilizedAnnualDist = last12.reduce((s, r) => s + r.distributions, 0);
  }
  const stabilizedCoC = totalEquity > 0 ? stabilizedAnnualDist / totalEquity : 0;

  const cashFlows = monthly.map(r => r.netCashFlow);
  const irr = xirrFromMonthly(cashFlows);

  return {
    monthly, totalEquity, totalDistributions, exitProceeds: exitProceedsTotal,
    totalReturns, roi, moic, irr, avgCoC, stabilizedCoC,
    tiTotal, investorEquityPerLocation, lpInvestment, debtUsedPerLocation,
    monthlyVendorRentPerLocation, monthlyOpexPerLocation, numVendors,
  };
}

export function runModelWith(base: ModelInputs, overrides: Partial<ModelInputs>): ModelOutputs {
  return runModel({ ...base, ...overrides });
}

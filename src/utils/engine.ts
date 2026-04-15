import type {
  ModelInputs, MonthlyRow, ModelOutputs,
  GasConfig, ElectricConfig, WaterConfig, NonUtilityConfig, Scenario,
} from './types';
import { xirrFromMonthly } from './xirr';

// ── Capital Stack ──
export function capitalStack(inputs: ModelInputs) {
  const tiTotal = inputs.sqft * inputs.tiPSF;
  const investorEquityPerLocation = Math.max(0, inputs.capex - tiTotal);
  const lpInvestment = Math.max(0, investorEquityPerLocation - inputs.gpInvestment);
  return { tiTotal, investorEquityPerLocation, lpInvestment };
}

// ── Revenue ──
export function vendorTotals(inputs: ModelInputs) {
  const numVendors = inputs.vendors.reduce((s, v) => s + v.count, 0);
  const numFoodVendors = inputs.vendors.reduce((s, v) => s + (v.isFood ? v.count : 0), 0);
  const numNonFoodVendors = numVendors - numFoodVendors;

  let monthlyVendorRentPerLocation = 0;
  if (inputs.revenueModel === 'base') {
    monthlyVendorRentPerLocation = inputs.vendors.reduce((s, v) => s + v.count * v.rent, 0);
  } else if (inputs.revenueModel === 'pct') {
    const totalSales = inputs.vendors.reduce((s, v) => s + v.count * v.sales, 0);
    monthlyVendorRentPerLocation = totalSales * (inputs.pctOfSalesRate / 100);
  } else {
    const totalSales = inputs.vendors.reduce((s, v) => s + v.count * v.sales, 0);
    const baseTotal = numVendors * inputs.mixedBaseRent;
    const pctTotal = totalSales * (inputs.mixedPctRate / 100);
    monthlyVendorRentPerLocation = baseTotal + pctTotal;
  }

  return { numVendors, numFoodVendors, numNonFoodVendors, monthlyVendorRentPerLocation };
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
  } = inputs;

  const schedule = inputs.openSchedule.slice(0, numLocations);
  const { tiTotal, investorEquityPerLocation, lpInvestment } = capitalStack(inputs);
  const { numVendors, monthlyVendorRentPerLocation } = vendorTotals(inputs);
  const monthlyOpexPerLocation = opexPerLocation(inputs);

  const monthly: MonthlyRow[] = [];
  let cumulativeEquity = 0;
  let cumulativeDistributions = 0;
  const monthlyLeasePerLocation = (leasePSF * sqft) / 12;
  const profitShareRate = profitSharePct / 100;

  for (let m = 1; m <= holdMonths; m++) {
    const nActive = schedule.filter(om => om <= m).length;
    const nDistributing = schedule.filter(om => om <= m - rampMonths).length;
    const revenue = nActive * monthlyVendorRentPerLocation;
    const opex = nActive * monthlyOpexPerLocation;

    let masterLease = nActive * monthlyLeasePerLocation;
    const l1OpenMonth = schedule[0] ?? 1;
    if (m >= l1OpenMonth && m < l1OpenMonth + l1LeaseHolidayMonths) {
      masterLease -= monthlyLeasePerLocation;
    }

    const preCompEBITDA = revenue - opex - masterLease;
    const corpSalary = nActive > 0 ? (salaryBase + salaryStep * (nActive - 1)) / 12 : 0;
    const postSalaryEBITDA = preCompEBITDA - corpSalary;
    const distributableNOI = nActive > 0 ? (nDistributing / nActive) * postSalaryEBITDA : 0;
    const profitShare = Math.max(0, distributableNOI) * profitShareRate;
    const distributions = Math.max(0, distributableNOI - profitShare);

    const locationsOpening = schedule.filter(om => om === m).length;
    const capitalCall = -locationsOpening * investorEquityPerLocation;

    let exitProceeds = 0;
    if (m === holdMonths) {
      const trailing = monthly.slice(Math.max(0, monthly.length - 11));
      let t12 = postSalaryEBITDA;
      for (const r of trailing) t12 += r.postSalaryEBITDA;
      exitProceeds = exitMultiple * t12;
    }

    const netCashFlow = distributions + capitalCall + exitProceeds;
    cumulativeEquity += Math.abs(capitalCall);
    cumulativeDistributions += distributions;

    monthly.push({
      month: m, nActive, nDistributing, revenue, opex, masterLease,
      preCompEBITDA, corpSalary, postSalaryEBITDA, distributableNOI,
      profitShare, distributions, capitalCall, exitProceeds, netCashFlow,
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
    tiTotal, investorEquityPerLocation, lpInvestment,
    monthlyVendorRentPerLocation, monthlyOpexPerLocation, numVendors,
  };
}

export function runModelWith(base: ModelInputs, overrides: Partial<ModelInputs>): ModelOutputs {
  return runModel({ ...base, ...overrides });
}

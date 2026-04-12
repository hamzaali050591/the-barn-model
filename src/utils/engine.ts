import type { ModelInputs, MonthlyRow, ModelOutputs } from './types';
import { xirrFromMonthly } from './xirr';

export function runModel(inputs: ModelInputs): ModelOutputs {
  const {
    numLocations,
    equityPerLocation,
    exitMultiple,
    monthlyVendorRent,
    leasePSF,
    sqft,
    monthlyOpex,
    monthlyMembership,
    profitSharePct,
    salaryBase,
    salaryStep,
    rampMonths,
    l1LeaseHolidayMonths,
    holdMonths,
  } = inputs;

  // Only use the first numLocations entries from the open schedule
  const schedule = inputs.openSchedule.slice(0, numLocations);

  const monthly: MonthlyRow[] = [];
  let cumulativeEquity = 0;
  let cumulativeDistributions = 0;
  const monthlyLeasePerLocation = (leasePSF * sqft) / 12;
  const profitShareRate = profitSharePct / 100;

  for (let m = 1; m <= holdMonths; m++) {
    const nActive = schedule.filter(openMonth => openMonth <= m).length;
    const nDistributing = schedule.filter(openMonth => openMonth <= m - rampMonths).length;

    // Revenue
    const revenue = nActive * monthlyVendorRent + nActive * monthlyMembership;

    // OpEx
    const opex = nActive * monthlyOpex;

    // Master lease with L1 holiday
    let masterLease = nActive * monthlyLeasePerLocation;
    // L1 lease holiday: if we're within L1's first holiday months, subtract one location's lease
    const l1OpenMonth = schedule[0] ?? 1;
    if (m >= l1OpenMonth && m < l1OpenMonth + l1LeaseHolidayMonths) {
      masterLease -= monthlyLeasePerLocation;
    }

    // Pre-comp EBITDA
    const preCompEBITDA = revenue - opex - masterLease;

    // Corp salary
    const corpSalary = nActive > 0
      ? (salaryBase + salaryStep * (nActive - 1)) / 12
      : 0;

    // Post-salary EBITDA
    const postSalaryEBITDA = preCompEBITDA - corpSalary;

    // Distributable NOI: only distributing locations' share
    const distributableNOI = nActive > 0
      ? (nDistributing / nActive) * postSalaryEBITDA
      : 0;

    // Profit share
    const profitShare = Math.max(0, distributableNOI) * profitShareRate;

    // Distributions
    const distributions = Math.max(0, distributableNOI - profitShare);

    // Capital calls: negative for each location opening this month
    const locationsOpening = schedule.filter(openMonth => openMonth === m).length;
    const capitalCall = -locationsOpening * equityPerLocation;

    // Exit proceeds on final month
    let exitProceeds = 0;
    if (m === holdMonths) {
      // Sum of last 12 months of post-salary EBITDA
      const trailingMonths = monthly.slice(Math.max(0, monthly.length - 11));
      let trailing12 = postSalaryEBITDA; // current month
      for (const row of trailingMonths) {
        trailing12 += row.postSalaryEBITDA;
      }
      exitProceeds = exitMultiple * trailing12;
    }

    // Net cash flow
    const netCashFlow = distributions + capitalCall + exitProceeds;

    cumulativeEquity += Math.abs(capitalCall);
    cumulativeDistributions += distributions;

    monthly.push({
      month: m,
      nActive,
      nDistributing,
      revenue,
      opex,
      masterLease,
      preCompEBITDA,
      corpSalary,
      postSalaryEBITDA,
      distributableNOI,
      profitShare,
      distributions,
      capitalCall,
      exitProceeds,
      netCashFlow,
      cumulativeEquity,
      cumulativeDistributions,
    });
  }

  const totalEquity = monthly.reduce((s, r) => s + Math.abs(r.capitalCall), 0);
  const totalDistributions = monthly.reduce((s, r) => s + r.distributions, 0);
  const exitProceedsTotal = monthly.reduce((s, r) => s + r.exitProceeds, 0);
  const totalReturns = totalDistributions + exitProceedsTotal;
  const roi = totalEquity > 0 ? (totalReturns - totalEquity) / totalEquity : 0;
  const moic = totalEquity > 0 ? totalReturns / totalEquity : 0;
  const avgCoC = totalEquity > 0 ? totalDistributions / totalEquity / (holdMonths / 12) : 0;

  // Stabilized CoC: annual distributions when all locations are distributing
  // Find the last full year where all locations are active and distributing
  const lastMonth = monthly[monthly.length - 1];
  let stabilizedAnnualDist = 0;
  if (lastMonth && lastMonth.nDistributing > 0) {
    // Use last 12 months of distributions
    const last12 = monthly.slice(-12);
    stabilizedAnnualDist = last12.reduce((s, r) => s + r.distributions, 0);
  }
  const stabilizedCoC = totalEquity > 0 ? stabilizedAnnualDist / totalEquity : 0;

  // XIRR
  const cashFlows = monthly.map(r => r.netCashFlow);
  const irr = xirrFromMonthly(cashFlows);

  return {
    monthly,
    totalEquity,
    totalDistributions,
    exitProceeds: exitProceedsTotal,
    totalReturns,
    roi,
    moic,
    irr,
    avgCoC,
    stabilizedCoC,
  };
}

/**
 * Run model with overrides for sensitivity analysis
 */
export function runModelWith(
  base: ModelInputs,
  overrides: Partial<ModelInputs>
): ModelOutputs {
  return runModel({ ...base, ...overrides });
}

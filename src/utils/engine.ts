import type { ModelInputs, MonthlyRow, ModelOutputs } from './types';
import { xirrFromMonthly } from './xirr';

/** Derived capital stack amounts (per location) */
export function capitalStack(inputs: ModelInputs) {
  const tiTotal = inputs.sqft * inputs.tiPSF;
  const investorEquityPerLocation = Math.max(0, inputs.capex - tiTotal);
  const lpInvestment = Math.max(0, investorEquityPerLocation - inputs.gpInvestment);
  return { tiTotal, investorEquityPerLocation, lpInvestment };
}

/** Vendor aggregates - rent revenue depends on revenue model */
export function vendorTotals(inputs: ModelInputs) {
  const numVendors = inputs.vendors.reduce((s, v) => s + v.count, 0);

  let monthlyVendorRentPerLocation = 0;
  if (inputs.revenueModel === 'base') {
    monthlyVendorRentPerLocation = inputs.vendors.reduce(
      (s, v) => s + v.count * v.rent,
      0
    );
  } else if (inputs.revenueModel === 'pct') {
    const totalSales = inputs.vendors.reduce((s, v) => s + v.count * v.sales, 0);
    monthlyVendorRentPerLocation = totalSales * (inputs.pctOfSalesRate / 100);
  } else {
    // mixed
    const totalSales = inputs.vendors.reduce((s, v) => s + v.count * v.sales, 0);
    const baseTotal = numVendors * inputs.mixedBaseRent;
    const pctTotal = totalSales * (inputs.mixedPctRate / 100);
    monthlyVendorRentPerLocation = baseTotal + pctTotal;
  }

  return { numVendors, monthlyVendorRentPerLocation };
}

/** OpEx per location (monthly), broken out */
export function opexBreakdown(inputs: ModelInputs) {
  const { numVendors } = vendorTotals(inputs);
  const vendorUtilitiesPerVendor =
    inputs.gasPerVendor + inputs.electricPerVendor + inputs.waterPerVendor;
  const vendorUtilities = inputs.rentIncludesUtilities
    ? numVendors * vendorUtilitiesPerVendor
    : 0;
  const commonAreaUtilities = inputs.commonElectric + inputs.commonWater;
  const nonUtilities =
    inputs.marketing + inputs.cleaning + inputs.security + inputs.maintenance;
  const total = vendorUtilities + commonAreaUtilities + nonUtilities;
  return { vendorUtilities, commonAreaUtilities, nonUtilities, total };
}

/** OpEx per location (monthly) */
export function opexPerLocation(inputs: ModelInputs) {
  return opexBreakdown(inputs).total;
}

export function runModel(inputs: ModelInputs): ModelOutputs {
  const {
    numLocations,
    exitMultiple,
    leasePSF,
    sqft,
    profitSharePct,
    salaryBase,
    salaryStep,
    rampMonths,
    l1LeaseHolidayMonths,
    holdMonths,
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
    const nActive = schedule.filter(openMonth => openMonth <= m).length;
    const nDistributing = schedule.filter(openMonth => openMonth <= m - rampMonths).length;

    const revenue = nActive * monthlyVendorRentPerLocation;
    const opex = nActive * monthlyOpexPerLocation;

    let masterLease = nActive * monthlyLeasePerLocation;
    const l1OpenMonth = schedule[0] ?? 1;
    if (m >= l1OpenMonth && m < l1OpenMonth + l1LeaseHolidayMonths) {
      masterLease -= monthlyLeasePerLocation;
    }

    const preCompEBITDA = revenue - opex - masterLease;

    const corpSalary = nActive > 0
      ? (salaryBase + salaryStep * (nActive - 1)) / 12
      : 0;

    const postSalaryEBITDA = preCompEBITDA - corpSalary;

    const distributableNOI = nActive > 0
      ? (nDistributing / nActive) * postSalaryEBITDA
      : 0;

    const profitShare = Math.max(0, distributableNOI) * profitShareRate;
    const distributions = Math.max(0, distributableNOI - profitShare);

    // Capital calls: investor equity (GP+LP) per location opening
    const locationsOpening = schedule.filter(openMonth => openMonth === m).length;
    const capitalCall = -locationsOpening * investorEquityPerLocation;

    let exitProceeds = 0;
    if (m === holdMonths) {
      const trailingMonths = monthly.slice(Math.max(0, monthly.length - 11));
      let trailing12 = postSalaryEBITDA;
      for (const row of trailingMonths) {
        trailing12 += row.postSalaryEBITDA;
      }
      exitProceeds = exitMultiple * trailing12;
    }

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
    tiTotal,
    investorEquityPerLocation,
    lpInvestment,
    monthlyVendorRentPerLocation,
    monthlyOpexPerLocation,
    numVendors,
  };
}

export function runModelWith(
  base: ModelInputs,
  overrides: Partial<ModelInputs>
): ModelOutputs {
  return runModel({ ...base, ...overrides });
}

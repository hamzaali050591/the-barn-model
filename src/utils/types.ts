export interface ModelInputs {
  numLocations: number;
  equityPerLocation: number;
  exitMultiple: number;
  monthlyVendorRent: number;
  leasePSF: number;
  sqft: number;
  monthlyOpex: number;
  monthlyMembership: number;
  gpInvestment: number;
  lpInvestment: number;
  profitSharePct: number;
  salaryBase: number;
  salaryStep: number;
  rampMonths: number;
  l1LeaseHolidayMonths: number;
  openSchedule: number[];
  holdMonths: number;
}

export interface MonthlyRow {
  month: number;
  nActive: number;
  nDistributing: number;
  revenue: number;
  opex: number;
  masterLease: number;
  preCompEBITDA: number;
  corpSalary: number;
  postSalaryEBITDA: number;
  distributableNOI: number;
  profitShare: number;
  distributions: number;
  capitalCall: number;
  exitProceeds: number;
  netCashFlow: number;
  cumulativeEquity: number;
  cumulativeDistributions: number;
}

export interface ModelOutputs {
  monthly: MonthlyRow[];
  totalEquity: number;
  totalDistributions: number;
  exitProceeds: number;
  totalReturns: number;
  roi: number;
  moic: number;
  irr: number;
  avgCoC: number;
  stabilizedCoC: number;
}

export const DEFAULT_INPUTS: ModelInputs = {
  numLocations: 7,
  equityPerLocation: 1_150_000,
  exitMultiple: 6,
  monthlyVendorRent: 74_000,
  leasePSF: 35,
  sqft: 10_000,
  monthlyOpex: 26_136,
  monthlyMembership: 0,
  gpInvestment: 200_000,
  lpInvestment: 950_000,
  profitSharePct: 10,
  salaryBase: 75_000,
  salaryStep: 20_000,
  rampMonths: 3,
  l1LeaseHolidayMonths: 3,
  openSchedule: [1, 13, 17, 21, 25, 29, 33],
  holdMonths: 48,
};

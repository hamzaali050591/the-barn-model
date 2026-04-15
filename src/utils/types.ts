export interface VendorCategory {
  name: string;
  count: number;
  rent: number; // monthly rent per vendor
}

export interface ModelInputs {
  // Capital Stack
  sqft: number;              // total sq ft per location
  tiPSF: number;             // TI $/PSF (DPEG)
  leasePSF: number;          // master lease $/PSF/yr
  capex: number;             // total capex per location
  gpInvestment: number;      // GP investment per location

  // Revenue Model (vendor breakdown)
  vendors: VendorCategory[];

  // Rent terms
  rentIncludesUtilities: boolean;

  // OpEx — per-vendor utilities (only incurred by The Barn if rent inclusive)
  gasPerVendor: number;      // monthly gas $ per vendor
  electricPerVendor: number; // monthly electric $ per vendor
  waterPerVendor: number;    // monthly water $ per vendor

  // OpEx — common area utilities (always paid by The Barn)
  commonElectric: number;
  commonWater: number;

  // OpEx — per-location non-utilities (flat)
  marketing: number;
  cleaning: number;
  security: number;
  maintenance: number;

  // Salary & profit share
  salaryBase: number;        // annual
  salaryStep: number;        // annual per additional location
  profitSharePct: number;    // 0-100

  // Deal terms
  numLocations: number;
  exitMultiple: number;
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
  // Derived capital stack per location
  tiTotal: number;
  investorEquityPerLocation: number;
  lpInvestment: number;
  monthlyVendorRentPerLocation: number;
  monthlyOpexPerLocation: number;
  numVendors: number;
}

export const DEFAULT_INPUTS: ModelInputs = {
  // Capital Stack
  sqft: 10_000,
  tiPSF: 35,
  leasePSF: 35,
  capex: 1_500_000,
  gpInvestment: 200_000,

  // Revenue Model
  vendors: [
    { name: 'Food Vendors', count: 8, rent: 7_000 },
    { name: 'Health Bar', count: 1, rent: 6_000 },
    { name: 'Desserts', count: 1, rent: 6_000 },
    { name: 'Drinks', count: 2, rent: 6_000 },
  ],

  // Rent terms
  rentIncludesUtilities: true,

  // Vendor utilities ($/vendor/mo)
  gasPerVendor: 210,
  electricPerVendor: 670,
  waterPerVendor: 210,

  // Common area utilities ($/location/mo)
  commonElectric: 2_000,
  commonWater: 400,

  // Non-utilities ($/location/mo)
  marketing: 3_000,
  cleaning: 4_000,
  security: 2_500,
  maintenance: 2_000,

  // Salary & profit share
  salaryBase: 84_000,
  salaryStep: 20_000,
  profitSharePct: 10,

  // Deal terms
  numLocations: 7,
  exitMultiple: 6,
  rampMonths: 3,
  l1LeaseHolidayMonths: 3,
  openSchedule: [1, 13, 17, 21, 25, 29, 33],
  holdMonths: 48,
};

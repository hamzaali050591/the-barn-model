export type RevenueModel = 'base' | 'pct' | 'mixed';
export type Scenario = 'low' | 'mid' | 'high';

export interface VendorCategory {
  name: string;
  count: number;
  rent: number;       // base monthly rent per vendor (used in 'base' mode)
  sales: number;      // monthly sales per vendor (used in 'pct' and 'mixed' modes)
  isFood: boolean;    // drives utility cost split
}

// ── Detailed OpEx Configs ──

export interface GasEquipment {
  name: string;
  btu: number;
  duty: number;
}
export interface GasConfig {
  equipment: GasEquipment[];
  hoursPerDay: number;
  daysPerMonth: number;
  lowRate: number;   // $/therm
  midRate: number;
  highRate: number;
  scenario: Scenario;
}

export interface ElectricLoad {
  name: string;
  kw: number;
  duty: number;
  hrs: number;       // hrs/day
}
export interface ElectricConfig {
  baseLoad: ElectricLoad[];
  foodAddOn: ElectricLoad[];
  commonArea: ElectricLoad[];
  lowRate: number;   // $/kWh
  midRate: number;
  highRate: number;
  scenario: Scenario;
}

export interface WaterCommonLoad {
  name: string;
  galPerDay: number;
}
export interface WaterConfig {
  foodGalPerDay: number;
  nonFoodGalPerDay: number;
  daysPerMonth: number;
  commonArea: WaterCommonLoad[];
  lowRate: number;   // $/CCF
  midRate: number;
  highRate: number;
  scenario: Scenario;
}

export interface LineItem {
  name: string;
  monthly: number;
}
export interface NonUtilityConfig {
  marketing: LineItem[];
  cleaning: LineItem[];
  grease: LineItem[];
  security: LineItem[];
  maintenance: LineItem[];
  insurance: LineItem[];
  technology: LineItem[];
  misc: LineItem[];
}

export interface ModelInputs {
  // Capital Stack
  sqft: number;
  tiPSF: number;
  leasePSF: number;
  capexPSF: number;
  gpInvestment: number;

  // Revenue Model
  vendors: VendorCategory[];
  revenueModel: RevenueModel;
  pctOfSalesRate: number;
  mixedBaseRent: number;
  mixedPctRate: number;

  // Rent terms
  rentIncludesUtilities: boolean;

  // Detailed OpEx configs
  gas: GasConfig;
  electric: ElectricConfig;
  water: WaterConfig;
  nonUtility: NonUtilityConfig;

  // Salary & profit share
  salaryBase: number;
  salaryStep: number;
  profitSharePct: number;

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
  exitProfitShare: number;
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
  tiTotal: number;
  investorEquityPerLocation: number;
  lpInvestment: number;
  monthlyVendorRentPerLocation: number;
  monthlyOpexPerLocation: number;
  numVendors: number;
}

export const DEFAULT_INPUTS: ModelInputs = {
  // Capital Stack
  sqft: 9_180,
  tiPSF: 35,
  leasePSF: 35,
  capexPSF: 150,
  gpInvestment: 200_000,

  // Revenue Model
  vendors: [
    { name: 'Food Vendors', count: 8, rent: 7_000, sales: 35_000, isFood: true },
    { name: 'Health Bar', count: 1, rent: 6_000, sales: 25_000, isFood: false },
    { name: 'Desserts', count: 2, rent: 6_000, sales: 25_000, isFood: false },
    { name: 'Coffee', count: 1, rent: 6_000, sales: 25_000, isFood: false },
  ],
  revenueModel: 'base',
  pctOfSalesRate: 20,
  mixedBaseRent: 3_500,
  mixedPctRate: 6,

  rentIncludesUtilities: true,

  // Gas config (from spreadsheet Gas tab — food vendors only)
  gas: {
    equipment: [
      { name: '40lb Fryer', btu: 120_000, duty: 0.5 },
      { name: '2ft Flat Top Griddle', btu: 48_000, duty: 0.45 },
      { name: '2ft Charbroiler', btu: 56_000, duty: 0.3 },
      { name: '6-Burner Range', btu: 150_000, duty: 0.35 },
    ],
    hoursPerDay: 12,
    daysPerMonth: 30,
    lowRate: 0.9,
    midRate: 1.05,
    highRate: 1.2,
    scenario: 'mid',
  },

  // Electric config (from spreadsheet Electric tab)
  electric: {
    baseLoad: [
      { name: 'Double-door commercial fridge', kw: 1.8, duty: 0.6, hrs: 24 },
      { name: 'Double-door commercial freezer', kw: 2.2, duty: 0.7, hrs: 24 },
      { name: '2 refrigerated prep tables', kw: 1, duty: 0.5, hrs: 24 },
      { name: 'Stall lighting + POS/misc', kw: 0.5, duty: 1, hrs: 12 },
    ],
    foodAddOn: [
      { name: 'Steam table / warmers', kw: 1.5, duty: 0.8, hrs: 12 },
      { name: 'Heat lamp', kw: 0.5, duty: 0.7, hrs: 12 },
      { name: 'Rice cooker', kw: 1, duty: 0.3, hrs: 12 },
    ],
    commonArea: [
      { name: 'HVAC (40 tons, 70% duty)', kw: 48, duty: 0.7, hrs: 16 },
      { name: 'Exhaust / make-up air', kw: 1.6, duty: 1, hrs: 12 },
      { name: 'Ambient lighting', kw: 4, duty: 1, hrs: 12 },
      { name: 'Hot water heater', kw: 2, duty: 1, hrs: 16 },
      { name: 'Sound system', kw: 0.5, duty: 1, hrs: 12 },
      { name: 'Restrooms (exhaust, lights, etc.)', kw: 0.5, duty: 1, hrs: 12 },
      { name: 'Security cameras / WiFi / office', kw: 1, duty: 1, hrs: 24 },
      { name: 'Overnight security lighting', kw: 0.3, duty: 1, hrs: 12 },
    ],
    lowRate: 0.085,
    midRate: 0.10,
    highRate: 0.12,
    scenario: 'mid',
  },

  // Water config (from spreadsheet Water tab)
  water: {
    foodGalPerDay: 350,
    nonFoodGalPerDay: 157,
    daysPerMonth: 30,
    commonArea: [
      { name: 'Restrooms (~300 customers/day)', galPerDay: 600 },
      { name: 'Floor cleaning / mop sinks', galPerDay: 100 },
      { name: 'Hot water system losses / misc', galPerDay: 50 },
      { name: 'Outdoor hose / landscaping', galPerDay: 30 },
    ],
    lowRate: 8,
    midRate: 10,
    highRate: 12,
    scenario: 'mid',
  },

  // Non-Utility config (from spreadsheet Non-Utility OpEx tab + Marketing)
  nonUtility: {
    marketing: [
      { name: 'Social media content creation', monthly: 800 },
      { name: 'Paid social (IG, FB, TikTok)', monthly: 1200 },
      { name: 'Event promotion / print / signage', monthly: 500 },
      { name: 'App marketing / push notifications', monthly: 300 },
      { name: 'Influencer / blogger activations', monthly: 200 },
    ],
    cleaning: [
      { name: '2 staff splitting 84 hrs/wk', monthly: 5000 },
      { name: 'Cleaning supplies / restroom stock', monthly: 500 },
    ],
    grease: [
      { name: 'Grease trap pumping (biweekly)', monthly: 600 },
      { name: 'Grease trap hauling', monthly: 200 },
    ],
    security: [
      { name: 'Camera system monitoring service', monthly: 100 },
      { name: 'On-site guard — Fri & Sat (8hr)', monthly: 0 },
    ],
    maintenance: [
      { name: 'HVAC preventive maintenance', monthly: 500 },
      { name: 'Plumbing (excl. grease trap)', monthly: 200 },
      { name: 'General repairs', monthly: 300 },
      { name: 'Pest control', monthly: 200 },
      { name: 'Fire suppression', monthly: 100 },
    ],
    insurance: [
      { name: 'General liability + property', monthly: 1000 },
      { name: 'Umbrella policy', monthly: 300 },
    ],
    technology: [
      { name: 'POS / ordering platform', monthly: 200 },
      { name: 'WiFi (commercial-grade)', monthly: 300 },
      { name: 'Dashboards / analytics', monthly: 200 },
      { name: 'Loyalty / membership platform', monthly: 200 },
    ],
    misc: [
      { name: 'Commercial waste / dumpster pickup', monthly: 600 },
      { name: 'Miscellaneous / contingency', monthly: 300 },
    ],
  },

  // Salary & profit share
  salaryBase: 84_000,
  salaryStep: 20_000,
  profitSharePct: 10,

  // Deal terms
  numLocations: 7,
  exitMultiple: 6,
  rampMonths: 3,
  l1LeaseHolidayMonths: 3,
  openSchedule: [4, 16, 20, 24, 28, 32, 36],
  holdMonths: 48,
};

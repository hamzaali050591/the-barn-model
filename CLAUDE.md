# The Barn — Investor Web App

Interactive investor-facing companion to The Barn's pitch deck and financial model. Shown live to prospective LPs/partners — **polish and copy quality matter as much as the code**.

## The concept (for context when making copy/design calls)

- **The Barn** is a curated, tech-enabled food hall. Richmond, TX is the flagship/proof-of-concept.
- **Long-term vision:** 7 Texas-suburb locations over ~4 years (Richmond → Fulshear → Frisco → Plano → San Antonio → +2), exit at a conservative ~3× EBITDA default in the model (slider ranges 1–8×; aspirational 6× still available).
- **Capital stack partners:** **DPEG** (landlord) funds TI; **GP** (the user) + **LP** investors fund the remaining equity per location. Don't rename "DPEG" in the UI — it's load-bearing terminology for the deal.
- **Brand voice:** warm, neighborhood-first, "Everybody's Welcome." Never franchise-y, never a food court.

## Source of truth

**The web app is now the source of truth for financial-model math** (as of April 2026). Two Excel files in the parent folder are regenerated from the web app, not hand-maintained:

```
../../The Barn — Financial Model.xlsx          ← portfolio (7-loc) generated artifact
../../Richmond Financial Model.xlsx            ← Richmond-only (1-loc) generated artifact
./build_xlsx.py                                ← portfolio generator (committed)
./build_richmond_xlsx.py                       ← Richmond generator (committed)
../../Archive Docs/xlsx-backups/               ← date-stamped snapshots from prior versions
```

**Standing rule (April 2026):** Any time `DEFAULT_INPUTS` (`src/utils/types.ts`) or `runModel` (`src/utils/engine.ts`) changes, regenerate **both** xlsx files in the same task:
```
python3 build_xlsx.py
python3 build_richmond_xlsx.py
```
Both must agree with the web app to the dollar. If a new input field or new MonthlyRow column is added, update both generator scripts first (Inputs sheet + downstream formulas) before regenerating. Don't hand-edit either xlsx — re-run the script.

Verification after regen: run `npx tsx audit.ts` for the web-app baseline, then sanity-check the xlsx KPIs sheet against those numbers. They should match within ~1bp on IRR (Excel uses uniform-period IRR annualized; web app uses XIRR with day counts) and exactly on MOIC / CoC / equity / distributions / exit.

Other reference assets in `../../`:

- `Initial Decks/Barn Full Proposal.pdf` — narrative long-form
- `Initial Decks/Barn Deck.pdf` — pitch deck
- `Layout/TheBarn_SpaceAllocation.xlsx` — V1 / V2 / Comparison / MEP tabs; drives `/layout` zone numbers
- `Layout/Detailed Layout Plan.docx` — locked narrative for both versions (supersedes the old `Detailed Layot Plan.pdf` — typo file, kept for now)
- `Layout/Layout_Sketch_Description.md` — companion markdown describing the V1 + V2 bird's-eye sketches for redraw
- `Layout/Plans/Plans and Specs bldg. F - Part 1/2/3.pdf` — Gensler Issue For Permit set (12/17/2021). Key sheets: A02.F02, A02.F03, A02.F05, M01.F02, P01.F02, E01.F02, E03.F00, P02.F00
- `Layout/Richmond SOW Internal.pdf` — full V1 capital expenditure scope of work ($1.754M total, 9 categories, 59 line items). Drives `/capex` tab content. Edit the inline arrays at the top of `src/pages/CapEx.tsx` if the SOW changes.
- `Visual Assets/` — original photography and mockups (legacy / reference only).
- `Visual Assets 2/` — 18 numbered AI-rendered concept images (V1 narrative order). Source for the `/renderings` tab. Numbering is load-bearing — `1. Hero Image.png` → `18. Barn Ops UI 2.png` is the intended scroll order. When adding/replacing renderings, drop the source PNG into `Visual Assets 2/`, then re-export to `public/renderings/NN-slug.jpg` at quality 85 (use `sips -s format jpeg -s formatOptions 85`); the page references JPGs by URL-safe slug.

## Tech stack

- React 19 + TypeScript + Vite 8
- Tailwind v4 (via `@tailwindcss/vite`) — theme tokens in `src/index.css` under `@theme`
- React Router v7
- Recharts for cash-flow chart
- Deployed on Vercel (`vercel.json` present)

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint
npm run preview   # preview built output
```

## Routes & page responsibilities

**Tab labels** (April 2026 rebrand — URLs unchanged):
The Vision · The Vibe · The Layout · CapEx · OpEx · The Numbers
(was: Strategy · Financial Model · Space Layout · CapEx · OpEx · Renderings)

| Route | File | Display label | Purpose |
|---|---|---|---|
| `/` | `src/pages/Landing.tsx` | — | Feature-wall hero + 6 nav buttons in display order: The Vision / The Vibe / The Layout / CapEx / OpEx / The Numbers |
| `/strategy` | `src/pages/Strategy.tsx` | **The Vision** | Narrative: The Plan → Scale Vision → Richmond at a Glance → Opportunity → Concept → Tech → Brand |
| `/renderings` | `src/pages/Renderings.tsx` | **The Vibe** | Single-scroll photo essay of 18 V1 concept renderings (hero → moods → exterior → interior → vendor detail → birds-eye → app UI), each with a numbered title and short caption. Images live in `public/renderings/`. |
| `/layout` | `src/pages/Layout.tsx` | **The Layout** | V1 / V2 toggle — V1 Left Zone (~9,180 sf, Path A single row at core wall) vs V2 Full L2 (~14,500+ sf, mirrored Path A) |
| `/capex` | `src/pages/CapEx.tsx` | **CapEx** | Full Richmond V1 SOW — 9 categories, 59 line items, $1.754M. Static (data inlined from `Richmond SOW Internal.pdf`). |
| `/opex` | `src/pages/Opex.tsx` | **OpEx** | Unified read-only OpEx roll-up driven live from `useModel()`. Each block has an "Edit Details" link to the corresponding `/model/opex/*` page. |
| `/model` | `src/pages/Model.tsx` | **The Numbers** | Interactive model with **Richmond / Full Portfolio** toggle |
| `/model/opex/vendor-utilities` | `src/pages/OpexVendorUtilities.tsx` | (subroute) | Detailed gas/electric/water breakdown per vendor (editable) |
| `/model/opex/common-utilities` | `src/pages/OpexCommonUtilities.tsx` | (subroute) | Common-area gas + electric + water (editable) |
| `/model/opex/non-utility` | `src/pages/OpexNonUtility.tsx` | (subroute) | Marketing, cleaning, grease, security, maintenance, insurance, technology, misc (editable) |

## Model architecture

Single shared state via `src/utils/ModelContext.tsx` → `ModelProvider` wraps the whole app.

**Inputs** (`src/utils/types.ts` → `ModelInputs`):
- Capital stack: `sqft`, `tiPSF`, `baseRentPSF`, `nnnPSF`, `capexPSF`, `gpInvestment`, `debtPerLocation`, `debtRatePct`
  - Total CapEx is derived: `sqft × capexPSF` (default $150/psf × 9,180 sf ≈ $1.38M — V1 Richmond left-zone baseline). Never store a total-dollar CapEx field — the PSF coupling keeps sqft, TI, lease, and CapEx moving together, which is the CFO-defensible behavior.
  - Capital stack order: `TI + Debt + GP + LP = CapEx`. Debt is clamped at `max(0, capex − TI − GP)` so it can't squeeze LP below zero — the slider visually appears "stuck" past that point and the summary row shows "(capped)".
- Revenue: `vendors[]`, `revenueModel` (`'base' | 'pct' | 'mixed'`), `pctOfSalesRate`, `mixedBaseRent`, `mixedPctRate`, `rentIncludesUtilities`, `nonRentRevenue` (per-location $/mo, default $0, escalates with rent), `spaceLeasedPct` (default 100%, scales rent only — OpEx unchanged)
- Detailed OpEx: `gas`, `electric`, `water`, `nonUtility` (each with scenario `'low' | 'mid' | 'high'`)
- Comp: `salaryBase`, `salaryStep`, `profitSharePct`
- Deal terms: `numLocations`, `exitMultiple`, `rampMonths`, `l1LeaseHolidayMonths`, `openSchedule[]`, `holdMonths`
  - Default `openSchedule: [4, 16, 20, 24, 28, 32, 36]` — first value is 4 because equity is called 3 months prior to open.

**Engine** (`src/utils/engine.ts`):
- `capitalStack()` → `totalCapex`, `tiTotal`, `investorEquityPerLocation`, `lpInvestment`
- `vendorTotals()` → `monthlyVendorRentPerLocation` + `escalatingRent` / `flatRent` split (drives the rent escalator)
- `gasMonthly()`, `electricMonthly()`, `waterMonthly()`, `nonUtilityBreakdown()` — mirror xlsx formulas
- `opexBreakdown()` → vendor + common + non-utility totals (respects `rentIncludesUtilities`)
- `runModel()` → monthly cash-flow array + IRR/MOIC/CoC/stabilized CoC/exit proceeds (net to investors). Iterates per-location every month so escalators apply on each location's own clock.
- `xirrFromMonthly()` in `src/utils/xirr.ts` — Newton-Raphson XIRR. Returns `NaN` (not a clamp value) when it can't converge to within tolerance. This matters: prior versions silently clamped at 1000% on degenerate cash flows, producing bogus dashboard readings; the engine now propagates `NaN` and the UI renders `"—"`.

**Key engine conventions (CFO-signed-off):**
- **Capital calls fire at `max(1, openSchedule[i] − 3)`** — 3-month buildout period where CapEx is actually spent.
- **Exit EBITDA** = T12 `preCompEBITDA` (owner comp added back per industry PE normalization), NOT post-salary. Gross exit = `exitMultiple × T12 preCompEBITDA`. Net equity proceeds = `MAX(0, grossExit − debtPayoff)` (balloon paid off first if any debt remains). Investor exit = netEquity × (1 − profitSharePct); operator promote on the same net-of-debt base.
- **Operator's profit share (`profitSharePct`, default 10%)** applies to BOTH ongoing distributions and exit proceeds. No preferred return, no waterfall, no catch-up.
- **Ramp is a distribution reserve, not a revenue ramp.** The hall is pre-leased from day 1; revenue and opex start at 100% the month a location opens. `rampMonths` simply delays distributions (builds operating cash reserve). **Side effect:** any cost or savings that lands inside the ramp window (months `openMonth` through `openMonth + rampMonths − 1`) is silently absorbed by the reserve and never reaches investor cash flow. Concretely, dropping `l1LeaseHolidayMonths` from 3 → 2 at default doesn't change IRR because month 6 is still within ramp; raising it from 3 → 4 DOES help, because month 7 is post-ramp. This is conservative for investor returns by design — don't "fix" it without changing the ramp-as-reserve convention.
- **Model is pre-tax.** No tax modeling. `gpInvestment` is a pure GP/LP split when there's no debt — it does not affect aggregate investor IRR/MOIC/CoC (invariant). With debt, GP still doesn't move investor-aggregate KPIs but it does shift the LP residual.
- **MonthlyRow fields:** `preCompEBITDA` (pre-owner-comp), `postSalaryEBITDA` (after corp salary), `interestExpense`, `debtPrincipalPaid`, `debtServicePayment` (the full P&I number), `distributableNOI`, `profitShare` (monthly promote), `distributions` (net to investors), `exitProceeds` (net to investors on exit), `exitProfitShare` (operator's exit promote, shown for transparency).
- **Undefined-KPI handling (added Apr 2026):** when a metric is genuinely undefined for a given scenario, the engine returns `NaN` so `fmtPct` / `fmtMultiple` render `"—"` rather than a misleading 0%. Triggers: IRR/MOIC/ROI when totalEquity = 0; AvgCoC when no distributions ever flowed; StabilizedCoC unless the deal is actually stabilized (last month has all active locations distributing AND a full 12-row T12 window). The hold slider can reach 0 (in 6-mo steps) so these guards keep the dashboard sensible at slider edges.
- **Annual escalators (added Apr 2026):** three independent compounding escalators on `ModelInputs`:
  - `rentEscalatorPct` (default 3) — applies to base rent only. Base mode: full rent escalates. Mixed mode: only the base portion escalates. % of Sales mode: nothing escalates (sales assumed flat).
  - `opexEscalatorPct` (default 3) — applies to vendor utilities, common-area utilities, non-utility OpEx, AND operator salary (`salaryBase` + `salaryStep`). Profit share is excluded by definition (it's a % of NOI).
  - `baseRentEscalatorPct` (default 0) — applies only to the contract base rent.
  - `nnnEscalatorPct` (default 2) — applies only to NNN pass-throughs (CAM + property tax + insurance), which typically inflate faster than base rent.
  - **Clock convention:** per-location, Year 0 = first 12 months from each location's open month. Year 1 starts at month 12, Year 2 at month 24, etc. Factor at month-since-open `k` = `(1 + esc)^floor(k/12)`. Salary uses L1's open as a single portfolio-wide clock since salary is corporate, not per-location.
  - **Lease holiday interaction:** `l1LeaseHolidayMonths` zeroes the lease for L1's first N months regardless of escalator. The escalator clock keeps ticking from open month, so the holiday doesn't reset Year 0.
  - **Exit math:** `MAX(0, exitMultiple × T12 preCompEBITDA − debtPayoff) × (1 − profitShare)` net to investors. T12 at exit naturally captures whatever year each location is in, so escalators flow into exit value automatically. `debtPayoff` is the sum of remaining loan balances at the exit month (zero unless senior debt is configured with `debtTermYears > holdMonths/12`).
- **Senior debt:** `debtPerLocation` (default $0, range $0–$1M), `debtRatePct` (default 0%, range 0–20%), `debtTermYears` (default 10, slider 5–20 in 5-yr steps). Loan funds at each location's capital-call month (`max(1, openMonth − 3)`) and amortizes on a fixed level-monthly-P&I schedule of `debtTermYears × 12` months — **decoupled from `holdMonths`**. If term > hold, the remaining balance at exit is the **balloon**, paid off from gross exit proceeds before the operator promote and investor split. If term ≤ hold, the loan fully amortizes mid-hold and there is no balloon. Engine details: `interestExpense` and `debtServicePayment` are subtracted from `postSalaryEBITDA` *before* the ramp ratio (debt service is a hard cost). `MonthlyRow` exposes `interestExpense`, `debtPrincipalPaid`, `debtServicePayment`, `loanBalance`, `debtPayoff`. Exit math is **`MAX(0, exitMultiple × T12 preCompEBITDA − debtPayoff) × (1 − profitSharePct)`** to investors; operator promote is on net-of-debt equity proceeds. Default 10-yr term matches typical CRE term-loan structures (lower P&I drag than a hold-matched loan, balloon refinanced or paid at exit). Default exit multiple lowered to 3× (down from 6×) — slider 1–8× covers the full range.

**Richmond vs Portfolio:** `Model.tsx` overrides `numLocations: 1`, `openSchedule: [4]` (L1 opens m=4, capital called m=1), and `holdMonths` is driven by the Hold Period slider inside `RichmondDealTermsPanel`. **Hold Period slider** (both Richmond and Portfolio): range 0–72 mo in 6-mo steps. Sliding to 0 produces an empty cash flow array; KPIs render as "—". The portfolio `InvestorPanel` hides in Richmond mode; the `RichmondDealTermsPanel` takes its 4th-column slot. `OpexPanel` accepts `isRichmond` and hides the Salary Increment slider (inert with 1 location).

**Current default baseline (Apr 30 2026, post-promote-cut to 5%):**
- Richmond 36mo (app default): **IRR 15.08%, MOIC 1.427×, Stab CoC 18.20%**, Exit $1,238,259, Total Distributions $530,631, Total Returns $1,768,890.
- Portfolio 7×48mo (app default): **IRR 16.15%, MOIC 1.361×, Stab CoC 21.14%**, Exit $8,349,395, Total Distributions $3,460,896, Total Returns $11,810,291.

Note: **`DEFAULT_INPUTS.holdMonths = 48`** (drives Portfolio); the Richmond Hold Period slider initializes at **36** via `useState<number>(36)` in `Model.tsx`. The split is intentional — a 36-mo hold breaks the default portfolio because `openSchedule[6] = 36` would put L7's open month AT exit. If `holdMonths` is ever lowered for portfolio mode, also compress `openSchedule` so all opens land ≥12 months before exit.

These flow from: 9,180 sf × $170 = $1.561M CapEx; $321k TI; $1.239M investor equity per loc (200k GP + 1.039M LP); $72k/mo total vendor rent (8×$6.5k food + 4×$5k non-food); **$20.8k/mo total Year-0 OpEx** (vendor utils $6.6k + common utils $2.6k + non-utils $11.5k); $27.2k/mo lease (Year 0 = base $26 + NNN $9.50 × 9180 sf / 12); 4% rent + 3% OpEx + 2% base-rent + 2% NNN escalators; $0 debt; 4× exit multiple; **5% promote**; 0-mo L1 lease holiday.

## Design system

**Colors** (Tailwind tokens in `src/index.css`):
- `cream` `#FAF8F5` · `walnut` `#5C4033` · `honey` `#C49A6C` · `sage` `#8B9D77` · `terracotta` `#C27D5B` · `walnut-light` `#7A5E4F`

**Utility classes worth knowing:**
- `.glass` / `.glass-dark` — frosted card surfaces (default container for panels, KPI cards)
- `.reveal` + `useReveal()` — IntersectionObserver fade-up on scroll (content is visible by default; `.reveal-ready` gate prevents blank-page bugs if the observer fails)
- `.glow-hover`, `.hover-lift`, `.float-anim`, `.fade-up` / `.fade-up-d{1-4}`
- `.tabular-nums` — use on any number column/KPI

**Panel convention (`src/components/panels/`):** each panel is a self-contained card with icon + title, `SliderRow`s for inputs, and a `mt-auto pt-4` bottom-aligned derived-KPI section using `<DerivedRow>`. Keep this pattern when adding new panels.

**Icons:** inline Heroicons-style SVGs (no icon library).

**Tooltips:** use `<InfoTooltip content="..." />` for hover-revealed explanations. Already wired into: KPI cards, summary row, page title (equity-only disclosure), Timeline section headers, and the Ramp Period slider. `SliderRow` accepts an optional `info` prop that renders an inline tooltip next to the label. Prefer tooltips over inline copy for anything a CFO might want to verify the convention for.

## Richmond layout spec (locked — April 2026)

Site: Building F, Level 2, Marcel Harvest Green, 18806 W Airport Blvd, Richmond, TX 77406. Landlord: DPEG. Architect of Record: Gensler. Shell delivered as "Shell Space Only — Tenant Buildout NIC."

**Level 2 shell reality** (per Gensler permit set):
- ~196′ × 90′ ≈ 17,640 sf gross, split by a central core (~30′ × 30′ — Mech/Elec + elevator + stairs).
- Left zone ~102′ × 90′ ≈ **9,180 sf** (V1 scope). Right zone ~85′ × 90′ ≈ 7,650 sf.
- **All 4 perimeter sides are storefront glazing** — no solid exterior walls. The core wall is the ONLY solid interior wall.
- Exposed wood trusses throughout (preserved as a design feature).
- Roof: sloped standing-seam metal on long sides + central flat TPO zone above the core — **hood exhaust penetrations MUST land in the central TPO zone**.
- Floor-to-floor: Level 2 slab at 14′-8″ above grade; low roof 42′-8″, high roof 47′-0⅜″ (generous interior volume under the gable).
- **Terrace on L2** (see A08.005 — guardrail, drain, storefront edge details) — usable outdoor area on our floor.
- **Access:** core stairs + elevator through central core, plus an exterior stair (A09.F02). No ground-floor street frontage — wayfinding/signage is a narrative item for the Strategy page.
- **L2 occupant load: 164** (per code review) — ceiling on combined seating + vendor + circulation capacity.
- **Code:** 2018 IBC, Type II-B, Occupancy B, fully sprinklered (NFPA 13), outside 100-yr floodplain — all positives for insurance/underwriting.
- **Exterior palette:** Cooperstown brick (UM01, running bond, rough) + Ballpark brick (UM02, angled) + slate-gray standing-seam metal (MTL01) + "Aria" stucco (STC01, PPG 1001-2). Gable ends face Harlem Rd corner — inherently barn-like, no facade work needed to sell the brand.

**Path A (both versions):** single linear row of food stalls anchored to the core wall. Cooking at back against core · prep middle · counter front. Stall = 10′ × 28′ = 280 sf. Gathering opens outward to the window walls. Kiosks are NOT placed at the core wall — they float through the gathering zone.

**V1 (PRIMARY — 9,180 sf left zone):** 8 food stalls (2,240 sf) + 4 kiosks (HB 280sf + Coffee 220sf + Dessert ×2 @ 220sf) + ~500 sf restrooms + ~800 sf circulation/BOH + ~4,700 sf gathering. Basis for Richmond deal + first SOW + CapEx model.

**V2 (alternate — ~14,500+ sf full L2):** mirrored Path A, 16 food stalls + 6-kiosk preliminary program (HB + C + 3 dessert + 1 specialty TBD), ~800 sf restrooms + ~1,500 sf circulation/BOH + ~6,280 sf gathering. Pitch conversation with DPEG.

**Buildout package per food stall — "Heavy Warm minus Refrigeration":** The Barn delivers hood + UL 300 suppression + FRP walls + 3-comp + hand sinks + floor drains + utility stub-outs (electrical subpanel, water, sewer, gas manifold sized for 4 equipment connections). Vendor brings all cooking equipment AND all refrigeration (vendor's choice of under-counter / reach-in / walk-in). Kiosks: no gas, no hood, no fire suppression — electrical + water + waste only.

**Critical infrastructure flag — gas service upgrade (P02.F00):** Current Bldg F gas is 7,000 CFH @ 5 PSI for all tenants. V1 needs 32,000–35,000 CFH peak; V2 needs 64,000–70,000 CFH. CenterPoint upgrade confirmed available by DPEG but must be scheduled early in Discovery/Design or buildout permits will hold.

**Model reconciled to V1 (April 2026):** `DEFAULT_INPUTS.sqft = 9_180` and vendor array = 8 Food + 4 Non-Food kiosks (12 total — Non-Food consolidated into one row covering the HB + Coffee + 2 Dessert kiosks). Total monthly vendor rent baseline = $76k (8×$7k food + 4×$5k non-food). Non-food kiosks all share $25k/mo sales for the percent-of-sales mode.

Vendor utility usage was lowered in late April 2026 (rates unchanged, market-realistic):
- Gas equipment duty cycles cut ~33%: Fryer 0.50→0.33, Griddle 0.45→0.30, Charbroiler 0.30→0.20, Range 0.35→0.23.
- Electric vendor duty cycles cut 25% (baseLoad + foodAddOn). Common-area loads untouched.
- Water vendor gallons-per-day cut 25%: food 350→263, non-food 157→118. Common-area gallons untouched.
- Net: monthly vendor utilities $11.0k → $6.6k.

Common-area gas added (was missing — gas was food-vendor-only):
- 2-line breakdown: water heater (75 therms/mo, year-round) + space heating (175 therms/mo, annualized — assumes gas furnace).
- $263/mo at $1.05/therm midRate. Editable on `/model/opex/common-utilities`.

Non-utility OpEx tightened (Apr 28 2026):
- **Insurance** simplified from 7 lines to 3 (still $2k total): GL $700, Property + Business Income $1,000, Umbrella $300. (Removed Liquor / Workers Comp / Cyber / Crime — fold into Property when broker quote arrives.)
- **Cleaning** $5,000 → $2,700 (from 2 staff to 1 staff @ 6h/day × 30 days × $15/hr) + $500 supplies = $3,200 total. Saves $2,300/mo.
- **Marketing** $3,000 → $2,500 (5 lines scaled proportionally). Saves $500/mo.
- **Technology** $900 → $700 (removed POS line — vendors carry their own POS). Saves $200/mo.

Total Year-0 monthly OpEx: $20.8k (was $23.8k pre-tightening).

`audit.ts` sqft perturbation set to 7,344 / 11,016 (±20% of 9,180). If V2 ever becomes the modelled case, bump `sqft` to ~14,500 and roughly double food-vendor count (16) + non-food kiosks (6).

**Floor-plan rendering on `/layout`:** V1 renders the birdseye blueprint image (`public/renderings/15-birdseye-blueprint.jpg`, sourced from `Visual Assets 2/15. Birdseye Blueprint.png`) via a simple `<img>` in the `V1FloorPlan` component — this is the investor-facing artifact, keep it in sync with any spec changes. V2 still uses the hand-built ASCII/CSS `V2FloorPlan` (no V2 blueprint rendered yet); if/when a V2 blueprint arrives, drop the PNG into `Visual Assets 2/`, re-export to `public/renderings/` at JPG Q85, and swap `V2FloorPlan` to the same `<img>` pattern as V1.

## CapEx & OpEx tabs (added April 2026)

Two top-level tabs sit alongside Strategy / Financial Model / Space Layout in the NavBar.

**`/capex` (`src/pages/CapEx.tsx`)** — view of the Richmond V1 SOW with a **V1 / V2 toggle** (V1 = default; V2 = post-Niyi-Apr-29 revisions). All numbers are **inlined as TypeScript constants** at the top of the file (cat1Items, cat2aItems...cat9Items for V1; cat1ItemsV2 ... cat9ItemsV2 for V2 — V2 currently initializes as a deep clone of V1 via `.map(i => ({ ...i }))` and diverges per line item by replacing the clone with explicit literals or surgical `.map` overrides). Why inline rather than data-driven: the SOW is the deal artifact, not a model input. The `computeTotals()` factory takes a categories array + cat9 items and returns a `CapExData` object (hardCosts, softCosts, contingency, totalProjectCost, tiAllowance, netEquity, capexPSF) — `V1_DATA` and `V2_DATA` are precomputed at module scope and the active one is passed to `SummaryCard` / `CategoryCard`. Cat 2 (MEP) is the only category with sub-categories (2a HVAC → 2g Low-Voltage); other categories use a flat line-item list. Includes the gas service upgrade callout and Critical Path sequencing block — both are demo-grade copy, edit carefully.

**`/opex` (`src/pages/Opex.tsx`)** — unified read-only roll-up of all OpEx categories pulling live values via `useModel()`. Mirrors the CapEx tab's expandable-category UX. Each block has an **"Edit Details" button** that routes to the corresponding `/model/opex/*` detail page — that's where editing happens. **Do not duplicate edit affordances on `/opex`** (that would create two write paths into the same state). The tab also surfaces a Monthly Roll-Up card (vendor utils + common + non-utils + operator salary → total monthly + annual) and a "How OpEx Flows Into the Model" explainer.

**Pattern shared by both tabs:** category card → expandable line items → optional second-level expand for scope notes / per-item calculation. `toneStyles` map + numbered category dots = visual taxonomy. Both pages are unauthenticated client-side routes — no SEO, no markup beyond the NavBar/footer scaffold.

## Renderings tab (added April 2026)

**`/renderings` (`src/pages/Renderings.tsx`)** — single linear photo-essay of 18 AI-rendered concept images for V1. The narrative arc (set in source filenames `1.` → `18.` and preserved in URL slugs `01-` → `18-`) is intentional and load-bearing: hero (1) → moods/exterior (2–4) → interior moments (5–9) → vendor detail (10–13) → birds-eye plan (14–15) → app UI (16–18). Don't reorder unless you're rebuilding the narrative.

**Asset pipeline:** Source PNGs are 1536×1024 (~2–3 MB each, 42 MB total). Page references **JPGs at quality 85** in `public/renderings/` (~10 MB total) — the conversion is not part of the build. To refresh after editing source: re-run `sips -s format jpeg -s formatOptions 85` per-file and overwrite. Captions on each rendering are written into the `renderings` array at the top of the file — they're brand voice, not literal description; review before changing.

**Performance:** First two images load eager, remaining 16 are lazy. No image optimization beyond JPG-Q85 — Vite serves `public/` as static assets without the Next.js `next/image` machinery. If the page ever feels slow, the next lever is responsive `srcset` + a smaller mobile variant, not further compression.

## Conventions & gotchas

- **Shared state:** always read/write model inputs through `useModel()`. Panel components take `{ inputs, onChange }` props and delegate `onChange(setInputs)` up from `Model.tsx`.
- **Money formatting:** `fmtDollarFull` / `fmtDollar` / `fmtPct` / `fmtMultiple` from `src/utils/format.ts`. Don't roll your own. `fmtPct` and `fmtMultiple` render any non-finite value (NaN/Infinity) as "—" — relied on by the engine to signal undefined KPIs at slider edges.
- **Richmond overrides must not mutate `inputs`** — compute `activeInputs` via `useMemo`, as `Model.tsx` already does. All sliders stay bound to full portfolio state.
- **OpEx detail pages** (`/model/opex/*`) read directly from `useModel()` and write back via `setInputs`. Keep the URL structure stable — links from `OpexPanel` AND from the `/opex` top-level tab point to them. Editing happens here; `/opex` is read-only.
- **Scenario rates:** `low / mid / high` for gas/electric/water rates live inside each config object and are selected via `scenarioRate()` in the engine.
- **No comments in code** unless the *why* is non-obvious. The existing code follows this.
- **Don't create new docs/READMEs** unless asked.
- **xlsx must stay in sync with the web app.** Any change to `DEFAULT_INPUTS` or `runModel` requires regenerating BOTH `python3 build_xlsx.py` (portfolio) AND `python3 build_richmond_xlsx.py` (Richmond) from the project root in the same task. Both xlsx files live at `~/Documents/The Barn/` (outside the repo) and must agree with the app to the dollar. Backups go to `~/Documents/The Barn/Archive Docs/xlsx-backups/`. Don't hand-edit either xlsx — re-run the generator. New ModelInputs fields or MonthlyRow columns require updating both generator scripts first (Inputs sheet + downstream formulas).
- **Scroll-to-top on navigation:** `src/components/ScrollToTop.tsx` resets scroll on every route change. Mounted once in `App.tsx` inside the Router. Browser auto-scroll-restoration is disabled in `main.tsx` (`history.scrollRestoration = 'manual'`) so back/forward navigation also lands at the top. If a future page wants to preserve scroll (e.g., long detail page with deep-link anchors), it must opt-in explicitly — don't unwind this convention by default.
- **Mobile patterns:** `NavBar.tsx` collapses to a hamburger drawer below `md`. `InfoTooltip.tsx` is tap-to-toggle with outside-tap close + viewport-clamped width (`max-w-[min(16rem,calc(100vw-2rem))]`) so it can't overflow. Wide tables use the `.scroll-fade-x` utility (defined in `src/index.css`) which adds a right-edge gradient hint below `md`. Expandable sections use a prominent honey-tinted circular chevron badge next to the title (NOT a tiny far-right caret) — see `Opex.tsx`, `CapEx.tsx`, `Layout.tsx` for the pattern.

## Working with this repo

- The user is the GP/operator — they own the numbers and the narrative. When in doubt on copy or defaults, ask before changing.
- Investor-facing polish matters: type hierarchy, spacing, currency formatting, hover states. Test visually in the browser after UI changes.
- Memory system at `~/.claude/projects/-Users-hamzaali-Documents-The-Barn-Claude-Code-the-barn-model/memory/` holds cross-session context; this file holds in-repo context.

## Financial model audit

Two complementary audit scripts live at the project root. Both are committed.

### `audit.ts` — comprehensive ±20% audit + cross-checks

Trigger phrase: **"run financial model audit"** (or any close variant). Executes `audit.ts` via `npx tsx audit.ts` and delivers a CFO-grade report.

**What the audit must always test:**
1. **Baselines** — Richmond 48-mo and Portfolio 48-mo at `DEFAULT_INPUTS`, with a manual sanity cross-check of capital stack, monthly vendor rent, monthly OpEx, and stabilized pre-comp EBITDA against first principles.
2. **±20% on every adjustable variable** — each slider-controlled field tested at default, default × 0.8, and default × 1.2. Round cleanly for integer fields (months, `numLocations`). Print a 3-column LO/BASELINE/HI table per variable covering: IRR, MOIC, StabCoC, TotDist, Exit, Equity. Assert expected IRR direction; flag mismatches.
3. **Revenue model toggles** — test `pctOfSalesRate`, `mixedBaseRent`, `mixedPctRate` within their own models (cross-mode comparisons should be marked `'either'` direction so they don't false-positive flag).
4. **OpEx scenario lattice** — run all-LOW / all-MID / all-HIGH plus single-axis-HIGH rows to show utilities sensitivity range.
5. **Portfolio-only variables** — `numLocations`, `salaryStep` (inert in Richmond).
6. **Industry-method cross-checks (all must reconcile):**
   - MOIC = `totalReturns / totalEquity`
   - Stab CoC = last-12-month distributions ÷ total equity
   - Exit = `MAX(0, exitMultiple × T12 preCompEBITDA − debtPayoff) × (1 − profitSharePct)` (debtPayoff is the sum of per-location balloon balances at the exit month — zero by default since `debtPerLocation = 0`)
   - IRR NPV = 0 at the computed rate (verify XIRR convergence)
   - Capital call month = `openSchedule[0] − 3` (clamped at 1)
   - `gpInvestment` invariant: IRR/MOIC identical for any GP amount
   - `salaryStep` inert in Richmond
   - Distributions reconciliation: `sum(monthly.distributions) === totalDistributions`

**What "pass" looks like:** every ± direction matches expectation, every manual reconciliation matches engine to within rounding, every invariant holds. Any ⚠️ must be explained.

**Maintenance:** if a new slider is added to a panel, add a corresponding ±20% test to the `perturbations` array. For asymmetric tests where both arms differ from baseline in the same direction (e.g., perturbing a default-zero input upward), use `expectDirIRR: 'either'` with a note explaining the LO vs HI relationship — symmetric direction-checks don't apply there.

### `audit_sliders.ts` — ±10% sensitivity sweep across every UI slider

Run via `npx tsx audit_sliders.ts`. Faster, focused, NaN-aware: for sliders whose default sits at 0 or at a slider boundary, uses a sensible perturbative value instead of strict ±10%. When IRR is undefined (XIRR can't converge — degenerate cash flows), falls back to MOIC for the direction check. Use this when you want a quick read on whether anything's moved in the wrong direction across the full UI surface.

Both audits should pass before the model goes in front of investors. The two are complementary: `audit.ts` is the deep cross-check pass; `audit_sliders.ts` is the sweep across every slider in 34 short rows (covers all CapitalStack / Revenue / OpEx / Investor / Richmond panels including per-location open-schedule sliders and the loan-term slider).

**Delivery format:** concise CFO-grade markdown summary with a ✅/⚠️/🚨 bucket structure — GREEN items (math verified), YELLOW items (design choices to confirm), RED items (probable demo hazards).

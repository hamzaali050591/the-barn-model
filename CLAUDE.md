# The Barn — Investor Web App

Interactive investor-facing companion to The Barn's pitch deck and financial model. Shown live to prospective LPs/partners — **polish and copy quality matter as much as the code**.

## The concept (for context when making copy/design calls)

- **The Barn** is a curated, tech-enabled food hall. Richmond, TX is the flagship/proof-of-concept.
- **Long-term vision:** 7 Texas-suburb locations over ~4 years (Richmond → Fulshear → Frisco → Plano → San Antonio → +2), exit at ~6× EBITDA.
- **Capital stack partners:** **DPEG** (landlord) funds TI; **GP** (the user) + **LP** investors fund the remaining equity per location. Don't rename "DPEG" in the UI — it's load-bearing terminology for the deal.
- **Brand voice:** warm, neighborhood-first, "Everybody's Welcome." Never franchise-y, never a food court.

## Source of truth

The authoritative financial model lives in the parent folder:

```
../../The Barn — Financial Model.xlsx
```

When changing default inputs (`DEFAULT_INPUTS` in `src/utils/types.ts`) or formulas in `src/utils/engine.ts`, cross-check against the xlsx. Other reference assets in `../../`:

- `Initial Decks/Barn Full Proposal.pdf` — narrative long-form
- `Initial Decks/Barn Deck.pdf` — pitch deck
- `Layout/TheBarn_SpaceAllocation.xlsx` + `Layout/Detailed Layot Plan.pdf` — drives `/layout` zone numbers
- `Visual Assets/` — photography and mockups

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

| Route | File | Purpose |
|---|---|---|
| `/` | `src/pages/Landing.tsx` | Feature-wall hero + 3 nav buttons |
| `/strategy` | `src/pages/Strategy.tsx` | Narrative: The Plan → Scale Vision → Richmond at a Glance → Opportunity → Concept → Tech → Brand |
| `/model` | `src/pages/Model.tsx` | Interactive model with **Richmond / Full Portfolio** toggle |
| `/model/opex/vendor-utilities` | `src/pages/OpexVendorUtilities.tsx` | Detailed gas/electric/water breakdown per vendor |
| `/model/opex/common-utilities` | `src/pages/OpexCommonUtilities.tsx` | Common-area utilities |
| `/model/opex/non-utility` | `src/pages/OpexNonUtility.tsx` | Marketing, cleaning, grease, security, etc. |
| `/layout` | `src/pages/Layout.tsx` | 10,000sf zone-by-zone allocation |

## Model architecture

Single shared state via `src/utils/ModelContext.tsx` → `ModelProvider` wraps the whole app.

**Inputs** (`src/utils/types.ts` → `ModelInputs`):
- Capital stack: `sqft`, `tiPSF`, `leasePSF`, `capexPSF`, `gpInvestment`
  - Total CapEx is derived: `sqft × capexPSF` (default $150/psf × 10,000 sf = $1.5M). Never store a total-dollar CapEx field — the PSF coupling keeps sqft, TI, lease, and CapEx moving together, which is the CFO-defensible behavior.
- Revenue: `vendors[]`, `revenueModel` (`'base' | 'pct' | 'mixed'`), `pctOfSalesRate`, `mixedBaseRent`, `mixedPctRate`, `rentIncludesUtilities`
- Detailed OpEx: `gas`, `electric`, `water`, `nonUtility` (each with scenario `'low' | 'mid' | 'high'`)
- Comp: `salaryBase`, `salaryStep`, `profitSharePct`
- Deal terms: `numLocations`, `exitMultiple`, `rampMonths`, `l1LeaseHolidayMonths`, `openSchedule[]`, `holdMonths`
  - Default `openSchedule: [4, 16, 20, 24, 28, 32, 36]` — first value is 4 because equity is called 3 months prior to open.

**Engine** (`src/utils/engine.ts`):
- `capitalStack()` → `totalCapex`, `tiTotal`, `investorEquityPerLocation`, `lpInvestment`
- `vendorTotals()` → `monthlyVendorRentPerLocation` (handles all 3 revenue modes)
- `gasMonthly()`, `electricMonthly()`, `waterMonthly()`, `nonUtilityBreakdown()` — mirror xlsx formulas
- `opexBreakdown()` → vendor + common + non-utility totals (respects `rentIncludesUtilities`)
- `runModel()` → monthly cash-flow array + IRR/MOIC/CoC/stabilized CoC/exit proceeds (net to investors)
- `xirrFromMonthly()` in `src/utils/xirr.ts`

**Key engine conventions (CFO-signed-off):**
- **Capital calls fire at `max(1, openSchedule[i] − 3)`** — 3-month buildout period where CapEx is actually spent.
- **Exit EBITDA** = T12 `preCompEBITDA` (owner comp added back per industry PE normalization), NOT post-salary. Net exit to investors = gross × (1 − profitSharePct).
- **Operator's profit share (`profitSharePct`, default 10%)** applies to BOTH ongoing distributions and exit proceeds. No preferred return, no waterfall, no catch-up.
- **Ramp is a distribution reserve, not a revenue ramp.** The hall is pre-leased from day 1; revenue and opex start at 100% the month a location opens. `rampMonths` simply delays distributions (builds operating cash reserve).
- **Model is equity-only, pre-tax.** No debt, no tax. `gpInvestment` is a pure GP/LP split — it does not affect aggregate investor IRR/MOIC/CoC (invariant).
- **MonthlyRow fields:** `preCompEBITDA` (pre-owner-comp), `postSalaryEBITDA` (after corp salary), `distributableNOI`, `profitShare` (monthly promote), `distributions` (net to investors), `exitProceeds` (net to investors on exit), `exitProfitShare` (operator's exit promote, shown for transparency).

**Richmond vs Portfolio:** `Model.tsx` overrides `numLocations: 1`, `openSchedule: [4]` (L1 opens m=4, capital called m=1), and `holdMonths` is driven by the Hold Period slider inside `RichmondDealTermsPanel` (range 24–72 mo, default 48). The portfolio `InvestorPanel` hides in Richmond mode; the `RichmondDealTermsPanel` takes its 4th-column slot. `OpexPanel` accepts `isRichmond` and hides the Salary Increment slider (inert with 1 location).

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

## Conventions & gotchas

- **Shared state:** always read/write model inputs through `useModel()`. Panel components take `{ inputs, onChange }` props and delegate `onChange(setInputs)` up from `Model.tsx`.
- **Money formatting:** `fmtDollarFull` / `fmtDollar` / `fmtPct` from `src/utils/format.ts`. Don't roll your own.
- **Richmond overrides must not mutate `inputs`** — compute `activeInputs` via `useMemo`, as `Model.tsx` already does. All sliders stay bound to full portfolio state.
- **OpEx detail pages** (`/model/opex/*`) read directly from `useModel()` and write back via `setInputs`. Keep the URL structure stable — links from `OpexPanel` point to them.
- **Scenario rates:** `low / mid / high` for gas/electric/water rates live inside each config object and are selected via `scenarioRate()` in the engine.
- **No comments in code** unless the *why* is non-obvious. The existing code follows this.
- **Don't create new docs/READMEs** unless asked.

## Working with this repo

- The user is the GP/operator — they own the numbers and the narrative. When in doubt on copy or defaults, ask before changing.
- Investor-facing polish matters: type hierarchy, spacing, currency formatting, hover states. Test visually in the browser after UI changes.
- Memory system at `~/.claude/projects/-Users-hamzaali-Documents-The-Barn-Claude-Code-the-barn-model/memory/` holds cross-session context; this file holds in-repo context.

## Financial model audit (`run financial model audit`)

Trigger phrase: **"run financial model audit"** (or any close variant). Executes `audit.ts` at the project root via `npx tsx audit.ts` and delivers a CFO-grade report.

**What the audit must always test:**
1. **Baselines** — Richmond 48-mo and Portfolio 48-mo at `DEFAULT_INPUTS`, with a manual sanity cross-check of capital stack, monthly vendor rent, monthly OpEx, and stabilized pre-comp EBITDA against first principles.
2. **±20% on every adjustable variable** — each slider-controlled field tested at default, default × 0.8, and default × 1.2. Round cleanly for integer fields (months, `numLocations`). Print a 3-column LO/BASELINE/HI table per variable covering: IRR, MOIC, StabCoC, TotDist, Exit, Equity. Assert expected IRR direction; flag mismatches.
3. **Revenue model toggles** — test `pctOfSalesRate`, `mixedBaseRent`, `mixedPctRate` within their own models (note: comparing a mixed-model run to a base-model baseline will show artifactual direction mismatches — that's expected, not a bug).
4. **OpEx scenario lattice** — run all-LOW / all-MID / all-HIGH plus single-axis-HIGH rows to show utilities sensitivity range.
5. **Portfolio-only variables** — `numLocations`, `salaryStep` (inert in Richmond).
6. **Industry-method cross-checks (all must reconcile):**
   - MOIC = `totalReturns / totalEquity`
   - Stab CoC = last-12-month distributions ÷ total equity
   - Exit = `exitMultiple × T12 preCompEBITDA × (1 − profitSharePct)`
   - IRR NPV = 0 at the computed rate (verify XIRR convergence)
   - Capital call month = `openSchedule[0] − 3` (clamped at 1)
   - `gpInvestment` invariant: IRR/MOIC identical for any GP amount
   - `salaryStep` inert in Richmond
   - Distributions reconciliation: `sum(monthly.distributions) === totalDistributions`

**What "pass" looks like:** every ± direction matches expectation, every manual reconciliation matches engine to within rounding, every invariant holds. Any ⚠️ must be explained — most mixed-model direction flags are false positives and should be labeled as such in the report.

**Running:** `npx tsx audit.ts` from the project root. The script lives at `./audit.ts` and is committed — edit it when inputs/formulas change so the audit stays in sync. If a slider is added to a panel, add the corresponding ±20% test to the `perturbations` array.

**Delivery format:** concise CFO-grade markdown summary with a ✅/⚠️/🚨 bucket structure — GREEN items (math verified), YELLOW items (design choices to confirm), RED items (probable demo hazards).

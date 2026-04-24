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

| Route | File | Purpose |
|---|---|---|
| `/` | `src/pages/Landing.tsx` | Feature-wall hero + 6 nav buttons (Strategy / Financial Model / Space Layout / CapEx / OpEx / Renderings) |
| `/strategy` | `src/pages/Strategy.tsx` | Narrative: The Plan → Scale Vision → Richmond at a Glance → Opportunity → Concept → Tech → Brand |
| `/model` | `src/pages/Model.tsx` | Interactive model with **Richmond / Full Portfolio** toggle |
| `/model/opex/vendor-utilities` | `src/pages/OpexVendorUtilities.tsx` | Detailed gas/electric/water breakdown per vendor (editable) |
| `/model/opex/common-utilities` | `src/pages/OpexCommonUtilities.tsx` | Common-area utilities (editable) |
| `/model/opex/non-utility` | `src/pages/OpexNonUtility.tsx` | Marketing, cleaning, grease, security, etc. (editable) |
| `/layout` | `src/pages/Layout.tsx` | V1 / V2 toggle — V1 Left Zone (~9,180 sf, Path A single row at core wall) vs V2 Full L2 (~14,500+ sf, mirrored Path A) |
| `/capex` | `src/pages/CapEx.tsx` | Full Richmond V1 SOW — 9 categories, 59 line items, $1.754M. Static (data inlined from `Richmond SOW Internal.pdf`). |
| `/opex` | `src/pages/Opex.tsx` | Unified read-only OpEx roll-up driven live from `useModel()`. Each block has an "Edit Details" link to the corresponding `/model/opex/*` page. |
| `/renderings` | `src/pages/Renderings.tsx` | Single-scroll photo essay of 18 V1 concept renderings (hero → moods → exterior → interior → vendor detail → birds-eye → app UI), each with a numbered title and short caption. Images live in `public/renderings/`. |

## Model architecture

Single shared state via `src/utils/ModelContext.tsx` → `ModelProvider` wraps the whole app.

**Inputs** (`src/utils/types.ts` → `ModelInputs`):
- Capital stack: `sqft`, `tiPSF`, `leasePSF`, `capexPSF`, `gpInvestment`
  - Total CapEx is derived: `sqft × capexPSF` (default $150/psf × 9,180 sf ≈ $1.38M — V1 Richmond left-zone baseline). Never store a total-dollar CapEx field — the PSF coupling keeps sqft, TI, lease, and CapEx moving together, which is the CFO-defensible behavior.
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

**Model reconciled to V1 (April 2026):** `DEFAULT_INPUTS.sqft = 9_180` and vendor array = 8 Food + 1 Health Bar + 2 Desserts + 1 Coffee (12 total). Total monthly vendor rent invariant at $80k (all non-food kiosks share the same $6k rent / $25k sales). `audit.ts` sqft perturbation updated to 7,344 / 11,016 (±20% of 9,180). If V2 ever becomes the modelled case, bump `sqft` to ~14,500 and roughly double food-vendor count (16) + kiosks (6).

## CapEx & OpEx tabs (added April 2026)

Two top-level tabs sit alongside Strategy / Financial Model / Space Layout in the NavBar.

**`/capex` (`src/pages/CapEx.tsx`)** — single-source view of the Richmond V1 SOW. All numbers are **inlined as TypeScript constants** at the top of the file (cat1Items, cat2aItems...cat9Items). Why inline rather than data-driven: the SOW is the deal artifact, not a model input — investors see the same numbers we present in PDF form. To change a line item or add a category: edit the array, the subtotal/total/percentage roll-ups recompute automatically. Cat 2 (MEP) is the only category with sub-categories (2a HVAC → 2g Low-Voltage); other categories use a flat line-item list. Includes the gas service upgrade callout and Critical Path sequencing block — both are demo-grade copy, edit carefully.

**`/opex` (`src/pages/Opex.tsx`)** — unified read-only roll-up of all OpEx categories pulling live values via `useModel()`. Mirrors the CapEx tab's expandable-category UX. Each block has an **"Edit Details" button** that routes to the corresponding `/model/opex/*` detail page — that's where editing happens. **Do not duplicate edit affordances on `/opex`** (that would create two write paths into the same state). The tab also surfaces a Monthly Roll-Up card (vendor utils + common + non-utils + operator salary → total monthly + annual) and a "How OpEx Flows Into the Model" explainer.

**Pattern shared by both tabs:** category card → expandable line items → optional second-level expand for scope notes / per-item calculation. `toneStyles` map + numbered category dots = visual taxonomy. Both pages are unauthenticated client-side routes — no SEO, no markup beyond the NavBar/footer scaffold.

## Renderings tab (added April 2026)

**`/renderings` (`src/pages/Renderings.tsx`)** — single linear photo-essay of 18 AI-rendered concept images for V1. The narrative arc (set in source filenames `1.` → `18.` and preserved in URL slugs `01-` → `18-`) is intentional and load-bearing: hero (1) → moods/exterior (2–4) → interior moments (5–9) → vendor detail (10–13) → birds-eye plan (14–15) → app UI (16–18). Don't reorder unless you're rebuilding the narrative.

**Asset pipeline:** Source PNGs are 1536×1024 (~2–3 MB each, 42 MB total). Page references **JPGs at quality 85** in `public/renderings/` (~10 MB total) — the conversion is not part of the build. To refresh after editing source: re-run `sips -s format jpeg -s formatOptions 85` per-file and overwrite. Captions on each rendering are written into the `renderings` array at the top of the file — they're brand voice, not literal description; review before changing.

**Performance:** First two images load eager, remaining 16 are lazy. No image optimization beyond JPG-Q85 — Vite serves `public/` as static assets without the Next.js `next/image` machinery. If the page ever feels slow, the next lever is responsive `srcset` + a smaller mobile variant, not further compression.

## Conventions & gotchas

- **Shared state:** always read/write model inputs through `useModel()`. Panel components take `{ inputs, onChange }` props and delegate `onChange(setInputs)` up from `Model.tsx`.
- **Money formatting:** `fmtDollarFull` / `fmtDollar` / `fmtPct` from `src/utils/format.ts`. Don't roll your own.
- **Richmond overrides must not mutate `inputs`** — compute `activeInputs` via `useMemo`, as `Model.tsx` already does. All sliders stay bound to full portfolio state.
- **OpEx detail pages** (`/model/opex/*`) read directly from `useModel()` and write back via `setInputs`. Keep the URL structure stable — links from `OpexPanel` AND from the `/opex` top-level tab point to them. Editing happens here; `/opex` is read-only.
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

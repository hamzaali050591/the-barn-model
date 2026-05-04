import { useState } from 'react';
import NavBar from '../components/NavBar';
import InfoTooltip from '../components/InfoTooltip';
import { fmtDollarFull } from '../utils/format';
import { useReveal } from '../utils/useReveal';

const LEASE_SQFT = 9_180;

interface LineItem {
  num: number;
  name: string;
  notes: string;
  cost: number;
}
interface SubCategory {
  key: string;
  title: string;
  description?: string;
  items: LineItem[];
  subtotal: number;
}
interface Category {
  num: string;
  title: string;
  description: string;
  subtotal: number;
  items?: LineItem[];
  subcategories?: SubCategory[];
  executionNote?: string;
  hideItemPrices?: boolean;
  tone: 'honey' | 'sage' | 'terracotta' | 'walnut';
}

const sum = (arr: LineItem[]) => arr.reduce((s, i) => s + i.cost, 0);

const cat1Items: LineItem[] = [
  { num: 1, name: 'Selective demo of existing interior framing', notes: 'Removal of vertical stud framing and any partial partitions to open the floor for Path A layout. Haul-off included.', cost: 6_000 },
  { num: 2, name: 'Floor slab prep (cleaning, patching, leveling)', notes: 'Power cleaning, minor concrete patching, spot-leveling prior to polished-concrete treatment.', cost: 4_000 },
  { num: 3, name: 'Envelope remediation (spray foam touch-up, transitions)', notes: 'Touch-up of visible spray foam at window transitions and perimeter wall conditions seen in photos.', cost: 2_000 },
  { num: 4, name: 'Existing MEP cleanup/relocation', notes: 'Cleanup or removal of any existing rough-in MEP not aligned with new layout.', cost: 3_000 },
  { num: 5, name: 'Truss cleaning/prep (pre-seal)', notes: 'Dust removal, light sanding where needed, preparing trusses for clear sealer application.', cost: 2_000 },
  { num: 6, name: 'Dust containment + site protection', notes: 'Containment barriers, existing envelope protection during demo.', cost: 2_000 },
  { num: 7, name: 'Layout markout + construction start', notes: 'Chalk-line mapping of new layout on slab prior to construction.', cost: 1_000 },
];

const cat2aItems: LineItem[] = [
  { num: 1, name: '4 RTUs — ~56 tons total, SEER 16', notes: '4 packaged RTUs sized ~12–15 tons each, placed in central TPO roof zone. Exposed matte-black spiral ductwork routed through trusses. Zone 1 serves vendor row (dedicated), Zone 2 main gathering, Zone 3 perimeter lounge, Zone 4 entry+support.', cost: 170_000 },
  { num: 2, name: 'Hood-integrated MAU (short-circuit)', notes: '~14,000 CFM capacity with dehumidification stage (Houston climate requirement), integrated gas heating, BMS-tied for hood-fan interlock. Single MAU serving both 40-ft hood canopies.', cost: 45_000 },
  { num: 3, name: 'Building Management System (BMS)', notes: 'Cloud-based platform integrating HVAC + Hood + MAU + Lighting + Restroom exhaust controls. Remote access, scene programming, energy dashboards. Basic installer commissioning; operator (Hamza) handles scene programming and schedules.', cost: 25_000 },
  { num: 4, name: 'Restroom/BOH demand-controlled exhaust', notes: 'Occupancy-sensor-driven exhaust fans for men’s and women’s restrooms + janitor closet + BOH. Tied to BMS.', cost: 8_000 },
];
const cat2bItems: LineItem[] = [
  { num: 5, name: 'Two 40-ft hood canopies with DCV', notes: 'Captive-Aire (industry standard) UL-listed Type I grease hoods, 304 stainless, demand-controlled ventilation with heat/optical sensors, integrated LED task lighting. 40 ft each covering 4 stalls per hood.', cost: 62_000 },
  { num: 6, name: 'Two exhaust fans (high-efficiency, BMS-tied)', notes: 'Greenheck commercial fans with VFDs for DCV modulation, integrated grease containment, full BMS integration.', cost: 22_000 },
  { num: 7, name: 'Two UL 300 fire suppression systems', notes: 'Ansul R-102 systems with individual stall detection zones (4 per hood), electric-solenoid gas shut-off integration, fire marshal commissioning.', cost: 32_000 },
  { num: 8, name: 'Gas shut-off valves and interlocks', notes: 'Electric-solenoid valves (8 total — 1 per stall), manifold-integrated, BMS-compatible. Auto-shut on fire detection.', cost: 6_000 },
  { num: 9, name: 'Manual pull stations', notes: 'Code-required, 1 per hood (2 total) at accessible locations.', cost: 1_000 },
  { num: 10, name: 'Ductwork (2 exhaust runs to central TPO zone)', notes: '16-gauge welded stainless grease duct, fire-rated wrap through occupied areas, proper roof curbs and flashing at TPO penetrations, code-required access panels.', cost: 20_000 },
  { num: 11, name: 'Permitting, engineering, commissioning', notes: 'MEP engineer stamp, fire marshal plan review and inspection, test & balance of exhaust + MAU, DCV commissioning.', cost: 10_000 },
];
const cat2cItems: LineItem[] = [
  { num: 12, name: 'Distributed subpanels + main feeder', notes: 'MDP-T (400A) in core fed from landlord’s HF-2. Three sub-distribution panels: Food row (200A), Gathering/kiosks (125A), Entry/BOH (100A). Copper feeder wire. Basic BMS current monitoring at each panel.', cost: 30_000 },
  { num: 13, name: '8 food stall subpanels', notes: '60A subpanel per food stall for vendor equipment independence. Standard commercial panel, full breaker fill for typical vendor loads, BMS monitoring for per-vendor energy attribution.', cost: 15_000 },
  { num: 14, name: 'Smart lighting controls + wiring', notes: 'DALI protocol, group-level addressability across all locked lighting zones, control wiring from BMS controller to dimming drivers throughout hall. Operator-programmed scenes.', cost: 20_000 },
  { num: 15, name: 'Code-required emergency lighting', notes: 'Exit signs at egress, battery-backup egress lighting, fire alarm battery backup. Code minimum.', cost: 5_000 },
  { num: 16, name: 'Branch circuit distribution', notes: '~100 branch circuits, copper wire, exposed matte-black conduit (aesthetic match), equipment hookups to 4 RTUs + 2 hoods + MAU + water heaters + BMS devices, common-area and BOH receptacles, GFCI/AFCI compliance.', cost: 40_000 },
  { num: 17, name: 'Low-voltage conduit pathways', notes: 'Matte-black EMT conduit for data/AV/security/BMS cabling. Includes modest spare conduit for Version 2 expansion and future tech. Proper pull boxes.', cost: 10_000 },
  { num: 18, name: 'Permitting, engineering, inspection', notes: 'MEP engineer electrical stamp, Richmond/Fort Bend permit fees, rough-in and final inspections, BMS commissioning coordination.', cost: 8_000 },
];
const cat2dItems: LineItem[] = [
  { num: 19, name: 'Underground grease interceptor (1,500 gal)', notes: 'Precast concrete, H-20 traffic-rated, two-compartment. Sized for 8 food stalls with 10-year service life. Tie-in with civil engineering coordination, sample well, access risers.', cost: 25_000 },
  { num: 20, name: 'Plumbing distribution (trunk + branches)', notes: 'Copper water lines (10-yr durability), cast iron + PVC waste/vent. Full distribution to 12 vendor rough-ins + 2 restrooms + BOH + mop sink + hand sinks + dishwashing. Insulated hot water recirculation loop.', cost: 50_000 },
  { num: 21, name: 'Tankless hot water system + recirculation', notes: 'Two commercial gas tankless units (Rheem or Rinnai) in Mech/Elec core. BMS-integrated recirculation pump. Roof-vented. Handles 12-vendor + 2-restroom peak simultaneous demand.', cost: 20_000 },
  { num: 22, name: 'Floor drains + mop sink', notes: '~12 food stall floor drains (1–2 per stall), 2 restroom drains, 1 BOH drain, mop sink + janitor closet. Trap primers code-compliant. Includes slab core-cutting labor.', cost: 12_000 },
  { num: 23, name: 'Restroom fixtures', notes: 'Mid-tier commercial fixtures. 5 toilets (2M + 3W), 2 urinals, 4 sinks, matte-black sensor faucets, auto-flush valves. Durable and on-brand for 10-year lease.', cost: 15_000 },
  { num: 24, name: 'Permitting, engineering, inspection', notes: 'MEP plumbing stamp, Richmond/Fort Bend permit fees, grease interceptor permit + sizing coordination, inspections.', cost: 7_000 },
];
const cat2eItems: LineItem[] = [
  { num: 25, name: 'Gas service upgrade + distribution', notes: 'CenterPoint Energy service line upgrade to ~35K CFH, meter upsize, regulator upgrade, main trunk from upgraded meter to food row, per-stall manifolds with 4 branch connections and shut-off valves, leak testing, permits.', cost: 40_000 },
];
const cat2fItems: LineItem[] = [
  { num: 26, name: 'Sprinkler distribution throughout suite', notes: '~60 sprinkler heads covering 9,180 sq ft per NFPA 13. Wet-pipe system extended from delivered 4" riser. Standard commercial pendant heads (paintable matte-black to blend with aesthetic). Hydraulic calcs and fire engineer stamp.', cost: 25_000 },
  { num: 27, name: 'Fire alarm zone expansion + devices', notes: 'Addition of suite zone to existing Bldg F fire alarm panel. 15–25 smoke detectors, pull stations at egress doors, horn/strobes in all occupied areas, 4 duct detectors (one per RTU), interconnect with hood suppression and BMS, programming and commissioning.', cost: 12_000 },
  { num: 28, name: 'Permitting, fire marshal inspection, commissioning', notes: 'Fire protection engineer stamp, permit fees, fire marshal plan review and final inspection.', cost: 3_000 },
];
const cat2gItems: LineItem[] = [
  { num: 29, name: 'Structured cabling (Cat6A)', notes: 'Cat6A drops to all 12 vendor stalls + 10 common area drops (Wi-Fi APs, cameras, BMS devices). Proper termination and certification. 10-year lease durability.', cost: 10_000 },
  { num: 30, name: 'Wi-Fi infrastructure', notes: '8 Ubiquiti UniFi access points covering 9,180 sq ft + BOH. Cloud-managed controller, PoE switches, VLAN segmentation for guest / vendor / BMS / security. Operator-manageable.', cost: 6_000 },
  { num: 31, name: 'IP security cameras + NVR', notes: '8 UniFi Protect cameras at entry/exits/food row/BOH with 4MP low-light capability. NVR with 30-day storage. Native integration with UniFi network.', cost: 7_000 },
  { num: 32, name: 'Distributed speaker system', notes: '~16 commercial 70V ceiling speakers distributed for even coverage, multi-zone controller (food row / gathering / kiosk / BOH independent), standard commercial amplifier.', cost: 5_000 },
  { num: 33, name: 'IT rack + UPS + patch panels', notes: '18U wall-mounted rack in BOH, 1500VA UPS for network/NVR/BMS continuity, patch panel for terminations, cable management and labeling.', cost: 3_000 },
];

const cat3Items: LineItem[] = [
  { num: 34, name: 'Partitions, ADA hardware, baby changing, accessories', notes: 'Phenolic toilet partitions (durable, moisture-resistant), ADA grab bar sets in both restrooms, 2 commercial baby changing stations, mid-tier accessories with matte-black finish (paper dispensers, hand dryers, soap, mirrors, hooks, trash).', cost: 10_000 },
  { num: 35, name: 'Finishes (tile, wainscoting, mirrors, lighting)', notes: 'Porcelain floor tile (polished concrete look to match main hall), porcelain wall tile at wet zones, wood wainscoting accent, matte-black framed mirrors, warm decorative sconces and vanity lighting.', cost: 20_000 },
  { num: 36, name: 'Construction (framing, drywall, doors, ventilation hookup)', notes: 'Metal-stud framing, moisture-resistant drywall + tile backer at wet walls, 2 quality entry doors with privacy airlock configuration, water-resistant substrate behind tile, hookup to demand-controlled exhaust system.', cost: 15_000 },
  { num: 37, name: 'Permitting, inspection', notes: 'ADA compliance architectural stamp, health department plan review (food service restroom requirement), final inspection coordination.', cost: 2_000 },
];

const cat4Items: LineItem[] = [
  { num: 38, name: '8 food stalls — Heavy Warm minus Refrigeration', notes: '$40K per stall × 8. Open-counter facade (warm wood + matte black metal), partial side walls, shared back wall, utility stubs, 8-ft hood zone under shared hood (in Cat 2b), gas manifold with 4 connections, stainless prep counter (6–8 ft), 3-compartment sink, hand sink, floor drain in cooking zone, FRP wall panels behind cooking line, tile cooking-zone floor, paint + trim finish, task + pendant lighting (controls in Cat 2c).', cost: 320_000 },
  { num: 39, name: 'Health bar kiosk — Bucket 3 Heavy Warm', notes: '280 sq ft single-sided kiosk. Customer counter facade (warm wood + matte black), back wall for equipment, utility stubs, stainless prep counter, 3-comp + hand sink, floor drain, tile prep-zone floor, finished interior, full task/accent/display lighting, branded customer-facing millwork, sign panel.', cost: 35_000 },
  { num: 40, name: 'Coffee/drinks kiosk — Bucket 3 Heavy Warm', notes: '220 sq ft single-sided kiosk. Espresso-ready dedicated electrical outlets, stainless prep counter, 3-comp + hand sink, floor drain, tile prep-zone floor, finished interior, full lighting, syrup/milk station millwork, sign panel.', cost: 30_000 },
  { num: 41, name: '2 dessert kiosks — Bucket 2 Medium Warm', notes: '220 sq ft each, open island format (counter all sides). $20K per kiosk × 2. Warm wood + matte black facade on all visible sides, hand sink, sealed concrete floor (no tile needed — non-cooking), basic finished interior, basic pendant/task lighting, customer-facing millwork base for vendor-supplied display cases, sign panel.', cost: 40_000 },
  { num: 42, name: 'Unified sign panel system (12 stalls)', notes: 'Matte-black metal frame with integrated LED backlighting above each vendor counter. The Barn provides consistent hardware; vendors provide logo artwork/print insert. Standardized across all 12 for brand visual consistency.', cost: 10_000 },
];

const cat5Items: LineItem[] = [
  { num: 43, name: 'Floor finish (polished/stained concrete, ~7,000 sq ft)', notes: 'Grind + polish + single-tone honey/walnut stain + quality urethane sealer across all common area. Durable, easy to clean, on-brand aesthetic.', cost: 20_000 },
  { num: 44, name: 'Wall finishes (paint + accent wood + trim)', notes: 'Cream paint (#FAF8F5) throughout, wood-look engineered paneling on ~400 sq ft of accent walls (kiosk back walls, gathering zone features), matte-black metal trim at key transitions.', cost: 25_000 },
  { num: 45, name: 'Lighting fixtures (fixtures only; controls in Cat 2c)', notes: 'Commercial-grade Edison string lights across trusses (signature feature), 12 warm-metal pendants over communal tables and kiosks, 20 recessed LEDs for food row task lighting, 200 LF of under-counter LED strips, accent lamps, decorative sconces at feature walls. All 2700K dimmable.', cost: 38_000 },
  { num: 46, name: 'Ceiling treatment (truss cleaning + matte-black MEP)', notes: 'Cleaning + light sanding + clear matte sealer on exposed wood trusses (essential for grease/smoke protection over time), matte-black paint on all exposed ductwork, conduit, sprinkler lines, cable trays.', cost: 10_000 },
  { num: 47, name: 'Greenery & planters', notes: 'Mixed real + high-quality faux approach. Real plants near window walls (where light supports), faux in lower-light interior zones. Hanging truss planters, large potted transitions, vertical greenery at feature wall (high-quality faux), communal table accents.', cost: 15_000 },
];

const cat6Items: LineItem[] = [
  { num: 48, name: 'Seating mix — 200 capacity', notes: '3 large communal farm tables (48 seats total), 14 family/4-top tables + 56 chairs, 14 high-tops + 56 stools, custom window-bench seating along 3 window walls (~40 seats). Commercial-grade solid wood tops, matte-black metal frames, quality cushions on bench seating.', cost: 60_000 },
  { num: 49, name: 'Decor & styling', notes: 'Local artwork and framed photography (Richmond/Texas community themes, 8–15 pieces), vintage barn-inspired signage, 4 chalkboards for kiosk daily specials, area rugs to anchor seating zones (3–4 commercial-grade rugs), communal table accents, styling accessories.', cost: 12_000 },
  { num: 50, name: 'Feature wall buildout', notes: 'Signature photo-op destination. Herringbone reclaimed wood base (~100–150 sq ft), dimensional Barn logo in walnut + matte brass, "Everybody’s Welcome" LED faux-neon sign, flanking greenery panels, warm accent lighting. Instagram-optimized brand moment.', cost: 16_000 },
];

const cat7Items: LineItem[] = [
  { num: 51, name: 'The Barn App (lean v1)', notes: 'AI-accelerated development approach. Core features at launch: order-ahead from any vendor, at-the-table ordering, loyalty rewards, push notifications, vendor POS API integrations, basic admin dashboard. Ongoing operating cost ~$400–800/month (separate from CapEx).', cost: 20_000 },
];

const cat8Items: LineItem[] = [
  { num: 52, name: 'Exterior signage', notes: 'Primary Barn logo in matte-black dimensional metal with warm backlighting, smaller "Richmond" location identifier, window vinyl for operating hours + social handles + "Everybody’s Welcome" tagline across perimeter windows. Installation, electrical hookup for backlighting, DPEG + City permits.', cost: 18_000 },
  { num: 53, name: 'Interior wayfinding & signage', notes: 'ADA-compliant restroom signage, directional signage (entry, kiosks, event venue next door, BOH), "Everybody’s Welcome" accent signage in gathering zones, BOH/staff-only markers, 12–20 table numbers for order-ahead pickup. Matte-black metal + warm wood fabrication.', cost: 5_000 },
];

const cat9Items: LineItem[] = [
  { num: 54, name: 'Architecture / design', notes: 'Licensed architect of record producing stamped TI drawings for permit submittal, interior design coordination for material/finish specs, 2–3 revision rounds.', cost: 25_000 },
  { num: 55, name: 'MEP engineering', notes: 'Licensed MEP engineer of record stamping mechanical, electrical, plumbing, fire protection drawings. Includes load calcs, hydraulic calcs, gas sizing, BMS integration design, coordination with hood vendor and CenterPoint Energy. Complex scope warrants upper-mid range.', cost: 30_000 },
  { num: 56, name: 'Permits, plan review, fees', notes: 'City of Richmond building permit (1–1.5% of project value), Fort Bend County fees, utility permits (gas upgrade, water), health department permit.', cost: 10_000 },
  { num: 57, name: 'Construction management', notes: 'Operator self-managed with CM consultant on retainer (~50–80 hours over 4–6 month buildout) for contractor selection, major coordination, change orders, commissioning. Hamza personally handles daily coordination.', cost: 20_000 },
  { num: 58, name: 'Insurance during buildout', notes: 'Builder’s risk insurance (~1% of hard costs) covering fire/theft/vandalism/weather during construction, general liability during construction, workers comp coordination.', cost: 10_000 },
  { num: 59, name: 'Contingency (10% of hard costs)', notes: 'Disciplined 10% contingency reserve on $1,510K hard costs. Returnable to investors if unused. Covers variance on gas service upgrade (largest single uncertainty pending CenterPoint quote), MEP engineering refinements, and normal construction unknowns.', cost: 149_000 },
];

const cat2Subs: SubCategory[] = [
  { key: '2a', title: 'HVAC, Ventilation & BMS', description: '4 zoned RTUs + hood-integrated MAU + BMS controls + restroom/BOH demand-controlled exhaust.', items: cat2aItems, subtotal: sum(cat2aItems) },
  { key: '2b', title: 'Kitchen Hood System', description: 'Two 40-ft shared hoods with UL 300 fire suppression and gas shut-off interlocks.', items: cat2bItems, subtotal: sum(cat2bItems) },
  { key: '2c', title: 'Electrical', description: 'Distributed subpanel strategy with main tenant distribution panel feeding 3 sub-distribution panels.', items: cat2cItems, subtotal: sum(cat2cItems) },
  { key: '2d', title: 'Plumbing', description: 'Underground 1,500-gal grease interceptor, full distribution, tankless hot water with recirculation.', items: cat2dItems, subtotal: sum(cat2dItems) },
  { key: '2e', title: 'Gas (Service Upgrade + Distribution)', description: 'CenterPoint upgrade from 7,000 CFH to ~35K CFH + per-stall manifolds. $40K placeholder pending formal quote.', items: cat2eItems, subtotal: sum(cat2eItems) },
  { key: '2f', title: 'Fire Protection', description: 'Wet-pipe sprinkler distribution + expanded fire alarm zone with hood UL 300 interconnect.', items: cat2fItems, subtotal: sum(cat2fItems) },
  { key: '2g', title: 'Low-Voltage (Data / AV / Security)', description: 'Cat6A cabling, UniFi Wi-Fi + cameras, multi-zone speakers, central IT rack with UPS.', items: cat2gItems, subtotal: sum(cat2gItems) },
];

const categories: Category[] = [
  {
    num: '1',
    title: 'Demo & Shell Prep',
    description: 'Preparation of the landlord-delivered cold shell — selective demo, slab prep, envelope remediation, truss cleaning, site protection, layout markout.',
    items: cat1Items,
    subtotal: sum(cat1Items),
    tone: 'walnut',
  },
  {
    num: '2',
    title: 'MEP Infrastructure',
    description: 'Complete tenant MEP build — HVAC + BMS + kitchen hood + electrical + plumbing + gas upgrade + fire protection + low-voltage. The largest single category (~44% of hard costs).',
    subcategories: cat2Subs,
    subtotal: cat2Subs.reduce((s, sc) => s + sc.subtotal, 0),
    tone: 'honey',
  },
  {
    num: '3',
    title: 'Restroom Buildout',
    description: 'Complete construction of ADA-compliant men’s and women’s restrooms from cold shell — sized for 200-person occupancy.',
    items: cat3Items,
    subtotal: sum(cat3Items),
    tone: 'sage',
  },
  {
    num: '4',
    title: 'Vendor Stall Packages',
    description: 'Complete buildout of all 12 vendor stalls — 8 food stalls along the core wall (Path A) + 4 non-cooking kiosks distributed through the gathering zone.',
    items: cat4Items,
    subtotal: sum(cat4Items),
    executionNote: 'Hitting the $40K per-stall target on food stalls requires standardized kit-of-parts construction across all 8 stalls. One-off custom per-stall would push costs meaningfully higher.',
    tone: 'honey',
  },
  {
    num: '5',
    title: 'Common Areas (Finishes, Lighting, Ambiance)',
    description: 'The finishes and atmospheric elements that define the elevated-barn aesthetic across ~7,000 sq ft of common gathering area.',
    items: cat5Items,
    subtotal: sum(cat5Items),
    tone: 'sage',
  },
  {
    num: '6',
    title: 'Seating, Furniture & FF&E',
    description: 'All seating furniture, decor and styling layer, and the signature feature wall (herringbone + dimensional logo + neon + greenery).',
    items: cat6Items,
    subtotal: sum(cat6Items),
    executionNote: 'Hitting the $60K seating target requires strategic sourcing through restaurant supply outlets, commercial auctions, and bulk vendor negotiations.',
    tone: 'terracotta',
  },
  {
    num: '7',
    title: 'Tech & AV (The Barn App)',
    description: 'Lean v1 of The Barn customer-facing app at launch — order-ahead, at-the-table ordering, loyalty, push notifications, POS integrations. v2 funded from operating cash flow (not CapEx).',
    items: cat7Items,
    subtotal: sum(cat7Items),
    tone: 'walnut',
  },
  {
    num: '8',
    title: 'Branding & Signage',
    description: 'Exterior building signage + interior wayfinding throughout. Matte-black metal + warm wood fabrication consistent with brand palette.',
    items: cat8Items,
    subtotal: sum(cat8Items),
    tone: 'terracotta',
  },
  {
    num: '9',
    title: 'Soft Costs & Contingency',
    description: 'Architecture + MEP engineering + permits + construction management + builder’s risk insurance + 10% contingency reserve.',
    items: cat9Items,
    subtotal: sum(cat9Items),
    tone: 'walnut',
  },
];

// ── V2 line items (post Niyi meeting, Apr 29, 2026) ──
// Items unchanged from V1 stay as deep clones; diverged items use explicit
// overrides via .map or are written as fresh literals.
const cat1ItemsV2: LineItem[] = cat1Items.map(i => ({ ...i }));

// 2a: RTUs $170k→$150k, MAU $45k→$20k, BMS $25k→$20k, Restroom exhaust $8k→$6k
const cat2aItemsV2: LineItem[] = cat2aItems.map((i, idx) => ({
  ...i,
  cost: [150_000, 20_000, 20_000, 6_000][idx],
}));
const cat2bItemsV2: LineItem[] = cat2bItems.map(i => ({ ...i }));
const cat2cItemsV2: LineItem[] = cat2cItems.map(i => ({ ...i }));

// 2d: total $129k→$110k, line items scaled proportionally (~0.853×)
const cat2dItemsV2: LineItem[] = cat2dItems.map((i, idx) => ({
  ...i,
  cost: [21_000, 43_000, 17_000, 10_000, 13_000, 6_000][idx],
}));
const cat2eItemsV2: LineItem[] = cat2eItems.map(i => ({ ...i }));
const cat2fItemsV2: LineItem[] = cat2fItems.map(i => ({ ...i }));
const cat2gItemsV2: LineItem[] = cat2gItems.map(i => ({ ...i }));
const cat3ItemsV2: LineItem[] = cat3Items.map(i => ({ ...i }));

// Cat 4: food stalls $40k/stall→$35k/stall ($320k→$280k); HB+Coffee+2Desserts
// collapsed into one "Non-Food Vendors" line at 4 × $20k = $80k.
const cat4ItemsV2: LineItem[] = [
  { num: 38, name: '8 food stalls — Heavy Warm minus Refrigeration', notes: '$35K per stall × 8. Open-counter facade (warm wood + matte black metal), partial side walls, shared back wall, utility stubs, 8-ft hood zone under shared hood (in Cat 2b), gas manifold with 4 connections, stainless prep counter (6–8 ft), 3-compartment sink, hand sink, floor drain in cooking zone, FRP wall panels behind cooking line, tile cooking-zone floor, paint + trim finish, task + pendant lighting (controls in Cat 2c).', cost: 280_000 },
  { num: 39, name: 'Non-Food Vendors (4 buildouts × $20K)', notes: 'Combined buildout for the four non-food kiosks (Health Bar, Coffee/Drinks, 2× Dessert). $20K per kiosk × 4. Heavy Warm spec at Health Bar / Coffee (counter facade, prep counter, 3-comp + hand sink, floor drain, tile prep-zone floor, full task/accent lighting, branded customer-facing millwork, sign panel). Lighter spec at Dessert kiosks (open island format, hand sink, sealed concrete floor, basic finished interior, customer-facing millwork base for vendor-supplied display cases, sign panel).', cost: 80_000 },
  { num: 40, name: 'Unified sign panel system (12 stalls)', notes: 'Matte-black metal frame with integrated LED backlighting above each vendor counter. The Barn provides consistent hardware; vendors provide logo artwork/print insert. Standardized across all 12 for brand visual consistency.', cost: 10_000 },
];
const cat5ItemsV2: LineItem[] = cat5Items.map(i => ({ ...i }));
const cat6ItemsV2: LineItem[] = cat6Items.map(i => ({ ...i }));
const cat7ItemsV2: LineItem[] = cat7Items.map(i => ({ ...i }));
const cat8ItemsV2: LineItem[] = cat8Items.map(i => ({ ...i }));

const cat2SubsV2: SubCategory[] = [
  { key: '2a', title: 'HVAC, Ventilation & BMS', description: cat2Subs[0].description, items: cat2aItemsV2, subtotal: sum(cat2aItemsV2) },
  { key: '2b', title: 'Kitchen Hood System', description: cat2Subs[1].description, items: cat2bItemsV2, subtotal: sum(cat2bItemsV2) },
  { key: '2c', title: 'Electrical', description: cat2Subs[2].description, items: cat2cItemsV2, subtotal: sum(cat2cItemsV2) },
  { key: '2d', title: 'Plumbing', description: cat2Subs[3].description, items: cat2dItemsV2, subtotal: sum(cat2dItemsV2) },
  { key: '2e', title: 'Gas (Service Upgrade + Distribution)', description: cat2Subs[4].description, items: cat2eItemsV2, subtotal: sum(cat2eItemsV2) },
  { key: '2f', title: 'Fire Protection', description: cat2Subs[5].description, items: cat2fItemsV2, subtotal: sum(cat2fItemsV2) },
  { key: '2g', title: 'Low-Voltage (Data / AV / Security)', description: cat2Subs[6].description, items: cat2gItemsV2, subtotal: sum(cat2gItemsV2) },
];

// V2 hard costs (cat 1-8) — needed before cat 9 so contingency is 10% of this.
const V2_HARD_COSTS =
  10_000                                                  // Cat 1 (overridden)
  + cat2SubsV2.reduce((s, sc) => s + sc.subtotal, 0)      // Cat 2
  + sum(cat3ItemsV2)
  + sum(cat4ItemsV2)
  + sum(cat5ItemsV2)
  + sum(cat6ItemsV2)
  + sum(cat7ItemsV2)
  + sum(cat8ItemsV2);

// Cat 9: Architecture/design ($25k) + MEP engineering ($30k) collapsed into
// one $40k line. Contingency = 10% of V2 hard costs (recomputes if any
// V2 hard-cost line item changes).
const cat9ItemsV2: LineItem[] = [
  { num: 54, name: 'Architecture / design + MEP engineering', notes: 'Combined fee covering licensed architect of record (stamped TI drawings for permit submittal, interior design coordination, 2–3 revision rounds) + licensed MEP engineer of record (mechanical, electrical, plumbing, fire protection stamps; load + hydraulic + gas calcs; BMS integration design; coordination with hood vendor and CenterPoint Energy).', cost: 40_000 },
  { num: 55, name: 'Permits, plan review, fees', notes: 'City of Richmond building permit (1–1.5% of project value), Fort Bend County fees, utility permits (gas upgrade, water), health department permit.', cost: 10_000 },
  { num: 56, name: 'Construction management', notes: 'Operator self-managed with CM consultant on retainer (~50–80 hours over 4–6 month buildout) for contractor selection, major coordination, change orders, commissioning. Hamza personally handles daily coordination.', cost: 20_000 },
  { num: 57, name: 'Insurance during buildout', notes: 'Builder’s risk insurance (~1% of hard costs) covering fire/theft/vandalism/weather during construction, general liability during construction, workers comp coordination.', cost: 10_000 },
  { num: 58, name: 'Contingency (10% of hard costs)', notes: 'Disciplined 10% contingency reserve on V2 hard costs. Returnable to investors if unused. Covers variance on gas service upgrade (largest single uncertainty pending CenterPoint quote), MEP engineering refinements, and normal construction unknowns.', cost: Math.round(V2_HARD_COSTS * 0.10) },
];

const categoriesV2: Category[] = categories.map((c, idx) => {
  if (c.num === '2') {
    return { ...c, subcategories: cat2SubsV2, subtotal: cat2SubsV2.reduce((s, sc) => s + sc.subtotal, 0) };
  }
  if (c.num === '1') {
    return { ...c, items: cat1ItemsV2, subtotal: 10_000, hideItemPrices: true };
  }
  if (c.num === '4') {
    return { ...c, items: cat4ItemsV2, subtotal: sum(cat4ItemsV2), executionNote: 'Hitting the $35K per-stall target on food stalls requires standardized kit-of-parts construction across all 8 stalls. One-off custom per-stall would push costs meaningfully higher.' };
  }
  const v2Items = [undefined, undefined, cat3ItemsV2, undefined, cat5ItemsV2, cat6ItemsV2, cat7ItemsV2, cat8ItemsV2, cat9ItemsV2][idx];
  return { ...c, items: v2Items, subtotal: sum(v2Items!) };
});

interface CapExData {
  categories: Category[];
  hardCosts: number;
  softCosts: number;
  contingency: number;
  totalProjectCost: number;
  tiAllowance: number;
  netEquity: number;
  capexPSF: number;
}

function computeTotals(cats: Category[], cat9: LineItem[]): CapExData {
  const hardCosts = cats.slice(0, 8).reduce((s, c) => s + c.subtotal, 0);
  const contingency = cat9[cat9.length - 1].cost;
  const softCosts = cats[8].subtotal - contingency;
  const totalProjectCost = hardCosts + softCosts + contingency;
  const tiAllowance = 321_300;
  const netEquity = totalProjectCost - tiAllowance;
  const capexPSF = totalProjectCost / LEASE_SQFT;
  return { categories: cats, hardCosts, softCosts, contingency, totalProjectCost, tiAllowance, netEquity, capexPSF };
}

const V1_DATA: CapExData = computeTotals(categories, cat9Items);
const V2_DATA: CapExData = computeTotals(categoriesV2, cat9ItemsV2);

const toneStyles: Record<Category['tone'], { dot: string; chip: string }> = {
  honey: { dot: 'bg-honey', chip: 'bg-honey/15 text-walnut border-honey/30' },
  sage: { dot: 'bg-sage', chip: 'bg-sage/15 text-walnut border-sage/30' },
  terracotta: { dot: 'bg-terracotta', chip: 'bg-terracotta/15 text-walnut border-terracotta/30' },
  walnut: { dot: 'bg-walnut/40', chip: 'bg-walnut/10 text-walnut border-walnut/20' },
};

function LineItemRow({ item, hidePrice }: { item: LineItem; hidePrice?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-walnut/5 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-honey/5 transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-mono text-walnut-light w-5 shrink-0">{item.num}</span>
        <span className="text-xs text-walnut min-w-0 truncate font-medium">{item.name}</span>
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-honey/20 text-honey transition-transform shrink-0 ${hidePrice ? 'ml-auto' : ''} ${open ? 'rotate-180' : ''}`} aria-hidden>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
        {!hidePrice && <span className="ml-auto text-xs font-bold text-walnut tabular-nums shrink-0">{fmtDollarFull(item.cost)}</span>}
      </button>
      {open && (
        <div className="px-3 pb-3 pl-11 -mt-1">
          <p className="text-[11px] text-walnut-light leading-relaxed">{item.notes}</p>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ cat, totalProjectCost }: { cat: Category; totalProjectCost: number }) {
  const [open, setOpen] = useState(false);
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});
  const tone = toneStyles[cat.tone];

  return (
    <div className={`glass rounded-2xl transition-all ${open ? '!shadow-lg !shadow-honey/10' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <span className={`w-9 h-9 rounded-lg ${tone.dot} text-cream font-bold flex items-center justify-center text-sm shrink-0`}>
          {cat.num}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-walnut text-sm flex items-center gap-2">
            <span className="truncate">{cat.title}</span>
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-honey/25 text-honey transition-transform shrink-0 ring-1 ring-honey/30 ${open ? 'rotate-180' : ''}`} aria-hidden>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          <div className="text-xs text-walnut-light mt-0.5 hidden md:block">{cat.description}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-walnut tabular-nums">{fmtDollarFull(cat.subtotal)}</div>
          <div className="text-[10px] text-walnut-light">
            {((cat.subtotal / totalProjectCost) * 100).toFixed(1)}% of total
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-walnut/5">
          <p className="text-xs text-walnut-light leading-relaxed mt-3 mb-3 md:hidden">{cat.description}</p>
          {cat.executionNote && (
            <div className="mb-3 px-3 py-2 bg-terracotta/8 border border-terracotta/20 rounded-md">
              <p className="text-[11px] text-walnut-light italic leading-relaxed">
                <span className="font-semibold text-walnut not-italic">Execution note: </span>{cat.executionNote}
              </p>
            </div>
          )}

          {cat.items && (
            <div className="bg-white/40 rounded-lg overflow-hidden">
              {cat.items.map(item => <LineItemRow key={item.num} item={item} hidePrice={cat.hideItemPrices} />)}
            </div>
          )}

          {cat.subcategories && (
            <div className="space-y-2">
              {cat.subcategories.map(sub => {
                const subOpen = openSubs[sub.key] ?? false;
                return (
                  <div key={sub.key} className="bg-white/40 rounded-lg border border-walnut/5">
                    <button
                      onClick={() => setOpenSubs({ ...openSubs, [sub.key]: !subOpen })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer hover:bg-honey/5 transition-colors rounded-lg"
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tone.chip} shrink-0`}>{sub.key}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-walnut text-xs flex items-center gap-2">
                          <span className="truncate">{sub.title}</span>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-honey/20 text-honey transition-transform shrink-0 ${subOpen ? 'rotate-180' : ''}`} aria-hidden>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.75} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </span>
                        </div>
                        {sub.description && <div className="text-[11px] text-walnut-light mt-0.5 hidden md:block">{sub.description}</div>}
                      </div>
                      <div className="font-bold text-walnut text-sm tabular-nums shrink-0">{fmtDollarFull(sub.subtotal)}</div>
                    </button>
                    {subOpen && (
                      <div className="border-t border-walnut/5">
                        {sub.description && <p className="text-[11px] text-walnut-light leading-relaxed px-4 pt-2 md:hidden">{sub.description}</p>}
                        {sub.items.map(item => <LineItemRow key={item.num} item={item} />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GasFlagCallout() {
  return (
    <div className="rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <div className="text-terracotta text-xl leading-none">▲</div>
        <div>
          <div className="font-bold text-walnut text-sm mb-1">CRITICAL INFRASTRUCTURE — Gas Service Upgrade</div>
          <p className="text-xs text-walnut-light leading-relaxed">
            Line 25 carries a <span className="font-semibold text-walnut">$40K placeholder</span> pending CenterPoint Energy formal quote.
            Current Building F service is <span className="font-semibold text-walnut">7,000 CFH @ 5 PSI</span> for all tenants;
            The Barn requires <span className="font-semibold text-walnut">35,000–39,000 CFH peak</span> (V1, 8 stalls). Upgrade is confirmed
            available by DPEG. Lead time is 90–180 days — must be scheduled early in Discovery/Design or buildout permits will hold.
            This is the single largest source of budget uncertainty and the primary justification for the 10% contingency reserve.
          </p>
        </div>
      </div>
    </div>
  );
}

function V2ChangesSummary() {
  const cat2aV1 = cat2Subs[0].subtotal;
  const cat2aV2 = cat2SubsV2[0].subtotal;
  const cat2dV1 = cat2Subs[3].subtotal;
  const cat2dV2 = cat2SubsV2[3].subtotal;
  const cat4V1 = categories[3].subtotal;
  const cat4V2 = categoriesV2[3].subtotal;
  const archMepV1 = 25_000 + 30_000;
  const archMepV2 = 40_000;

  const rows: { category: string; detail: string; v1: number; v2: number }[] = [
    { category: 'Cat 1 — Demo & Shell Prep', detail: 'Collapsed 7 line items into a single category total; line items kept in dropdown without per-item pricing.', v1: 20_000, v2: 10_000 },
    { category: 'Cat 2a — HVAC, Vent & BMS', detail: 'RTUs $170K → $150K · MAU $45K → $20K · BMS $25K → $20K · Restroom exhaust $8K → $6K.', v1: cat2aV1, v2: cat2aV2 },
    { category: 'Cat 2d — Plumbing', detail: 'Subcategory total $129K → $110K; six line items scaled proportionally.', v1: cat2dV1, v2: cat2dV2 },
    { category: 'Cat 4 — Vendor Stalls', detail: 'Food stalls $40K/stall → $35K/stall ($320K → $280K). Health Bar + Coffee + 2× Dessert kiosks collapsed into one "Non-Food Vendors" line at 4 × $20K = $80K.', v1: cat4V1, v2: cat4V2 },
    { category: 'Cat 9 — Architecture + MEP Eng', detail: 'Architecture/Design ($25K) and MEP Engineering ($30K) combined into a single $40K fee line.', v1: archMepV1, v2: archMepV2 },
    { category: 'Contingency', detail: 'Recomputed at 10% of V2 hard costs (was 10% of V1 hard costs).', v1: V1_DATA.contingency, v2: V2_DATA.contingency },
  ];

  const totalSaved = V1_DATA.totalProjectCost - V2_DATA.totalProjectCost;

  return (
    <div className="rounded-2xl border border-sage/40 bg-sage/10 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <div className="text-sage text-xl leading-none">●</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-walnut text-sm mb-1">V2 REVISIONS — Post Niyi Meeting (Apr 29, 2026)</div>
          <p className="text-xs text-walnut-light leading-relaxed mb-3">
            Refined SOW after walkthrough with Niyi. Six line-item changes shrink the V2 budget by{' '}
            <span className="font-semibold text-walnut">{fmtDollarFull(totalSaved)}</span> versus V1
            (<span className="font-semibold text-walnut">{fmtDollarFull(V1_DATA.totalProjectCost)}</span> →{' '}
            <span className="font-semibold text-walnut">{fmtDollarFull(V2_DATA.totalProjectCost)}</span>).
          </p>
          <div className="bg-white/40 rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-2 border-b border-walnut/10 text-[10px] font-semibold text-walnut-light uppercase tracking-wider">
              <div className="col-span-4">Change</div>
              <div className="col-span-5">Detail</div>
              <div className="col-span-1 text-right">V1</div>
              <div className="col-span-1 text-right">V2</div>
              <div className="col-span-1 text-right">Saved</div>
            </div>
            {rows.map((r, i) => {
              const saved = r.v1 - r.v2;
              return (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-3 py-2.5 border-b border-walnut/5 last:border-b-0 text-xs">
                  <div className="col-span-4 font-semibold text-walnut">{r.category}</div>
                  <div className="col-span-5 text-walnut-light leading-snug">{r.detail}</div>
                  <div className="col-span-1 md:text-right text-walnut-light tabular-nums">
                    <span className="md:hidden text-[10px] uppercase tracking-wider mr-1">V1:</span>{fmtDollarFull(r.v1)}
                  </div>
                  <div className="col-span-1 md:text-right text-walnut tabular-nums">
                    <span className="md:hidden text-[10px] uppercase tracking-wider mr-1">V2:</span>{fmtDollarFull(r.v2)}
                  </div>
                  <div className="col-span-1 md:text-right font-bold text-sage tabular-nums">
                    <span className="md:hidden text-[10px] uppercase tracking-wider mr-1 text-walnut-light">Saved:</span>−{fmtDollarFull(saved)}
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-3 py-2.5 bg-sage/15 text-sm">
              <div className="col-span-4 md:col-span-9 font-bold text-walnut uppercase tracking-wider text-xs">Total CapEx Saved (V1 → V2)</div>
              <div className="col-span-1 md:text-right" />
              <div className="col-span-1 md:text-right" />
              <div className="col-span-1 md:text-right font-bold text-sage tabular-nums">−{fmtDollarFull(totalSaved)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Buildout Execution Timeline ──
// 15-week fast-track plan, sequenced as a top-tier GC would actually run it.
// Critical path: CenterPoint gas upgrade (90–180d lead, ordered W1) → permits →
// underground → MEP rough-in → rough-in inspection → drywall close → trim →
// UL 300 → fire marshal + health → vendor move-in → soft open. Bars positioned
// globally against the 15-week grid so concurrent trades line up vertically.

type Tone = Category['tone'];

interface TimelineTrack {
  label: string;
  catRef: string;
  tone: Tone;
  startWeek: number;
  durationWeeks: number;
  isMilestone?: boolean;
  note?: string;
  critical?: boolean;
}
interface TimelinePhase {
  name: string;
  weekRange: string;
  startWeek: number;
  endWeek: number;
  tracks: TimelineTrack[];
}

const TIMELINE_WEEKS = 15;
const TIMELINE_HEADER_COLS = 5;

const TIMELINE_PHASES: TimelinePhase[] = [
  {
    name: 'Pre-Construction',
    weekRange: 'Weeks 1–3',
    startWeek: 0,
    endWeek: 3,
    tracks: [
      { label: 'A&E + MEP Engineering', catRef: 'Cat 9', tone: 'walnut', startWeek: 0, durationWeeks: 2, note: 'Stamped TI drawings → permit submittal' },
      { label: 'BMS / Hood Vendor Selection', catRef: 'Cat 2', tone: 'honey', startWeek: 0, durationWeeks: 2 },
      { label: 'CenterPoint Gas Upgrade — order', catRef: 'Cat 2e', tone: 'terracotta', startWeek: 0, durationWeeks: 9, note: '90–180 day lead — critical path', critical: true },
      { label: 'Long-Lead Equipment Procurement', catRef: 'Cat 2', tone: 'honey', startWeek: 1, durationWeeks: 6, note: 'RTUs · MAU · Hood canopies' },
      { label: 'Building Permits Issued', catRef: 'Milestone', tone: 'sage', startWeek: 3, durationWeeks: 0, isMilestone: true, critical: true },
    ],
  },
  {
    name: 'Shell Prep & Underground',
    weekRange: 'Weeks 3–5',
    startWeek: 2,
    endWeek: 5,
    tracks: [
      { label: 'Demo & Shell Prep', catRef: 'Cat 1', tone: 'walnut', startWeek: 2, durationWeeks: 2 },
      { label: 'Underground Grease Interceptor', catRef: 'Cat 2d', tone: 'honey', startWeek: 3, durationWeeks: 2, note: 'Must precede slab finish work', critical: true },
      { label: 'Slab Penetrations + Floor Drains', catRef: 'Cat 2d', tone: 'honey', startWeek: 3, durationWeeks: 2 },
    ],
  },
  {
    name: 'MEP Rough-In',
    weekRange: 'Weeks 5–9',
    startWeek: 4,
    endWeek: 9,
    tracks: [
      { label: 'Electrical Rough-In', catRef: 'Cat 2c', tone: 'honey', startWeek: 4, durationWeeks: 5 },
      { label: 'HVAC Rough-In + Roof Penetrations', catRef: 'Cat 2a', tone: 'honey', startWeek: 4, durationWeeks: 5, note: 'Coordinate central TPO zone with roofer' },
      { label: 'Plumbing Above-Slab Distribution', catRef: 'Cat 2d', tone: 'honey', startWeek: 4, durationWeeks: 5 },
      { label: 'Sprinkler Distribution', catRef: 'Cat 2f', tone: 'honey', startWeek: 5, durationWeeks: 3 },
      { label: 'Low-Voltage Conduit Pathways', catRef: 'Cat 2g', tone: 'honey', startWeek: 5, durationWeeks: 3 },
      { label: 'Hood Ductwork + Fans', catRef: 'Cat 2b', tone: 'honey', startWeek: 5, durationWeeks: 4 },
      { label: 'Gas Distribution + Manifolds', catRef: 'Cat 2e', tone: 'terracotta', startWeek: 6, durationWeeks: 3, note: 'Tie-in after CenterPoint upgrade complete' },
      { label: 'Restroom Framing + MEP', catRef: 'Cat 3', tone: 'sage', startWeek: 6, durationWeeks: 3 },
      { label: 'MEP Rough-In Inspection', catRef: 'Milestone', tone: 'sage', startWeek: 9, durationWeeks: 0, isMilestone: true, critical: true },
    ],
  },
  {
    name: 'Walls, Vendor Stalls & Finishes',
    weekRange: 'Weeks 10–12',
    startWeek: 9,
    endWeek: 12,
    tracks: [
      { label: 'Drywall + FRP + Tile Backer', catRef: 'Cat 3 / 4', tone: 'sage', startWeek: 9, durationWeeks: 2 },
      { label: 'Vendor Stall Framing (Kit-of-Parts)', catRef: 'Cat 4', tone: 'honey', startWeek: 9, durationWeeks: 3, note: '8 food stalls + 4 kiosks · standardized build' },
      { label: 'Polished Concrete Floor', catRef: 'Cat 5', tone: 'sage', startWeek: 10, durationWeeks: 2 },
      { label: 'Wall Finishes (Paint + Wood Accent)', catRef: 'Cat 5', tone: 'sage', startWeek: 10, durationWeeks: 2 },
      { label: 'Ceiling (Truss Seal + Black MEP Paint)', catRef: 'Cat 5', tone: 'sage', startWeek: 10, durationWeeks: 2 },
      { label: 'Restroom Tile + Fixtures', catRef: 'Cat 3', tone: 'sage', startWeek: 10, durationWeeks: 2 },
    ],
  },
  {
    name: 'Equipment & Trim',
    weekRange: 'Weeks 12–14',
    startWeek: 11,
    endWeek: 14,
    tracks: [
      { label: 'Hood Install + UL 300 Commissioning', catRef: 'Cat 2b', tone: 'terracotta', startWeek: 11, durationWeeks: 2, note: 'Gates fire marshal final', critical: true },
      { label: 'Plumbing Fixtures + Tankless Water', catRef: 'Cat 2d', tone: 'honey', startWeek: 11, durationWeeks: 2 },
      { label: 'Lighting Fixtures Install', catRef: 'Cat 5', tone: 'sage', startWeek: 12, durationWeeks: 2 },
      { label: 'Wi-Fi · Cameras · AV · Speakers', catRef: 'Cat 2g', tone: 'honey', startWeek: 12, durationWeeks: 2 },
      { label: 'BMS Programming & Commissioning', catRef: 'Cat 2a', tone: 'honey', startWeek: 12, durationWeeks: 2 },
      { label: 'Vendor Stall Counters + Sign Panels', catRef: 'Cat 4', tone: 'honey', startWeek: 12, durationWeeks: 2 },
    ],
  },
  {
    name: 'FF&E, Branding & Punch',
    weekRange: 'Weeks 13–15',
    startWeek: 12,
    endWeek: 15,
    tracks: [
      { label: 'Seating · Furniture · Feature Wall', catRef: 'Cat 6', tone: 'terracotta', startWeek: 12, durationWeeks: 3 },
      { label: 'Exterior + Interior Signage', catRef: 'Cat 8', tone: 'terracotta', startWeek: 13, durationWeeks: 2 },
      { label: 'Greenery & Final Styling', catRef: 'Cat 5 / 6', tone: 'sage', startWeek: 13, durationWeeks: 2 },
      { label: 'Fire Marshal + Health Final', catRef: 'Milestone', tone: 'sage', startWeek: 14, durationWeeks: 0, isMilestone: true, critical: true },
      { label: 'Vendor Equipment Move-In', catRef: 'Vendors', tone: 'walnut', startWeek: 14, durationWeeks: 1, note: 'Vendor-supplied refrigeration + cooking gear' },
      { label: 'Punch & Soft Open', catRef: 'Milestone', tone: 'sage', startWeek: 15, durationWeeks: 0, isMilestone: true, critical: true },
    ],
  },
];

const trackBarBg: Record<Tone, string> = {
  honey: 'bg-honey',
  sage: 'bg-sage',
  terracotta: 'bg-terracotta',
  walnut: 'bg-walnut/70',
};

function TrackRow({ track }: { track: TimelineTrack }) {
  const left = (track.startWeek / TIMELINE_WEEKS) * 100;
  const width = (track.durationWeeks / TIMELINE_WEEKS) * 100;
  const bar = trackBarBg[track.tone];

  return (
    <div className="flex items-stretch py-1 group">
      <div className="w-56 md:w-64 shrink-0 pr-3 flex items-center gap-2">
        <span className={`w-1 self-stretch rounded-sm ${trackBarBg[track.tone]} shrink-0`} />
        <div className="min-w-0 flex-1">
          <div className="text-xs text-walnut font-medium truncate flex items-center gap-1.5">
            <span className="truncate">{track.label}</span>
            {track.critical && (
              <span className="text-[8px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/15 border border-terracotta/30 rounded px-1 py-px shrink-0">CP</span>
            )}
          </div>
          {track.note && <div className="text-[10px] text-walnut-light truncate">{track.note}</div>}
        </div>
        <span className="text-[9px] text-walnut-light font-mono shrink-0 self-start mt-0.5">{track.catRef}</span>
      </div>
      <div className="flex-1 relative h-7 rounded">
        <div className="absolute inset-0 bg-walnut/[0.03] rounded" />
        {Array.from({ length: TIMELINE_HEADER_COLS - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-walnut/8"
            style={{ left: `${((i + 1) / TIMELINE_HEADER_COLS) * 100}%` }}
          />
        ))}
        {track.isMilestone ? (
          <div
            className="absolute top-1/2 z-10"
            style={{ left: `${left}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-3.5 h-3.5 rotate-45 bg-terracotta border-2 border-cream shadow-sm" />
          </div>
        ) : (
          <div
            className={`absolute top-1 bottom-1 rounded-md ${bar} shadow-sm transition-all group-hover:brightness-110`}
            style={{ left: `${left}%`, width: `${width}%` }}
            title={`${track.label} · W${track.startWeek + 1}–${track.startWeek + track.durationWeeks}`}
          >
            {width > 14 && (
              <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-cream truncate">
                {track.durationWeeks} wk
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PhaseHeaderRow({ idx, phase }: { idx: number; phase: TimelinePhase }) {
  const left = (phase.startWeek / TIMELINE_WEEKS) * 100;
  const width = ((phase.endWeek - phase.startWeek) / TIMELINE_WEEKS) * 100;
  return (
    <div className="flex items-center mt-5 mb-1.5">
      <div className="w-56 md:w-64 shrink-0 pr-3 flex items-center gap-2">
        <span className="w-7 h-7 rounded-md bg-walnut text-cream font-bold text-xs flex items-center justify-center shrink-0">
          {String(idx + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <div className="font-bold text-walnut text-sm truncate">{phase.name}</div>
          <div className="text-[10px] text-walnut-light italic">{phase.weekRange}</div>
        </div>
      </div>
      <div className="flex-1 relative h-2">
        <div
          className="absolute inset-y-0 bg-honey/20 border-l-2 border-r-2 border-honey/40 rounded"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function ExecutionTimeline() {
  return (
    <>
      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-walnut">Buildout Execution Timeline</h2>
            <p className="text-xs text-walnut-light mt-1 leading-relaxed">
              15-week fast-track buildout across 6 phases · GC sequencing with parallel trades + critical-path gates.
              Long-lead orders (gas service upgrade, RTUs, hoods) engage Week 1 to land in time for in-suite installation.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] shrink-0">
            <span className="px-2 py-1 rounded border border-walnut/20 bg-walnut/10 text-walnut font-semibold">Cat 1 / 9 / Vendors</span>
            <span className="px-2 py-1 rounded border border-honey/30 bg-honey/15 text-walnut font-semibold">Cat 2 MEP / 4</span>
            <span className="px-2 py-1 rounded border border-sage/30 bg-sage/15 text-walnut font-semibold">Cat 3 / 5 Finishes</span>
            <span className="px-2 py-1 rounded border border-terracotta/30 bg-terracotta/15 text-walnut font-semibold">Cat 6 / 8 / Critical</span>
            <span className="px-2 py-1 rounded border border-terracotta/40 bg-terracotta text-cream font-bold">CP = Critical Path</span>
          </div>
        </div>

        <div className="overflow-x-auto scroll-fade-x mt-4">
          <div className="min-w-[820px]">
            <div className="flex">
              <div className="w-56 md:w-64 shrink-0" />
              <div className="flex-1 grid grid-cols-5 border-b border-walnut/15 pb-1.5">
                {Array.from({ length: TIMELINE_HEADER_COLS }).map((_, i) => (
                  <div
                    key={i}
                    className={`text-center text-[10px] font-semibold uppercase tracking-wider text-walnut-light border-r border-walnut/10 last:border-r-0 ${i === 0 ? 'border-l border-walnut/10' : ''}`}
                  >
                    Wks {i * 3 + 1}–{(i + 1) * 3}
                  </div>
                ))}
              </div>
            </div>

            {TIMELINE_PHASES.map((phase, pi) => (
              <div key={phase.name}>
                <PhaseHeaderRow idx={pi} phase={phase} />
                {phase.tracks.map((t, ti) => <TrackRow key={ti} track={t} />)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <TimelineCriticalPathCard />
    </>
  );
}

function TimelineCriticalPathCard() {
  const items: { idx: number; title: string; detail: string; critical?: boolean }[] = [
    { idx: 1, title: 'CenterPoint Gas Upgrade', detail: '90–180 day lead. Order Week 2. Slip the order and the entire MEP rough-in window slides — every other trade waits on tied-in gas.', critical: true },
    { idx: 2, title: 'Building Permits Issued', detail: 'No physical construction until permits are stamped. Targeting Week 9. Drives demo + slab + MEP start.', critical: true },
    { idx: 3, title: 'Underground Plumbing', detail: 'Grease interceptor + slab penetrations must be set before any slab finish or stall framing. Misses force concrete cuts later.' },
    { idx: 4, title: 'Roof Penetration Coordination', detail: 'Hood exhaust + MAU + 4 RTUs all land in the central TPO zone. Lock layout with hood vendor + roofer before MEP rough-in starts.' },
    { idx: 5, title: 'MEP Rough-In Inspection', detail: 'Gates wall close-up. All 5 trades must finish + pass before drywall covers anything. Failed inspection is the most common multi-week slip.', critical: true },
    { idx: 6, title: 'UL 300 Hood Commissioning', detail: 'Fire suppression must be commissioned with fire marshal before final occupancy walkthrough. Gates fire marshal sign-off.', critical: true },
    { idx: 7, title: 'Fire Marshal + Health Final', detail: 'Health department food-service final inspection gates vendor equipment move-in and soft open.', critical: true },
  ];

  return (
    <div className="glass rounded-2xl p-5 md:p-6 mt-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-terracotta text-xl leading-none mt-0.5">▲</div>
        <div>
          <h3 className="text-base font-bold text-walnut">Critical Path & Dependency Gates</h3>
          <p className="text-xs text-walnut-light mt-0.5">Seven gates that drive opening date. Slip one and the whole sequence shifts — these are the items the GC and operator coordinate weekly.</p>
        </div>
      </div>
      <ol className="space-y-2.5">
        {items.map(it => (
          <li key={it.idx} className="flex gap-3">
            <span className={`w-7 h-7 rounded-full ${it.critical ? 'bg-terracotta' : 'bg-walnut'} text-cream font-bold text-xs flex items-center justify-center shrink-0`}>
              {it.idx}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-walnut flex items-center gap-1.5 flex-wrap">
                <span>{it.title}</span>
                {it.critical && (
                  <span className="text-[8px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/15 border border-terracotta/30 rounded px-1.5 py-px">Critical Path</span>
                )}
              </div>
              <div className="text-xs text-walnut-light leading-relaxed mt-0.5">{it.detail}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SummaryCard({ data }: { data: CapExData }) {
  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <h2 className="text-lg font-bold text-walnut mb-4">Project Cost Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">Cost Stack</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-walnut/5">
              <span className="text-walnut-light">Hard Construction Cost</span>
              <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(data.hardCosts)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-walnut/5">
              <span className="text-walnut-light">Soft Costs (A&amp;E, Permits, CM, Insurance)</span>
              <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(data.softCosts)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-walnut/5">
              <span className="text-walnut-light">Contingency (10% of Hard Costs)</span>
              <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(data.contingency)}</span>
            </div>
            <div className="flex justify-between py-2 mt-1 bg-walnut text-cream rounded-md px-3">
              <span className="font-semibold uppercase tracking-wider text-xs">Total Project Cost</span>
              <span className="font-bold tabular-nums">{fmtDollarFull(data.totalProjectCost)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-3">
              <span className="text-[11px] text-walnut-light italic">CapEx $/PSF (Total ÷ {LEASE_SQFT.toLocaleString()} sf)</span>
              <span className="text-xs font-semibold text-walnut tabular-nums">${data.capexPSF.toFixed(2)}/sf</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-walnut-light uppercase tracking-wider mb-2">Funding Structure</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-walnut/5">
              <span className="text-walnut-light">DPEG TI Allowance ($35/PSF × {LEASE_SQFT.toLocaleString()})</span>
              <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(data.tiAllowance)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-walnut/5">
              <span className="text-walnut-light">Net Equity Requirement (GP + LP)</span>
              <span className="font-semibold text-walnut tabular-nums">{fmtDollarFull(data.netEquity)}</span>
            </div>
            <div className="flex justify-between py-2 mt-1 bg-honey/20 rounded-md px-3">
              <span className="font-semibold uppercase tracking-wider text-xs text-walnut">Total Project Cost</span>
              <span className="font-bold text-walnut tabular-nums">{fmtDollarFull(data.totalProjectCost)}</span>
            </div>
            <p className="text-[10px] text-walnut-light italic mt-2 leading-relaxed">
              TI excluded from CoC equity base. Equity ask reflects {fmtDollarFull(data.hardCosts)} hard + {fmtDollarFull(data.softCosts)} soft + {fmtDollarFull(data.contingency)} contingency at {fmtDollarFull(data.totalProjectCost)} total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type CapExVersion = 'v1' | 'v2';
type CapExView = 'budget' | 'timeline';

export default function CapEx() {
  const revealRef = useReveal();
  const [version, setVersion] = useState<CapExVersion>('v1');
  const [view, setView] = useState<CapExView>('budget');
  const data = version === 'v1' ? V1_DATA : V2_DATA;

  return (
    <div className="min-h-screen bg-cream" ref={revealRef}>
      <NavBar current="/capex" />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-walnut">Capital Expenditure — Richmond V1</h1>
          <p className="text-walnut-light text-sm mt-1">
            Full SOW · 9 categories · ~{LEASE_SQFT.toLocaleString()} sq ft Left Zone of Bldg F Level 2 · Gensler shell (Issued for Permit 12/17/2021)
          </p>
          <div className="flex gap-2 mt-3 flex-wrap text-[10px]">
            <span className="px-2 py-0.5 rounded-full border border-honey/30 bg-honey/15 text-walnut font-semibold">{fmtDollarFull(data.totalProjectCost)} total project cost</span>
            <span className="px-2 py-0.5 rounded-full border border-sage/30 bg-sage/15 text-walnut font-semibold">DPEG TI: {fmtDollarFull(data.tiAllowance)} ({LEASE_SQFT.toLocaleString()} × $35/PSF)</span>
            <span className="px-2 py-0.5 rounded-full border border-terracotta/30 bg-terracotta/15 text-walnut font-semibold">Net equity: {fmtDollarFull(data.netEquity)}</span>
          </div>
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-walnut/5 border border-walnut/10">
              <button
                onClick={() => setVersion('v1')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${version === 'v1' ? 'bg-walnut text-cream shadow-sm' : 'text-walnut-light hover:text-walnut'}`}
              >
                CapEx V1
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setVersion('v2')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${version === 'v2' ? 'bg-walnut text-cream shadow-sm' : 'text-walnut-light hover:text-walnut'}`}
                >
                  CapEx V2
                </button>
                <InfoTooltip content="Updated numbers after meeting with Niyi on Apr 29, 2026." />
              </div>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-walnut/5 border border-walnut/10">
              <button
                onClick={() => setView('budget')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${view === 'budget' ? 'bg-walnut text-cream shadow-sm' : 'text-walnut-light hover:text-walnut'}`}
              >
                Budget
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setView('timeline')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${view === 'timeline' ? 'bg-walnut text-cream shadow-sm' : 'text-walnut-light hover:text-walnut'}`}
                >
                  Timeline
                </button>
                <InfoTooltip content="Visual buildout sequencing — phases, parallel trades, and critical-path gates from a GC's perspective." />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <SummaryCard data={data} />
        </section>

        <section className="mb-6">
          {version === 'v1' ? <GasFlagCallout /> : <V2ChangesSummary />}
        </section>

        {view === 'budget' ? (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-walnut">Budget by Category</h2>
              <p className="text-[11px] text-walnut-light italic">Click a category to expand · click a line item for scope notes</p>
            </div>
            <div className="space-y-3">
              {data.categories.map(cat => <CategoryCard key={cat.num} cat={cat} totalProjectCost={data.totalProjectCost} />)}
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <ExecutionTimeline />
          </section>
        )}

        <section className="mb-8">
          <div className="glass rounded-2xl p-5 md:p-6">
            <h2 className="text-lg font-bold text-walnut mb-3">Critical Path — Discovery/Design Sequencing</h2>
            <p className="text-xs text-walnut-light leading-relaxed mb-3">
              The following items must be engaged during the Discovery/Design phase (before construction start) to avoid delays:
            </p>
            <ul className="space-y-1.5 text-xs text-walnut-light">
              <li><span className="text-walnut font-semibold">Gas service upgrade</span> — engage CenterPoint Energy for 90–180 day lead time; start during MEP design</li>
              <li><span className="text-walnut font-semibold">MEP engineer of record selection</span> — drives all permit submittals</li>
              <li><span className="text-walnut font-semibold">Grease interceptor location</span> — coordinated with DPEG civil engineer; affects site work and sanitary tie-in</li>
              <li><span className="text-walnut font-semibold">Underground utility stub upsizes</span> — coordinate with DPEG (water 2" → 3" pending final calc)</li>
              <li><span className="text-walnut font-semibold">Roof penetration coordination</span> — central TPO zone for hood exhaust + MAU + RTUs</li>
              <li><span className="text-walnut font-semibold">Hood vendor selection and engineering</span> — drives fire marshal submittal</li>
              <li><span className="text-walnut font-semibold">BMS platform selection</span> — influences electrical and low-voltage scope</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-walnut/5 border-t border-walnut/10 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-walnut font-semibold text-sm">The Barn &mdash; Everybody&rsquo;s Welcome</p>
          <p className="text-walnut-light text-xs mt-1">Building F Level 2 &middot; Marcel Harvest Green &middot; Richmond, TX</p>
        </div>
      </footer>
    </div>
  );
}

import type { ReactNode } from 'react';

export interface ScopeLineItem {
  n: number;
  item: string;
  notes: string;
}

export interface ScopeSection {
  title: string;
  items: ScopeLineItem[];
}

export interface ScopeMeta {
  label: string;
  value: string;
}

export interface SubScope {
  slug: string;
  label: string;
  subtitle: string;
  title: string;
  blurb: string;
  meta: ScopeMeta[];
  sections: ScopeSection[];
  note: string;
  icon: ReactNode;
}

const icon = (path: ReactNode) => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    {path}
  </svg>
);

export const ICONS: Record<string, ReactNode> = {
  bolt: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />),
  beaker: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />),
  cog: icon(<><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>),
  funnel: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" />),
  shield: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />),
  building: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.434-.434 1.158-.434 1.592 0L21.75 12M4.5 9.75v10.5a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V15a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v5.25c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75V9.75M8.25 21h8.25" />),
  paint: icon(<path strokeLinecap="round" strokeLinejoin="round" d="m9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />),
  wifi: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />),
  squares: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />),
  tag: icon(<><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></>),
  gauge: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />),
};

export const SUB_SCOPES: SubScope[] = [
  {
    slug: 'framing-stalls',
    label: 'Framing & Stalls',
    subtitle: 'Demo · Restrooms · Vendor Stalls',
    title: 'Framing, Restrooms & Vendor Stall Buildout',
    blurb: 'Selective demo and shell prep, the two ADA restroom builds, and the kit-of-parts buildout of all 12 vendor stalls plus the feature wall.',
    meta: [{ label: 'Area', value: '~9,180 sq ft' }],
    sections: [
      {
        title: 'Demo & Shell Prep',
        items: [
          { n: 1, item: 'Selective demo of interior framing', notes: 'Remove existing studs / partial partitions to open floor. Haul-off included.' },
          { n: 2, item: 'Floor slab prep', notes: 'Power clean, patch, and spot-level slab throughout.' },
          { n: 3, item: 'Truss cleaning & prep', notes: 'Dust removal and light sanding of exposed trusses (sealer applied in later finish phase).' },
          { n: 4, item: 'Dust containment & site protection', notes: 'Containment barriers, envelope protection, construction layout markout.' },
        ],
      },
      {
        title: "Restroom Buildout (Men's + Women's, ADA)",
        items: [
          { n: 5, item: 'Framing & drywall', notes: 'Metal-stud framing, moisture-resistant drywall + tile backer at wet walls.' },
          { n: 6, item: 'Doors, partitions & accessories', notes: 'Entry doors w/ privacy airlock, phenolic partitions, ADA hardware, baby changing, accessories.' },
          { n: 7, item: 'Finishes', notes: 'Porcelain floor + wall tile, wood wainscoting, framed mirrors, sconces. (Plumbing fixtures by others.)' },
        ],
      },
      {
        title: 'Vendor Stalls (12 Total)',
        items: [
          { n: 8, item: '8 food stalls — kit-of-parts', notes: 'Standardized build: facade, side/back walls, FRP panels, tile cooking floor, counters, finishes. Tie into utility stubs (by others).' },
          { n: 9, item: 'Health bar kiosk', notes: '~280 sq ft single-sided. Counter facade, back wall, tile floor, finished interior.' },
          { n: 10, item: 'Coffee / drinks kiosk', notes: '~220 sq ft single-sided. Counter facade, back wall, tile floor, finished interior.' },
          { n: 11, item: '2 dessert kiosks', notes: '~220 sq ft each, open island format. Matched-spec facade, sealed concrete floor, finished interior.' },
          { n: 12, item: 'Unified sign panel system', notes: 'Matte-black framed LED-backlit panels above all 12 stalls (vendors supply artwork).' },
          { n: 13, item: 'Feature wall buildout', notes: 'Herringbone wood base, dimensional logo, faux-neon sign, greenery panels, accent lighting.' },
        ],
      },
    ],
    note: 'Common-area finishes (paint, polished concrete, lighting) are quoted as a separate later phase.',
    icon: ICONS.building,
  },
  {
    slug: 'electrical',
    label: 'Electrical',
    subtitle: 'Distribution · Power · Controls',
    title: 'Electrical',
    blurb: 'Tenant distribution from the landlord service, per-stall subpanels, branch circuitry, lighting-control wiring, and low-voltage pathways.',
    meta: [
      { label: 'Area', value: '~9,180 sq ft' },
      { label: 'Service', value: '1,200A @ 277/480V 3-phase delivered' },
    ],
    sections: [
      {
        title: 'Distribution & Power',
        items: [
          { n: 1, item: 'Subpanels + main feeder', notes: "Main tenant panel (MDP-T, ~400A) in core off landlord's HF-2, plus 3 sub-distribution panels: food row, gathering/kiosks, entry/BOH. Copper feeders." },
          { n: 2, item: '8 food stall subpanels', notes: '60A subpanel per food stall for vendor equipment independence. Full breaker fill + per-vendor energy monitoring.' },
          { n: 3, item: 'Branch circuit distribution', notes: '~100 branch circuits in exposed matte-black conduit. Equipment hookups (RTUs, hoods, MAU, water heaters), common-area + BOH receptacles, GFCI/AFCI.' },
        ],
      },
      {
        title: 'Lighting Controls & Low-Voltage',
        items: [
          { n: 4, item: 'Smart lighting controls + wiring', notes: 'DALI control wiring + dimming drivers, group-addressable zones, operator-programmed scenes. (Light fixtures supplied/installed by others.)' },
          { n: 5, item: 'Emergency / egress lighting', notes: 'Exit signs, battery-backup egress lighting, fire alarm battery backup. Code minimum.' },
          { n: 6, item: 'Low-voltage conduit pathways', notes: 'Matte-black EMT pathway for data/AV/security/BMS, plus modest spare conduit for future expansion. (Cabling pulled by others.)' },
        ],
      },
      {
        title: 'Engineering & Permitting',
        items: [
          { n: 7, item: 'Permitting, engineering, inspection', notes: 'MEP electrical stamp, Richmond / Fort Bend permit fees, rough-in + final inspections, BMS commissioning coordination.' },
        ],
      },
    ],
    note: 'Light fixtures & low-voltage cabling are separate packages — conduit pathway only here.',
    icon: ICONS.bolt,
  },
  {
    slug: 'plumbing-gas',
    label: 'Plumbing & Gas',
    subtitle: 'Water · Waste · Gas Service',
    title: 'Plumbing & Gas',
    blurb: 'Grease interceptor, full water/waste/vent distribution to 12 vendor rough-ins and 2 restrooms, tankless hot water, and the CenterPoint gas upgrade + per-stall manifolds.',
    meta: [
      { label: 'Area', value: '~9,180 sq ft' },
      { label: 'Program', value: '8 food stalls + 4 kiosks, 2 restrooms' },
    ],
    sections: [
      {
        title: 'Plumbing',
        items: [
          { n: 1, item: 'Underground grease interceptor', notes: '1,500-gal precast, H-20 traffic-rated, two-compartment. Tie-in to municipal sewer, sample well, access risers. Sized for 8 food stalls.' },
          { n: 2, item: 'Plumbing distribution (trunk + branches)', notes: 'Copper water + cast iron/PVC waste/vent. Full distribution to 12 vendor rough-ins, 2 restrooms, BOH, mop sink, hand sinks, dishwashing. Insulated hot-water recirc loop.' },
          { n: 3, item: 'Tankless hot water system + recirc', notes: 'Two commercial gas tankless units (Rheem/Rinnai) in core, BMS-tied recirc pump, roof-vented. Handles 12-vendor + 2-restroom peak.' },
          { n: 4, item: 'Floor drains + mop sink', notes: '~12 food-stall floor drains, 2 restroom drains, 1 BOH drain, mop sink + janitor closet. Trap primers, slab core-cutting included.' },
          { n: 5, item: 'Restroom fixtures', notes: 'Mid-tier commercial: 5 toilets (2M + 3W), 2 urinals, 4 sinks, matte-black sensor faucets, auto-flush valves.' },
        ],
      },
      {
        title: 'Gas',
        items: [
          { n: 6, item: 'Gas service upgrade + distribution', notes: 'CenterPoint service-line upgrade to ~35K CFH (meter + regulator upsize), main trunk to food row, per-stall manifolds (4 connections each) + shut-off valves, leak testing. Critical path — 90–180 day lead.' },
        ],
      },
      {
        title: 'Engineering & Permitting',
        items: [
          { n: 7, item: 'Permitting, engineering, inspection', notes: 'MEP plumbing stamp, Richmond / Fort Bend permit fees, grease-interceptor permit + sizing coordination, inspections.' },
        ],
      },
    ],
    note: 'Gas timing pending CenterPoint formal scheduling. Landlord stub at L2: 2" cold water + 4" waste + 4" vent.',
    icon: ICONS.beaker,
  },
  {
    slug: 'hvac-bms',
    label: 'HVAC & BMS',
    subtitle: 'Cooling · Make-Up Air · Controls',
    title: 'HVAC, Ventilation & BMS',
    blurb: 'Full tenant HVAC — rooftop units, hood-integrated make-up air, demand-controlled restroom/BOH exhaust, and the cloud BMS that ties every system together.',
    meta: [
      { label: 'Area', value: '~9,180 sq ft' },
      { label: 'Shell', value: 'No HVAC delivered — 100% tenant scope' },
    ],
    sections: [
      {
        title: 'Mechanical — Cooling, Heating & Make-Up Air',
        items: [
          { n: 1, item: '4 RTUs — ~56 tons total, SEER 16', notes: '4 packaged rooftop units (~12–15 tons each) in central TPO roof zone. Exposed matte-black spiral ductwork through trusses. 4 thermal zones: vendor row, gathering, perimeter lounge, entry/support.' },
          { n: 2, item: 'Hood-integrated MAU (short-circuit)', notes: '~14,000 CFM with dehumidification stage (Houston climate), integrated gas heating, BMS-tied hood-fan interlock. Single MAU serving both 40-ft hood canopies.' },
          { n: 3, item: 'Restroom / BOH demand-controlled exhaust', notes: "Occupancy-sensor exhaust fans for men's/women's restrooms, janitor closet, BOH. Tied to BMS." },
        ],
      },
      {
        title: 'Controls',
        items: [
          { n: 4, item: 'Building Management System (BMS)', notes: 'Cloud-based platform integrating HVAC + Hood + MAU + Lighting + Restroom exhaust. Remote access, scene programming, energy dashboards. Installer commissioning (operator handles scenes/schedules).' },
        ],
      },
    ],
    note: 'Kitchen hoods are a separate specialty package; the MAU here must interlock with them. Roof penetrations land in the central TPO zone.',
    icon: ICONS.cog,
  },
  {
    slug: 'hood-vents',
    label: 'Hood Vents',
    subtitle: 'Kitchen Hood System',
    title: 'Kitchen Hood System',
    blurb: 'Two shared 40-ft Type I grease hoods with demand-controlled ventilation, exhaust fans and ductwork, and the UL 300 fire-suppression + gas-safety package across 8 cooking stalls.',
    meta: [
      { label: 'Config', value: 'Two 40-ft shared hoods, 4 stalls each (8 cooking stalls)' },
      { label: 'Exhaust', value: 'Central TPO roof zone' },
    ],
    sections: [
      {
        title: 'Hood Canopies & Exhaust',
        items: [
          { n: 1, item: 'Two 40-ft hood canopies with DCV', notes: 'Captive-Aire (industry standard) UL-listed Type I grease hoods, 304 stainless, demand-controlled ventilation with heat/optical sensors, integrated LED task lighting. 40 ft each covering 4 stalls per hood.' },
          { n: 2, item: 'Two exhaust fans (high-efficiency, BMS-tied)', notes: 'Greenheck commercial fans with VFDs for DCV modulation, integrated grease containment, full BMS integration.' },
          { n: 3, item: 'Ductwork (2 exhaust runs to central TPO zone)', notes: '16-gauge welded stainless grease duct, fire-rated wrap through occupied areas, proper roof curbs and flashing at TPO penetrations, code-required access panels.' },
        ],
      },
      {
        title: 'Fire Suppression & Gas Safety',
        items: [
          { n: 4, item: 'Two UL 300 fire suppression systems', notes: 'Ansul R-102 systems with individual stall detection zones (4 per hood), electric-solenoid gas shut-off integration, fire marshal commissioning.' },
          { n: 5, item: 'Gas shut-off valves and interlocks', notes: 'Electric-solenoid valves (8 total — 1 per stall), manifold-integrated, BMS-compatible. Auto-shut on fire detection.' },
          { n: 6, item: 'Manual pull stations', notes: 'Code-required, 1 per hood (2 total) at accessible locations.' },
        ],
      },
      {
        title: 'Engineering & Permitting',
        items: [
          { n: 7, item: 'Permitting, engineering, commissioning', notes: 'MEP engineer stamp, fire marshal plan review and inspection, test & balance of exhaust + MAU, DCV commissioning.' },
        ],
      },
    ],
    note: 'General-area sprinklers & fire alarm are under Fire Protection; the hood-integrated MAU is under HVAC.',
    icon: ICONS.funnel,
  },
  {
    slug: 'fire-suppression',
    label: 'Fire Suppression',
    subtitle: 'Sprinkler + Fire Alarm',
    title: 'Fire Protection (Sprinkler + Fire Alarm)',
    blurb: 'Wet-pipe sprinkler distribution throughout the suite per NFPA 13, plus the fire-alarm zone expansion, devices, and fire-marshal commissioning.',
    meta: [
      { label: 'Area', value: '~9,180 sq ft' },
      { label: 'Riser', value: '4" sprinkler riser stubbed to Level 2' },
    ],
    sections: [
      {
        title: 'Sprinkler System',
        items: [
          { n: 1, item: 'Sprinkler distribution throughout suite', notes: '~60 sprinkler heads covering 9,180 sq ft per NFPA 13. Wet-pipe system extended from delivered 4" riser. Standard commercial pendant heads (paintable matte-black to blend with aesthetic). Hydraulic calcs and fire engineer stamp.' },
        ],
      },
      {
        title: 'Fire Alarm & Permitting',
        items: [
          { n: 2, item: 'Fire alarm zone expansion + devices', notes: 'Add suite zone to existing Bldg F fire alarm panel. 15–25 smoke detectors, pull stations at egress doors, horn/strobes in all occupied areas, 4 duct detectors (one per RTU), interconnect with hood suppression and BMS, programming and commissioning.' },
          { n: 3, item: 'Permitting, fire marshal inspection, commissioning', notes: 'Fire protection engineer stamp, permit fees, fire marshal plan review and final inspection.' },
        ],
      },
    ],
    note: 'Hood UL 300 suppression is under the Kitchen Hood package — you are responsible for interconnect/commissioning.',
    icon: ICONS.shield,
  },
  {
    slug: 'common-areas',
    label: 'Common Areas',
    subtitle: 'Finishes · Lighting · Ambiance',
    title: 'Common Area Finishes, Lighting & Ambiance',
    blurb: 'Floor, wall, and ceiling finishes across the gathering hall, plus the lighting fixtures, greenery, and styling that set the room’s warmth.',
    meta: [{ label: 'Common Area', value: '~7,000 sq ft' }],
    sections: [
      {
        title: 'Finishes',
        items: [
          { n: 1, item: 'Floor finish — polished/stained concrete (~7,000 sq ft)', notes: 'Grind + polish + single-tone honey/walnut stain + quality urethane sealer across all common area. Durable, easy to clean, on-brand.' },
          { n: 2, item: 'Wall finishes (paint + accent wood + trim)', notes: 'Cream paint (#FAF8F5) throughout, wood-look engineered paneling on ~400 sq ft of accent walls (kiosk back walls, gathering features), matte-black metal trim at key transitions.' },
          { n: 3, item: 'Ceiling treatment (truss cleaning + matte-black MEP)', notes: 'Clean + light sand + clear matte sealer on exposed wood trusses (grease/smoke protection), matte-black paint on all exposed ductwork, conduit, sprinkler lines, cable trays.' },
        ],
      },
      {
        title: 'Lighting & Ambiance',
        items: [
          { n: 4, item: 'Lighting fixtures (fixtures only; controls by Electrical)', notes: 'Edison string lights across trusses (signature feature), 12 warm-metal pendants over communal tables/kiosks, 20 recessed LEDs for food row, 200 LF under-counter LED strips, accent lamps + sconces. All 2700K dimmable.' },
          { n: 5, item: 'Greenery & planters', notes: 'Mixed real + high-quality faux. Real plants near window walls, faux in lower-light interior zones. Hanging truss planters, large potted transitions, vertical greenery at feature wall, communal table accents.' },
        ],
      },
    ],
    note: 'Lighting controls (DALI) are under Electrical — you supply & install fixtures only.',
    icon: ICONS.paint,
  },
  {
    slug: 'av-network',
    label: 'AV & Network',
    subtitle: 'Data · Wi-Fi · AV · Security',
    title: 'Low-Voltage / Data / AV & Security',
    blurb: 'Structured cabling, Wi-Fi, IT rack/UPS, IP security cameras with NVR, and the distributed multi-zone speaker system — pulled and commissioned in conduit provided by Electrical.',
    meta: [
      { label: 'Area', value: '~9,180 sq ft' },
      { label: 'Pathways', value: 'Conduit by Electrical — you pull, terminate & commission' },
    ],
    sections: [
      {
        title: 'Data & Network',
        items: [
          { n: 1, item: 'Structured cabling (Cat6A)', notes: 'Cat6A drops to all 12 vendor stalls + 10 common-area endpoints (Wi-Fi APs, cameras, BMS devices). Certified terminations, 10-year lease durability.' },
          { n: 2, item: 'Wi-Fi infrastructure', notes: '8 Ubiquiti UniFi access points covering 9,180 sq ft + BOH. Cloud-managed controller, PoE switches, VLAN segmentation (guest / vendor / BMS / security). Operator-manageable.' },
          { n: 3, item: 'IT rack + UPS + patch panels', notes: '18U wall-mounted rack in BOH, 1500VA UPS for network/NVR/BMS continuity, patch panel for terminations, cable management and labeling.' },
        ],
      },
      {
        title: 'AV & Security',
        items: [
          { n: 4, item: 'IP security cameras + NVR', notes: '8 UniFi Protect cameras at entry/exits/food row/BOH, 4MP low-light. NVR with 30-day storage, native UniFi network integration.' },
          { n: 5, item: 'Distributed speaker system', notes: '~16 commercial 70V ceiling speakers for even coverage, multi-zone controller (food row / gathering / kiosk / BOH independent), standard commercial amplifier.' },
        ],
      },
    ],
    note: 'Conduit pathways are provided by Electrical — you pull, terminate, configure & commission.',
    icon: ICONS.wifi,
  },
  {
    slug: 'ffe',
    label: 'FF&E & Seating',
    subtitle: 'Seating · Furniture · Decor',
    title: 'Seating, Furniture & FF&E',
    blurb: 'The full 200-seat furniture package — communal farm tables, family tables, high-tops, custom window benches — plus the decor and styling layer.',
    meta: [{ label: 'Capacity', value: '200 occupants' }],
    sections: [
      {
        title: 'Seating — 200 Capacity',
        items: [
          { n: 1, item: 'Seating mix', notes: '3 large communal farm tables (48 seats total), 14 family/4-top tables + 56 chairs, 14 high-tops + 56 stools, custom window-bench seating along 3 window walls (~40 seats). Commercial-grade solid wood tops, matte-black metal frames, quality cushions on bench seating.' },
        ],
      },
      {
        title: 'Decor & Styling',
        items: [
          { n: 2, item: 'Decor & styling layer', notes: 'Local artwork and framed photography (Richmond/Texas community themes, 8–15 pieces), vintage barn-inspired signage, 4 chalkboards for kiosk daily specials, 3–4 commercial-grade area rugs to anchor seating zones, communal table accents and styling accessories.' },
        ],
      },
    ],
    note: 'Feature wall is under Millwork; lighting fixtures are under Common Areas. Strategic sourcing expected to hit target pricing.',
    icon: ICONS.squares,
  },
  {
    slug: 'signage',
    label: 'Signage',
    subtitle: 'Branding · Wayfinding',
    title: 'Branding & Signage',
    blurb: 'Exterior building signage and window vinyl, plus the interior ADA + wayfinding signage package in matte-black metal and warm wood.',
    meta: [
      { label: 'Area', value: '~9,180 sq ft' },
      { label: 'Palette', value: 'Matte-black metal + warm wood' },
    ],
    sections: [
      {
        title: 'Exterior Signage',
        items: [
          { n: 1, item: 'Exterior building signage', notes: 'Primary Barn logo in matte-black dimensional metal with warm backlighting, smaller "Richmond" location identifier, window vinyl for operating hours + social handles + "Everybody’s Welcome" tagline across perimeter windows. Installation, electrical hookup for backlighting, DPEG + City permits.' },
        ],
      },
      {
        title: 'Interior Wayfinding',
        items: [
          { n: 2, item: 'Interior wayfinding & signage', notes: 'ADA-compliant restroom signage, directional signage (entry, kiosks, event venue next door, BOH), "Everybody’s Welcome" accent signage in gathering zones, BOH/staff-only markers, 12–20 table numbers for order-ahead pickup. Matte-black metal + warm wood fabrication.' },
        ],
      },
    ],
    note: 'Vendor stall sign panels & feature wall neon are covered under the Framing / Millwork package.',
    icon: ICONS.tag,
  },
];

export function getScope(slug: string): SubScope | undefined {
  return SUB_SCOPES.find(s => s.slug === slug);
}

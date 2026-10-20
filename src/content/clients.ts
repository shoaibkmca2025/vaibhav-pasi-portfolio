// Client websites shown in the client wall (components/ClientLogos.tsx) and the full directory
// on /work (components/ClientDirectory.tsx). Source: "Portfolio Works" sheet supplied by Vaibhav.
//
// Rules (please keep):
// - Only real clients, and only ones you are allowed to name. Never copy another agency's client list.
// - `url` is left out when the site is offline or has a broken certificate, so visitors never hit
//   a warning page (checked Oct 2026: Full Drone and Little Fin Seafood certificate errors,
//   the DeBartolo Longevity domain no longer resolves).
// - Optional `logo`: a file in /public/clients (taken from the client's own site, resized to 96px tall);
//   otherwise the name is shown. Logos that were wrong, generic or too low quality were left out.
export interface Client {
  name: string;
  url?: string;
  logo?: string;
  // Background behind the logo: light for dark logos, dark for white ones
  plate?: 'light' | 'dark';
  industry: (typeof INDUSTRIES)[number];
}

// Display order of the industry groups in the directory
export const INDUSTRIES = [
  'Legal',
  'Healthcare & wellness',
  'Home & property services',
  'Food, drink & hospitality',
  'Finance, insurance & business',
  'Science, non-profit & community',
  'Retail, products & personal brands',
  'Education & careers',
] as const;

// The home-page wall stays hidden below this many entries, so it never looks empty
export const MIN_CLIENTS = 4;

export const clients: Client[] = [
  // Named publicly in the Mauli Overseas case study (content/caseStudies.ts)
  { name: 'Mauli Overseas', url: 'https://maulioverseas.com', industry: 'Education & careers' },
  { name: "Art For Soul", url: 'https://www.artforsoul.in/', logo: '/clients/art-for-soul.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "AstroSrijan", url: 'https://www.astrosrijan.com/', logo: '/clients/astrosrijan.webp', plate: 'dark', industry: 'Retail, products & personal brands' },
  { name: "Adhira Herbals", url: 'https://www.adhiraherbals.com/', logo: '/clients/adhira-herbals.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "Joker Media", url: 'https://jokermedia.com/', logo: '/clients/joker-media.webp', plate: 'light', industry: 'Finance, insurance & business' },
  { name: "Silver Thatch Pensions", url: 'https://silverthatch.org.ky/', logo: '/clients/silver-thatch-pensions.webp', plate: 'dark', industry: 'Finance, insurance & business' },
  { name: "Century Boats", url: 'https://centuryboats.com/', logo: '/clients/century-boats.webp', plate: 'dark', industry: 'Retail, products & personal brands' },
  { name: "Greendale Physical Therapy", url: 'https://greendalept.com/', logo: '/clients/greendale-physical-therapy.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "Russell's Orlando", url: 'https://russellsorlando.com/', logo: '/clients/russells-orlando.webp', plate: 'dark', industry: 'Food, drink & hospitality' },
  { name: "Rolly Polly", url: 'https://rolypoly.com/', logo: '/clients/rolly-polly.webp', plate: 'light', industry: 'Retail, products & personal brands' },
  { name: "Verdant Isle Pension Plan", url: 'https://verdantisle.org.ky/', logo: '/clients/verdant-isle-pension-plan.webp', plate: 'light', industry: 'Finance, insurance & business' },
  { name: "SCCOOS", url: 'https://sccoos.org/', logo: '/clients/sccoos.webp', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "GCOOS", url: 'https://gcoos.org/', logo: '/clients/gcoos.webp', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "CeNCOOS", url: 'https://www.cencoos.org/', logo: '/clients/cencoos.webp', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "Sarasota Dolphin Research Program", url: 'https://sarasotadolphin.org/', logo: '/clients/sarasota-dolphin-research-program.webp', plate: 'dark', industry: 'Science, non-profit & community' },
  { name: "Alan Smith Pool Plastering & Remodeling", url: 'https://alansmithpools.com/', logo: '/clients/alan-smith-pool-plastering-and-remodeling.webp', plate: 'light', industry: 'Home & property services' },
  { name: "The Back Porch Mulberry", url: 'https://thebackporchmulberry.com/', logo: '/clients/the-back-porch-mulberry.webp', plate: 'light', industry: 'Food, drink & hospitality' },
  { name: "Hogan’s Place Gibsonton Florida", url: 'https://hogansplacegibsontonflorida.com/', industry: 'Food, drink & hospitality' },
  { name: "DMS Broadcasting", url: 'https://dmsbroadcasting.ky/', industry: 'Finance, insurance & business' },
  { name: "CS Roofing Company", url: 'https://csroofingcompany.com/', logo: '/clients/cs-roofing-company.webp', plate: 'light', industry: 'Home & property services' },
  { name: "DeBartolo Longevity University", industry: 'Healthcare & wellness' },
  { name: "Gutter Guards Direct", url: 'https://www.gutterguardsdirect.com/', logo: '/clients/gutter-guards-direct.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Coachman Tahoe", url: 'https://coachmantahoe.com/', industry: 'Food, drink & hospitality' },
  { name: "Nashua Glass", url: 'https://nashuaglass.com/', logo: '/clients/nashua-glass.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Creative Concrete Inc.", url: 'https://www.creativeconcreteinc.com/', logo: '/clients/creative-concrete-inc.webp', plate: 'light', industry: 'Home & property services' },
  { name: "This Sold House", url: 'https://thissoldhouseinc.com/', industry: 'Home & property services' },
  { name: "Orlando Hand Surgery Associates", url: 'https://orlandohandsurgery.com/', logo: '/clients/orlando-hand-surgery-associates.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "Lake Shore Guys", url: 'https://lakeshoreguys.com/', logo: '/clients/lake-shore-guys.webp', plate: 'dark', industry: 'Home & property services' },
  { name: "Ice Dam Removal Guys", url: 'https://icedamremovalguys.com/', logo: '/clients/ice-dam-removal-guys.webp', plate: 'dark', industry: 'Home & property services' },
  { name: "Landscape Guys", url: 'https://landscapeguys.com/', industry: 'Home & property services' },
  { name: "Full Drone", industry: 'Retail, products & personal brands' },
  { name: "Hand Armor Gloves", url: 'https://handarmorgloves.com/', logo: '/clients/hand-armor-gloves.webp', plate: 'dark', industry: 'Retail, products & personal brands' },
  { name: "The Back Porch Longwood", url: 'https://thebackporchlongwood.com/', logo: '/clients/the-back-porch-longwood.webp', plate: 'light', industry: 'Food, drink & hospitality' },
  { name: "Frenchy's Wood Fired", url: 'https://frenchyswoodfired.com/', logo: '/clients/frenchys-wood-fired.webp', plate: 'dark', industry: 'Food, drink & hospitality' },
  { name: "The Greater Pine Island Alliance", url: 'https://www.gpialliance.org/', logo: '/clients/the-greater-pine-island-alliance.webp', plate: 'dark', industry: 'Science, non-profit & community' },
  { name: "Loeschen Art", url: 'https://loeschenart.com/', industry: 'Retail, products & personal brands' },
  { name: "GM Rodriguez Law", url: 'https://gmrodriguezlaw.com/', logo: '/clients/gm-rodriguez-law.webp', plate: 'light', industry: 'Legal' },
  { name: "Hampton Closet Company", url: 'https://hamptonclosetcompany.com/', logo: '/clients/hampton-closet-company.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Rebecca Waxse Law", url: 'https://www.rebeccalouiselaw.com/', logo: '/clients/rebecca-waxse-law.webp', plate: 'light', industry: 'Legal' },
  { name: "John's Pro Care", url: 'https://johnsprocare.com/', logo: '/clients/johns-pro-care.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Valley Agencies", url: 'https://valleyagencies.com/', logo: '/clients/valley-agencies.webp', plate: 'light', industry: 'Finance, insurance & business' },
  { name: "Little Fin Seafood", industry: 'Food, drink & hospitality' },
  { name: "Waco Foundation Repair", url: 'https://wacofoundationrepair.com/', logo: '/clients/waco-foundation-repair.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Cross Stone Law", url: 'https://crossstone.com/', logo: '/clients/cross-stone-law.webp', plate: 'light', industry: 'Legal' },
  { name: "Ocean Synchro", url: 'https://oceansynchro.io/', logo: '/clients/ocean-synchro.webp', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "Ridgeline Scientific", url: 'https://ridgelinescientificsx.com/', logo: '/clients/ridgeline-scientific.svg', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "Surface Waxse Law", url: 'https://surfacewaxselaw.com/', logo: '/clients/surface-waxse-law.webp', plate: 'dark', industry: 'Legal' },
  { name: "MemoryBanc", url: 'https://memorybanc.com/', logo: '/clients/memorybanc.webp', plate: 'dark', industry: 'Finance, insurance & business' },
  { name: "Regulus Global", url: 'https://regulusglobal.com/', logo: '/clients/regulus-global.svg', plate: 'dark', industry: 'Finance, insurance & business' },
  { name: "Callicoon Hills", url: 'https://www.callicoonhills.com/', logo: '/clients/callicoon-hills.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Lavent Law", url: 'https://laventlaw.com/', logo: '/clients/lavent-law.svg', plate: 'light', industry: 'Legal' },
  { name: "Athens Shutters", url: 'https://athensshutters.com/', logo: '/clients/athens-shutters.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Saxon", url: 'https://www.saxon.ky/', logo: '/clients/saxon.webp', plate: 'light', industry: 'Finance, insurance & business' },
  { name: "WC Beverage", url: 'https://www.wcbevdc.com/', logo: '/clients/wc-beverage.webp', plate: 'dark', industry: 'Food, drink & hospitality' },
  { name: "Joker Care", url: 'https://jokercare.com/', logo: '/clients/joker-care.webp', plate: 'dark', industry: 'Finance, insurance & business' },
  { name: "Four Daughters Vineyard", url: 'https://fourdaughtersvineyard.com/', industry: 'Food, drink & hospitality' },
  { name: "Bald Beauties Project®", url: 'https://baldbeautiesproject.org/', logo: '/clients/bald-beauties-project.webp', plate: 'dark', industry: 'Healthcare & wellness' },
  { name: "Success Print", url: 'https://successprint.com/', logo: '/clients/success-print.webp', plate: 'light', industry: 'Finance, insurance & business' },
  { name: "Dynasty’s United Youth Association", url: 'https://dynastysyouth.org/', logo: '/clients/dynastys-united-youth-association.webp', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "Villagio Family & Cosmetic Dental", url: 'https://www.villagiofamilydental.com/', logo: '/clients/villagio-family-and-cosmetic-dental.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "Chatow Law", url: 'https://chatow.com/', logo: '/clients/chatow-law.webp', plate: 'light', industry: 'Legal' },
  { name: "Josh Benson", url: 'https://joshbenson.com/', logo: '/clients/josh-benson.webp', plate: 'dark', industry: 'Retail, products & personal brands' },
  { name: "Prosper Shaked Accident Injury Attorneys PA", url: 'https://prosperlaw.com/', logo: '/clients/prosper-shaked-accident-injury-attorneys-pa.webp', plate: 'dark', industry: 'Legal' },
  { name: "North Star Fur", url: 'https://northstarfur.com/', logo: '/clients/north-star-fur.webp', plate: 'dark', industry: 'Retail, products & personal brands' },
  { name: "Better Way Home Improvement", url: 'https://bettervinylsiding.com/', logo: '/clients/better-way-home-improvement.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Orlando Regenerative Medicine", url: 'https://orlandoregenerativemed.com/', logo: '/clients/orlando-regenerative-medicine.webp', plate: 'dark', industry: 'Healthcare & wellness' },
  { name: "Lasers Over Los Angeles", url: 'https://www.lasersoverlosangeles.com/', logo: '/clients/lasers-over-los-angeles.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "The Pilates Body", url: 'https://tpbody.com/', logo: '/clients/the-pilates-body.svg', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "Local Visibility System", url: 'https://www.localvisibilitysystem.com/', industry: 'Finance, insurance & business' },
  { name: "Kickball Society of Tampa Bay", url: 'https://kickballsociety.com/', logo: '/clients/kickball-society-of-tampa-bay.webp', plate: 'light', industry: 'Science, non-profit & community' },
  { name: "Dr. Jason Attaman", url: 'https://jasonattaman.com/', industry: 'Healthcare & wellness' },
  { name: "Newsroom Knot", url: 'https://newsroomknot.com/', industry: 'Finance, insurance & business' },
  { name: "Tim Cortes", url: 'https://timcortes.com/', logo: '/clients/tim-cortes.webp', plate: 'dark', industry: 'Retail, products & personal brands' },
  { name: "First State Bank and Trust", url: 'https://www.fsbt.com/', logo: '/clients/first-state-bank-and-trust.svg', plate: 'dark', industry: 'Finance, insurance & business' },
  { name: "Blue Sky Estate Services", url: 'https://www.blueskyestateservices.com/', industry: 'Home & property services' },
  { name: "Butcher and Market", url: 'https://butcherandmarket.com/', industry: 'Food, drink & hospitality' },
  { name: "Willy's Original Orlando", url: 'https://willysoriginalorlando.com/', industry: 'Food, drink & hospitality' },
  { name: "Phoenix Accident and Injury Law Firm", url: 'https://phxinjurylaw.com/', industry: 'Legal' },
  { name: "Saxon Administration", url: 'https://saxonadministration.ky/', logo: '/clients/saxon-administration.webp', plate: 'dark', industry: 'Finance, insurance & business' },
  { name: "Kammes Colorworks", url: 'https://kammescolorworks.com/', logo: '/clients/kammes-colorworks.webp', plate: 'light', industry: 'Home & property services' },
  { name: "Forza Ltd", url: 'https://forza.ky/', industry: 'Finance, insurance & business' },
  { name: "Regus Cayman", url: 'https://reguscayman.ky/', logo: '/clients/regus-cayman.svg', plate: 'light', industry: 'Finance, insurance & business' },
  { name: "Minnesota Rose Society", url: 'https://minnesotarosesociety.org/', industry: 'Science, non-profit & community' },
  { name: "Find Jodi Huisentruit", url: 'https://findjodi.com/', logo: '/clients/find-jodi-huisentruit.svg', plate: 'dark', industry: 'Science, non-profit & community' },
  { name: "Mountaintop Roofing & Solar", url: 'https://www.mountaintoproofing.com/', industry: 'Home & property services' },
  { name: "The Traditionalist Bourbon", url: 'https://thetraditionalistbourbon.com/', logo: '/clients/the-traditionalist-bourbon.webp', plate: 'light', industry: 'Food, drink & hospitality' },
  { name: "Cents of Relief", url: 'https://centsofrelief.org/', industry: 'Science, non-profit & community' },
  { name: "Greta's Grotto", url: 'https://www.gretasgrotto.ky/', logo: '/clients/gretas-grotto.webp', plate: 'light', industry: 'Food, drink & hospitality' },
  { name: "Loon Juice Hard Cider", url: 'https://loonjuice.com/', industry: 'Food, drink & hospitality' },
  { name: "Small Victories Project", url: 'https://smallvictoriesproject.org/', logo: '/clients/small-victories-project.webp', plate: 'dark', industry: 'Science, non-profit & community' },
  { name: "Dr. Anup Patel", url: 'https://dranuppatel.com/', industry: 'Healthcare & wellness' },
  { name: "Boston Orthopaedic & Spine", url: 'https://bostonorthoandspine.com/', logo: '/clients/boston-orthopaedic-and-spine.webp', plate: 'light', industry: 'Healthcare & wellness' },
  { name: "OC Patent Lawyer", url: 'https://ocpatentlawyer.com/', industry: 'Legal' },
  { name: "Warner & Fitzmartin", url: 'https://warnerfitzmartin.com/', logo: '/clients/warner-and-fitzmartin.webp', plate: 'dark', industry: 'Legal' },
  { name: "Houston Faces", url: 'https://www.houstonfaces.com/', industry: 'Healthcare & wellness' },
  { name: "SeaForce Boats", url: 'https://seaforceboats.com/', industry: 'Retail, products & personal brands' },
  { name: "PharmaKonnect", url: 'https://pharmakonnect.com/', industry: 'Finance, insurance & business' },
  { name: "Smoke Boards: Cocktail Smoker", url: 'https://smokeboards.com/', logo: '/clients/smoke-boards-cocktail-smoker.webp', plate: 'light', industry: 'Food, drink & hospitality' },
  { name: "Casper Mehlos Law Group", url: 'https://mehloslaw.com/', logo: '/clients/casper-mehlos-law-group.webp', plate: 'dark', industry: 'Legal' },
  { name: "Hollingsworth Kelly Law Firm", url: 'https://www.hollingsworthlaw.com/', logo: '/clients/hollingsworth-kelly-law-firm.webp', plate: 'light', industry: 'Legal' },
  { name: "Jimmy Ryce Center", url: 'https://jimmyryce.org/', logo: '/clients/jimmy-ryce-center.webp', plate: 'light', industry: 'Science, non-profit & community' },
];

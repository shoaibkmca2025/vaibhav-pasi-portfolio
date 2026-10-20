// Brands shown in the "Brands I've worked with" logo wall (components/ClientLogos.tsx).
//
// Rules (please keep):
// - Only real clients of Vaibhav Pasi or 4AM Global Media, and only with their permission to be named.
// - Never copy another agency's client list.
// - Logo files go in /public/clients (SVG or PNG on a transparent background). Without a logo, the name is shown.
//
// The wall stays hidden until there are at least MIN_CLIENTS entries, so it never looks empty.
export interface Client {
  name: string;
  logo?: string; // e.g. '/clients/mauli-overseas.svg'
  url?: string;
  industry?: string;
}

export const MIN_CLIENTS = 4;

export const clients: Client[] = [
  // Already named publicly in the Mauli Overseas case study (content/caseStudies.ts)
  { name: 'Mauli Overseas', url: 'https://maulioverseas.com', industry: 'Study & work abroad' },
];

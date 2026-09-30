// Result of one automated check run by /api/growth-score against a visitor's homepage
export type ScoreArea = 'website' | 'ux' | 'seo' | 'conversion' | 'trust' | 'social' | 'content' | 'branding';

export interface SiteCheck {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
  area: ScoreArea;
}

export interface SiteCheckResponse {
  ok: boolean;
  reachable: boolean;
  finalUrl?: string;
  status?: number;
  checks: SiteCheck[];
}

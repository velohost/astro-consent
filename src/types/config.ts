export interface CookieCategory {
  enabled: boolean;
  readonly?: boolean;
  label: string;
  description?: string;
}

export interface CookieBannerConfig {
  /** Human-readable site name used in banner copy */
  siteName: string;

  /** URL to privacy / cookie policy */
  policyUrl: string;

  /** Consent storage configuration */
  consent: {
    enabled: boolean;
    days: number;
    storageKey: string;
  };

  /** Cookie categories */
  categories: Record<string, CookieCategory>;
}
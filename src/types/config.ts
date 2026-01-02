export interface CookieCategory {
  /**
   * Whether this category is enabled by default
   * (may be overridden by stored consent)
   */
  enabled: boolean;

  /**
   * If true, this category cannot be disabled by the user
   * and should always be treated as enabled
   */
  readonly?: boolean;

  /**
   * Human-readable category label
   */
  label: string;

  /**
   * Optional explanation shown to the user
   */
  description?: string;

  /**
   * Optional UI hint:
   * hide this category from the preferences UI
   */
  hidden?: boolean;
}

export interface CookieBannerConfig {
  /**
   * Human-readable site name used in banner copy
   */
  siteName: string;

  /**
   * URL to privacy / cookie policy
   */
  policyUrl: string;

  /**
   * Consent storage configuration
   */
  consent: {
    /**
     * Globally enable or disable the consent system
     */
    enabled: boolean;

    /**
     * Number of days consent remains valid
     */
    days: number;

    /**
     * LocalStorage key used to store consent
     */
    storageKey: string;
  };

  /**
   * Cookie categories (built-in or user-defined)
   */
  categories: Record<string, CookieCategory>;
}
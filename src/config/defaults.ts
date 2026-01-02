import type { CookieBannerConfig } from "../types/config.js";

/**
 * DEFAULT_CONFIG
 * ---------------------------------------------------------
 * Fallback values ONLY.
 *
 * These are used:
 * - when the user omits a value
 * - during internal normalisation
 *
 * User-provided config ALWAYS takes priority.
 */
export const DEFAULT_CONFIG: CookieBannerConfig = {
  siteName: "This website",

  policyUrl: "/privacy",

  consent: {
    enabled: true,

    // Number of days consent remains valid
    days: 30,

    // Must match runtime + frontend API
    storageKey: "astro-consent"
  },

  categories: {
    essential: {
      label: "Essential",
      description: "Required for the website to function correctly",
      enabled: true,
      readonly: true
    },

    analytics: {
      label: "Analytics",
      description: "Helps us understand how visitors use the site",
      enabled: false
    },

    marketing: {
      label: "Marketing",
      description: "Used to deliver personalised ads",
      enabled: false
    }
  }
};
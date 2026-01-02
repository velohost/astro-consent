import type { CookieBannerConfig } from "../types/config";

/**
 * Default configuration values.
 * These are ONLY used as fallbacks if the user omits something.
 * User config always takes priority.
 */
export const DEFAULT_CONFIG: CookieBannerConfig = {
  siteName: "This website",

  policyUrl: "/privacy",

  consent: {
    enabled: true,
    days: 30,
    storageKey: "astro-cookie-consent"
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
    },

    functional: {
      label: "Functional",
      description: "Remembers preferences and settings",
      enabled: false
    },

    performance: {
      label: "Performance",
      description: "Helps improve site performance and reliability",
      enabled: false
    }
  }
};
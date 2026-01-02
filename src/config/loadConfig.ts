import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

import type { CookieBannerConfig } from "../types/config.js";
import { DEFAULT_CONFIG } from "./defaults.js";

/**
 * Safely loads the user config file and merges it with defaults.
 * User values always override defaults.
 * Cache-busted to ensure updates are picked up during dev.
 */
export async function loadUserConfig(
  projectRoot: string
): Promise<CookieBannerConfig> {
  const configPath = path.join(
    projectRoot,
    "src",
    "cookiebanner",
    "config.ts"
  );

  let userConfig: Partial<CookieBannerConfig> = {};

  try {
    // 🔑 IMPORTANT:
    // Bust Node ESM import cache using file modified time
    const stat = fs.statSync(configPath);
    const cacheBuster = `?v=${stat.mtimeMs}`;

    const imported = await import(
      /* @vite-ignore */
      pathToFileURL(configPath).href + cacheBuster
    );

    userConfig = imported?.default ?? {};
  } catch (err) {
    console.warn(
      "[cookiebanner] Failed to load user config, falling back to defaults:",
      err
    );
  }

  return {
    /* ─────────────────────────────
       Site name
    ───────────────────────────── */
    siteName: userConfig.siteName ?? DEFAULT_CONFIG.siteName,

    /* ─────────────────────────────
       Policy URL
    ───────────────────────────── */
    policyUrl: userConfig.policyUrl ?? DEFAULT_CONFIG.policyUrl,

    /* ─────────────────────────────
       Consent settings
    ───────────────────────────── */
    consent: {
      enabled:
        userConfig.consent?.enabled ??
        DEFAULT_CONFIG.consent.enabled,

      days:
        userConfig.consent?.days ??
        DEFAULT_CONFIG.consent.days,

      storageKey:
        userConfig.consent?.storageKey ??
        DEFAULT_CONFIG.consent.storageKey
    },

    /* ─────────────────────────────
       Categories
    ───────────────────────────── */
    categories: mergeCategories(
      userConfig.categories,
      DEFAULT_CONFIG.categories
    )
  };
}

/**
 * Merge category config safely.
 * Defaults are preserved, user overrides where provided.
 */
function mergeCategories(
  userCategories: CookieBannerConfig["categories"] | undefined,
  defaultCategories: CookieBannerConfig["categories"]
): CookieBannerConfig["categories"] {
  const merged: CookieBannerConfig["categories"] = {};

  // Start with defaults
  for (const key of Object.keys(defaultCategories)) {
    merged[key] = {
      ...defaultCategories[key],
      ...(userCategories?.[key] ?? {})
    };
  }

  // Include any custom categories the user added
  if (userCategories) {
    for (const key of Object.keys(userCategories)) {
      if (!merged[key]) {
        merged[key] = userCategories[key];
      }
    }
  }

  return merged;
}
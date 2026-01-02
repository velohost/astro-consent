import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { DEFAULT_CONFIG } from "./defaults.js";
/**
 * Safely loads the user config file and merges it with defaults.
 * User values always override defaults.
 * Cache-busted to ensure updates are picked up during dev.
 */
export async function loadUserConfig(projectRoot) {
    const configPath = path.join(projectRoot, "src", "astro-consent", "config.ts");
    let userConfig = {};
    try {
        const stat = fs.statSync(configPath);
        const cacheBuster = `?v=${stat.mtimeMs}`;
        const imported = await import(
        /* @vite-ignore */
        pathToFileURL(configPath).href + cacheBuster);
        userConfig = imported?.default ?? {};
    }
    catch (err) {
        console.warn("[astro-consent] Failed to load user config, falling back to defaults");
    }
    return {
        siteName: userConfig.siteName ?? DEFAULT_CONFIG.siteName,
        policyUrl: userConfig.policyUrl ?? DEFAULT_CONFIG.policyUrl,
        consent: {
            enabled: userConfig.consent?.enabled ??
                DEFAULT_CONFIG.consent.enabled,
            days: userConfig.consent?.days ??
                DEFAULT_CONFIG.consent.days,
            storageKey: userConfig.consent?.storageKey ??
                DEFAULT_CONFIG.consent.storageKey
        },
        categories: mergeCategories(userConfig.categories, DEFAULT_CONFIG.categories)
    };
}
/**
 * Merge category config safely.
 * - Defaults are preserved
 * - User overrides win
 * - Custom categories are supported
 */
function mergeCategories(userCategories, defaultCategories) {
    const merged = {};
    // Start with defaults
    for (const key of Object.keys(defaultCategories)) {
        merged[key] = {
            ...defaultCategories[key],
            ...(userCategories?.[key] ?? {})
        };
    }
    // Add user-defined custom categories safely
    if (userCategories) {
        for (const key of Object.keys(userCategories)) {
            if (!merged[key]) {
                merged[key] = {
                    ...userCategories[key],
                    enabled: userCategories[key].enabled ?? false
                };
            }
        }
    }
    return merged;
}

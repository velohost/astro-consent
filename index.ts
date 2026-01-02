import type { AstroIntegration } from "astro";

export default function astroCookieBanner(): AstroIntegration {
  return {
    name: "astro-cookiebanner",
    hooks: {
      "astro:config:setup"() {
        // will be used to initialise user files
      },
      "astro:build:setup"() {
        // reserved for later if needed
      },
      "astro:build:done"() {
        // reserved for later if needed
      }
    }
  };
}
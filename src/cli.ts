#!/usr/bin/env node
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";

const CWD = process.cwd();
const args = process.argv.slice(2);
const command = args[0] ?? "install";

const ASTRO_CONFIG_FILES = [
  "astro.config.mjs",
  "astro.config.ts",
  "astro.config.js"
];

function findAstroConfig(): string | null {
  for (const file of ASTRO_CONFIG_FILES) {
    const fullPath = path.join(CWD, file);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
}

function exitWith(message: string, code = 1): never {
  console.error(`\n❌ ${message}\n`);
  process.exit(code);
}

/* ─────────────────────────────────────
   Locate astro.config
───────────────────────────────────── */

const configPath = findAstroConfig();
if (!configPath) {
  exitWith(
    "No astro.config.(mjs|ts|js) found. Run this in the root of an Astro project."
  );
}

let source = fs.readFileSync(configPath, "utf8");

/* ─────────────────────────────────────
   REMOVE MODE
───────────────────────────────────── */

if (command === "remove") {
  source = source
    .replace(/\s*astroConsent\s*\([\s\S]*?\),?/gm, "")
    .replace(
      /import\s+astroConsent\s+from\s+["']astro-consent["'];?\n?/,
      ""
    );

  fs.writeFileSync(configPath, source.trim() + "\n", "utf8");

  const cssFile = path.join(CWD, "src", "cookiebanner.css");
  if (fs.existsSync(cssFile)) fs.unlinkSync(cssFile);

  console.log("\n🧹 astro-consent fully removed\n");
  process.exit(0);
}

/* ─────────────────────────────────────
   INSTALL MODE
───────────────────────────────────── */

const cssDir = path.join(CWD, "src");
const cssFile = path.join(cssDir, "cookiebanner.css");

if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

/* ─────────────────────────────────────
   Create CSS override file (ONCE)
───────────────────────────────────── */

if (!fs.existsSync(cssFile)) {
  fs.writeFileSync(
    cssFile,
`/* =========================================================
   astro-consent — FULL THEME VARIABLES
   This file is NEVER overwritten
   ========================================================= */

:root {
  --cb-font: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  --cb-bg: #0c1220;
  --cb-border: rgba(255,255,255,0.08);
  --cb-text: #ffffff;
  --cb-muted: #9ca3af;
  --cb-link: #60a5fa;

  --cb-radius: 16px;
  --cb-shadow: 0 20px 40px rgba(0,0,0,0.35);

  --cb-btn-radius: 999px;
  --cb-btn-padding: 10px 18px;

  --cb-accept-bg: #22c55e;
  --cb-accept-text: #052e16;

  --cb-reject-bg: #374151;
  --cb-reject-text: #ffffff;

  --cb-manage-bg: transparent;
  --cb-manage-text: #ffffff;
  --cb-manage-border: rgba(255,255,255,0.15);

  --cb-modal-bg: #0c1220;
  --cb-modal-backdrop: rgba(0,0,0,0.55);
  --cb-modal-radius: 18px;
  --cb-modal-width: 480px;

  --cb-toggle-off-bg: #374151;
  --cb-toggle-on-bg: #22c55e;
  --cb-toggle-knob: #ffffff;
}
`,
    "utf8"
  );

  console.log("🎨 Created src/cookiebanner.css");
}

/* ─────────────────────────────────────
   Inject Astro integration ONLY
───────────────────────────────────── */

if (!source.includes(`from "astro-consent"`)) {
  source = `import astroConsent from "astro-consent";\n${source}`;
}

if (!source.includes("astroConsent(")) {
  source = source.replace(
    /integrations\s*:\s*\[/,
    match =>
      `${match}
    astroConsent({
      siteName: "My Website",
      policyUrl: "/privacy",
      consent: {
        days: 30,
        storageKey: "astro-consent"
      }
    }),
`
  );
}

fs.writeFileSync(configPath, source, "utf8");

console.log("\n🎉 astro-consent installed successfully");
console.log("👉 Style everything via src/cookiebanner.css");
console.log("👉 Run `astro-consent remove` to uninstall\n");
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
  source = source.replace(
    /\s*astroCookieBanner\s*\(\s*\{[\s\S]*?\}\s*\),?/gm,
    ""
  );

  source = source.replace(
    /import\s+astroCookieBanner\s+from\s+["']astro-cookiebanner["'];?\n?/,
    ""
  );

  fs.writeFileSync(configPath, source.trim() + "\n", "utf8");

  const cssFile = path.join(CWD, "src", "cookiebanner.css");
  if (fs.existsSync(cssFile)) fs.unlinkSync(cssFile);

  console.log("\n🧹 astro-cookiebanner fully removed\n");
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
   Create FULL CSS VARIABLE OVERRIDE
───────────────────────────────────── */

if (!fs.existsSync(cssFile)) {
  fs.writeFileSync(
    cssFile,
`/* =========================================================
   astro-cookiebanner — FULL THEME VARIABLES
   All visuals are controlled from here.
   This file is NEVER overwritten.
   ========================================================= */

:root {
  /* ───── Core ───── */
  --cb-font: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  /* ───── Banner ───── */
  --cb-bg: rgba(12,18,32,0.88);
  --cb-border: rgba(255,255,255,0.08);
  --cb-text: #e5e7eb;
  --cb-muted: #9ca3af;
  --cb-link: #60a5fa;
  --cb-radius: 16px;
  --cb-shadow: 0 20px 40px rgba(0,0,0,0.35);

  /* ───── Buttons ───── */
  --cb-btn-radius: 999px;
  --cb-btn-padding: 10px 18px;

  --cb-accept-bg: #22c55e;
  --cb-accept-text: #052e16;

  --cb-reject-bg: #374151;
  --cb-reject-text: #e5e7eb;

  --cb-manage-bg: transparent;
  --cb-manage-text: #e5e7eb;
  --cb-manage-border: rgba(255,255,255,0.15);

  /* ───── Modal ───── */
  --cb-modal-backdrop: rgba(0,0,0,0.55);
  --cb-modal-bg: #0c1220;
  --cb-modal-radius: 18px;
  --cb-modal-width: 480px;

  /* ───── Toggles ───── */
  --cb-toggle-off-bg: #374151;
  --cb-toggle-on-bg: #22c55e;
  --cb-toggle-knob: #ffffff;
}

/* =========================================================
   Banner
   ========================================================= */

#astro-cookie-banner {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  font-family: var(--cb-font);
}

.cb-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  align-items: center;

  background: var(--cb-bg);
  backdrop-filter: blur(14px);
  border-radius: var(--cb-radius);
  border: 1px solid var(--cb-border);
  box-shadow: var(--cb-shadow);
  color: var(--cb-text);
}

.cb-title {
  font-size: 16px;
  font-weight: 600;
}

.cb-desc {
  font-size: 14px;
  color: var(--cb-muted);
}

.cb-desc a {
  color: var(--cb-link);
  text-decoration: none;
}

.cb-actions {
  display: flex;
  gap: 10px;
}

/* =========================================================
   Buttons
   ========================================================= */

.cb-actions button {
  padding: var(--cb-btn-padding);
  border-radius: var(--cb-btn-radius);
  border: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.cb-accept {
  background: var(--cb-accept-bg);
  color: var(--cb-accept-text);
}

.cb-reject {
  background: var(--cb-reject-bg);
  color: var(--cb-reject-text);
}

.cb-manage {
  background: var(--cb-manage-bg);
  color: var(--cb-manage-text);
  border: 1px solid var(--cb-manage-border);
}

/* =========================================================
   Modal
   ========================================================= */

#astro-cookie-modal {
  position: fixed;
  inset: 0;
  background: var(--cb-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.cb-modal {
  width: 100%;
  max-width: var(--cb-modal-width);
  background: var(--cb-modal-bg);
  border-radius: var(--cb-modal-radius);
  padding: 24px;
  color: var(--cb-text);
}

/* =========================================================
   Toggles
   ========================================================= */

.cb-toggle {
  width: 44px;
  height: 24px;
  background: var(--cb-toggle-off-bg);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
}

.cb-toggle span {
  position: absolute;
  width: 18px;
  height: 18px;
  background: var(--cb-toggle-knob);
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 0.2s ease;
}

.cb-toggle.active {
  background: var(--cb-toggle-on-bg);
}

.cb-toggle.active span {
  transform: translateX(20px);
}

/* =========================================================
   Mobile
   ========================================================= */

@media (max-width: 640px) {
  .cb-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
`,
    "utf8"
  );

  console.log("🎨 Created src/cookiebanner.css (CSS variables enabled)");
}

/* ─────────────────────────────────────
   Inject Astro integration
───────────────────────────────────── */

if (!source.includes(`from "astro-cookiebanner"`)) {
  source = `import astroCookieBanner from "astro-cookiebanner";\n${source}`;
}

if (!source.includes("astroCookieBanner(")) {
  const injection =
`    astroCookieBanner({
      siteName: "My Website",
      policyUrl: "/privacy",
      consent: {
        days: 30,
        storageKey: "astro-cookie-consent"
      },
      categories: {
        analytics: false,
        marketing: false
      }
    }),
`;

  source = source.replace(
    /integrations\s*:\s*\[/,
    match => `${match}\n${injection}`
  );
}

fs.writeFileSync(configPath, source, "utf8");

console.log("\n🎉 astro-cookiebanner installed successfully");
console.log("👉 Edit src/cookiebanner.css to theme everything");
console.log("👉 Run `astro-cookiebanner remove` to uninstall\n");
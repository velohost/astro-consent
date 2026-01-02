#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const process = __importStar(require("node:process"));
const CWD = process.cwd();
const args = process.argv.slice(2);
const command = args[0] ?? "install";
const ASTRO_CONFIG_FILES = [
    "astro.config.mjs",
    "astro.config.ts",
    "astro.config.js"
];
function findAstroConfig() {
    for (const file of ASTRO_CONFIG_FILES) {
        const fullPath = path.join(CWD, file);
        if (fs.existsSync(fullPath))
            return fullPath;
    }
    return null;
}
function exitWith(message, code = 1) {
    console.error(`\n❌ ${message}\n`);
    process.exit(code);
}
/* ─────────────────────────────────────
   Locate astro.config
   
───────────────────────────────────── */
const configPath = findAstroConfig();
if (!configPath) {
    exitWith("No astro.config.(mjs|ts|js) found. Run this in the root of an Astro project.");
}
let source = fs.readFileSync(configPath, "utf8");
/* ─────────────────────────────────────
   REMOVE MODE
───────────────────────────────────── */
if (command === "remove") {
    source = source
        .replace(/\s*astroConsent\s*\([\s\S]*?\),?/gm, "")
        .replace(/import\s+astroConsent\s+from\s+["']astro-consent["'];?\n?/, "");
    fs.writeFileSync(configPath, source.trim() + "\n", "utf8");
    const cssFile = path.join(CWD, "src", "cookiebanner.css");
    if (fs.existsSync(cssFile))
        fs.unlinkSync(cssFile);
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
   Create CSS file ONCE (theme + structure)
───────────────────────────────────── */
if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, `/* =========================================================
   astro-consent — FULL THEME + STRUCTURE
   This file is NEVER overwritten.
   ========================================================= */

:root {
  --cb-font: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  --cb-bg: var(--color-surface, #0c1220);
  --cb-border: var(--color-border, rgba(255,255,255,0.08));
  --cb-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);

  --cb-text: var(--color-text, #ffffff);
  --cb-muted: var(--color-muted, #9ca3af);
  --cb-link: var(--color-primary, #60a5fa);

  --cb-radius: 16px;
  --cb-btn-radius: 999px;
  --cb-btn-padding: 10px 18px;

  --cb-accept-bg: var(--color-cta, #22c55e);
  --cb-accept-text: #ffffff;

  --cb-reject-bg: var(--cb-border);
  --cb-reject-text: var(--cb-text);

  --cb-manage-bg: transparent;
  --cb-manage-text: var(--cb-text);
  --cb-manage-border: var(--cb-border);

  --cb-modal-bg: var(--cb-bg);
  --cb-modal-backdrop: rgba(15, 23, 42, 0.45);
  --cb-modal-radius: 18px;
  --cb-modal-width: 480px;

  --cb-toggle-off-bg: var(--cb-border);
  --cb-toggle-on-bg: var(--color-accent, #22c55e);
  --cb-toggle-knob: #ffffff;
}

/* ===============================
   Banner
   =============================== */

#astro-consent-banner {
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
  margin-top: 4px;
  font-size: 14px;
  color: var(--cb-muted);
}

.cb-desc a {
  color: var(--cb-link);
  text-decoration: none;
}

.cb-desc a:hover {
  text-decoration: underline;
}

/* ===============================
   Buttons
   =============================== */

.cb-actions {
  display: flex;
  gap: 10px;
}

.cb-actions button {
  padding: var(--cb-btn-padding);
  border-radius: var(--cb-btn-radius);
  border: 1px solid transparent;
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

/* ===============================
   Modal
   =============================== */

#astro-consent-modal {
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
  padding: 28px;
  color: var(--cb-text);
  border: 1px solid var(--cb-border);
}

/* ===============================
   Modal rows (SPACING FIXED)
   =============================== */

.cb-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--cb-border);
}

.cb-row:last-of-type {
  border-bottom: 0;
  padding-bottom: 32px;
}

/* ===============================
   Modal actions
   =============================== */

.cb-modal .cb-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--cb-border);
  display: flex;
  justify-content: flex-end;
}

/* ===============================
   Toggles
   =============================== */

.cb-toggle {
  width: 44px;
  height: 24px;
  background: var(--cb-toggle-off-bg);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
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

/* ===============================
   Mobile
   =============================== */

@media (max-width: 640px) {
  .cb-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .cb-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
`, "utf8");
    console.log("🎨 Created src/cookiebanner.css");
}
/* ─────────────────────────────────────
   Inject Astro integration
───────────────────────────────────── */
if (!source.includes(`from "astro-consent"`)) {
    source = `import astroConsent from "astro-consent";\n${source}`;
}
if (!source.includes("astroConsent(")) {
    source = source.replace(/integrations\s*:\s*\[/, match => `${match}
    astroConsent({
      siteName: "My Website",
      policyUrl: "/privacy",
      consent: {
        days: 30,
        storageKey: "astro-consent"
      }
    }),
`);
}
fs.writeFileSync(configPath, source, "utf8");
console.log("\n🎉 astro-consent installed successfully");
console.log("👉 Style everything via src/cookiebanner.css");
console.log("👉 Run `astro-consent remove` to uninstall\n");

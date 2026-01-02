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
   Create CSS override file (ONCE)
───────────────────────────────────── */
if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, `/* =========================================================
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
`, "utf8");
    console.log("🎨 Created src/cookiebanner.css");
}
/* ─────────────────────────────────────
   Inject Astro integration ONLY
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

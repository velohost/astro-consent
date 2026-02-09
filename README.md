# astro-consent

A **privacy-first, zero-dependency cookie consent banner** for Astro projects — built for speed, compliance, and total visual control.

Designed and maintained by **Velohost**.

---

## Why astro-consent?

Most cookie consent solutions are bloated, opaque, or tied to third-party services.

**astro-consent** is built differently:

- No trackers  
- No remote calls  
- No analytics SDKs  
- No vendor lock-in  
- No runtime dependencies  

Just a **fast, deterministic, developer-controlled consent layer** that respects user privacy and legal boundaries.

---

## ✨ Features

- ✅ GDPR / UK GDPR friendly
- 🍪 Consent categories: Essential, Analytics, Marketing
- 🎛️ Preferences modal with toggle switches
- ⚡ Zero runtime dependencies
- 🎨 Fully themeable via CSS variables
- 🧠 Frontend-controlled script loading
- 🧩 Native Astro integration
- 🧾 Built-in TypeScript declarations
- 🛠️ CLI installer & remover
- 🔁 Clean uninstall with no residue
- 🌍 Framework-agnostic frontend API

---

## 📦 Installation (Required)

This package uses **both an Astro integration and a CLI installer**.

### 1️⃣ Install the package

```bash
npm install astro-consent
```

This step is **required** so Astro can import the integration at build time.

---

### 2️⃣ Run the installer

```bash
npx astro-consent
```

This will automatically:

- Inject the Astro integration into `astro.config.*`
- Create `src/cookiebanner.css` for theme control
- Enable the consent banner across your site

No manual wiring required.

---

### ❌ Uninstall

```bash
npx astro-consent remove
```

This cleanly removes:

- The integration entry
- Generated files
- All banner logic

No orphaned config. No hidden state.

---

## 🔧 Astro Integration Usage

```ts
import astroConsent from "astro-consent";

export default {
  integrations: [
    astroConsent({
      siteName: "My Website",
      policyUrl: "https://example.com/privacy-policy",
      consent: {
        days: 30,
        storageKey: "astro-cookie-consent"
      },
      categories: {
        analytics: false,
        marketing: false
      }
    })
  ]
};
```

### Configuration notes

- **policyUrl**  
  A full, public URL to your Privacy or Cookie Policy page.  
  This is linked directly from the consent banner.

- **consent.days**  
  How long (in days) consent is stored before the user is asked again.

- **consent.storageKey**  
  The `localStorage` key used to persist consent.  
  You may change this freely if you need per-site or per-environment isolation.

- **categories.analytics**  
  Allows analytics scripts to load only after consent.  
  Typical use: Plausible, self-hosted analytics, Google Analytics.

- **categories.marketing**  
  Allows marketing and advertising scripts to load only after consent.  
  Typical use: ad pixels, remarketing tags, embedded social trackers.

Scripts outside the **essential** category must be conditionally loaded.

---

## 🧠 Frontend API

```js
window.cookieConsent.get();
window.cookieConsent.set({ essential: true, analytics: true });
window.cookieConsent.reset();
```

## 🧾 TypeScript

TypeScript declarations are included in the package.

No separate `@types` install is required.

---

## 🎨 Theming

All visuals are controlled via:

```
src/cookiebanner.css
```

You must ensure this file is included globally.

### Recommended import (Astro)

Import the stylesheet once in your main layout or entry file:

```ts
import "../cookiebanner.css";
```

This guarantees the banner styles are available on every page.

- This file is never overwritten
- All colours, spacing, radius, and animations are controlled via CSS variables
- Full visual control with zero JavaScript theming

---

## 🔐 Privacy

- No cookies before consent
- No tracking without permission
- No external requests
- Stored locally with TTL

---

## 🙏 Acknowledgements

Thanks to [@magicspon](https://github.com/magicspon) for assisting with the PR and issue triage.

---

## 📄 License

MIT © Velohost

---

## 🏢 Velohost

https://velohost.co.uk/

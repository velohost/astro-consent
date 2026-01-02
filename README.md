# astro-consent

A **privacy-first, zero-dependency cookie consent banner** for Astro projects — built for speed, compliance, and full visual control.

Designed and maintained by **Velohost**.

---

## ✨ Features

- ✅ GDPR / UK GDPR friendly
- 🍪 Essential, Analytics & Marketing categories
- 🎛️ Manage preferences modal with toggle switches
- ⚡ No external dependencies
- 🎨 Fully themeable via CSS variables
- 🧠 Frontend‑controlled script loading
- 🧩 Astro Integration + CLI installer
- 🔁 Easy uninstall via CLI
- 🌍 Framework‑agnostic frontend API

---

## 📦 Installation (Required)

This package uses **both an Astro integration and a CLI installer**.

### 1️⃣ Install the package

```bash
npm install astro-consent
```

This step is **required** so Astro can import the integration at build time.

### 2️⃣ Run the installer

```bash
npx astro-consent
```

This will:

- Inject the Astro integration into `astro.config.*`
- Create `src/cookiebanner.css` (theme variables)
- Enable the consent banner automatically

### ❌ Uninstall

```bash
npx astro-consent remove
```

---

## 🔧 Astro Integration Usage

```ts
import astroConsent from "astro-consent";

export default {
  integrations: [
    astroConsent({
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
    })
  ]
};
```

---

## 🧠 Frontend API

```js
window.cookieConsent.get();
window.cookieConsent.set({ essential: true, analytics: true });
window.cookieConsent.reset();
```

---

## 🎨 Theming

All visuals are controlled via:

```
src/cookiebanner.css
```

This file is never overwritten.

---

## 🔐 Privacy

- No cookies before consent
- No tracking without permission
- No external calls
- Stored locally with TTL

---

## 🏷️ License & Attribution

Open‑source with **mandatory attribution**.

Any public use, fork, or redistribution **must credit Velohost**.

---

## 🏢 Velohost

https://velohost.co.uk/

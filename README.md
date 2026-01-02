# astro-cookiebanner

A **privacy‑first, zero‑dependency cookie consent banner** for Astro projects — built for speed, compliance, and full visual control.

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

## 📦 Installation

```bash
npm install astro-cookiebanner
```

Then run the installer inside your Astro project:

```bash
npx astro-cookiebanner
```

To remove everything:

```bash
npx astro-cookiebanner remove
```

---

## 🔧 Usage

```ts
import astroCookieBanner from "astro-cookiebanner";

export default {
  integrations: [
    astroCookieBanner({
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

Example conditional loading:

```js
const consent = window.cookieConsent.get();

if (consent?.categories?.analytics) {
  // Load analytics script
}
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

See `LICENSE.md` for full terms.

---

## 🏢 Velohost

Built by **Velohost**  
https://velohost.co.uk

---

## 🤝 Contributions

PRs welcome — attribution must be preserved.

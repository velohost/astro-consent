# astro-consent

`astro-consent` is a privacy-first cookie consent integration for Astro. It adds a polished consent banner or overlay, generates an editable stylesheet in your project, and exposes a tiny runtime API for managing stored consent.

## What You Get

- A banner or overlay consent UI
- A generated `src/cookiebanner/styles.css` file you can edit directly
- Idle-based display with a configurable fade-in delay
- Focus trapping, `Escape` to close, and focus return for the overlay
- CLI setup, removal, and diagnostics commands
- TypeScript support
- Compatibility with Astro 4, 5, and 6

## Quick Start

### 1. Install the package

```bash
npm install astro-consent
```

### 2. Add the integration

Use the CLI to wire everything into your Astro project:

```bash
npx astro-consent init
```

That will:

- add `astro-consent` to `astro.config.*`
- create `src/cookiebanner/styles.css` if it is missing
- add a starter configuration block with placeholder values

### 3. Edit the generated CSS

Open `src/cookiebanner/styles.css` in your project and customize the banner or modal visually. The package does not inject CSS through JavaScript, so this file is the single source of truth for styling.

### 4. Run your Astro app

```bash
npm run dev
```

## Recommended Setup

The default install is designed to be easy to understand and safe to customise. A typical configuration looks like this:

```ts
import astroConsent from "astro-consent";

export default {
  integrations: [
    astroConsent({
      siteName: "My Website",
      headline: "Manage cookie preferences for My Website",
      description:
        "We use cookies to improve site performance, measure traffic, and support marketing.",
      acceptLabel: "Accept all",
      rejectLabel: "Reject all",
      manageLabel: "Manage preferences",
      cookiePolicyUrl: "/cookie-policy",
      privacyPolicyUrl: "/privacy",
      displayUntilIdle: true,
      displayIdleDelayMs: 1000,
      presentation: "banner",
      consent: {
        days: 30,
        storageKey: "astro-consent"
      }
    })
  ]
};
```

## CLI Commands

### `init`

```bash
npx astro-consent init
```

Adds the integration import and a marked configuration block to `astro.config.*`, then creates `src/cookiebanner/styles.css` if the file does not already exist.

### `remove`

```bash
npx astro-consent remove
```

Removes the marked `astro-consent` block from `astro.config.*`, removes the import, and deletes `src/cookiebanner/styles.css` if it exists.

### `doctor`

```bash
npx astro-consent doctor
```

Checks the following:

- Astro config import wiring
- `astroConsent(...)` integration wiring
- `src/cookiebanner/styles.css` existence
- `src/layouts/BaseLayout.astro` importing the stylesheet

Use JSON output for automation:

```bash
npx astro-consent doctor --json
```

### `status`

```bash
npx astro-consent status
```

Reports the current install state:

- whether the Astro config is wired
- whether the stylesheet exists
- whether the package is linked into `node_modules`
- which consent storage key is configured
- a note explaining that actual consent state is browser-side

JSON output is also available:

```bash
npx astro-consent status --json
```

### Dry Run

Preview changes without writing files:

```bash
npx astro-consent init --dry-run
npx astro-consent remove --dry-run
```

## Presentation Modes

You can choose how the consent UI appears:

- `banner` for a standard bottom-of-page consent banner
- `overlay` for a centered modal-first experience

Example:

```ts
astroConsent({
  presentation: "overlay"
});
```

## Display Timing

The consent UI can wait until the browser is idle before appearing, then fade in after a short pause.

### `displayUntilIdle`

When `true`, the banner or overlay waits for browser idle before showing.

### `displayIdleDelayMs`

Adds a delay after idle before the UI becomes visible.

Example:

```ts
astroConsent({
  displayUntilIdle: true,
  displayIdleDelayMs: 1000
});
```

## Copy Customisation

These options let you tune the wording without editing the runtime:

- `siteName` sets the site name used in fallback copy
- `headline` sets the banner or dialog title
- `description` sets the explanatory text
- `acceptLabel` sets the primary action
- `rejectLabel` sets the reject action
- `manageLabel` sets the preferences action

Example:

```ts
astroConsent({
  siteName: "Escape Zone",
  headline: "Manage cookie preferences for Escape Zone",
  description:
    "We use cookies to improve site performance, measure traffic, and support marketing.",
  acceptLabel: "Accept all",
  rejectLabel: "Reject all",
  manageLabel: "Manage preferences"
});
```

## Policy Links

The consent UI supports separate links for cookie and privacy policy pages.

- `cookiePolicyUrl` controls the cookie policy link
- `privacyPolicyUrl` controls the privacy policy link

If you still pass `policyUrl`, it will be used for both links as a backwards-compatible fallback.

## Runtime API

The integration exposes a small browser API on `window.astroConsent`:

```js
window.astroConsent.get();
window.astroConsent.set({ essential: true, analytics: true, marketing: false });
window.astroConsent.reset();
```

- `get()` returns the stored consent object if one exists and is still valid
- `set(...)` stores a new consent state
- `reset()` clears consent and reloads the page

## Styling

The generated `src/cookiebanner/styles.css` file is meant to be edited directly.

It uses `cb-*` custom properties so you can change the visual style without rewriting selectors. The most useful tokens are:

- `--cb-bg`
- `--cb-text`
- `--cb-muted`
- `--cb-border`
- `--cb-accent`
- `--cb-accent-strong`
- `--cb-success`
- `--cb-shadow`
- `--cb-banner-radius`
- `--cb-modal-width`
- `--cb-button-bg`
- `--cb-button-secondary-bg`

## File Layout

The installer creates the stylesheet here:

```txt
src/cookiebanner/styles.css
```

That file is intentionally local to your project. It is not injected from the package at runtime, which keeps styling under your control and avoids overwriting custom work.

## Notes

- Consent is stored in `localStorage`
- The stored value expires after the configured TTL
- Optional categories default to checked in the UI, but users can still reject them
- The overlay uses accessible dialog behavior, including focus trapping, `Escape` to close, and focus return to the trigger

## Troubleshooting

### The banner does not appear

Check the following:

1. `npx astro-consent init` has been run in the Astro project root
2. `astro.config.*` includes the `astro-consent` integration
3. `src/layouts/BaseLayout.astro` imports `../cookiebanner/styles.css`
4. You have not already stored consent in `localStorage`

### The CLI says the stylesheet is missing

Run:

```bash
npx astro-consent init
```

### The CLI says the config is not wired

Run:

```bash
npx astro-consent doctor
```

and follow the fix instructions it prints.

## Why the Package Works This Way

The design is intentionally simple:

- the runtime handles consent logic and UI behavior
- the generated stylesheet handles appearance
- the CLI wires setup and removal cleanly

That separation keeps the plugin predictable, easier to debug, and safer to customise.

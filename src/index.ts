import type { AstroIntegration } from "astro";

export interface AstroConsentOptions {
  siteName?: string;
  headline?: string;
  description?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  manageLabel?: string;
  cookiePolicyUrl?: string;
  privacyPolicyUrl?: string;
  policyUrl?: string;
  presentation?: "banner" | "overlay";
  displayUntilIdle?: boolean;
  displayIdleDelayMs?: number;

  consent?: {
    days?: number;
    storageKey?: string;
  };

  categories?: {
    essential?: boolean;
    analytics?: boolean;
    marketing?: boolean;
  };
}

export default function astroConsent(
  options: AstroConsentOptions = {}
): AstroIntegration {
  const siteName = options.siteName ?? "This website";
  const headline = options.headline ?? `Manage cookie preferences for ${siteName}`;
  const description =
    options.description ??
    "We use cookies to improve site performance, measure traffic, and support marketing.";
  const acceptLabel = options.acceptLabel ?? "Accept all";
  const rejectLabel = options.rejectLabel ?? "Reject all";
  const manageLabel = options.manageLabel ?? "Manage preferences";
  const cookiePolicyUrl =
    options.cookiePolicyUrl ?? options.policyUrl ?? "/cookie-policy";
  const privacyPolicyUrl =
    options.privacyPolicyUrl ?? options.policyUrl ?? "/privacy";
  const presentation = options.presentation ?? "banner";

  const consentDays = options.consent?.days ?? 30;
  const storageKey = options.consent?.storageKey ?? "astro-consent";
  const displayUntilIdle = options.displayUntilIdle ?? true;
  const displayIdleDelayMs = options.displayIdleDelayMs ?? 1000;

  const defaultCategories = {
    essential: true,
    analytics: true,
    marketing: true,
    ...options.categories
  };

  const ttl = consentDays * 24 * 60 * 60 * 1000;
  const stateClass = presentation === "overlay"
    ? "cb-mode-overlay"
    : "cb-mode-banner";

  return {
    name: "astro-consent",

    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        injectScript(
          "page",
          `
(() => {
  const KEY = "${storageKey}";
  const TTL = ${ttl};
  const SITE_NAME = ${JSON.stringify(siteName)};
  const HEADLINE = ${JSON.stringify(headline)};
  const DESCRIPTION = ${JSON.stringify(description)};
  const ACCEPT_LABEL = ${JSON.stringify(acceptLabel)};
  const REJECT_LABEL = ${JSON.stringify(rejectLabel)};
  const MANAGE_LABEL = ${JSON.stringify(manageLabel)};
  const DEFAULTS = ${JSON.stringify(defaultCategories)};
  const PRESENTATION = ${JSON.stringify(presentation)};
  const DISPLAY_UNTIL_IDLE = ${displayUntilIdle};
  const DISPLAY_IDLE_DELAY_MS = ${displayIdleDelayMs};
  const STATE_CLASS = ${JSON.stringify(stateClass)};
  const STYLE_ID = "astro-consent-css";
  const BANNER_ID = "astro-consent-banner";
  const MODAL_ID = "astro-consent-modal";
  const COOKIE_POLICY_URL = ${JSON.stringify(cookiePolicyUrl)};
  const PRIVACY_POLICY_URL = ${JSON.stringify(privacyPolicyUrl)};

  function now() { return Date.now(); }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.expiresAt < now()) {
        localStorage.removeItem(KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  function write(categories) {
    localStorage.setItem(KEY, JSON.stringify({
      updatedAt: now(),
      expiresAt: now() + TTL,
      categories
    }));
  }

  function ensureApi() {
    window.astroConsent = {
      get: read,
      set: write,
      reset() {
        localStorage.removeItem(KEY);
        location.reload();
      }
    };
  }

  ensureApi();
})();
`
        );

        /* ─────────────────────────────────────
           Banner + modal UI (NO CSS)
        ───────────────────────────────────── */

        injectScript(
          "page",
          `
(() => {
  const SITE_NAME = ${JSON.stringify(siteName)};
  const HEADLINE = ${JSON.stringify(headline)};
  const DESCRIPTION = ${JSON.stringify(description)};
  const ACCEPT_LABEL = ${JSON.stringify(acceptLabel)};
  const REJECT_LABEL = ${JSON.stringify(rejectLabel)};
  const MANAGE_LABEL = ${JSON.stringify(manageLabel)};
  const COOKIE_POLICY_URL = ${JSON.stringify(cookiePolicyUrl)};
  const PRIVACY_POLICY_URL = ${JSON.stringify(privacyPolicyUrl)};
  const DEFAULTS = ${JSON.stringify(defaultCategories)};
  const PRESENTATION = ${JSON.stringify(presentation)};
  const DISPLAY_UNTIL_IDLE = ${displayUntilIdle};
  const DISPLAY_IDLE_DELAY_MS = ${displayIdleDelayMs};
  const STATE_CLASS = ${JSON.stringify(stateClass)};
  const BANNER_ID = "astro-consent-banner";
  const MODAL_ID = "astro-consent-modal";
  const stored = window.astroConsent.get();
  const state = stored?.categories ? { ...DEFAULTS, ...stored.categories } : { ...DEFAULTS };
  let lastTrigger = null;

  function start() {
    if (window.astroConsent.get()) return;

    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.className = STATE_CLASS;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("aria-live", "polite");

    banner.innerHTML = PRESENTATION === "overlay" ? "" : \`
      <div class="cb-container">
        <div>
          <div class="cb-title">\${HEADLINE}</div>
          <div class="cb-desc">
            \${DESCRIPTION}
            Read our <a href="\${COOKIE_POLICY_URL}">Cookie Policy</a> and
            <a href="\${PRIVACY_POLICY_URL}">Privacy Policy</a>.
          </div>
        </div>
        <div class="cb-actions">
          <button class="cb-manage">\${MANAGE_LABEL}</button>
          <button class="cb-reject">\${REJECT_LABEL}</button>
          <button class="cb-accept">\${ACCEPT_LABEL}</button>
        </div>
      </div>
    \`;

    if (PRESENTATION !== "overlay") {
      document.body.appendChild(banner);
      requestAnimationFrame(() => banner.classList.add("cb-visible"));
      banner.querySelector(".cb-accept").onclick = () => {
        window.astroConsent.set({ essential: true, analytics: true, marketing: true });
        banner.remove();
      };

      banner.querySelector(".cb-reject").onclick = () => {
        window.astroConsent.set({ essential: true });
        banner.remove();
      };

      banner.querySelector(".cb-manage").onclick = openModal;
    }
    if (PRESENTATION === "overlay") {
      openModal();
    }
  }

  function openModal() {
    if (document.getElementById(MODAL_ID)) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lastTrigger = previousFocus;
    document.body.style.overflow = "hidden";

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "astro-consent-title");

    modal.innerHTML = \`
      <div class="cb-modal">
        <div class="cb-modal-header">
          <h3 id="astro-consent-title">\${HEADLINE}</h3>
          <p>
            \${DESCRIPTION}
            Read our <a href="\${COOKIE_POLICY_URL}">Cookie Policy</a> and
            <a href="\${PRIVACY_POLICY_URL}">Privacy Policy</a>.
          </p>
        </div>
        <div class="cb-panel">
          <div class="cb-row">
            <span>Essential</span>
            <strong>Always on</strong>
          </div>
          <div class="cb-row">
            <span>Analytics</span>
            <button class="cb-toggle" type="button" data-key="analytics" aria-pressed="false"></button>
          </div>
          <div class="cb-row">
            <span>Marketing</span>
            <button class="cb-toggle" type="button" data-key="marketing" aria-pressed="false"></button>
          </div>
        </div>
        <div class="cb-actions cb-actions-modal">
          <button class="cb-reject" type="button">\${REJECT_LABEL}</button>
          <button class="cb-accept" type="button">\${ACCEPT_LABEL}</button>
        </div>
      </div>
    \`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add("cb-visible"));

    function closeModal(restoreFocus = true) {
      modal.classList.remove("cb-visible");
      modal.remove();
      document.body.style.overflow = previousOverflow;
      if (restoreFocus) {
        const target = lastTrigger;
        window.setTimeout(() => target?.focus(), 0);
      }
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        document.removeEventListener("keydown", onKeyDown);
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = Array.from(
        modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        el => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    modal.querySelectorAll(".cb-toggle").forEach(toggle => {
      const key = toggle.getAttribute("data-key");
      const sync = () => {
        const active = Boolean(state[key]);
        toggle.classList.toggle("active", active);
        toggle.setAttribute("aria-pressed", String(active));
      };
      sync();

      toggle.onclick = () => {
        state[key] = !state[key];
        sync();
      };
    });

    modal.querySelector(".cb-accept").onclick = () => {
      window.astroConsent.set({ essential: true, ...state });
      document.removeEventListener("keydown", onKeyDown);
      closeModal();
    };

    modal.querySelector(".cb-reject").onclick = () => {
      window.astroConsent.set({ essential: true, analytics: false, marketing: false });
      document.removeEventListener("keydown", onKeyDown);
      closeModal();
    };

    modal.onclick = e => {
      if (e.target === modal) {
        document.removeEventListener("keydown", onKeyDown);
        closeModal();
      }
    };

    modal.querySelector(".cb-accept").focus();
  }

  function runWhenIdle() {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => {
        window.setTimeout(start, DISPLAY_IDLE_DELAY_MS);
      }, { timeout: 2000 });
      return;
    }

    window.setTimeout(start, 300 + DISPLAY_IDLE_DELAY_MS);
  }

  if (DISPLAY_UNTIL_IDLE) {
    runWhenIdle();
  } else {
    start();
  }
})();
`
        );
      }
    }
  };
}

import type { AstroIntegration } from "astro";

export interface AstroConsentOptions {
  siteName?: string;
  policyUrl?: string;

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
  const policyUrl = options.policyUrl ?? "/privacy";

  const consentDays = options.consent?.days ?? 30;
  const storageKey = options.consent?.storageKey ?? "astro-consent";

  const defaultCategories = {
    essential: true,
    analytics: false,
    marketing: false,
    ...options.categories
  };

  const ttl = consentDays * 24 * 60 * 60 * 1000;

  return {
    name: "astro-consent",

    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        /* ─────────────────────────────────────
           Structural styles ONLY
           (NO colours, NO theme values)
        ───────────────────────────────────── */

        injectScript(
          "head-inline",
          `
const style = document.createElement("style");
style.innerHTML = \`
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

.cb-actions button {
  padding: var(--cb-btn-padding);
  border-radius: var(--cb-btn-radius);
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* Buttons use ONLY variables */
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

/* Modal */

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
  padding: 24px;
  border: 1px solid var(--cb-border);
  color: var(--cb-text);
}

.cb-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--cb-border);
}

.cb-row:last-child {
  border-bottom: 0;
}

/* Toggles */

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

@media (max-width: 640px) {
  .cb-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
\`;
document.head.appendChild(style);
`
        );

        /* ─────────────────────────────────────
           Consent runtime
        ───────────────────────────────────── */

        injectScript(
          "page",
          `
(() => {
  const KEY = "${storageKey}";
  const TTL = ${ttl};

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

  window.astroConsent = {
    get: read,
    set: write,
    reset() {
      localStorage.removeItem(KEY);
      location.reload();
    }
  };
})();
`
        );

        /* ─────────────────────────────────────
           Banner + modal UI
        ───────────────────────────────────── */

        injectScript(
          "page",
          `
(() => {
  if (window.astroConsent.get()) return;

  const state = { ...${JSON.stringify(defaultCategories)} };

  const banner = document.createElement("div");
  banner.id = "astro-consent-banner";

  banner.innerHTML = \`
    <div class="cb-container">
      <div>
        <div class="cb-title">${siteName} uses cookies</div>
        <div class="cb-desc">
          Choose how your data is used.
          <a href="${policyUrl}">Learn more</a>
        </div>
      </div>
      <div class="cb-actions">
        <button class="cb-manage">Manage</button>
        <button class="cb-reject">Reject</button>
        <button class="cb-accept">Accept all</button>
      </div>
    </div>
  \`;

  document.body.appendChild(banner);

  banner.querySelector(".cb-accept").onclick = () => {
    window.astroConsent.set({ essential: true, analytics: true, marketing: true });
    banner.remove();
  };

  banner.querySelector(".cb-reject").onclick = () => {
    window.astroConsent.set({ essential: true });
    banner.remove();
  };

  banner.querySelector(".cb-manage").onclick = openModal;

  function openModal() {
    const modal = document.createElement("div");
    modal.id = "astro-consent-modal";

    modal.innerHTML = \`
      <div class="cb-modal">
        <h3>Cookie preferences</h3>

        <div class="cb-row">
          <span>Essential</span>
          <strong>Always on</strong>
        </div>

        <div class="cb-row">
          <span>Analytics</span>
          <div class="cb-toggle" data-key="analytics"><span></span></div>
        </div>

        <div class="cb-row">
          <span>Marketing</span>
          <div class="cb-toggle" data-key="marketing"><span></span></div>
        </div>

        <div class="cb-actions" style="margin-top:16px;justify-content:flex-end">
          <button class="cb-accept">Save preferences</button>
        </div>
      </div>
    \`;

    document.body.appendChild(modal);

    modal.querySelectorAll(".cb-toggle").forEach(toggle => {
      const key = toggle.getAttribute("data-key");
      if (state[key]) toggle.classList.add("active");

      toggle.onclick = () => {
        state[key] = !state[key];
        toggle.classList.toggle("active");
      };
    });

    modal.querySelector(".cb-accept").onclick = () => {
      window.astroConsent.set({ essential: true, ...state });
      modal.remove();
      banner.remove();
    };

    modal.onclick = e => {
      if (e.target === modal) modal.remove();
    };
  }
})();
`
        );
      }
    }
  };
}
export default function astroConsent(options = {}) {
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
                   LOAD USER CSS (required)
                ───────────────────────────────────── */
                injectScript("head-inline", `@import "/src/cookiebanner.css";`);
                /* ─────────────────────────────────────
                   Consent runtime (NO CSS)
                ───────────────────────────────────── */
                injectScript("page", `
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
`);
                /* ─────────────────────────────────────
                   Banner + modal UI (NO CSS)
                ───────────────────────────────────── */
                injectScript("page", `
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

        <div class="cb-actions">
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
`);
            }
        }
    };
}

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
                   Styles (banner + modal)
                ───────────────────────────────────── */
                injectScript("head-inline", `
const style = document.createElement("style");
style.innerHTML = \`
:root {
  --cb-bg: rgba(12,18,32,.88);
  --cb-border: rgba(255,255,255,.08);
  --cb-text: #e5e7eb;
  --cb-muted: #9ca3af;
  --cb-link: #60a5fa;
  --cb-accept: #22c55e;
  --cb-reject: #374151;
}

/* ───── Banner ───── */

#astro-consent-banner {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
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
  border-radius: 16px;
  border: 1px solid var(--cb-border);
  box-shadow: 0 20px 40px rgba(0,0,0,.35);

  color: var(--cb-text);
}

.cb-text {
  max-width: 760px;
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

.cb-desc a:hover {
  text-decoration: underline;
}

.cb-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.cb-actions button {
  padding: 10px 18px;
  border-radius: 999px;
  border: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.cb-accept {
  background: var(--cb-accept);
  color: #052e16;
}

.cb-reject {
  background: var(--cb-reject);
  color: #e5e7eb;
}

.cb-manage {
  background: transparent;
  color: var(--cb-text);
  border: 1px solid var(--cb-border);
}

/* ───── Modal ───── */

#astro-consent-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
}

.cb-modal {
  width: 100%;
  max-width: 480px;
  background: #0c1220;
  border-radius: 18px;
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

.cb-toggle {
  width: 44px;
  height: 24px;
  background: #374151;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
}

.cb-toggle span {
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform .2s;
}

.cb-toggle.active {
  background: var(--cb-accept);
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
`);
                /* ─────────────────────────────────────
                   Consent runtime
                ───────────────────────────────────── */
                injectScript("page", `
(() => {
  const KEY = "${storageKey}";
  const TTL = ${ttl};

  function now(){ return Date.now(); }

  function read(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(data.expiresAt < now()){
        localStorage.removeItem(KEY);
        return null;
      }
      return data;
    }catch{ return null; }
  }

  function write(categories){
    localStorage.setItem(KEY, JSON.stringify({
      updatedAt: now(),
      expiresAt: now() + TTL,
      categories
    }));
  }

  window.astroConsent = {
    get: read,
    set: write,
    reset(){
      localStorage.removeItem(KEY);
      location.reload();
    }
  };
})();
`);
                /* ─────────────────────────────────────
                   Banner + modal UI
                ───────────────────────────────────── */
                injectScript("page", `
(() => {
  if (window.astroConsent.get()) return;

  const state = { ...${JSON.stringify(defaultCategories)} };

  const banner = document.createElement("div");
  banner.id = "astro-consent-banner";

  banner.innerHTML = \`
    <div class="cb-container">
      <div class="cb-text">
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
    window.astroConsent.set({ essential:true, analytics:true, marketing:true });
    banner.remove();
  };

  banner.querySelector(".cb-reject").onclick = () => {
    window.astroConsent.set({ essential:true });
    banner.remove();
  };

  banner.querySelector(".cb-manage").onclick = openModal;

  function openModal(){
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
      if(state[key]) toggle.classList.add("active");

      toggle.onclick = () => {
        state[key] = !state[key];
        toggle.classList.toggle("active");
      };
    });

    modal.querySelector(".cb-accept").onclick = () => {
      window.astroConsent.set({ essential:true, ...state });
      modal.remove();
      banner.remove();
    };

    modal.onclick = e => {
      if(e.target === modal) modal.remove();
    };
  }
})();
`);
            }
        }
    };
}

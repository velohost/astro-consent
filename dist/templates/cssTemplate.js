export const DEFAULT_CSS = `
:root {
  /* Layout */
  --cb-z-index: 9999;
  --cb-max-width: 960px;
  --cb-padding: 16px;
  --cb-gap: 12px;
  --cb-radius: 10px;

  /* Colours */
  --cb-bg: #111827;
  --cb-surface: #1f2933;
  --cb-text: #ffffff;
  --cb-muted: #9ca3af;
  --cb-border: #374151;
  --cb-accent: #6366f1;

  /* Buttons */
  --cb-btn-bg: var(--cb-accent);
  --cb-btn-text: #ffffff;
  --cb-btn-secondary-bg: transparent;
  --cb-btn-secondary-text: var(--cb-text);
  --cb-btn-border: var(--cb-border);

  /* Typography */
  --cb-font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --cb-title-size: 1rem;
  --cb-text-size: 0.875rem;
}

#astro-cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--cb-z-index);
  background: var(--cb-bg);
  color: var(--cb-text);
  font-family: var(--cb-font-family);
  border-top: 1px solid var(--cb-border);
}

#astro-cookie-banner > * {
  max-width: var(--cb-max-width);
  margin: 0 auto;
  padding: var(--cb-padding);
}

#astro-cookie-banner h2 {
  margin: 0 0 4px;
  font-size: var(--cb-title-size);
}

#astro-cookie-banner p {
  margin: 0;
  font-size: var(--cb-text-size);
  color: var(--cb-muted);
}

#astro-cookie-banner a {
  color: var(--cb-accent);
  text-decoration: underline;
}

.astro-cookie-categories {
  display: grid;
  gap: var(--cb-gap);
  margin-top: var(--cb-gap);
}

.astro-cookie-category {
  background: var(--cb-surface);
  padding: 12px;
  border-radius: var(--cb-radius);
  border: 1px solid var(--cb-border);
}

.astro-cookie-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.astro-cookie-description {
  margin: 4px 0 0 26px;
  font-size: 0.8rem;
  color: var(--cb-muted);
}

.astro-cookie-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: var(--cb-gap);
  flex-wrap: wrap;
}

.astro-cookie-actions button {
  padding: 8px 14px;
  border-radius: var(--cb-radius);
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid var(--cb-btn-border);
}

.astro-cookie-actions button:first-child {
  background: var(--cb-btn-secondary-bg);
  color: var(--cb-btn-secondary-text);
}

.astro-cookie-actions button:last-child {
  background: var(--cb-btn-bg);
  color: var(--cb-btn-text);
  border-color: var(--cb-btn-bg);
}
`;

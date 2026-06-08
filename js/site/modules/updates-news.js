import { UPDATES_NEWS } from "../config.js";
import { startPreorder } from "./preorder.js";
import { storage } from "../core/storage.js";
import { escapeHtml, validateEmail } from "../core/security.js";

const COLLECTION = "updates-subscribers";

export function getUpdatesSubscribers() {
  return storage.list(COLLECTION);
}

export function subscribeUpdates(email, source = "homepage") {
  const normalized = validateEmail(email);
  if (!normalized) return { invalid: true };

  const existing = getUpdatesSubscribers().some((s) => s.email === normalized);
  if (existing) return { duplicate: true, email: normalized };

  const record = {
    id: crypto.randomUUID?.() ?? `up-${Date.now()}`,
    email: normalized,
    source,
    at: new Date().toISOString(),
  };
  storage.insert(COLLECTION, record);
  return record;
}

function bindUpsellButtons(root) {
  root.querySelectorAll("[data-updates-preorder]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startPreorder(btn.dataset.updatesPreorder, { source: "updates-news" });
    });
  });
}

export function renderUpdatesNews(containerId = "updates-news-section") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const { form, upcomingFeatures } = UPDATES_NEWS;

  root.innerHTML = `
    <header class="updates-header">
      <p class="section-eyebrow">Stay in the loop</p>
      <h2 class="section-title" id="updates-heading">${escapeHtml(UPDATES_NEWS.headline)}</h2>
      <p class="updates-tagline">${escapeHtml(UPDATES_NEWS.tagline)}</p>
      <p class="updates-pitch">${escapeHtml(UPDATES_NEWS.pitch)}</p>
    </header>

    <div class="updates-layout">
      <form class="updates-form panel-card" id="updates-subscribe-form" novalidate>
        <h3 class="panel-card-title">Email me updates</h3>
        <label>
          Email
          <input type="email" name="email" required placeholder="you@email.com" autocomplete="email" />
        </label>
        <p class="form-status updates-form-status" id="updates-form-status" hidden role="status"></p>
        <button type="submit" class="btn btn-primary">${escapeHtml(form.submitLabel)}</button>
      </form>

      <div class="updates-features">
        <h3 class="updates-features-title">Upcoming features</h3>
        <ul class="updates-feature-list">
          ${upcomingFeatures
            .map((feature) => {
              const upsell = feature.upsell;
              const upsellBtn = upsell?.preorder
                ? `<button type="button" class="btn btn-secondary btn-sm" data-updates-preorder="${escapeHtml(upsell.preorder)}">${escapeHtml(upsell.label)}</button>`
                : upsell?.href
                  ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(upsell.href)}">${escapeHtml(upsell.label)}</a>`
                  : "";
              return `
                <li class="updates-feature-card panel-card">
                  <div class="updates-feature-meta">
                    <span class="updates-feature-status">${escapeHtml(feature.status)}</span>
                  </div>
                  <h4>${escapeHtml(feature.title)}</h4>
                  <p>${escapeHtml(feature.description)}</p>
                  ${upsellBtn ? `<div class="updates-feature-cta">${upsellBtn}</div>` : ""}
                </li>
              `;
            })
            .join("")}
        </ul>
      </div>
    </div>
  `;

  bindUpsellButtons(root);

  root.querySelector("#updates-subscribe-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formEl = e.target;
    const email = new FormData(formEl).get("email");
    const status = root.querySelector("#updates-form-status");

    if (!email) return;

    const result = subscribeUpdates(email, "homepage");

    if (status) {
      if (result.invalid) {
        status.textContent = "Please enter a valid email address.";
      } else {
        status.textContent = result.duplicate
          ? "You're already subscribed — we'll keep you posted."
          : form.successMessage;
      }
      status.hidden = false;
    }
    if (result.invalid) return;
    formEl.reset();
    formEl.querySelector("button[type=submit]").disabled = true;
  });
}

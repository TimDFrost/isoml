import { PREORDER, ADOPT_A_COMEDIAN, STRIPE } from "../config.js";
import { Events, emit } from "../core/events.js";
import { validateEmail, isStripePaymentUrl, escapeHtml, sanitizeText } from "../core/security.js";
import { getCurrentUser } from "./auth.js";

const PREORDERS_KEY = "isoml:v1:preorders";

export function getPreorders() {
  return JSON.parse(localStorage.getItem(PREORDERS_KEY) || "[]");
}

export function getAllTiers() {
  return [...PREORDER.tiers, ...(ADOPT_A_COMEDIAN?.tiers || [])];
}

export function getTierById(tierId) {
  return getAllTiers().find((t) => t.id === tierId);
}

export function isAdoptTier(tierId) {
  const tier = getTierById(tierId);
  return tier?.category === "adopt";
}

export function getAdoptStats() {
  const adoptPreorders = getPreorders().filter((p) => isAdoptTier(p.tierId));
  const fromPreorders = adoptPreorders.reduce((sum, p) => sum + (p.amount || 0), 0);
  const funded = ADOPT_A_COMEDIAN.seedFunded + fromPreorders;
  const adoptions = ADOPT_A_COMEDIAN.seedAdoptions + adoptPreorders.length;
  const goal = ADOPT_A_COMEDIAN.goal;
  const pct = Math.min(100, Math.round((funded / goal) * 100));
  return { funded, adoptions, goal, pct, adoptPreorders };
}

export function getComicRaised(comicId) {
  const comic = ADOPT_A_COMEDIAN.featuredComics.find((c) => c.id === comicId);
  const fromPreorders = getPreorders()
    .filter((p) => p.comicId === comicId && isAdoptTier(p.tierId))
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  return (comic?.seedRaised || 0) + fromPreorders;
}

export function getPaymentLink(tierId) {
  const tier = getTierById(tierId);
  if (!tier?.stripeKey) return null;
  return STRIPE.paymentLinks[tier.stripeKey] || null;
}

export function getCampaignStats() {
  const preorders = getPreorders();
  const fromPreorders = preorders.reduce((sum, p) => sum + (p.amount || 0), 0);
  const funded = PREORDER.campaign.seedFunded + fromPreorders;
  const backers = PREORDER.campaign.seedBackers + preorders.length;
  const goal = PREORDER.campaign.goal;
  const pct = Math.min(100, Math.round((funded / goal) * 100));
  return { funded, backers, goal, pct, preorders };
}

export function getTierBackerCount(tierId) {
  return getPreorders().filter((p) => p.tierId === tierId).length;
}

export function getTierRemaining(tier) {
  if (!tier.limit) return null;
  return Math.max(0, tier.limit - getTierBackerCount(tier.id));
}

export function formatTierPrice(tier) {
  return `$${tier.price}`;
}

export function logPreorder(tierId, email, source, extra = {}) {
  const tier = getTierById(tierId);
  if (!tier) return null;

  const preorders = getPreorders();
  const record = {
    id: crypto.randomUUID?.() ?? `po-${Date.now()}`,
    tierId,
    amount: tier.price,
    email: email || getCurrentUser()?.email || null,
    userId: getCurrentUser()?.id || null,
    source: source || "campaign",
    backerNumber: PREORDER.campaign.seedBackers + preorders.length + 1,
    comicId: extra.comicId || null,
    adopterName: extra.adopterName || null,
    message: extra.message || null,
    at: new Date().toISOString(),
  };
  preorders.unshift(record);
  localStorage.setItem(PREORDERS_KEY, JSON.stringify(preorders.slice(0, 500)));

  emit(Events.PREORDER_PLACED, record);
  emit(Events.CHECKOUT_INTENT, { productId: tierId, email: record.email, source });
  refreshCampaignUI();
  return record;
}

export function renderAdoptSection(containerId = "bribe-section") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const { pct, funded, adoptions } = getAdoptStats();
  const split = ADOPT_A_COMEDIAN.fundSplit;

  root.innerHTML = `
    <header class="adopt-header">
      <p class="section-eyebrow">Fan fundraiser</p>
      <h2 class="adopt-headline" id="bribe-heading">${escapeHtml(ADOPT_A_COMEDIAN.headline)}</h2>
      <p class="adopt-tagline">${escapeHtml(ADOPT_A_COMEDIAN.tagline)}</p>
      <p class="adopt-pitch">${escapeHtml(ADOPT_A_COMEDIAN.pitch)}</p>
      ${split ? `
        <div class="fund-split-banner" role="note" aria-label="Fund split ${split.guests} percent to guests, ${split.platform} percent to platform">
          <div class="fund-split-bar" aria-hidden="true">
            <span class="fund-split-guests" style="width: ${split.guests}%">${split.guests}% guests</span>
            <span class="fund-split-platform" style="width: ${split.platform}%">${split.platform}% platform</span>
          </div>
          <p class="fund-split-label"><strong>${escapeHtml(split.label)}</strong></p>
          <p class="fund-split-detail">${escapeHtml(split.detail)}</p>
        </div>
      ` : ""}
      <div class="adopt-stats" role="status">
        <span><strong>$${funded.toLocaleString()}</strong> raised</span>
        <span><strong>${adoptions}</strong> bribes</span>
        <span><strong>${pct}%</strong> of ${ADOPT_A_COMEDIAN.goalLabel} goal</span>
      </div>
      <div class="campaign-progress-wrap adopt-progress" aria-label="Bribe fund progress ${pct} percent">
        <div class="campaign-progress-bar campaign-progress-bar--adopt" style="width: ${pct}%"></div>
      </div>
    </header>

    <div class="adopt-how">
      <h3 class="adopt-subheading">How it works</h3>
      <ol class="adopt-steps">
        ${ADOPT_A_COMEDIAN.howItWorks.map((s) => `
          <li>
            <span class="adopt-step-num">${s.step}</span>
            <div>
              <strong>${escapeHtml(s.title)}</strong>
              <p>${escapeHtml(s.body)}</p>
            </div>
          </li>
        `).join("")}
      </ol>
    </div>

    <div class="adopt-roster">
      <h3 class="adopt-subheading">Featured comics — bribe today</h3>
      <div class="comic-roster-grid" id="comic-roster"></div>
    </div>

    <div class="adopt-tiers-wrap">
      <h3 class="adopt-subheading">Bribe levels</h3>
      <div class="reward-tiers adopt-tiers" id="adopt-tiers"></div>
    </div>
  `;

  renderComicRoster("comic-roster");
  renderTierGrid("adopt-tiers", ADOPT_A_COMEDIAN.tiers, { variant: "adopt" });
}

function renderComicRoster(containerId) {
  const root = document.getElementById(containerId);
  if (!root) return;

  root.innerHTML = ADOPT_A_COMEDIAN.featuredComics.map((comic) => {
    const raised = getComicRaised(comic.id);
    const pct = Math.min(100, Math.round((raised / comic.goal) * 100));
    return `
      <article class="comic-card">
        <span class="comic-emoji" aria-hidden="true">${comic.emoji || "🎤"}</span>
        <h4>${escapeHtml(comic.name)}</h4>
        <p class="comic-city">${escapeHtml(comic.city)}</p>
        <p class="comic-pitch">${escapeHtml(comic.pitch)}</p>
        <div class="comic-progress-wrap" aria-label="${pct}% funded">
          <div class="comic-progress-bar" style="width: ${pct}%"></div>
        </div>
        <p class="comic-raised">$${raised.toLocaleString()} of $${comic.goal.toLocaleString()}</p>
        <button type="button" class="btn btn-secondary btn-sm" data-preorder="adopt-patron" data-comic-id="${comic.id}" data-source="comic-roster">Bribe from $50</button>
      </article>
    `;
  }).join("");

  root.querySelectorAll("[data-preorder]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startPreorder(btn.dataset.preorder, { source: btn.dataset.source, comicId: btn.dataset.comicId });
    });
  });
}

/** Quick adopt with pre-selected comic opens modal with comic pre-filled */
export function startPreorder(tierId, { source = "campaign", comicId = null } = {}) {
  const tier = getTierById(tierId);
  if (!tier) return;

  const remaining = getTierRemaining(tier);
  if (remaining === 0) {
    alert("This tier is sold out. Pick another or email tim@isoml.com.");
    return;
  }

  const link = getPaymentLink(tierId);
  if (link) {
    if (!isStripePaymentUrl(link)) {
      console.error("[preorder] Blocked unsafe payment URL");
      openPreorderModal(tier, source, comicId);
      return;
    }
    logPreorder(tierId, getCurrentUser()?.email, source, { comicId });
    window.location.assign(link);
    return;
  }

  openPreorderModal(tier, source, comicId);
}

function openPreorderModal(tier, source, preselectedComicId = null) {
  let dialog = document.getElementById("preorder-modal");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "preorder-modal";
    dialog.className = "site-modal preorder-modal";
    document.body.appendChild(dialog);
  }

  const remaining = getTierRemaining(tier);
  const savings = tier.retailValue ? tier.retailValue - tier.price : 0;
  const isAdopt = tier.category === "adopt";
  const adoptableComics = ADOPT_A_COMEDIAN.featuredComics.filter((c) => c.adoptable);

  dialog.innerHTML = `
    <form method="dialog" class="preorder-form" id="preorder-form">
      <p class="preorder-modal-eyebrow">${isAdopt ? "💸 Bribe Your Favorite Comedian" : "🎤 Back this reward"}</p>
      <h2>${escapeHtml(tier.name)}</h2>
      <p class="preorder-modal-price">${formatTierPrice(tier)} ${tier.retailLabel ? `<span class="preorder-modal-retail">(${escapeHtml(tier.retailLabel)}${savings ? ` · save $${savings}+` : ""})</span>` : ""}</p>
      <p class="preorder-form-lead">${isAdopt
        ? "Seventy-five percent lands with the comedian. At Guardian tier, you also get thirty unscripted minutes — the conversation every fan wishes they could buy."
        : `You're pre-ordering at founding backer pricing. Launch access ships ${escapeHtml(PREORDER.campaign.launchWindow)}.`}</p>
      ${!isAdopt && PREORDER.campaign.guarantee?.label ? `<p class="preorder-guarantee-modal">${escapeHtml(PREORDER.campaign.guarantee.label)}</p>` : ""}
      ${remaining != null ? `<p class="preorder-scarcity">${remaining} of ${tier.limit} spots left</p>` : ""}
      ${isAdopt ? `
        <label>Bribe which comic?
          <select name="comicId" required>
            ${adoptableComics.map((c) => `<option value="${c.id}">${escapeHtml(c.name)} — ${escapeHtml(c.city)}</option>`).join("")}
          </select>
        </label>
      ` : ""}
      <label>Email for confirmation <input type="email" name="email" required placeholder="you@email.com" autocomplete="email" /></label>
      <label>${isAdopt ? "Name for briber wall" : "Name for backer wall"} (optional) <input type="text" name="name" maxlength="40" placeholder="Your name or @handle" autocomplete="name" /></label>
      ${isAdopt ? `<label>Message for your comic (optional) <textarea name="message" rows="2" maxlength="200" placeholder="Go kill it this Friday!"></textarea></label>` : ""}
      <p class="preorder-form-error" id="preorder-form-error" hidden role="alert"></p>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" data-preorder-cancel>Maybe later</button>
        <button type="submit" class="btn btn-primary">${escapeHtml(tier.cta)}</button>
      </div>
    </form>
  `;

  dialog.querySelector("[data-preorder-cancel]")?.addEventListener("click", () => dialog.close());

  if (preselectedComicId && isAdopt) {
    const sel = dialog.querySelector('select[name="comicId"]');
    if (sel) sel.value = preselectedComicId;
  }

  dialog.querySelector("#preorder-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const errEl = dialog.querySelector("#preorder-form-error");
    const email = validateEmail(fd.get("email"));
    if (!email) {
      if (errEl) {
        errEl.textContent = "Please enter a valid email address.";
        errEl.hidden = false;
      }
      return;
    }
    if (errEl) errEl.hidden = true;

    const name = sanitizeText(fd.get("name"), { maxLength: 40, allowEmpty: true });
    const message = sanitizeText(fd.get("message"), { maxLength: 200, allowEmpty: true });
    const record = logPreorder(tier.id, email, source, {
      comicId: fd.get("comicId") || null,
      adopterName: name,
      message: message,
    });
    if (name && record) {
      const all = getPreorders();
      const idx = all.findIndex((p) => p.id === record.id);
      if (idx >= 0) {
        all[idx].adopterName = name;
        if (message) all[idx].message = message;
        localStorage.setItem(PREORDERS_KEY, JSON.stringify(all));
      }
    }

    const successLabel = isAdopt ? "Briber" : "Backer";
    dialog.innerHTML = `
      <div class="preorder-success">
        <p class="preorder-success-badge">${successLabel} #${record?.backerNumber ?? "—"}</p>
        <h2>${isAdopt ? "Bribe confirmed!" : "You're in!"}</h2>
        <p>${isAdopt ? "Bribe confirmed for" : "Pre-order confirmed for"} <strong>${escapeHtml(tier.name)}</strong>.</p>
        <p class="preorder-success-note">Confirmation sent to <strong>${escapeHtml(email)}</strong>. ${isAdopt ? "You're not just funding a set — you're buying your way closer to the comic. Thank you." : "You're helping fund the IsoML launch — thank you."}</p>
        <button type="button" class="btn btn-primary" data-preorder-done>Back to campaign</button>
      </div>
    `;
    dialog.querySelector("[data-preorder-done]")?.addEventListener("click", () => dialog.close());
    refreshCampaignUI();
  });

  dialog.showModal();
}

export function renderCampaignHeader(containerId = "campaign-header") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const { pct, funded, backers, goal } = getCampaignStats();
  const deadline = new Date(PREORDER.campaign.deadline);
  const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 86400000));

  el.innerHTML = `
    <header class="campaign-header">
      <p class="campaign-eyebrow">Pre-order campaign · ${escapeHtml(PREORDER.campaign.name)}</p>
      ${renderGuaranteeBadge()}
      <h2 class="campaign-headline" id="preorder-heading">${escapeHtml(PREORDER.campaign.headline)}</h2>
      <p class="campaign-subhead">${escapeHtml(PREORDER.campaign.subhead)}</p>
      <div class="campaign-stats" role="status">
        <div class="campaign-stat">
          <span class="campaign-stat-value">${pct}%</span>
          <span class="campaign-stat-label">funded</span>
        </div>
        <div class="campaign-stat">
          <span class="campaign-stat-value">$${funded.toLocaleString()}</span>
          <span class="campaign-stat-label">of ${PREORDER.campaign.goalLabel} goal</span>
        </div>
        <div class="campaign-stat">
          <span class="campaign-stat-value">${backers}</span>
          <span class="campaign-stat-label">backers</span>
        </div>
        <div class="campaign-stat">
          <span class="campaign-stat-value">${daysLeft}</span>
          <span class="campaign-stat-label">days left</span>
        </div>
      </div>
      <div class="campaign-progress-wrap" aria-label="Funding progress ${pct} percent">
        <div class="campaign-progress-bar" style="width: ${pct}%"></div>
      </div>
      <p class="campaign-meta">By ${escapeHtml(PREORDER.campaign.creatorName)} · Est. launch ${escapeHtml(PREORDER.campaign.launchWindow)}</p>
    </header>
  `;
}

export function renderCampaignPitch(containerId = "campaign-pitch") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const blocks = Object.values(PREORDER.pitch);
  el.innerHTML = `
    <div class="campaign-pitch-grid">
      ${blocks.map((b) => `
        <article class="campaign-pitch-card">
          <h3>${escapeHtml(b.title)}</h3>
          <p>${escapeHtml(b.body)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

export function renderRewardTiers(containerId = "reward-tiers") {
  const guaranteeEl = document.getElementById("preorder-guarantee");
  if (guaranteeEl) {
    guaranteeEl.innerHTML = renderGuaranteeBanner();
  }
  renderTierGrid(containerId, PREORDER.tiers);
}

function renderGuaranteeBadge() {
  const g = PREORDER.campaign.guarantee;
  if (!g?.label) return "";
  return `
    <p class="preorder-guarantee-badge" role="note">
      <span class="preorder-guarantee-icon" aria-hidden="true">✓</span>
      ${escapeHtml(g.label)}
    </p>
  `;
}

function renderGuaranteeBanner() {
  const g = PREORDER.campaign.guarantee;
  if (!g?.label) return "";
  return `
    <div class="preorder-guarantee-banner" role="note">
      <span class="preorder-guarantee-banner-label">${escapeHtml(g.label)}</span>
      ${g.detail ? `<span class="preorder-guarantee-banner-detail">${escapeHtml(g.detail)}</span>` : ""}
    </div>
  `;
}

function renderTierGrid(containerId, tiers, { variant = "backer" } = {}) {
  const root = document.getElementById(containerId);
  if (!root) return;

  root.innerHTML = tiers
    .map((tier) => {
      const remaining = getTierRemaining(tier);
      const soldOut = remaining === 0;
      const link = getPaymentLink(tier.id);
      const savings = tier.retailValue ? tier.retailValue - tier.price : 0;
      const btnClass = variant === "adopt" || tier.tier === "fan" || tier.tier === "comic" ? "btn-primary" : "btn-secondary";
      return `
      <article class="reward-tier reward-tier--${tier.tier}${tier.badge ? " reward-tier--featured" : ""}${soldOut ? " reward-tier--sold-out" : ""}"
        ${tier.anchorId ? `id="${tier.anchorId}"` : ""} data-tier="${tier.id}">
        ${tier.badge ? `<span class="reward-badge">${escapeHtml(tier.badge)}</span>` : ""}
        <h3 class="reward-name">${escapeHtml(tier.name)}</h3>
        <p class="reward-price">${formatTierPrice(tier)}</p>
        ${tier.retailValue ? `<p class="reward-retail"><s>$${tier.retailValue}</s> value${savings ? ` · <strong>Save $${savings}+</strong>` : ""}</p>` : ""}
        <p class="reward-desc">${escapeHtml(tier.description)}</p>
        ${tier.limit ? `<p class="reward-scarcity">${soldOut ? "Sold out" : `${remaining} of ${tier.limit} left`}</p>` : ""}
        <ul class="reward-features">${tier.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
        <button type="button" class="btn ${btnClass} reward-cta"
          data-preorder="${tier.id}" ${soldOut ? "disabled" : ""}>
          ${soldOut ? "Sold out" : escapeHtml(tier.cta)}${!link && !soldOut ? " →" : ""}
        </button>
        ${link ? `<p class="reward-live">✓ Stripe ${variant === "adopt" ? "bribe" : "pre-order"} live</p>` : !soldOut ? `<p class="reward-pending">${variant === "adopt" ? "Bribe now" : "Reserve now"} — Stripe link coming</p>` : ""}
      </article>
    `;
    })
    .join("");

  root.querySelectorAll("[data-preorder]").forEach((btn) => {
    btn.addEventListener("click", () => startPreorder(btn.dataset.preorder, { source: containerId }));
  });
}

export function renderStretchGoals(containerId = "stretch-goals") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const { funded } = getCampaignStats();

  el.innerHTML = `
    <h3 class="stretch-heading">Stretch goals</h3>
    <ol class="stretch-list">
      ${PREORDER.stretchGoals.map((g) => {
        const unlocked = funded >= g.amount;
        return `
        <li class="stretch-item ${unlocked ? "stretch-item--unlocked" : ""}">
          <span class="stretch-marker">${unlocked ? "✓" : "$" + g.amount.toLocaleString()}</span>
          <div>
            <strong>${escapeHtml(g.title)}</strong>
            <p>${escapeHtml(g.description)}</p>
          </div>
        </li>`;
      }).join("")}
    </ol>
  `;
}

export function renderTrustBar(containerId = "campaign-trust") {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = PREORDER.trust.map((t) => `<span class="trust-chip">${escapeHtml(t)}</span>`).join("");
}

export function renderUpsell(containerId, upsellKey) {
  const root = document.getElementById(containerId);
  const upsell = PREORDER.upsells[upsellKey];
  if (!root || !upsell) return;

  const tier = getTierById(upsell.tierId);
  const isAdopt = tier?.category === "adopt";
  root.innerHTML = `
    <aside class="upsell-card upsell-card--preorder${isAdopt ? " upsell-card--adopt" : ""}">
      <p class="upsell-eyebrow">${isAdopt ? "Bribe Your Favorite Comedian" : "Pre-order"}</p>
      <h3 class="upsell-title">${escapeHtml(upsell.title)}</h3>
      <p class="upsell-text">${escapeHtml(upsell.text)}</p>
      <p class="upsell-price">${tier ? formatTierPrice(tier) : ""} founding backer</p>
      <button type="button" class="btn btn-primary btn-sm" data-preorder="${upsell.tierId}">${tier?.cta ?? "Pre-order"}</button>
    </aside>
  `;
  root.querySelector("[data-preorder]")?.addEventListener("click", () => {
    startPreorder(upsell.tierId, { source: `upsell-${upsellKey}` });
  });
}

export function initPreorderButtons() {
  document.querySelectorAll("[data-preorder]:not(.reward-cta)").forEach((btn) => {
    if (btn.closest("#reward-tiers, #adopt-tiers")) return;
    btn.addEventListener("click", () => {
      startPreorder(btn.dataset.preorder, {
        source: btn.dataset.source || "cta",
        comicId: btn.dataset.comicId || null,
      });
    });
  });
}

export function refreshCampaignUI() {
  renderCampaignHeader();
  renderAdoptSection();
  renderRewardTiers();
  renderStretchGoals();
}

/** Legacy aliases for app.js */
export const renderPricingGrid = renderRewardTiers;
export const renderRevenueStreams = () => {};
export const startCheckout = startPreorder;
export function initCheckoutButtons() {
  initPreorderButtons();
}

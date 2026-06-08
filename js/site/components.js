import { SITE, NAV_LINKS, HOW_TO_GUIDES, FUNNELS, MONETIZE } from "./config.js";

function rootPrefix() {
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments.length && segments[segments.length - 1].includes(".")) {
    segments.pop();
  }
  return segments.length ? "../".repeat(segments.length) : "";
}

function navPath(href) {
  if (/^(https?:|#|mailto:|tel:)/.test(href)) return href;
  const prefix = rootPrefix();
  if (href.startsWith("/")) return prefix + href.slice(1);
  return prefix + href;
}

export function renderHeader() {
  const root = document.getElementById("site-header");
  if (!root) return;

  const homeHref = navPath("/");
  const links = NAV_LINKS.map(
    (link) =>
      `<a class="site-nav-link" href="${navPath(link.href)}">${link.label}</a>`
  ).join("");

  root.innerHTML = `
    <div class="site-header-inner">
      <a class="site-logo" href="${homeHref}" aria-label="${SITE.name} home">
        <span class="logo-iso">ISO</span><span class="logo-ml">ML</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Main">${links}</nav>
      <div class="user-bar" id="user-bar" aria-label="Account"></div>
    </div>
  `;
}

export function renderFooter() {
  const root = document.getElementById("site-footer");
  if (!root) return;

  const { ceo } = SITE;
  const telHref = `tel:+1${SITE.phone.replace(/\D/g, "")}`;

  root.innerHTML = `
    <div class="site-footer-inner">
      <div class="footer-brand">
        <p class="footer-logo"><span class="logo-iso">ISO</span><span class="logo-ml">ML</span></p>
        <p class="footer-tagline">${SITE.tagline}</p>
        <p class="footer-company">${SITE.companyLegal}</p>
        <p class="footer-entity"><a href="${SITE.url}">isoml.com</a></p>
      </div>
      <div class="footer-links">
        <p class="footer-heading">Explore</p>
        <a href="${navPath("/#podcast")}">Podcast</a>
        <a href="${navPath("/pages/comedians-wanted.html")}">Comedians Wanted</a>
        <a href="${navPath("/pages/how-to/")}">How to Be a Comedian</a>
        <a href="${navPath("/#bribe")}">Bribe a Comic</a>
        <a href="${navPath("/#preorder")}">Pre-order</a>
        <a href="${navPath("/#updates")}">Updates</a>
        <a href="${navPath("/simulator/")}">TV Simulator</a>
      </div>
      <div class="footer-contact">
        <p class="footer-heading">Contact the CEO</p>
        <p class="footer-ceo-name">${ceo.name}</p>
        <a href="mailto:${ceo.email}">${ceo.emailDisplay}</a>
        <a href="${telHref}">${ceo.phone}</a>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-corp">
        <p class="footer-bottom-legal"><strong>${SITE.companyLegal}</strong> · isoml.com</p>
      </div>
      <div class="footer-bottom-ceo">
        <button type="button" class="btn btn-secondary footer-ceo-btn" id="footer-ceo-toggle" aria-expanded="false" aria-controls="footer-ceo-panel">
          Contact the CEO
        </button>
        <div class="footer-ceo-panel" id="footer-ceo-panel" hidden>
          <p class="footer-ceo-panel-name">${ceo.name}, ${ceo.title}</p>
          <p class="footer-ceo-panel-links">
            <a href="mailto:${ceo.email}">${ceo.emailDisplay}</a>
            <span aria-hidden="true"> · </span>
            <a href="${telHref}">${ceo.phone}</a>
          </p>
        </div>
      </div>
    </div>

    <p class="footer-copy">© ${new Date().getFullYear()} ${SITE.company}. All rights reserved.</p>
    <p class="footer-founder"><a href="${navPath("/pages/monetize-playbook.html")}">Pre-order campaign playbook</a> · for founders</p>
  `;

  const toggle = root.querySelector("#footer-ceo-toggle");
  const panel = root.querySelector("#footer-ceo-panel");
  toggle?.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });
}

export function renderGuideCards(containerId = "guide-grid") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const base = navPath("/pages/how-to/");
  root.innerHTML = HOW_TO_GUIDES.map(
    (guide) => `
    <article class="guide-card" data-slug="${guide.slug}">
      <a class="guide-card-link" href="${base}${guide.slug}.html">
        <span class="guide-number">${guide.number}</span>
        <span class="guide-icon" aria-hidden="true">${guide.icon}</span>
        <h3 class="guide-title">${guide.title}</h3>
        <p class="guide-desc">${guide.shortDescription}</p>
        <span class="guide-cta">Read guide →</span>
      </a>
    </article>
  `
  ).join("");
}

export function renderFunnels() {
  Object.values(FUNNELS).forEach((funnel) => {
    const root = document.getElementById(`funnel-${funnel.id}`);
    if (!root) return;

    const product = MONETIZE.products.find((p) => p.id === funnel.productId);
    const features = funnel.features.map((f) => `<li>${f}</li>`).join("");
    const tagline = funnel.tagline
      ? `<p class="funnel-tagline">${funnel.tagline}</p>`
      : "";
    const pullQuote = funnel.pullQuote
      ? `<blockquote class="funnel-pull-quote">${funnel.pullQuote}</blockquote>`
      : "";
    const secondary = funnel.secondaryCta
      ? `<a class="funnel-secondary-cta" href="${navPath(funnel.secondaryCta.href)}">${funnel.secondaryCta.label} →</a>`
      : "";

    root.innerHTML = `
      <p class="section-eyebrow">${funnel.eyebrow}</p>
      <h2 class="section-title funnel-title">${funnel.title}</h2>
      ${tagline}
      <p class="section-lead">${funnel.description}</p>
      ${pullQuote}
      <ul class="funnel-features">${features}</ul>
      <div class="funnel-actions">
        <button type="button" class="btn ${funnel.id === "training" ? "btn-primary" : "btn-secondary"}" data-preorder="${funnel.productId}" data-source="funnel-${funnel.id}">
          ${funnel.cta.label}${product ? ` — $${product.price}` : ""}
        </button>
        ${secondary}
      </div>
    `;
  });
}

export function renderGuideHub() {
  const root = document.getElementById("guide-hub-list");
  if (!root) return;

  const base = "";
  root.innerHTML = HOW_TO_GUIDES.map(
    (guide) => `
    <article class="guide-hub-item">
      <a href="${base}${guide.slug}.html">
        <span class="guide-number">${guide.number}</span>
        <div>
          <h2>${guide.title}</h2>
          <p>${guide.shortDescription}</p>
        </div>
        <span class="guide-cta">→</span>
      </a>
    </article>
  `
  ).join("");
}

export function getGuideBySlug(slug) {
  return HOW_TO_GUIDES.find((g) => g.slug === slug);
}

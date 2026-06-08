import { MODULES, FAN_LOUNGE, GAMIFY } from "./config.js";
import { Events, on } from "./core/events.js";
import {
  renderHeader,
  renderFooter,
  renderGuideCards,
  renderFunnels,
  renderGuideHub,
  getGuideBySlug,
} from "./components.js";
import { renderPodcastSection } from "./modules/podcast.js";
import { buildGuidePrompt, buildHubPrompt, renderAiPromptBlock } from "./ai-prompt.js";
import { initAuth, mountAuthUI, mountAuthModal } from "./modules/auth.js";
import { initGamify, renderLeaderboard } from "./modules/gamify.js";
import { initVotingGlobalRefresh, createVoteWidget } from "./modules/voting.js";
import { initFanLounge } from "./modules/fan-lounge.js";
import { initFanShowcase } from "./modules/fan-showcase.js";
import {
  renderCampaignHeader,
  renderCampaignPitch,
  renderAdoptSection,
  renderRewardTiers,
  renderStretchGoals,
  renderTrustBar,
  renderUpsell,
  initPreorderButtons,
  refreshCampaignUI,
} from "./modules/preorder.js";
import { renderComediansWanted } from "./modules/comedians-wanted.js";
import { renderUpdatesNews } from "./modules/updates-news.js";
import { renderFounderPlaybook, renderCheckoutIntentSummary } from "./modules/founder-playbook.js";
import { validateEmail } from "./core/security.js";
import { storage, Collections } from "./core/storage.js";

/** Module registry — plug in AI agents, auth, social later */
const moduleRegistry = new Map();

export function registerModule(name, initFn) {
  moduleRegistry.set(name, initFn);
}

function initModules() {
  Object.entries(MODULES).forEach(([key, mod]) => {
    if (!mod.enabled) return;
    const el = document.getElementById(mod.mountId);
    const init = moduleRegistry.get(key);
    if (el && init) init(el);
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initScrollReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

function initWaitlistForms() {
  document.querySelectorAll("[data-waitlist]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const status = form.querySelector(".waitlist-status");
      const email = validateEmail(input?.value);
      if (!email) {
        if (status) {
          status.textContent = "Please enter a valid email address.";
          status.hidden = false;
        }
        return;
      }

      const funnel = String(form.dataset.waitlist || "default").replace(/[^a-z0-9_-]/gi, "");
      const list = storage.list(`${Collections.UPDATES_SUBSCRIBERS}-waitlist-${funnel}`);
      if (!list.some((entry) => entry.email === email)) {
        storage.insert(`${Collections.UPDATES_SUBSCRIBERS}-waitlist-${funnel}`, {
          id: crypto.randomUUID?.() ?? `wl-${Date.now()}`,
          email,
          funnel,
          at: new Date().toISOString(),
        });
      }

      if (status) {
        status.textContent = "You're on the list — we'll be in touch.";
        status.hidden = false;
      }
      input.value = "";
      form.querySelector("button[type=submit]").disabled = true;
    });
  });
}

function initGuidePage() {
  const article = document.getElementById("guide-article");
  if (!article) return;

  const slug = article.dataset.slug;
  const guide = getGuideBySlug(slug);
  if (!guide) return;

  const promptEl = document.getElementById("guide-ai-prompt");
  if (promptEl) {
    renderAiPromptBlock(promptEl, buildGuidePrompt(guide), {
      label: `AI prompt: ${guide.title}`,
    });
  }

  document.title = `${guide.title} — How to Be a Comedian | IsoML`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = guide.shortDescription;

  const titleEl = document.getElementById("guide-page-title");
  const descEl = document.getElementById("guide-page-desc");
  const bodyEl = document.getElementById("guide-page-body");
  const numEl = document.getElementById("guide-page-number");

  if (titleEl) titleEl.textContent = guide.title;
  if (numEl) numEl.textContent = guide.number;
  if (descEl) descEl.textContent = guide.shortDescription;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <p class="guide-placeholder">${guide.descriptionPlaceholder}</p>
      <aside class="guide-keywords" aria-label="Related topics">
        ${guide.keywords.map((k) => `<span class="keyword-tag">${k}</span>`).join("")}
      </aside>
      <div id="guide-upsell"></div>
    `;
    renderUpsell("guide-upsell", "guide");
  }

  const voteMount = document.getElementById("guide-vote");
  if (voteMount && !voteMount.querySelector(".vote-widget")) {
    voteMount.appendChild(createVoteWidget("guide", slug));
  }
}

function initGuideHubPrompt() {
  if (document.getElementById("guide-article")) return;
  const promptEl = document.getElementById("guide-ai-prompt");
  if (!promptEl) return;

  renderAiPromptBlock(promptEl, buildHubPrompt(), {
    label: "AI prompt: How to Be a Comedian (full series)",
  });
}

function initFanLoungeMeta() {
  const desc = document.getElementById("fan-lounge-desc");
  if (desc) desc.textContent = FAN_LOUNGE.description;

  const rules = document.getElementById("xp-rules-list");
  if (rules) {
    rules.innerHTML = Object.values(GAMIFY.actions)
      .map((a) => `<li><strong>+${a.xp} XP</strong> — ${a.label}</li>`)
      .join("");
  }
}

async function initPlatform() {
  if (MODULES.userAuth?.enabled) {
    await initAuth();
    mountAuthModal();
    mountAuthUI();
  }
  if (MODULES.gamify?.enabled) {
    initGamify();
    await renderLeaderboard();
  }
  if (MODULES.fanLounge?.enabled) {
    initFanShowcase();
    initFanLounge();
  }
  initVotingGlobalRefresh();
  on(Events.XP_AWARDED, () => renderLeaderboard());
  on(Events.LEVEL_UP, () => renderLeaderboard());
}

async function initMonetize() {
  if (!MODULES.checkout?.enabled) return;
  renderCampaignHeader();
  renderCampaignPitch();
  renderFunnels();
  renderAdoptSection();
  renderRewardTiers();
  renderStretchGoals();
  renderTrustBar();
  renderUpsell("fan-lounge-upsell", "fanLounge");
  initPreorderButtons();
  renderFounderPlaybook();
  renderCheckoutIntentSummary();
  import("./core/events.js").then(({ on, Events }) => {
    on(Events.PREORDER_PLACED, refreshCampaignUI);
  });
}

function init() {
  renderHeader();
  renderFooter();
  renderGuideCards();
  renderPodcastSection();
  renderGuideHub();
  initFanLoungeMeta();
  initMobileNav();
  initScrollReveal();
  initWaitlistForms();
  initGuidePage();
  initGuideHubPrompt();
  renderComediansWanted();
  renderUpdatesNews();
  initPlatform();
  initMonetize();
  initModules();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

import { COMEDIANS_WANTED } from "../config.js";
import { storage } from "../core/storage.js";
import { escapeHtml, sanitizeText, validateEmail, validatePhone } from "../core/security.js";

const COLLECTION = "comedian-applications";

export function getComedianApplications() {
  return storage.list(COLLECTION);
}

export function submitComedianApplication({ name, email, phone, source = "homepage" }) {
  const safeName = sanitizeText(name, { maxLength: 80, minLength: 1 });
  const safeEmail = validateEmail(email);
  const safePhone = validatePhone(phone);
  if (!safeName || !safeEmail || !safePhone) {
    throw new Error("Invalid application data.");
  }

  const record = {
    id: crypto.randomUUID?.() ?? `cw-${Date.now()}`,
    name: safeName,
    email: safeEmail,
    phone: safePhone,
    source: String(source).slice(0, 40),
    at: new Date().toISOString(),
  };
  storage.insert(COLLECTION, record);
  return record;
}

export function renderComediansWanted(containerId = "comedians-wanted-section") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const { form, seoDiscovery } = COMEDIANS_WANTED;

  root.innerHTML = `
    <header class="cw-header">
      <p class="section-eyebrow">Invite-only · Podcast guests</p>
      <h2 class="section-title" id="comedians-wanted-heading">${escapeHtml(COMEDIANS_WANTED.headline)}</h2>
      <p class="cw-tagline">${escapeHtml(COMEDIANS_WANTED.tagline)}</p>
      <p class="cw-pitch">${escapeHtml(COMEDIANS_WANTED.pitch)}</p>
      <p class="cw-invite-badge" role="status">${escapeHtml(COMEDIANS_WANTED.inviteOnly)}</p>
    </header>

    <div class="cw-layout">
      <form class="cw-form panel-card" id="comedians-wanted-form">
        <h3 class="panel-card-title">Apply for an invite</h3>
        <label>
          ${escapeHtml(form.nameLabel)}
          <input type="text" name="name" required maxlength="80" placeholder="${escapeHtml(form.namePlaceholder)}" autocomplete="name" />
        </label>
        <label>
          ${escapeHtml(form.emailLabel)}
          <input type="email" name="email" required placeholder="you@email.com" autocomplete="email" />
        </label>
        <label>
          ${escapeHtml(form.phoneLabel)}
          <input type="tel" name="phone" required placeholder="(555) 555-5555" autocomplete="tel" />
        </label>
        <p class="cw-form-note">Tim reviews every application. If you're a fit, we'll email you to schedule the interview.</p>
        <p class="form-status cw-form-status" id="cw-form-status" hidden role="status"></p>
        <button type="submit" class="btn btn-primary">${escapeHtml(form.submitLabel)}</button>
      </form>

      <aside class="cw-aside">
        <div class="panel-card cw-seo-card">
          <h3 class="panel-card-title">Find us on Google</h3>
          <ul class="cw-seo-list">
            ${seoDiscovery.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
          <p class="cw-seo-keywords">
            <span class="keyword-tag">comedians wanted</span>
            <span class="keyword-tag">comedy podcast guest</span>
            <span class="keyword-tag">submit stand up comedy</span>
            <span class="keyword-tag">comedy interview</span>
          </p>
        </div>
      </aside>
    </div>
  `;

  root.querySelector("#comedians-wanted-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formEl = e.target;
    const fd = new FormData(formEl);
    const name = fd.get("name");
    const email = fd.get("email");
    const phone = fd.get("phone");
    const status = root.querySelector("#cw-form-status");

    if (!name || !email || !phone) {
      if (status) {
        status.textContent = "Please fill in name, email, and phone.";
        status.hidden = false;
        status.classList.add("form-status--error");
      }
      return;
    }

    try {
      submitComedianApplication({
        name,
        email,
        phone,
        source: location.pathname.includes("comedians-wanted") ? "comedians-wanted-page" : "homepage",
      });
    } catch {
      if (status) {
        status.textContent = "Please enter a valid name, email, and phone number.";
        status.hidden = false;
        status.classList.add("form-status--error");
      }
      return;
    }

    if (status) {
      status.textContent = form.successMessage;
      status.hidden = false;
      status.classList.remove("form-status--error");
    }
    formEl.reset();
    formEl.querySelector("button[type=submit]").disabled = true;
  });
}

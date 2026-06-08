import { FOUNDER_PLAYBOOK } from "../config.js";

const PROGRESS_KEY = "isoml:v1:founder-playbook";

function getProgress() {
  return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]"));
}

function saveProgress(done) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done]));
}

export function renderFounderPlaybook(containerId = "founder-playbook") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const done = getProgress();
  const total = FOUNDER_PLAYBOOK.steps.length;
  const completed = done.size;

  root.innerHTML = `
    <header class="playbook-header">
      <p class="section-eyebrow">Founder toolkit</p>
      <h1 class="playbook-title">${FOUNDER_PLAYBOOK.title}</h1>
      <p class="playbook-intro">${FOUNDER_PLAYBOOK.intro}</p>
      <div class="playbook-progress" role="status">
        <div class="playbook-progress-bar" style="width: ${Math.round((completed / total) * 100)}%"></div>
        <span>${completed} / ${total} complete</span>
      </div>
    </header>
    <ol class="playbook-steps">
      ${FOUNDER_PLAYBOOK.steps.map((step, i) => `
        <li class="playbook-step ${done.has(step.id) ? "playbook-step--done" : ""}" data-step="${step.id}">
          <label class="playbook-step-check">
            <input type="checkbox" ${done.has(step.id) ? "checked" : ""} aria-label="Mark complete: ${step.title}" />
            <span class="playbook-step-num">${i + 1}</span>
          </label>
          <div class="playbook-step-body">
            <h2>${step.title}</h2>
            <p class="playbook-prompt"><strong>Ask yourself:</strong> ${step.prompt}</p>
            <p class="playbook-followup"><strong>Next action:</strong> ${step.followUp}</p>
            ${step.action ? `<a class="btn btn-secondary btn-sm" href="${step.action.href}" target="_blank" rel="noopener">${step.action.label} →</a>` : ""}
          </div>
        </li>
      `).join("")}
    </ol>
    <footer class="playbook-footer">
      <p>Pre-orders logged locally: <code>isoml:v1:preorders</code> — export before backend ships.</p>
      <button type="button" class="btn btn-ghost btn-sm" id="playbook-reset">Reset checklist</button>
    </footer>
  `;

  root.querySelectorAll(".playbook-step input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const id = cb.closest(".playbook-step")?.dataset.step;
      const progress = getProgress();
      if (cb.checked) progress.add(id);
      else progress.delete(id);
      saveProgress(progress);
      renderFounderPlaybook(containerId);
    });
  });

  root.querySelector("#playbook-reset")?.addEventListener("click", () => {
    if (confirm("Reset monetization checklist progress?")) {
      localStorage.removeItem(PROGRESS_KEY);
      renderFounderPlaybook(containerId);
    }
  });
}

export function renderCheckoutIntentSummary(containerId = "checkout-intent-summary") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const preorders = JSON.parse(localStorage.getItem("isoml:v1:preorders") || "[]");
  const byTier = preorders.reduce((acc, p) => {
    acc[p.tierId] = (acc[p.tierId] || 0) + 1;
    return acc;
  }, {});

  root.innerHTML = `
    <div class="panel-card">
      <h3 class="panel-card-title">📊 Pre-order tracker</h3>
      <p class="playbook-intro">${preorders.length} local pre-order${preorders.length === 1 ? "" : "s"} · $${preorders.reduce((s, p) => s + (p.amount || 0), 0).toLocaleString()} pledged</p>
      <ul class="intent-summary">
        ${Object.entries(byTier).length
          ? Object.entries(byTier).map(([id, n]) => `<li><strong>${id}</strong>: ${n} backer${n === 1 ? "" : "s"}</li>`).join("")
          : "<li>No pre-orders yet — test the campaign flow on the homepage.</li>"}
      </ul>
    </div>
  `;
}

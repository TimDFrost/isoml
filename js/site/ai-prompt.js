import { SITE, HOW_TO_GUIDES } from "./config.js";

/** Shared instructions appended to every guide prompt */
const PROMPT_FOOTER = `Response format:
- Use clear headings and numbered steps
- Give concrete examples (sample jokes, lines, or actions) where useful
- Flag common beginner mistakes
- Keep advice practical for someone building a real stand-up career

Start by asking me 2–3 short clarifying questions about my experience and goals. Then provide tailored guidance.`;

/** Build a full copy-paste prompt for a single guide */
export function buildGuidePrompt(guide) {
  const url = `${SITE.url}/pages/how-to/${guide.slug}.html`;
  return `You are an expert stand-up comedy coach and working comedian with deep knowledge of both craft and the business of comedy.

I am working through the IsoML guide series "How to Be a Comedian."
Current guide: "${guide.title}" (${url})
Guide summary: ${guide.shortDescription}

My context (fill in before sending, or ask me):
- Experience level: [never performed / open-mic regular / paid gigs / touring]
- Location/market: [city or region]
- Primary goal: [e.g. first open mic, tighter 5 minutes, book paid shows, develop voice]
- Time available per week: [hours]

Focus this conversation on: ${guide.aiFocus}

Related topics for this guide: ${guide.keywords.join(", ")}

${PROMPT_FOOTER}`;
}

/** General prompt for the How to Be a Comedian hub page */
export function buildHubPrompt() {
  const guideList = HOW_TO_GUIDES.map(
    (g) => `- ${g.number}. ${g.title}: ${g.shortDescription}`
  ).join("\n");

  return `You are an expert stand-up comedy coach and career advisor for aspiring and working comedians.

I am exploring the IsoML "How to Be a Comedian" guide series (${SITE.url}/pages/how-to/).

The six guides are:
${guideList}

My context (fill in before sending, or ask me):
- Experience level: [never performed / open-mic regular / paid gigs / touring]
- Location/market: [city or region]
- Biggest challenge right now: [writing / stage / open mics / set structure / business / finding voice]
- Primary goal for the next 90 days: [specific outcome]

Help me:
1. Recommend which guide(s) to start with and in what order for my situation
2. Outline a realistic 90-day practice plan for becoming a better comedian
3. Identify the highest-leverage skills I should focus on first

${PROMPT_FOOTER}`;
}

export function renderAiPromptBlock(container, promptText, { label = "AI assistant prompt" } = {}) {
  if (!container || !promptText) return;

  const id = `ai-prompt-${Math.random().toString(36).slice(2, 9)}`;

  container.className = "guide-ai-prompt";
  container.innerHTML = `
    <div class="ai-prompt-header">
      <div>
        <p class="ai-prompt-eyebrow">Copy &amp; paste into any AI chat</p>
        <h2 class="ai-prompt-title">${label}</h2>
        <p class="ai-prompt-hint">Works with ChatGPT, Claude, Gemini, Copilot, and similar assistants. Edit the bracketed fields, then copy.</p>
      </div>
      <button type="button" class="btn btn-primary ai-prompt-copy" data-copy-target="${id}" aria-label="Copy AI prompt to clipboard">
        Copy prompt
      </button>
    </div>
    <textarea class="ai-prompt-text" id="${id}" rows="14" aria-label="AI chatbot prompt"></textarea>
    <p class="ai-prompt-status" role="status" aria-live="polite" hidden></p>
  `;

  const textarea = container.querySelector(".ai-prompt-text");
  textarea.value = promptText;
  const copyBtn = container.querySelector(".ai-prompt-copy");
  const status = container.querySelector(".ai-prompt-status");

  copyBtn.addEventListener("click", () => copyPrompt(textarea, copyBtn, status));

  textarea.addEventListener("focus", () => textarea.select());
}

async function copyPrompt(textarea, btn, status) {
  const text = textarea.value;

  try {
    await navigator.clipboard.writeText(text);
    showCopySuccess(btn, status);
  } catch {
    textarea.select();
    const ok = document.execCommand("copy");
    if (ok) showCopySuccess(btn, status);
    else if (status) {
      status.textContent = "Select the text above and copy manually (Ctrl+C / Cmd+C).";
      status.hidden = false;
    }
  }
}

function showCopySuccess(btn, status) {
  const original = btn.textContent;
  btn.textContent = "Copied!";
  btn.classList.add("ai-prompt-copy--success");
  if (status) {
    status.textContent = "Prompt copied — paste it into your AI chat.";
    status.hidden = false;
  }
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("ai-prompt-copy--success");
    if (status) status.hidden = true;
  }, 2500);
}

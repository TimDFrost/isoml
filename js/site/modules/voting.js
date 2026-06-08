import { GAMIFY, FAN_LOUNGE } from "../config.js";
import { api } from "../core/api.js";
import { Events, emit } from "../core/events.js";
import { getCurrentUser, requireUser } from "./auth.js";

/**
 * Gamified voting widget — mount on any targetType/targetId.
 * targetType: 'post' | 'comment' | 'guide'
 */
export function createVoteWidget(targetType, targetId) {
  const wrap = document.createElement("div");
  wrap.className = "vote-widget";
  wrap.dataset.targetType = targetType;
  wrap.dataset.targetId = targetId;

  const render = async () => {
    const user = getCurrentUser();
    const score = api.getScore(targetType, targetId);
    const userVote = user ? await api.getUserVote(user.id, targetType, targetId) : null;
    const isPost = targetType === "post";
    const labels = FAN_LOUNGE.competition?.voteLabels;
    const upLabel = isPost && labels ? labels.up : "Upvote";
    const downLabel = isPost && labels ? labels.down : "Downvote";
    const upIcon = isPost ? "😂" : "▲";
    const downIcon = isPost ? "✕" : "▼";

    wrap.innerHTML = `
      <button type="button" class="vote-btn vote-up vote-funny ${userVote?.value === 1 ? "active" : ""}" data-vote="1" aria-label="${upLabel}" title="${upLabel}${isPost ? "" : ` · +${GAMIFY.actions.CAST_VOTE.xp} XP`}">${upIcon}</button>
      <span class="vote-score ${score > 0 ? "positive" : score < 0 ? "negative" : ""}" aria-label="Funny score">${isPost && score > 0 ? `${score} 😂` : score}</span>
      <button type="button" class="vote-btn vote-down ${userVote?.value === -1 ? "active" : ""}" data-vote="-1" aria-label="${downLabel}" title="${downLabel}">${downIcon}</button>
    `;

    wrap.querySelectorAll("[data-vote]").forEach((btn) => {
      btn.addEventListener("click", () => handleVote(Number(btn.dataset.vote)));
    });
  };

  async function handleVote(value) {
    try {
      const user = requireUser();
      const result = await api.castVote({ userId: user.id, targetType, targetId, value });
      emit(Events.VOTE_CAST, {
        targetType,
        targetId,
        delta: result.delta,
        voterId: user.id,
        score: result.score,
      });
      await render();
      flashXp(wrap, result.delta > 0 ? GAMIFY.actions.CAST_VOTE.xp : 0);
    } catch {
      document.getElementById("auth-modal")?.showModal?.();
    }
  }

  render();
  return wrap;
}

function flashXp(el, amount) {
  if (!amount) return;
  const tip = document.createElement("span");
  tip.className = "vote-xp-flash";
  tip.textContent = `+${amount} XP`;
  el.appendChild(tip);
  setTimeout(() => tip.remove(), 1200);
}

/** Re-render all vote widgets after auth change */
export function initVotingGlobalRefresh() {
  import("../core/events.js").then(({ on, Events }) => {
    on(Events.USER_SIGNED_IN, refreshAllWidgets);
    on(Events.USER_SIGNED_OUT, refreshAllWidgets);
  });
}

function refreshAllWidgets() {
  document.querySelectorAll(".vote-widget").forEach((el) => {
    const w = createVoteWidget(el.dataset.targetType, el.dataset.targetId);
    el.replaceWith(w);
  });
}

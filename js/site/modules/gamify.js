import { GAMIFY } from "../config.js";
import { escapeHtml } from "../core/security.js";
import { api } from "../core/api.js";
import { storage, Collections } from "../core/storage.js";
import { Events, emit, on } from "../core/events.js";
import { getCurrentUser, refreshUser } from "./auth.js";

export function xpToLevel(xp) {
  let level = 1;
  for (const threshold of GAMIFY.levelThresholds) {
    if (xp >= threshold) level++;
    else break;
  }
  return Math.min(level, GAMIFY.levelThresholds.length + 1);
}

export function levelProgress(xp) {
  const level = xpToLevel(xp);
  const prev = GAMIFY.levelThresholds[level - 2] ?? 0;
  const next = GAMIFY.levelThresholds[level - 1] ?? prev + 500;
  const pct = next > prev ? Math.round(((xp - prev) / (next - prev)) * 100) : 100;
  return { level, xp, prev, next, pct };
}

export async function awardXp(userId, action, meta = {}) {
  const rule = GAMIFY.actions[action];
  if (!rule) return null;

  let amount = rule.xp;
  if (rule.cooldownKey) {
    const key = `xp-cooldown:${userId}:${rule.cooldownKey}`;
    const last = sessionStorage.getItem(key);
    const now = Date.now();
    if (last && now - Number(last) < (rule.cooldownMs ?? 86400000)) {
      amount = 0;
    } else {
      sessionStorage.setItem(key, String(now));
    }
  }

  if (!amount) return null;

  const user = await api.getUserById(userId);
  if (!user) return null;

  const prevLevel = user.level;
  const xp = user.xp + amount;
  const level = xpToLevel(xp);
  const badges = [...user.badges];

  for (const badge of GAMIFY.badges) {
    if (badges.includes(badge.id)) continue;
    if (badge.check({ xp, level, action, meta, user })) badges.push(badge.id);
  }

  await api.updateUser(userId, { xp, level, badges });
  emit(Events.XP_AWARDED, { userId, action, amount, xp, meta });

  if (level > prevLevel) emit(Events.LEVEL_UP, { userId, level, prevLevel });

  badges.filter((b) => !user.badges.includes(b)).forEach((badgeId) => {
    emit(Events.BADGE_EARNED, { userId, badgeId });
  });

  if (getCurrentUser()?.id === userId) await refreshUser();
  return { amount, xp, level };
}

async function resolveAuthorId(targetType, targetId) {
  if (targetType === "post") {
    return storage.findById(Collections.POSTS, targetId)?.userId ?? null;
  }
  if (targetType === "comment") {
    return storage.findById(Collections.COMMENTS, targetId)?.userId ?? null;
  }
  return null;
}

async function onVoteCast({ targetType, targetId, delta, voterId }) {
  if (delta > 0) {
    const authorId = await resolveAuthorId(targetType, targetId);
    if (authorId && authorId !== voterId) {
      await awardXp(authorId, "RECEIVED_UPVOTE", { targetType, targetId });
    }
  }
  await awardXp(voterId, "CAST_VOTE", { targetType, targetId });
}

export function initGamify() {
  on(Events.VOTE_CAST, onVoteCast);
  on(Events.POST_CREATED, ({ userId }) => awardXp(userId, "POST_CREATED"));
  on(Events.COMMENT_CREATED, ({ userId }) => awardXp(userId, "COMMENT_CREATED"));
}

export async function renderLeaderboard(containerId = "gamify-leaderboard") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const users = (await api.getUsers()).sort((a, b) => b.xp - a.xp).slice(0, GAMIFY.leaderboardSize);

  el.innerHTML = `
    <ol class="leaderboard-list">
      ${users.length ? users.map((u, i) => `
        <li class="leaderboard-row">
          <span class="leaderboard-rank">#${i + 1}</span>
          <span class="leaderboard-name">${escapeHtml(u.displayName)}</span>
          <span class="leaderboard-xp">${u.xp} XP</span>
          <span class="leaderboard-lvl">Lvl ${u.level}</span>
        </li>
      `).join("") : `<li class="leaderboard-empty">Be the first on the board — join and post!</li>`}
    </ol>
  `;
}

/**
 * API facade — methods match planned REST endpoints.
 * Replace internals with fetch() when backend ships; UI code stays the same.
 */

import { storage, Collections } from "./storage.js";
import { AUTH, FAN_LOUNGE, SECURITY } from "../config.js";
import {
  sanitizeText,
  validateEmail,
  validateUsername,
  validateRole,
  sanitizeExternalUrl,
} from "./security.js";
import { extractVideoId } from "./youtube.js";

function uid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** ISO week key e.g. 2026-W23 */
export function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const api = {
  // --- Users (future: POST /auth/register, GET /users/:id) ---
  async getUsers() {
    return storage.list(Collections.USERS);
  },

  async getUserById(id) {
    return storage.findById(Collections.USERS, id);
  },

  async createUser({ username, displayName, email, role = "fan" }) {
    const validUsername = validateUsername(username);
    if (!validUsername) throw new Error("Invalid username — use 3–24 letters, numbers, or underscores.");

    const existing = storage.list(Collections.USERS).find(
      (u) => u.username.toLowerCase() === validUsername
    );
    if (existing) throw new Error("Username already taken");

    const safeDisplay = sanitizeText(displayName || validUsername, { maxLength: 40, minLength: 1 }) || validUsername;
    const safeEmail = email ? validateEmail(email) : null;
    const safeRole = validateRole(role, AUTH.roles.map((r) => r.id));

    const user = {
      id: uid(),
      username: validUsername,
      displayName: safeDisplay,
      email: safeEmail,
      role: safeRole,
      xp: 0,
      level: 1,
      badges: [],
      createdAt: new Date().toISOString(),
    };
    storage.insert(Collections.USERS, user);
    return user;
  },

  async updateUser(id, patch) {
    return storage.update(Collections.USERS, id, patch);
  },

  // --- Session (future: JWT / httpOnly cookie) ---
  async getSession() {
    const session = storage.get(Collections.SESSION);
    if (session && !api.isSessionValid(session)) {
      storage.remove(Collections.SESSION);
      return null;
    }
    return session;
  },

  isSessionValid(session) {
    const ttl = AUTH.sessionTtlMs;
    if (!ttl || !session?.at) return Boolean(session?.userId);
    return Date.now() - new Date(session.at).getTime() < ttl;
  },

  async setSession(userId) {
    storage.set(Collections.SESSION, { userId, at: new Date().toISOString() });
    return storage.get(Collections.SESSION);
  },

  async clearSession() {
    storage.remove(Collections.SESSION);
  },

  // --- Fan posts (future: POST /posts, GET /posts) ---
  async getPosts() {
    return storage.list(Collections.POSTS);
  },

  async createPost({ userId, title, body, videoUrl }) {
    const safeTitle = sanitizeText(title, { maxLength: 120, minLength: 1 });
    const safeBody = sanitizeText(body, { maxLength: FAN_LOUNGE.maxCommentLength, minLength: 1 });
    if (!safeTitle || !safeBody) throw new Error("Title and comment are required.");

    let safeVideo = null;
    if (videoUrl) {
      const trimmed = String(videoUrl).trim();
      if (extractVideoId(trimmed)) {
        safeVideo = sanitizeExternalUrl(trimmed, {
          allowedHosts: SECURITY.allowedVideoHosts,
        }) || (extractVideoId(trimmed) ? trimmed : null);
      }
    }

    const post = {
      id: uid(),
      userId,
      title: safeTitle,
      body: safeBody,
      videoUrl: safeVideo,
      featured: false,
      featuredAt: null,
      youtubeStatus: "none",
      youtubeUrl: null,
      youtubeQueuedAt: null,
      youtubePublishedAt: null,
      weeklyWinnerWeek: null,
      createdAt: new Date().toISOString(),
    };
    storage.insert(Collections.POSTS, post);
    return post;
  },

  async getPostById(id) {
    return storage.findById(Collections.POSTS, id);
  },

  async updatePost(id, patch) {
    const safePatch = { ...patch };
    if ("youtubeUrl" in safePatch && safePatch.youtubeUrl) {
      const videoId = extractVideoId(safePatch.youtubeUrl);
      if (!videoId) throw new Error("Invalid YouTube URL.");
      safePatch.youtubeUrl =
        sanitizeExternalUrl(safePatch.youtubeUrl, { allowedHosts: SECURITY.allowedVideoHosts }) ||
        `https://www.youtube.com/watch?v=${videoId}`;
    }
    if ("title" in safePatch) {
      safePatch.title = sanitizeText(safePatch.title, { maxLength: 120, minLength: 1 }) || undefined;
    }
    if ("body" in safePatch) {
      safePatch.body = sanitizeText(safePatch.body, { maxLength: FAN_LOUNGE.maxCommentLength, minLength: 1 }) || undefined;
    }
    return storage.update(Collections.POSTS, id, safePatch);
  },

  getPostScore(postId) {
    return api.getScore("post", postId);
  },

  getPostsWithScores({ weekKey = null, limit = null } = {}) {
    let posts = storage.list(Collections.POSTS).map((p) => ({
      ...p,
      score: api.getScore("post", p.id),
    }));

    if (weekKey) {
      posts = posts.filter((p) => getWeekKey(new Date(p.createdAt)) === weekKey);
    }

    posts.sort((a, b) => {
      if (a.youtubeStatus === "published" && b.youtubeStatus !== "published") return -1;
      if (b.youtubeStatus === "published" && a.youtubeStatus !== "published") return 1;
      if (a.featured && !b.featured) return -1;
      if (b.featured && !a.featured) return 1;
      return b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt);
    });

    return limit ? posts.slice(0, limit) : posts;
  },

  async getCompetitionState() {
    return storage.get(Collections.FAN_COMPETITION, { weeklyWinners: {} });
  },

  async setWeeklyWinner(weekKey, postId) {
    const state = await api.getCompetitionState();
    state.weeklyWinners[weekKey] = { postId, crownedAt: new Date().toISOString() };
    storage.set(Collections.FAN_COMPETITION, state);
    return state;
  },

  // --- Comments (future: POST /posts/:id/comments) ---
  async getComments(postId) {
    return storage.filter(Collections.COMMENTS, (c) => c.postId === postId);
  },

  async createComment({ userId, postId, body }) {
    const safeBody = sanitizeText(body, { maxLength: FAN_LOUNGE.maxCommentLength, minLength: 1 });
    if (!safeBody) throw new Error("Comment cannot be empty.");

    const comment = {
      id: uid(),
      userId,
      postId,
      body: safeBody,
      createdAt: new Date().toISOString(),
    };
    storage.insert(Collections.COMMENTS, comment);
    return comment;
  },

  // --- Votes (future: POST /votes) ---
  async getVotes() {
    return storage.list(Collections.VOTES);
  },

  voteKey(userId, targetType, targetId) {
    return `${userId}:${targetType}:${targetId}`;
  },

  async getUserVote(userId, targetType, targetId) {
    return storage
      .list(Collections.VOTES)
      .find((v) => v.userId === userId && v.targetType === targetType && v.targetId === targetId);
  },

  async castVote({ userId, targetType, targetId, value }) {
    if (!["post", "comment", "guide"].includes(targetType)) {
      throw new Error("Invalid vote target.");
    }
    if (value !== 1 && value !== -1) {
      throw new Error("Invalid vote value.");
    }

    const votes = storage.list(Collections.VOTES);
    const key = api.voteKey(userId, targetType, targetId);
    const idx = votes.findIndex(
      (v) => api.voteKey(v.userId, v.targetType, v.targetId) === key
    );

    let delta = 0;
    let action = "cast";

    if (idx === -1) {
      votes.push({ userId, targetType, targetId, value, at: new Date().toISOString() });
      delta = value;
    } else {
      const prev = votes[idx].value;
      if (prev === value) {
        votes.splice(idx, 1);
        delta = -value;
        action = "removed";
      } else {
        votes[idx] = { ...votes[idx], value, at: new Date().toISOString() };
        delta = value - prev;
        action = "changed";
      }
    }

    storage.set(Collections.VOTES, votes);
    const score = api.getScore(targetType, targetId);
    return { delta, action, score, value: action === "removed" ? 0 : value };
  },

  getScore(targetType, targetId) {
    return storage
      .list(Collections.VOTES)
      .filter((v) => v.targetType === targetType && v.targetId === targetId)
      .reduce((sum, v) => sum + v.value, 0);
  },
};

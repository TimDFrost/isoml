import { FAN_LOUNGE } from "../config.js";
import { embedVideoUrl } from "../core/youtube.js";
import { escapeHtml, escapeAttr } from "../core/security.js";
import { api } from "../core/api.js";
import { Events, emit, on } from "../core/events.js";
import { getCurrentUser, requireUser } from "./auth.js";
import { createVoteWidget } from "./voting.js";
import { renderLeaderboard } from "./gamify.js";
import {
  refreshFanShowcase,
  renderFounderPostToolbar,
  bindFounderPostToolbar,
  renderPostBadges,
} from "./fan-showcase.js";

async function userName(userId) {
  const u = await api.getUserById(userId);
  return u?.displayName ?? "Anonymous";
}

export function initFanLounge() {
  mountPostForm();
  mountFeed();
  on(Events.POST_CREATED, () => { mountFeed(); renderLeaderboard(); refreshFanShowcase(); });
  on(Events.COMMENT_CREATED, mountFeed);
  on(Events.VOTE_CAST, () => { mountFeed(); refreshFanShowcase(); });
  on(Events.USER_SIGNED_IN, () => { mountPostForm(); refreshFanShowcase(); });
  on(Events.USER_SIGNED_OUT, () => { mountPostForm(); refreshFanShowcase(); });
  on(Events.FEED_UPDATED, () => { mountFeed(); refreshFanShowcase(); });
  on(Events.POST_FEATURED, () => { mountFeed(); refreshFanShowcase(); });
  on(Events.POST_YOUTUBE_QUEUED, () => { mountFeed(); refreshFanShowcase(); });
  on(Events.POST_YOUTUBE_PUBLISHED, () => { mountFeed(); refreshFanShowcase(); });
  on(Events.WEEKLY_FUNNIEST_CROWNED, () => { mountFeed(); refreshFanShowcase(); });
}

function mountPostForm() {
  const formWrap = document.getElementById("fan-post-form-wrap");
  if (!formWrap) return;

  const user = getCurrentUser();
  if (!user) {
    formWrap.innerHTML = `
      <p class="fan-guest-notice">Sign in to post videos and comments. <button type="button" class="btn btn-primary btn-sm" data-auth-open>Join free</button></p>
    `;
    formWrap.querySelector("[data-auth-open]")?.addEventListener("click", () => {
      document.getElementById("auth-modal")?.showModal?.();
    });
    return;
  }

  formWrap.innerHTML = `
    <form class="fan-post-form" id="fan-post-form">
      <h3 class="fan-form-title">Share your funniest clip</h3>
      <label>Title <input name="title" required maxlength="120" placeholder="What's this clip about?" /></label>
      <label>YouTube clip URL <input name="videoUrl" type="url" placeholder="https://youtube.com/watch?v=…" /></label>
      <label>Why it's funny <textarea name="body" required rows="3" maxlength="${FAN_LOUNGE.maxCommentLength}" placeholder="Tell us why this kills…"></textarea></label>
      <p class="fan-form-hint">Top 😂 votes each week qualify for featuring on <a href="${FAN_LOUNGE.youtube.url}" target="_blank" rel="noopener noreferrer">${FAN_LOUNGE.youtube.handle}</a>.</p>
      <button type="submit" class="btn btn-primary">Post (+${FAN_LOUNGE.xpPreview.post} XP)</button>
      <p class="fan-form-status" id="fan-form-status" hidden role="status"></p>
    </form>
  `;

  formWrap.querySelector("#fan-post-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = formWrap.querySelector("#fan-form-status");
    const fd = new FormData(e.target);
    try {
      const u = requireUser();
      const post = await api.createPost({
        userId: u.id,
        title: fd.get("title"),
        body: fd.get("body"),
        videoUrl: fd.get("videoUrl") || null,
      });
      emit(Events.POST_CREATED, { post, userId: u.id });
      emit(Events.FEED_UPDATED, {});
      e.target.reset();
      if (status) {
        status.textContent = "Posted! Check the feed below.";
        status.hidden = false;
        setTimeout(() => { status.hidden = true; }, 3000);
      }
    } catch (err) {
      if (status) {
        status.textContent = err.message;
        status.hidden = false;
      }
    }
  });
}

async function mountFeed() {
  const feed = document.getElementById("fan-feed");
  if (!feed) return;

  const posts = api.getPostsWithScores();
  const users = await api.getUsers();
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  if (!posts.length) {
    feed.innerHTML = `<p class="fan-feed-empty">No clips yet — post your funniest fan content and rally the votes!</p>`;
    return;
  }

  feed.innerHTML = "";
  for (const post of posts) {
    feed.appendChild(await renderPostCard(post, userMap));
  }
}

async function renderPostCard(post, userMap) {
  const card = document.createElement("article");
  card.className = "fan-post-card";
  if (post.featured) card.classList.add("fan-post-card--featured");
  if (post.youtubeStatus === "published") card.classList.add("fan-post-card--youtube");
  card.dataset.postId = post.id;

  const author = userMap[post.userId];
  const embed = embedVideoUrl(post.videoUrl);
  const comments = await api.getComments(post.id);
  const score = post.score ?? api.getPostScore(post.id);

  card.innerHTML = `
    <header class="fan-post-header">
      <div>
        ${renderPostBadges(post)}
        <h3 class="fan-post-title">${escapeHtml(post.title)}</h3>
        <p class="fan-post-meta">by <strong>${escapeHtml(author?.displayName ?? "Fan")}</strong> · ${formatDate(post.createdAt)} · <span class="fan-post-score">${score} 😂</span></p>
      </div>
      <div class="fan-post-vote" data-vote-mount></div>
    </header>
    ${embed ? `<div class="fan-post-video"><iframe src="${escapeAttr(embed)}" title="${escapeAttr(post.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>` : ""}
    <p class="fan-post-body">${escapeHtml(post.body)}</p>
    ${renderFounderPostToolbar(post)}
    <section class="fan-comments" aria-label="Comments">
      <h4 class="fan-comments-heading">${comments.length} comment${comments.length === 1 ? "" : "s"}</h4>
      <div class="fan-comments-list" data-comments></div>
      <form class="fan-comment-form" data-comment-form>
        <input name="body" required maxlength="${FAN_LOUNGE.maxCommentLength}" placeholder="Add a comment…" aria-label="Comment text" />
        <button type="submit" class="btn btn-secondary btn-sm">Reply</button>
      </form>
    </section>
  `;

  card.querySelector("[data-vote-mount]").appendChild(createVoteWidget("post", post.id));
  bindFounderPostToolbar(card, post.id);

  const listEl = card.querySelector("[data-comments]");
  for (const c of comments) {
    listEl.appendChild(await renderComment(c, userMap));
  }

  card.querySelector("[data-comment-form]")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const u = requireUser();
      const fd = new FormData(e.target);
      const comment = await api.createComment({
        userId: u.id,
        postId: post.id,
        body: fd.get("body"),
      });
      emit(Events.COMMENT_CREATED, { comment, userId: u.id });
      listEl.appendChild(await renderComment(comment, userMap));
      e.target.reset();
      card.querySelector(".fan-comments-heading").textContent =
        `${comments.length + 1} comments`;
    } catch {
      document.getElementById("auth-modal")?.showModal?.();
    }
  });

  return card;
}

async function renderComment(comment, userMap) {
  const el = document.createElement("div");
  el.className = "fan-comment";
  const author = userMap[comment.userId];
  el.innerHTML = `
    <div class="fan-comment-body">
      <strong>${escapeHtml(author?.displayName ?? "Fan")}</strong>
      <span class="fan-comment-date">${formatDate(comment.createdAt)}</span>
      <p>${escapeHtml(comment.body)}</p>
    </div>
    <div class="fan-comment-vote" data-vote-mount></div>
  `;
  el.querySelector("[data-vote-mount]").appendChild(createVoteWidget("comment", comment.id));
  return el;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

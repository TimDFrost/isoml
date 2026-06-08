import { FAN_LOUNGE, GAMIFY } from "../config.js";
import { api, getWeekKey } from "../core/api.js";
import { Events, emit } from "../core/events.js";
import { getCurrentUser, isFounder } from "./auth.js";
import { awardXp } from "./gamify.js";
import { embedVideoUrl, extractVideoId, watchUrl } from "../core/youtube.js";
import { escapeHtml, sanitizeExternalUrl } from "../core/security.js";

export async function featurePost(postId) {
  const post = await api.updatePost(postId, {
    featured: true,
    featuredAt: new Date().toISOString(),
  });
  if (post) {
    await awardXp(post.userId, "POST_FEATURED", { postId });
    emit(Events.POST_FEATURED, { post });
  }
  return post;
}

export async function queuePostForYouTube(postId) {
  const post = await api.updatePost(postId, {
    featured: true,
    featuredAt: new Date().toISOString(),
    youtubeStatus: "queued",
    youtubeQueuedAt: new Date().toISOString(),
  });
  if (post) {
    await awardXp(post.userId, "YOUTUBE_QUEUED", { postId });
    emit(Events.POST_YOUTUBE_QUEUED, { post });
  }
  return post;
}

export async function publishPostToYouTube(postId, youtubeUrl) {
  const post = await api.updatePost(postId, {
    featured: true,
    youtubeStatus: "published",
    youtubeUrl: youtubeUrl || null,
    youtubePublishedAt: new Date().toISOString(),
  });
  if (post) {
    await awardXp(post.userId, "YOUTUBE_PUBLISHED", { postId });
    emit(Events.POST_YOUTUBE_PUBLISHED, { post });
  }
  return post;
}

export async function crownWeeklyFunniest(postId) {
  const weekKey = getWeekKey();
  const post = await api.updatePost(postId, {
    weeklyWinnerWeek: weekKey,
    featured: true,
    featuredAt: new Date().toISOString(),
  });
  if (post) {
    await api.setWeeklyWinner(weekKey, postId);
    await awardXp(post.userId, "WEEKLY_FUNNIEST", { postId, weekKey });
    emit(Events.WEEKLY_FUNNIEST_CROWNED, { post, weekKey });
  }
  return post;
}

export function initFanShowcase() {
  refreshFanShowcase();
}

export async function refreshFanShowcase() {
  await Promise.all([
    renderYouTubeFeatured(),
    renderFunniestBoard(),
    renderFounderStudio(),
  ]);
}

async function renderYouTubeFeatured(containerId = "fan-youtube-featured") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const { youtube } = FAN_LOUNGE;
  const posts = api.getPostsWithScores().filter((p) => p.youtubeStatus === "published");
  const users = await api.getUsers();
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  if (!posts.length) {
    root.innerHTML = `
      <div class="fan-youtube-featured-empty panel-card">
        <p class="section-eyebrow">${escapeHtml(youtube.featuredHeadline)}</p>
        <h3 class="fan-youtube-featured-title">${escapeHtml(youtube.featuredTagline)}</h3>
        <p class="fan-youtube-featured-lead">
          Post a clip, earn 😂 votes, and top fan content gets promoted to
          <a href="${youtube.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(youtube.handle)}</a>.
        </p>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <header class="fan-youtube-featured-header">
      <p class="section-eyebrow">${escapeHtml(youtube.featuredHeadline)}</p>
      <h3 class="fan-youtube-featured-title">
        <a href="${youtube.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(youtube.handle)}</a>
      </h3>
    </header>
    <div class="fan-youtube-featured-grid">
      ${posts
        .map((post) => {
          const author = userMap[post.userId];
          const embedSrc = embedVideoUrl(post.youtubeUrl || post.videoUrl);
          const ytLink =
            watchUrl(extractVideoId(post.youtubeUrl || post.videoUrl)) || youtube.url;
          return `
            <article class="fan-youtube-card panel-card">
              <div class="fan-youtube-card-badge">▶ YouTube Featured</div>
              ${embedSrc ? `<div class="fan-youtube-card-video"><iframe src="${escapeHtml(embedSrc)}" title="${escapeHtml(post.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>` : ""}
              <div class="fan-youtube-card-body">
                <h4>${escapeHtml(post.title)}</h4>
                <p class="fan-youtube-card-meta">by <strong>${escapeHtml(author?.displayName ?? "Fan")}</strong> · ${post.score} 😂 votes</p>
                <p class="fan-youtube-card-desc">${escapeHtml(post.body)}</p>
                <a class="btn btn-secondary btn-sm" href="${escapeHtml(ytLink)}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

async function renderFunniestBoard(containerId = "fan-funniest-board") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const weekKey = getWeekKey();
  const { competition } = FAN_LOUNGE;
  const state = await api.getCompetitionState();
  const crowned = state.weeklyWinners?.[weekKey];
  const posts = api.getPostsWithScores({ weekKey, limit: GAMIFY.funniestBoardSize });
  const users = await api.getUsers();
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const crownedPost = crowned?.postId ? await api.getPostById(crowned.postId) : null;

  root.innerHTML = `
    <div class="panel-card fan-funniest-panel">
      <h3 class="panel-card-title">😂 ${escapeHtml(competition.headline)}</h3>
      <p class="fan-funniest-tagline">${escapeHtml(competition.tagline)}</p>
      <p class="fan-funniest-week">Week ${escapeHtml(weekKey)}</p>
      ${
        crownedPost
          ? `<div class="fan-week-crown" role="status">
              <span class="fan-week-crown-icon" aria-hidden="true">👑</span>
              <div>
                <strong>Crowned:</strong> ${escapeHtml(crownedPost.title)}
                <span class="fan-week-crown-meta"> · ${escapeHtml(userMap[crownedPost.userId]?.displayName ?? "Fan")}</span>
              </div>
            </div>`
          : ""
      }
      ${
        posts.length
          ? `<ol class="fan-funniest-list">
              ${posts
                .map((post, i) => {
                  const author = userMap[post.userId];
                  const qualified = post.score >= competition.minVotesToQualify;
                  return `
                    <li class="fan-funniest-row${post.id === crowned?.postId ? " fan-funniest-row--crowned" : ""}">
                      <span class="fan-funniest-rank">#${i + 1}</span>
                      <div class="fan-funniest-info">
                        <span class="fan-funniest-name">${escapeHtml(post.title)}</span>
                        <span class="fan-funniest-author">${escapeHtml(author?.displayName ?? "Fan")}</span>
                      </div>
                      <span class="fan-funniest-score" title="Funny votes">${post.score} 😂</span>
                      ${qualified ? `<span class="fan-funniest-qualified">In the running</span>` : ""}
                    </li>
                  `;
                })
                .join("")}
            </ol>`
          : `<p class="fan-funniest-empty">No clips this week yet — post one and rally the crowd!</p>`
      }
      <p class="fan-funniest-note">Top score + ${competition.minVotesToQualify}+ 😂 votes qualifies for YouTube featuring.</p>
    </div>
  `;
}

async function renderFounderStudio(containerId = "founder-youtube-studio") {
  const root = document.getElementById(containerId);
  if (!root) return;

  const user = getCurrentUser();
  if (!isFounder(user)) {
    root.innerHTML = "";
    root.hidden = true;
    return;
  }

  root.hidden = false;
  const { youtube } = FAN_LOUNGE;
  const weekKey = getWeekKey();
  const queued = api.getPostsWithScores().filter((p) => p.youtubeStatus === "queued");
  const candidates = api.getPostsWithScores({ weekKey, limit: 10 });
  const users = await api.getUsers();
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  root.innerHTML = `
    <div class="panel-card founder-studio-panel">
      <h3 class="panel-card-title">🎬 YouTube Studio · ${escapeHtml(youtube.handle)}</h3>
      <p class="founder-studio-lead">Feature fan clips on site and queue them for your channel. Founder-only controls.</p>

      <section class="founder-studio-section">
        <h4>YouTube upload queue (${queued.length})</h4>
        ${
          queued.length
            ? `<ul class="founder-queue-list">
                ${queued
                  .map((post) => {
                    const author = userMap[post.userId];
                    const source = post.videoUrl
                      ? sanitizeExternalUrl(post.videoUrl, {
                          allowedHosts: ["www.youtube.com", "youtube.com", "youtu.be"],
                        })
                      : "";
                    return `
                      <li class="founder-queue-item" data-post-id="${post.id}">
                        <div class="founder-queue-main">
                          <strong>${escapeHtml(post.title)}</strong>
                          <span>by ${escapeHtml(author?.displayName ?? "Fan")} · ${post.score} 😂</span>
                        </div>
                        <div class="founder-queue-actions">
                          ${source ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">Source clip</a>` : ""}
                          <a class="btn btn-secondary btn-sm" href="${youtube.uploadUrl}" target="_blank" rel="noopener noreferrer">Upload to YouTube</a>
                          <button type="button" class="btn btn-primary btn-sm" data-publish-yt="${post.id}">Mark published</button>
                        </div>
                      </li>
                    `;
                  })
                  .join("")}
              </ul>`
            : `<p class="founder-studio-empty">Nothing queued — promote a clip from the feed below.</p>`
        }
      </section>

      <section class="founder-studio-section">
        <h4>This week's candidates</h4>
        <ul class="founder-candidate-list">
          ${candidates
            .map((post) => {
              const author = userMap[post.userId];
              return `
                <li class="founder-candidate-item">
                  <span><strong>${escapeHtml(post.title)}</strong> · ${post.score} 😂 · ${escapeHtml(author?.displayName ?? "Fan")}</span>
                  <div class="founder-candidate-actions">
                    <button type="button" class="btn btn-secondary btn-sm" data-feature-post="${post.id}">Feature on site</button>
                    <button type="button" class="btn btn-secondary btn-sm" data-queue-yt="${post.id}">Queue for YouTube</button>
                    <button type="button" class="btn btn-primary btn-sm" data-crown-week="${post.id}">Crown funniest</button>
                  </div>
                </li>
              `;
            })
            .join("")}
        </ul>
      </section>
    </div>
  `;

  bindFounderStudioActions(root);
}

function bindFounderStudioActions(root) {
  root.querySelectorAll("[data-feature-post]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await featurePost(btn.dataset.featurePost);
      await refreshFanShowcase();
      emit(Events.FEED_UPDATED, {});
    });
  });

  root.querySelectorAll("[data-queue-yt]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await queuePostForYouTube(btn.dataset.queueYt);
      await refreshFanShowcase();
      emit(Events.FEED_UPDATED, {});
    });
  });

  root.querySelectorAll("[data-crown-week]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await crownWeeklyFunniest(btn.dataset.crownWeek);
      await refreshFanShowcase();
      emit(Events.FEED_UPDATED, {});
    });
  });

  root.querySelectorAll("[data-publish-yt]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.dataset.publishYt;
      const post = await api.getPostById(postId);
      const defaultUrl = post?.videoUrl || "";
      const url = prompt(
        "Paste the published YouTube URL on @IsoMassiveLaughs:",
        defaultUrl
      );
      if (url === null) return;
      if (url && !extractVideoId(url)) {
        alert("Please paste a valid YouTube URL.");
        return;
      }
      await publishPostToYouTube(postId, url || null);
      await refreshFanShowcase();
      emit(Events.FEED_UPDATED, {});
    });
  });
}

/** Founder controls on individual post cards */
export function renderFounderPostToolbar(post) {
  if (!isFounder(getCurrentUser())) return "";

  return `
    <div class="fan-founder-toolbar" data-founder-toolbar="${post.id}">
      <span class="fan-founder-label">Founder:</span>
      <button type="button" class="btn btn-secondary btn-sm" data-feature-post="${post.id}">Feature</button>
      <button type="button" class="btn btn-secondary btn-sm" data-queue-yt="${post.id}">Queue YT</button>
      <button type="button" class="btn btn-primary btn-sm" data-crown-week="${post.id}">Crown</button>
      ${
        post.youtubeStatus === "queued"
          ? `<button type="button" class="btn btn-primary btn-sm" data-publish-yt="${post.id}">Mark on YouTube</button>`
          : ""
      }
    </div>
  `;
}

export function bindFounderPostToolbar(card, postId) {
  const toolbar = card.querySelector(`[data-founder-toolbar="${postId}"]`);
  if (!toolbar) return;

  toolbar.querySelector("[data-feature-post]")?.addEventListener("click", async () => {
    await featurePost(postId);
    await refreshFanShowcase();
    emit(Events.FEED_UPDATED, {});
  });
  toolbar.querySelector("[data-queue-yt]")?.addEventListener("click", async () => {
    await queuePostForYouTube(postId);
    await refreshFanShowcase();
    emit(Events.FEED_UPDATED, {});
  });
  toolbar.querySelector("[data-crown-week]")?.addEventListener("click", async () => {
    await crownWeeklyFunniest(postId);
    await refreshFanShowcase();
    emit(Events.FEED_UPDATED, {});
  });
  toolbar.querySelector("[data-publish-yt]")?.addEventListener("click", async () => {
    const post = await api.getPostById(postId);
    const url = prompt("Paste the published YouTube URL:", post?.videoUrl || "");
    if (url === null) return;
    await publishPostToYouTube(postId, url || null);
    await refreshFanShowcase();
    emit(Events.FEED_UPDATED, {});
  });
}

export function renderPostBadges(post) {
  const badges = [];
  if (post.weeklyWinnerWeek === getWeekKey()) badges.push('<span class="fan-badge fan-badge--crown">👑 Funniest this week</span>');
  else if (post.weeklyWinnerWeek) badges.push('<span class="fan-badge fan-badge--crown">👑 Weekly winner</span>');
  if (post.youtubeStatus === "published") badges.push('<span class="fan-badge fan-badge--youtube">▶ On @IsoMassiveLaughs</span>');
  else if (post.youtubeStatus === "queued") badges.push('<span class="fan-badge fan-badge--queued">⏳ YouTube queue</span>');
  if (post.featured) badges.push('<span class="fan-badge fan-badge--featured">★ Featured</span>');
  const score = api.getPostScore(post.id);
  if (score >= FAN_LOUNGE.competition.minVotesToQualify) {
    badges.push(`<span class="fan-badge fan-badge--hot">${score} 😂</span>`);
  }
  return badges.length ? `<div class="fan-post-badges">${badges.join("")}</div>` : "";
}

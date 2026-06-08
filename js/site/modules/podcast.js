import { PODCAST } from "../config.js";
import {
  channelUploadsPlaylistId,
  embedPlaylistUrl,
  embedVideoUrl,
  extractVideoId,
  renderEmbedIframe,
  watchUrl,
} from "../core/youtube.js";

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFeaturedEmbedSrc() {
  const pinned = PODCAST.episodes?.filter((ep) => ep.id);
  const featured = pinned?.find((ep) => ep.featured) ?? pinned?.[0];

  if (PODCAST.embedMode === "featured" && featured) {
    return embedVideoUrl(featured.id);
  }

  if (pinned?.length && PODCAST.embedMode !== "playlist") {
    return embedVideoUrl(pinned[0].id);
  }

  const playlistId = channelUploadsPlaylistId(PODCAST.youtube?.channelId);
  return embedPlaylistUrl(playlistId);
}

function renderEpisodeCard(ep) {
  const videoId = extractVideoId(ep.id);
  if (!videoId) return "";

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const href = watchUrl(videoId);

  return `
    <article class="podcast-episode-card">
      <a class="podcast-episode-thumb" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeHtml(ep.title || "episode")} on YouTube">
        <img src="${thumb}" alt="" loading="lazy" width="480" height="360" />
        <span class="podcast-episode-play" aria-hidden="true">▶</span>
      </a>
      <div class="podcast-episode-meta">
        <h3 class="podcast-episode-title">
          <a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(ep.title || "Watch episode")}</a>
        </h3>
        ${ep.date ? `<time class="podcast-episode-date" datetime="${escapeHtml(ep.date)}">${escapeHtml(ep.date)}</time>` : ""}
        <button type="button" class="btn btn-secondary btn-sm podcast-episode-embed-btn" data-video-id="${videoId}">
          Play here
        </button>
      </div>
    </article>
  `;
}

export function renderPodcastSection() {
  const contentRoot = document.getElementById("podcast-content");
  const embedRoot = document.getElementById("podcast-embed-featured");
  const episodesRoot = document.getElementById("podcast-episodes");
  if (!contentRoot) return;

  const { youtube } = PODCAST;
  const highlights = PODCAST.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("");
  const platforms = PODCAST.platforms
    .map((p) => {
      const soon = p.comingSoon ? ' aria-disabled="true"' : "";
      const href = p.comingSoon ? "#" : p.href;
      return `<a class="platform-chip${p.comingSoon ? " platform-chip--soon" : ""}" href="${href}" ${p.href.startsWith("http") && !p.comingSoon ? 'target="_blank" rel="noopener"' : ""}${soon}>${escapeHtml(p.name)}${p.comingSoon ? " · soon" : ""}</a>`;
    })
    .join("");

  contentRoot.innerHTML = `
    <p class="section-eyebrow">${escapeHtml(PODCAST.eyebrow)}</p>
    <h2 class="section-title" id="podcast-heading">${escapeHtml(PODCAST.title)}</h2>
    <p class="section-lead">${escapeHtml(PODCAST.description)}</p>
    <ul class="podcast-highlights">${highlights}</ul>
    <div class="podcast-actions">
      <a class="btn btn-primary" href="${PODCAST.cta.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(PODCAST.cta.label)}</a>
      <a class="btn btn-secondary" href="${youtube.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(youtube.subscribeLabel)}</a>
      <div class="platform-list">${platforms}</div>
    </div>
    <p class="podcast-channel-handle">
      <a href="${youtube.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(youtube.handle)}</a>
    </p>
  `;

  if (embedRoot) {
    const src = getFeaturedEmbedSrc();
    embedRoot.innerHTML = renderEmbedIframe(
      src,
      `IsoML podcast on YouTube — ${youtube.handle}`,
      { className: "podcast-embed" }
    );
    embedRoot.dataset.embedSrc = src || "";
  }

  if (episodesRoot) {
    const episodes = (PODCAST.episodes || []).slice(0, PODCAST.maxEpisodes || 6);

    if (episodes.length) {
      episodesRoot.innerHTML = `
        <header class="podcast-episodes-header">
          <h3 class="podcast-episodes-title">Recent episodes</h3>
        </header>
        <div class="podcast-episodes-grid">${episodes.map(renderEpisodeCard).join("")}</div>
      `;

      episodesRoot.querySelectorAll("[data-video-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const videoId = btn.dataset.videoId;
          if (!embedRoot || !videoId) return;
          const src = embedVideoUrl(videoId);
          embedRoot.innerHTML = renderEmbedIframe(src, `IsoML podcast episode`, {
            className: "podcast-embed",
            lazy: false,
          });
          embedRoot.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      });
    } else {
      episodesRoot.innerHTML = `
        <p class="podcast-episodes-empty">
          New video episodes drop on
          <a href="${youtube.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(youtube.handle)}</a>
          — subscribe and the player above updates automatically.
        </p>
      `;
    }
  }
}

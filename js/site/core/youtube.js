/** YouTube URL parsing and privacy-friendly embed URLs */

const VIDEO_ID_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractVideoId(urlOrId) {
  if (!urlOrId) return null;
  const raw = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  const m = raw.match(VIDEO_ID_RE);
  return m?.[1] ?? null;
}

export function channelUploadsPlaylistId(channelId) {
  if (!channelId?.startsWith("UC")) return null;
  return `UU${channelId.slice(2)}`;
}

export function embedVideoUrl(videoId, { autoplay = false, rel = 0 } = {}) {
  const id = extractVideoId(videoId);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: String(rel),
    modestbranding: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

export function embedPlaylistUrl(playlistId, { autoplay = false } = {}) {
  if (!playlistId) return null;
  const params = new URLSearchParams({
    list: playlistId,
    rel: "0",
    modestbranding: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/videoseries?${params}`;
}

export function watchUrl(videoId) {
  const id = extractVideoId(videoId);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

import { escapeAttr } from "./security.js";

export function renderEmbedIframe(src, title, { lazy = true, className = "youtube-embed" } = {}) {
  if (!src) return "";
  const safeSrc = escapeAttr(src);
  const safeTitle = escapeAttr(title || "YouTube video");
  return `
    <div class="${className}-wrap">
      <iframe
        class="${className}"
        src="${safeSrc}"
        title="${safeTitle}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="${lazy ? "lazy" : "eager"}"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  `;
}

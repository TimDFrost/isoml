import {
  SYNDICATION_SLOTS,
  getState,
  getStation,
  getContent,
  addSyndicationPoints,
  assignSyndicationSlot,
  recordSyndication,
} from "./state.js";
import { OFFICIAL_YT_CHANNEL } from "./config.js";

export { OFFICIAL_YT_CHANNEL };

export function evaluateSyndication() {
  const { stations, syndicationAssignments, broadcastDay } = getState();
  const results = [];

  SYNDICATION_SLOTS.forEach((slot) => {
    const assignedId = syndicationAssignments[slot.id];
    let bestStation = null;
    let bestRating = 0;

    stations.forEach((station) => {
      const hh = station.ratings.hh || 0;
      if (hh >= slot.minRating && hh > bestRating) {
        bestStation = station;
        bestRating = hh;
      }
    });

    const winner = assignedId ? getStation(assignedId) : bestStation;
    const eligible = winner && (winner.ratings.hh || 0) >= slot.minRating;

    if (eligible && !assignedId) {
      assignSyndicationSlot(slot.id, winner.id);
      const pts = Math.round(winner.ratings.hh * 25);
      addSyndicationPoints(pts);
      winner.syndicationWins += 1;
      recordSyndication({
        day: broadcastDay,
        slot: slot.label,
        station: winner.callLetters,
        rating: winner.ratings.hh,
        points: pts,
      });
      results.push({ slot, winner, points: pts, status: "won" });
    } else if (assignedId) {
      const s = getStation(assignedId);
      results.push({ slot, winner: s, status: "held" });
    } else {
      results.push({ slot, winner: null, status: "open" });
    }
  });

  return results;
}

export function getLeaderboard() {
  const { stations } = getState();
  return [...stations]
    .sort((a, b) => {
      const scoreA = (a.ratings.hh || 0) * 10 + a.syndicationWins * 50;
      const scoreB = (b.ratings.hh || 0) * 10 + b.syndicationWins * 50;
      return scoreB - scoreA;
    })
    .map((s, i) => ({
      rank: i + 1,
      callLetters: s.callLetters,
      name: s.name,
      hh: s.ratings.hh || 0,
      syndicationWins: s.syndicationWins,
      points: Math.round((s.ratings.hh || 0) * 10 + s.syndicationWins * 50),
    }));
}

export function getNowPlayingContent(station) {
  const { currentHour } = getState();
  const contentId = station.schedule[currentHour];
  if (!contentId) return null;
  return getContent(contentId);
}

export function extractYouTubeId(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  return null;
}

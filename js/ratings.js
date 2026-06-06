import { PRIME_HOURS, getState, getContent, recordRatings } from "./state.js";

const GENRE_LIST = ["entertainment", "news", "sports", "kids", "documentary", "comedy", "drama", "music", "sci-fi"];

const GENRE_FORMAT_MATCH = {
  news: ["news", "documentary"],
  sports: ["sports"],
  kids: ["kids", "entertainment"],
  movies: ["drama", "comedy", "entertainment"],
  music: ["music"],
  "sci-fi": ["sci-fi", "drama"],
  general: GENRE_LIST,
};

function formatMatch(format, genre) {
  const allowed = GENRE_FORMAT_MATCH[format] || GENRE_LIST;
  return allowed.includes(genre);
}

function slotRating(station, hour) {
  const contentId = station.schedule[hour];
  if (!contentId) return { rating: 0.3, reason: "dead-air" };

  const content = getContent(contentId);
  if (!content) return { rating: 0.5, reason: "missing" };

  let base = content.engagement / 10;
  if (content.type === "original") {
    base = (content.quality * 0.6 + content.engagement * 0.4) / 10;
  }

  const formatBonus = formatMatch(station.format, content.genre) ? 1.25 : 0.85;
  const primeBonus = PRIME_HOURS.has(hour) ? 1.4 : 1.0;
  const durationPenalty = content.duration > 60 ? 0.9 : 1.0;

  const rating = base * formatBonus * primeBonus * durationPenalty;
  return { rating: Math.min(rating, 15), content };
}

export function runRatingsSweep() {
  const { stations, broadcastDay } = getState();
  const dayRatings = {};
  const totalMarket = 100;

  const rawScores = stations.map((station) => {
    let sum = 0;
    let filled = 0;
    for (let h = 0; h < 24; h++) {
      const { rating } = slotRating(station, h);
      sum += rating;
      if (station.schedule[h]) filled++;
    }
    const fillRate = filled / 24;
    const avg = filled > 0 ? sum / filled : 0.5;
    const scheduleBonus = fillRate >= 0.9 ? 1.15 : fillRate >= 0.7 ? 1.0 : 0.75;
    return { station, score: avg * scheduleBonus * (0.5 + fillRate * 0.5) };
  });

  const totalScore = rawScores.reduce((a, b) => a + b.score, 0) || 1;

  rawScores.forEach(({ station, score }) => {
    const share = (score / totalScore) * 100;
    const hh = (score / 8) * (0.8 + Math.random() * 0.4);
    const demo1849 = hh * (0.7 + Math.random() * 0.5);
    const demo2554 = hh * (0.85 + Math.random() * 0.3);
    const viewers = Math.round(hh * 1150 + Math.random() * 200);

    const prev = station.ratings.hh || 0;
    let trend = "flat";
    if (hh > prev * 1.05) trend = "up";
    else if (hh < prev * 0.95) trend = "down";

    station.ratings = {
      hh: round1(hh),
      share: round1(share),
      demo1849: round1(demo1849),
      demo2554: round1(demo2554),
      viewers,
    };
    station.trend = trend;
    dayRatings[station.id] = { ...station.ratings, trend };
  });

  recordRatings(dayRatings);
  return dayRatings;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

export function getCompetitionFactor(stationId) {
  const { stations, lastRatings } = getState();
  const all = Object.values(lastRatings);
  if (all.length < 2) return 1;
  const mine = lastRatings[stationId];
  if (!mine) return 1;
  const maxShare = Math.max(...all.map((r) => r.share || 0));
  return mine.share >= maxShare * 0.9 ? 1.2 : 1;
}

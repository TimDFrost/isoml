const STORAGE_KEY = "isoml_save_v1";

export const FORMATS = {
  general: { label: "General Entertainment", bonus: 1.0 },
  news: { label: "News & Information", bonus: 1.1 },
  sports: { label: "Sports", bonus: 1.15 },
  kids: { label: "Children & Family", bonus: 1.05 },
  movies: { label: "Movies & Classics", bonus: 1.12 },
  music: { label: "Music Video", bonus: 1.08 },
  "sci-fi": { label: "Sci-Fi & Fantasy", bonus: 1.18 },
};

export const GENRES = ["entertainment", "news", "sports", "kids", "documentary", "comedy", "drama", "music", "sci-fi"];

export const DAYPARTS = [
  { id: "overnight", label: "Overnight (12a–6a)", hours: [0, 1, 2, 3, 4, 5], cpm: 2 },
  { id: "morning", label: "Morning (6a–12p)", hours: [6, 7, 8, 9, 10, 11], cpm: 8 },
  { id: "daytime", label: "Daytime (12p–4p)", hours: [12, 13, 14, 15], cpm: 6 },
  { id: "fringe", label: "Early Fringe (4p–8p)", hours: [16, 17, 18, 19], cpm: 14 },
  { id: "prime", label: "Prime Time (8p–11p)", hours: [20, 21, 22], cpm: 35 },
  { id: "late", label: "Late Night (11p–12a)", hours: [23], cpm: 12 },
];

export const PRIME_HOURS = new Set([20, 21, 22]);
export const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export const SYNDICATION_SLOTS = [
  { id: "prime-a", label: "Prime Block A — 8:00 PM ET", minRating: 4.0 },
  { id: "prime-b", label: "Prime Block B — 9:00 PM ET", minRating: 4.5 },
  { id: "late", label: "Late Night Showcase — 11:30 PM ET", minRating: 2.5 },
  { id: "weekend", label: "Weekend Marathon — Sat 2:00 PM ET", minRating: 3.0 },
];

const defaultState = () => ({
  cash: 50000,
  syndicationPoints: 0,
  lifetimeRevenue: 0,
  broadcastDay: 1,
  currentHour: 20,
  selectedStationId: null,
  stations: [],
  content: [],
  ratingsHistory: [],
  revenueLog: [],
  syndicationHistory: [],
  syndicationAssignments: {},
  lastRatings: {},
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    }
  } catch (_) {}
  return defaultState();
}

export function getState() {
  return state;
}

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  state = defaultState();
  saveState();
}

export function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getDayName() {
  return DAYS[(state.broadcastDay - 1) % 7];
}

export function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function getStation(id) {
  return state.stations.find((s) => s.id === id);
}

export function getContent(id) {
  return state.content.find((c) => c.id === id);
}

export function addStation(data) {
  const station = {
    id: uid(),
    callLetters: data.callLetters.toUpperCase(),
    name: data.name,
    format: data.format,
    color: data.color,
    schedule: Array(24).fill(null),
    ratings: { hh: 0, share: 0, demo1849: 0, demo2554: 0, viewers: 0 },
    trend: "flat",
    totalRevenue: 0,
    syndicationWins: 0,
  };
  state.stations.push(station);
  if (!state.selectedStationId) state.selectedStationId = station.id;
  saveState();
  return station;
}

export function addContent(item) {
  state.content.push(item);
  saveState();
  return item;
}

export function setScheduleSlot(stationId, hour, contentId) {
  const station = getStation(stationId);
  if (!station) return;
  station.schedule[hour] = contentId;
  saveState();
}

export function clearScheduleSlot(stationId, hour) {
  const station = getStation(stationId);
  if (!station) return;
  station.schedule[hour] = null;
  saveState();
}

export function advanceHour() {
  state.currentHour = (state.currentHour + 1) % 24;
  if (state.currentHour === 0) {
    state.broadcastDay += 1;
  }
  saveState();
}

export function advanceDay() {
  state.broadcastDay += 1;
  state.currentHour = 6;
  saveState();
}

export function addCash(amount) {
  state.cash += amount;
  saveState();
}

export function addRevenue(amount, source, stationId) {
  state.cash += amount;
  state.lifetimeRevenue += amount;
  state.revenueLog.push({ day: state.broadcastDay, amount, source, stationId, hour: state.currentHour });
  const station = getStation(stationId);
  if (station) station.totalRevenue += amount;
  saveState();
}

export function addSyndicationPoints(pts) {
  state.syndicationPoints += pts;
  saveState();
}

export function recordRatings(dayRatings) {
  state.lastRatings = dayRatings;
  state.ratingsHistory.push({
    day: state.broadcastDay,
    stations: { ...dayRatings },
  });
  if (state.ratingsHistory.length > 14) state.ratingsHistory.shift();
  saveState();
}

export function recordSyndication(entry) {
  state.syndicationHistory.unshift(entry);
  if (state.syndicationHistory.length > 20) state.syndicationHistory.pop();
  saveState();
}

export function assignSyndicationSlot(slotId, stationId) {
  state.syndicationAssignments[slotId] = stationId;
  saveState();
}

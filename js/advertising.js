import { DAYPARTS, PRIME_HOURS, getState, getStation, getContent, addRevenue } from "./state.js";

export function getDaypartForHour(hour) {
  return DAYPARTS.find((d) => d.hours.includes(hour)) || DAYPARTS[0];
}

export function calculateHourRevenue(station, hour) {
  const contentId = station.schedule[hour];
  if (!contentId) return 0;

  const content = getContent(contentId);
  if (!content) return 0;

  const daypart = getDaypartForHour(hour);
  const { hh } = station.ratings;
  const ratingFactor = Math.max(hh, 0.5);
  const engagementBoost = 1 + content.engagement / 200;
  const primeBoost = PRIME_HOURS.has(hour) ? 1.5 : 1;

  const impressions = ratingFactor * 100000 * engagementBoost * primeBoost;
  const revenue = (impressions / 1000) * daypart.cpm;
  return Math.round(revenue);
}

export function runAdSales() {
  const { stations } = getState();
  let total = 0;
  const breakdown = [];

  stations.forEach((station) => {
    let stationTotal = 0;
    for (let h = 0; h < 24; h++) {
      const rev = calculateHourRevenue(station, h);
      if (rev > 0) {
        stationTotal += rev;
        const daypart = getDaypartForHour(h);
        breakdown.push({
          stationId: station.id,
          callLetters: station.callLetters,
          hour: h,
          daypart: daypart.label,
          amount: rev,
        });
      }
    }
    if (stationTotal > 0) {
      addRevenue(stationTotal, "ad-sales", station.id);
      total += stationTotal;
    }
  });

  return { total, breakdown };
}

export function getUnsoldInventory() {
  const { stations } = getState();
  const unsold = [];

  stations.forEach((station) => {
    for (let h = 0; h < 24; h++) {
      if (!station.schedule[h]) {
        const daypart = getDaypartForHour(h);
        unsold.push({
          station: station.callLetters,
          hour: formatHour(h),
          daypart: daypart.label,
          potentialCpm: daypart.cpm,
        });
      }
    }
  });

  return unsold;
}

function formatHour(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:00 ${ampm}`;
}

export function renderCpmTable() {
  return DAYPARTS.map(
    (d) => `<tr><td>${d.label}</td><td>$${d.cpm.toFixed(2)}</td><td>${d.hours.length} hrs</td></tr>`
  ).join("");
}

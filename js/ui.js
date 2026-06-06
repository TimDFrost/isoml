import {
  FORMATS,
  PRIME_HOURS,
  SYNDICATION_SLOTS,
  getState,
  getStation,
  getContent,
  getDayName,
  formatMoney,
  uid,
  addContent,
  addStation,
  setScheduleSlot,
  clearScheduleSlot,
  advanceHour,
  advanceDay,
  saveState,
} from "./state.js";
import { runRatingsSweep } from "./ratings.js";
import { runAdSales, getUnsoldInventory, renderCpmTable } from "./advertising.js";
import { evaluateSyndication, getLeaderboard, getNowPlayingContent, extractYouTubeId } from "./syndication.js";
import { OFFICIAL_YT_CHANNEL } from "./config.js";

let vuAnimationId = null;

export function initUI() {
  bindOfficialChannel();
  bindNavigation();
  bindModals();
  bindScheduleActions();
  seedStarterContent();
  renderAll();
  startClock();
  startVuMeters();
  setStatus("SYSTEM READY — BUILD YOUR EMPIRE ON ISOML");
}

function bindOfficialChannel() {
  const nameEl = document.getElementById("syndChannelName");
  const linkEl = document.getElementById("syndChannelLink");
  if (nameEl) nameEl.textContent = OFFICIAL_YT_CHANNEL.name.toUpperCase();
  if (linkEl) {
    linkEl.href = OFFICIAL_YT_CHANNEL.url;
    linkEl.textContent = OFFICIAL_YT_CHANNEL.displayUrl;
  }
}

function seedStarterContent() {
  const { content } = getState();
  if (content.length > 0) return;

  addContent({
    id: uid(),
    type: "youtube",
    title: "Iso Media Legends Network ID",
    genre: "entertainment",
    duration: 2,
    engagement: 40,
    youtubeId: "dQw4w9WgXcQ",
    logline: "Official network bumper",
  });
  addContent({
    id: uid(),
    type: "original",
    title: "Midnight Signal",
    genre: "sci-fi",
    duration: 44,
    engagement: 72,
    quality: 68,
    logline: "A rogue broadcast hijacks the airwaves at midnight.",
  });
  addContent({
    id: uid(),
    type: "original",
    title: "Cable Kids Club",
    genre: "kids",
    duration: 30,
    engagement: 58,
    quality: 55,
    logline: "Saturday morning chaos from your childhood.",
  });

  addStation({
    callLetters: "WISO",
    name: "IsoML Prime",
    format: "general",
    color: "#00ff9f",
  });
}

function bindNavigation() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      document.querySelectorAll(".nav-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      document.querySelectorAll(".view").forEach((v) => {
        v.classList.toggle("active", v.dataset.view === view);
      });
      if (view === "nielsen") drawRatingsChart();
    });
  });
}

function bindModals() {
  document.getElementById("btnNewStation").addEventListener("click", () => {
    document.getElementById("modalStation").showModal();
  });
  document.getElementById("btnAddYouTube").addEventListener("click", () => {
    document.getElementById("modalYouTube").showModal();
  });
  document.getElementById("btnAddOriginal").addEventListener("click", () => {
    document.getElementById("modalOriginal").showModal();
  });

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest("dialog").close());
  });

  const engSlider = document.querySelector('#formYouTube input[name="engagement"]');
  if (engSlider) {
    engSlider.addEventListener("input", () => {
      document.getElementById("engagementVal").textContent = engSlider.value;
    });
  }
  const qualSlider = document.querySelector('#formOriginal input[name="quality"]');
  if (qualSlider) {
    qualSlider.addEventListener("input", () => {
      document.getElementById("qualityVal").textContent = qualSlider.value;
    });
  }

  document.getElementById("formStation").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const station = addStation({
      callLetters: fd.get("callLetters"),
      name: fd.get("name"),
      format: fd.get("format"),
      color: fd.get("color"),
    });
    getState().selectedStationId = station.id;
    e.target.reset();
    e.target.closest("dialog").close();
    setStatus(`STATION ${station.callLetters} IS ON THE AIR`);
    renderAll();
  });

  document.getElementById("formYouTube").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const youtubeId = extractYouTubeId(fd.get("url"));
    if (!youtubeId) {
      setStatus("INVALID YOUTUBE URL — CHECK AND RETRY");
      return;
    }
    addContent({
      id: uid(),
      type: "youtube",
      title: fd.get("title"),
      genre: fd.get("genre"),
      duration: parseInt(fd.get("duration"), 10),
      engagement: parseInt(fd.get("engagement"), 10),
      youtubeId,
    });
    e.target.reset();
    e.target.closest("dialog").close();
    setStatus("YOUTUBE CONTENT ADDED TO VAULT");
    renderAll();
  });

  document.getElementById("formOriginal").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const quality = parseInt(fd.get("quality"), 10);
    addContent({
      id: uid(),
      type: "original",
      title: fd.get("title"),
      logline: fd.get("logline"),
      genre: fd.get("genre"),
      duration: parseInt(fd.get("duration"), 10),
      engagement: Math.round(quality * 0.85 + Math.random() * 15),
      quality,
    });
    e.target.reset();
    e.target.closest("dialog").close();
    setStatus("ORIGINAL PROGRAM ADDED TO VAULT");
    renderAll();
  });
}

function bindScheduleActions() {
  document.getElementById("btnAdvanceHour").addEventListener("click", () => {
    advanceHour();
    tickBroadcast();
    renderControlRoom();
    setStatus("ADVANCED 1 BROADCAST HOUR");
  });
  document.getElementById("btnAdvanceDay").addEventListener("click", () => {
    advanceDay();
    tickBroadcast();
    renderControlRoom();
    setStatus("NEW BROADCAST DAY — FRESH OVERNIGHTS TONIGHT");
  });
  document.getElementById("btnRunRatings").addEventListener("click", () => {
    if (getState().stations.length === 0) {
      setStatus("LAUNCH A STATION BEFORE RUNNING RATINGS");
      return;
    }
    runRatingsSweep();
    const adResult = runAdSales();
    evaluateSyndication();
    renderAll();
    setStatus(`RATINGS SWEEP COMPLETE — AD REVENUE ${formatMoney(adResult.total)}`);
  });
}

function tickBroadcast() {
  const { stations, currentHour } = getState();
  const station = stations.find((s) => s.id === getState().selectedStationId) || stations[0];
  if (station) updateMasterMonitor(station);
}

function startClock() {
  const tick = () => {
    const now = new Date();
    document.getElementById("liveClock").textContent = now.toTimeString().slice(0, 8);
    document.getElementById("broadcastDay").textContent =
      `DAY ${getState().broadcastDay} — ${getDayName()} · HOUR ${formatHourLabel(getState().currentHour)}`;
    document.getElementById("cashDisplay").textContent = formatMoney(getState().cash);
    document.getElementById("syndicationPts").textContent = getState().syndicationPoints;
  };
  tick();
  setInterval(tick, 1000);
}

function startVuMeters() {
  const vuLeft = document.getElementById("vuLeft");
  const vuRight = document.getElementById("vuRight");
  const animate = () => {
    const onAir = getState().stations.length > 0;
    const level = onAir ? 40 + Math.random() * 55 : 5 + Math.random() * 10;
    vuLeft.style.width = `${level}%`;
    vuRight.style.width = `${level + (Math.random() * 10 - 5)}%`;
    vuAnimationId = requestAnimationFrame(animate);
  };
  animate();
}

export function renderAll() {
  renderControlRoom();
  renderSchedule();
  renderLibrary();
  renderNielsen();
  renderAds();
  renderSyndication();
}

function renderControlRoom() {
  const { stations, selectedStationId } = getState();
  const list = document.getElementById("stationList");

  if (stations.length === 0) {
    list.innerHTML = '<p class="empty-state">NO STATIONS ON AIR<br>Launch your first network.</p>';
    document.getElementById("masterMonitor").innerHTML = `
      <div class="monitor-placeholder">
        <div class="test-pattern"></div>
        <p>NO STATIONS — CREATE ONE TO BEGIN</p>
      </div>`;
    document.getElementById("nowPlaying").textContent = "— NO SIGNAL —";
    document.getElementById("networkPulse").innerHTML = "";
    document.getElementById("miniLeaderboard").innerHTML = "";
    return;
  }

  list.innerHTML = stations
    .map(
      (s) => `
    <div class="station-card ${s.id === selectedStationId ? "selected" : ""}" data-station-id="${s.id}" style="--station-color: ${s.color}">
      <div>
        <div class="call-letters">${s.callLetters}</div>
        <div class="station-meta">${s.name} · ${FORMATS[s.format]?.label || s.format}</div>
        <div class="station-meta">HH ${s.ratings.hh || "—"} · Share ${s.ratings.share || "—"}%</div>
      </div>
    </div>`
    )
    .join("");

  list.querySelectorAll(".station-card").forEach((card) => {
    card.addEventListener("click", () => {
      getState().selectedStationId = card.dataset.stationId;
      saveState();
      renderControlRoom();
    });
  });

  const station = getStation(selectedStationId) || stations[0];
  getState().selectedStationId = station.id;
  updateMasterMonitor(station);

  const totalHh = stations.reduce((a, s) => a + (s.ratings.hh || 0), 0);
  document.getElementById("networkPulse").innerHTML = `
    <div class="stat-card"><div class="stat-label">STATIONS ON AIR</div><div class="stat-value" style="color: var(--phosphor-cyan)">${stations.length}</div></div>
    <div class="stat-card"><div class="stat-label">COMBINED HH RTG</div><div class="stat-value" style="color: var(--nielsen-blue)">${(totalHh).toFixed(1)}</div></div>
    <div class="stat-card"><div class="stat-label">CONTENT IN VAULT</div><div class="stat-value" style="color: var(--stream-purple)">${getState().content.length}</div></div>
    <div class="stat-card"><div class="stat-label">LIFETIME REVENUE</div><div class="stat-value" style="color: var(--phosphor-green)">${formatMoney(getState().lifetimeRevenue)}</div></div>`;

  const sorted = [...stations].sort((a, b) => (b.ratings.hh || 0) - (a.ratings.hh || 0));
  document.getElementById("miniLeaderboard").innerHTML = sorted
    .slice(0, 5)
    .map((s, i) => `<li><span><span class="rank">#${i + 1}</span>${s.callLetters}</span><span>${s.ratings.hh || "—"}</span></li>`)
    .join("");
}

function updateMasterMonitor(station) {
  const content = getNowPlayingContent(station);
  const monitor = document.getElementById("masterMonitor");
  const nowPlaying = document.getElementById("nowPlaying");

  if (!content) {
    monitor.innerHTML = `<div class="monitor-placeholder"><div class="test-pattern"></div><p>DEAD AIR — ${station.callLetters}</p></div>`;
    nowPlaying.textContent = `${station.callLetters} — DEAD AIR @ ${formatHourLabel(getState().currentHour)}`;
    return;
  }

  if (content.type === "youtube" && content.youtubeId) {
    monitor.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${content.youtubeId}?autoplay=0&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${content.title}"></iframe>`;
  } else {
    monitor.innerHTML = `
      <div class="monitor-placeholder" style="background: linear-gradient(135deg, ${station.color}22, #000)">
        <div style="font-size: 3rem; margin-bottom: 0.5rem">🎬</div>
        <p style="color: ${station.color}; font-size: 1rem">${content.title}</p>
        <p style="margin-top: 0.5rem; font-size: 0.65rem">${content.logline || "ORIGINAL PROGRAMMING"}</p>
      </div>`;
  }
  nowPlaying.textContent = `NOW: ${content.title} · ${station.callLetters} · ${formatHourLabel(getState().currentHour)}`;
}

function renderSchedule() {
  const { stations, content, selectedStationId } = getState();
  const select = document.getElementById("scheduleStationSelect");
  const station = getStation(selectedStationId) || stations[0];

  select.innerHTML = stations.map((s) => `<option value="${s.id}" ${s.id === station?.id ? "selected" : ""}>${s.callLetters} — ${s.name}</option>`).join("");
  select.onchange = () => {
    getState().selectedStationId = select.value;
    saveState();
    renderSchedule();
  };

  if (!station) {
    document.getElementById("gridStationName").textContent = "—";
    document.getElementById("programGrid").innerHTML = '<p class="empty-state">Create a station first.</p>';
    document.getElementById("contentPalette").innerHTML = "";
    return;
  }

  document.getElementById("gridStationName").textContent = `${station.callLetters} — ${station.name}`;

  const search = document.getElementById("paletteSearch").value?.toLowerCase() || "";
  const filtered = content.filter((c) => c.title.toLowerCase().includes(search));

  document.getElementById("contentPalette").innerHTML = filtered
    .map(
      (c) => `
    <div class="content-chip ${c.type}" draggable="true" data-content-id="${c.id}">
      <div class="chip-title">${c.title}</div>
      <div class="chip-meta">${c.type.toUpperCase()} · ${c.duration}m · ${c.genre}</div>
    </div>`
    )
    .join("");

  setupDragAndDrop();

  let gridHtml = '<div class="grid-hour-label"></div>';
  for (let h = 0; h < 24; h++) {
    gridHtml += `<div class="grid-hour-label">${formatHourShort(h)}</div>`;
  }
  gridHtml += '<div class="grid-row-label">MON</div>';
  for (let h = 0; h < 24; h++) {
    const cid = station.schedule[h];
    const c = cid ? getContent(cid) : null;
    const prime = PRIME_HOURS.has(h) ? " prime" : "";
    const filled = c ? " filled" : "";
    gridHtml += `
      <div class="grid-slot${prime}${filled}" data-hour="${h}" data-station-id="${station.id}">
        ${c ? `<div class="slot-content"><div class="slot-title">${c.title}</div><div class="slot-dur">${c.duration}m</div></div>` : ""}
      </div>`;
  }
  document.getElementById("programGrid").innerHTML = gridHtml;

  document.querySelectorAll(".grid-slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      if (slot.classList.contains("filled")) {
        clearScheduleSlot(slot.dataset.stationId, parseInt(slot.dataset.hour, 10));
        renderSchedule();
        setStatus("SLOT CLEARED");
      }
    });
  });
}

function setupDragAndDrop() {
  let draggedId = null;

  document.querySelectorAll(".content-chip").forEach((chip) => {
    chip.addEventListener("dragstart", (e) => {
      draggedId = chip.dataset.contentId;
      chip.classList.add("dragging");
      e.dataTransfer.setData("text/plain", draggedId);
    });
    chip.addEventListener("dragend", () => chip.classList.remove("dragging"));
  });

  document.querySelectorAll(".grid-slot").forEach((slot) => {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");
      const contentId = e.dataTransfer.getData("text/plain") || draggedId;
      if (contentId) {
        setScheduleSlot(slot.dataset.stationId, parseInt(slot.dataset.hour, 10), contentId);
        renderSchedule();
        setStatus("PROGRAMMING LOCKED IN");
      }
    });
  });

  const searchInput = document.getElementById("paletteSearch");
  searchInput.oninput = () => renderSchedule();
}

function renderLibrary() {
  const { content } = getState();
  const grid = document.getElementById("contentLibrary");
  if (content.length === 0) {
    grid.innerHTML = '<p class="empty-state">VAULT EMPTY — Import YouTube or create originals.</p>';
    return;
  }
  grid.innerHTML = content
    .map(
      (c) => `
    <article class="content-card ${c.type}">
      <div class="card-thumb">${c.type === "youtube" ? "▶" : "🎬"}</div>
      <div class="card-body">
        <div class="card-title">${c.title}</div>
        <div class="card-meta">${c.duration} min · ${c.genre} · ENG ${c.engagement}</div>
        ${c.logline ? `<div class="card-meta" style="margin-top:0.3rem">${c.logline}</div>` : ""}
        <span class="card-badge badge-${c.type}">${c.type === "youtube" ? "YOUTUBE" : "ORIGINAL"}</span>
      </div>
    </article>`
    )
    .join("");
}

function renderNielsen() {
  const { stations } = getState();
  const tbody = document.getElementById("nielsenBookBody");

  if (stations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No data — run a ratings sweep.</td></tr>';
    return;
  }

  tbody.innerHTML = stations
    .map((s) => {
      const trendIcon = s.trend === "up" ? "▲" : s.trend === "down" ? "▼" : "—";
      const trendClass = `trend-${s.trend}`;
      return `<tr>
        <td><strong>${s.callLetters}</strong> ${s.name}</td>
        <td>${s.ratings.hh || "—"}</td>
        <td>${s.ratings.share || "—"}%</td>
        <td>${s.ratings.demo1849 || "—"}</td>
        <td>${s.ratings.demo2554 || "—"}</td>
        <td>${s.ratings.viewers || "—"}</td>
        <td class="${trendClass}">${trendIcon}</td>
      </tr>`;
    })
    .join("");

  renderDemoHeatmap();
  drawRatingsChart();
}

function renderDemoHeatmap() {
  const { stations } = getState();
  const demos = ["M2-11", "M12-17", "M18-34", "M35-54", "F2-11", "F12-17", "F18-34", "F35-54", "HH", "P2+"];
  const base = stations.length ? stations.reduce((a, s) => a + (s.ratings.hh || 0), 0) / stations.length : 2;

  document.getElementById("demoHeatmap").innerHTML = demos
    .map((d, i) => {
      const val = base * (0.6 + Math.random() * 0.8) * (i % 3 === 0 ? 1.2 : 1);
      const intensity = Math.min(255, Math.round(val * 40));
      const bg = `rgb(${255 - intensity}, ${intensity}, ${100 + i * 10})`;
      return `<div class="demo-cell" style="background:${bg}" title="${d}">${val.toFixed(1)}</div>`;
    })
    .join("");
}

function drawRatingsChart() {
  const canvas = document.getElementById("ratingsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { ratingsHistory, stations } = getState();

  ctx.fillStyle = "#12151f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (ratingsHistory.length === 0 || stations.length === 0) {
    ctx.fillStyle = "#7a8499";
    ctx.font = "14px IBM Plex Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText("Run ratings sweeps to populate trend data", canvas.width / 2, canvas.height / 2);
    return;
  }

  const colors = ["#00ff9f", "#4a7cff", "#ffb020", "#a855f7", "#ff3355"];
  const padding = 40;
  const w = canvas.width - padding * 2;
  const h = canvas.height - padding * 2;

  ctx.strokeStyle = "#2a3348";
  for (let i = 0; i <= 5; i++) {
    const y = padding + (h / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  stations.slice(0, 5).forEach((station, si) => {
    const points = ratingsHistory.map((day) => day.stations[station.id]?.hh || 0);
    if (points.every((p) => p === 0)) return;

    ctx.strokeStyle = colors[si % colors.length];
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((val, i) => {
      const x = padding + (w / Math.max(points.length - 1, 1)) * i;
      const y = padding + h - (val / 10) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = colors[si % colors.length];
    ctx.font = "10px IBM Plex Mono";
    ctx.fillText(station.callLetters, padding + w + 4, padding + si * 14);
  });
}

function renderAds() {
  document.getElementById("lifetimeRevenue").textContent = formatMoney(getState().lifetimeRevenue);
  document.getElementById("cpmRates").innerHTML = `
    <thead><tr><th>DAYPART</th><th>CPM</th><th>SPAN</th></tr></thead>
    <tbody>${renderCpmTable()}</tbody>`;

  const recent = getState().revenueLog.slice(-8).reverse();
  document.getElementById("revenueBreakdown").innerHTML =
    recent.length === 0
      ? '<p class="empty-state">No revenue yet — schedule content and run ratings.</p>'
      : recent
          .map((r) => {
            const s = getStation(r.stationId);
            return `<div class="rev-line"><span>Day ${r.day} · ${s?.callLetters || "?"} · ${r.source}</span><span>${formatMoney(r.amount)}</span></div>`;
          })
          .join("");

  const unsold = getUnsoldInventory();
  document.getElementById("unsoldInventory").innerHTML =
    unsold.length === 0
      ? '<p style="color:var(--phosphor-green);font-size:0.75rem">FULL SELL-OUT — ALL SLOTS FILLED</p>'
      : unsold
          .slice(0, 12)
          .map((u) => `<div class="rev-line"><span>${u.station} @ ${u.hour}</span><span>$${u.potentialCpm} CPM potential</span></div>`)
          .join("") + (unsold.length > 12 ? `<p style="font-size:0.65rem;color:var(--text-dim);margin-top:0.5rem">+${unsold.length - 12} more unsold slots</p>` : "");
}

function renderSyndication() {
  const { syndicationAssignments, syndicationHistory, syndicationPoints } = getState();
  const board = getLeaderboard();

  document.getElementById("syndicationStatus").innerHTML = `
    <div class="stat-card">
      <div class="stat-label">YOUR SYNDICATION PTS</div>
      <div class="stat-value" style="color:var(--stream-purple)">${syndicationPoints}</div>
    </div>`;

  document.getElementById("syndLeaderboard").innerHTML =
    board.length === 0
      ? '<li class="empty-state">Launch stations to compete.</li>'
      : board
          .map(
            (e) => `
      <li>
        <span class="synd-rank">#${e.rank}</span>
        <span><strong>${e.callLetters}</strong> ${e.name}</span>
        <span style="margin-left:auto;color:var(--phosphor-amber)">${e.hh} HH · ${e.points} pts</span>
      </li>`
          )
          .join("");

  document.getElementById("syndSlots").innerHTML = SYNDICATION_SLOTS.map((slot) => {
    const assignedId = syndicationAssignments[slot.id];
    const station = assignedId ? getStation(assignedId) : null;
    const open = !station;
    return `
      <div class="synd-slot-card ${open ? "open" : "filled"}">
        <strong>${slot.label}</strong>
        <p style="font-size:0.65rem;color:var(--text-dim);margin-top:0.25rem">Min HH: ${slot.minRating}</p>
        <p style="font-size:0.75rem;margin-top:0.4rem;color:${open ? "var(--phosphor-green)" : "var(--stream-purple)"}">
          ${open ? "OPEN — Hit ratings threshold" : `SYNDICATED: ${station.callLetters} (${station.ratings.hh} HH)`}
        </p>
      </div>`;
  }).join("");

  document.getElementById("syndHistory").innerHTML =
    syndicationHistory.length === 0
      ? '<li>No syndication wins yet. Dominate prime time.</li>'
      : syndicationHistory
          .map((h) => `<li>Day ${h.day}: <strong>${h.station}</strong> → ${OFFICIAL_YT_CHANNEL.name}: ${h.slot} (+${h.points} pts, ${h.rating} HH)</li>`)
          .join("");
}

function formatHourShort(h) {
  const h12 = h % 12 || 12;
  return `${h12}${h >= 12 ? "p" : "a"}`;
}

function formatHourLabel(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:00 ${ampm}`;
}

function setStatus(msg) {
  document.getElementById("statusMessage").textContent = msg;
}

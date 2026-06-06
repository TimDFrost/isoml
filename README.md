# IsoML — Fantasy Television Network Simulator

Build your own cable network: launch stations, schedule YouTube and original programming, earn Nielsen-style ratings, sell advertising, and compete for syndication slots on the official [Iso Media Legends](https://www.youtube.com/@IsoMediaLegends) YouTube Live channel.

**Live site:** [isoml.com](https://isoml.com)

## Features

- **Control Room** — Master monitor with YouTube embeds, VU meters, station rack
- **Program Grid** — Drag content into a 24-hour schedule with prime-time highlighting
- **Content Vault** — Import YouTube videos or create original programs
- **Nielsen Desk** — Overnight ratings book, demo heatmap, 7-day trend chart
- **Ad Sales** — Daypart CPM rate card, revenue from ratings × inventory
- **Syndication** — Compete for official [@IsoMediaLegends](https://www.youtube.com/@IsoMediaLegends) YouTube Live blocks

## Quick Start

No build step required. Serve the folder with any static host:

```bash
cd Projects/isoml
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

## Deploy to isoml.com

See **[DEPLOY.md](DEPLOY.md)** for full GitHub + cPanel instructions.

### cPanel (isoml.com)

1. Push repo to GitHub (see `scripts/push-github.sh`)
2. In cPanel → **Git Version Control**, clone the repo
3. Edit `.cpanel.yml` with your cPanel username and document root
4. Click **Pull or Deploy**

Or upload `index.html`, `css/`, `js/`, and `.htaccess` to `public_html` manually.

### Netlify

1. Connect this repo or drag-drop the `isoml` folder
2. Build command: *(none)*
3. Publish directory: `/` (repo root)
4. Add custom domain `isoml.com` in Netlify DNS

### Vercel

```bash
vercel --prod
```

`vercel.json` is included for static deployment.

### Cloudflare Pages / GitHub Pages

Upload the project root as the site root. All assets are relative paths.

## How to Play

1. **Launch a station** (or use the starter WISO — IsoML Prime)
2. **Add content** — YouTube URLs or original shows in Content Vault
3. **Schedule** — Drag chips onto the Program Grid (prime time = 8–11 PM)
4. **Run Ratings Sweep** — Calculates HH rating, share, demos, ad revenue, syndication
5. **Advance time** — Simulate broadcast hours and days
6. **Win syndication** — Hit minimum HH thresholds for [@IsoMediaLegends](https://www.youtube.com/@IsoMediaLegends) YouTube Live slots

Progress saves automatically in `localStorage`.

## Tech Stack

- Vanilla HTML / CSS / JavaScript (ES modules)
- No bundler or Node.js required for development or production
- Canvas chart for Nielsen trends
- YouTube nocookie embeds for preview

## Project Structure

```
isoml/
├── index.html
├── css/main.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── ratings.js
│   ├── advertising.js
│   ├── syndication.js
│   └── ui.js
├── vercel.json
└── netlify.toml
```

## License

MIT — IsoML Network

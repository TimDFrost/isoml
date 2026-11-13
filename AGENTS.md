# AGENTS.md

## Cursor Cloud specific instructions

IsoML is a **fully static site** — vanilla HTML/CSS/JS ES modules with **no build step, no bundler, no Node.js, and no package manifest** (there is no `package.json`, `requirements.txt`, etc.). There is nothing to install; the update script is effectively a no-op.

### Running the app (dev)

Serve the repo root over HTTP (ES modules require an HTTP origin — do **not** open files via `file://`):

```bash
python3 -m http.server 8080
```

- Marketing homepage: `http://localhost:8080/` (serves `index.html`)
- TV Network Simulator: `http://localhost:8080/simulator/`
- Guides hub: `http://localhost:8080/pages/how-to/`

### Notes / gotchas

- There is **no backend**. The "API" layer (`js/site/core/api.js`) is a facade over browser `localStorage` (`js/site/core/storage.js`), namespaced `isoml:v1:`. All data (fan posts, applications, simulator state) persists client-side only.
- Simulator progress and site data live in `localStorage`, so state carries across reloads in the same browser profile. Clear site data to reset.
- External resources (YouTube nocookie embeds, Google Fonts, Stripe hosted payment links) require network access; the site still renders and functions without them (embeds simply show "unavailable").
- The hosting configs (`.htaccess`, `_headers`, `netlify.toml`, `vercel.json`, `.cpanel.yml`) are for production static hosts and are **not** used by `python3 -m http.server`.

### Lint / test / build

There are **no lint, test, or build scripts** in this repo (no tooling configured). Verification is done by serving the site and exercising it in a browser.

# Deploy IsoML to cPanel (isoml.com)

Static site — **no build step**. Upload or git-deploy the files below.

## What goes live

```
public_html/
  index.html          ← comedy homepage
  .htaccess
  css/
    site.css          ← main site
    main.css          ← TV simulator
  js/
    site/             ← homepage modules
    app.js, ui.js, …
  pages/              ← guides, comedians wanted, playbook
  simulator/          ← TV simulator at /simulator/
```

## Option A — Git deploy (recommended)

1. Push this repo to GitHub:
   ```bash
   git push origin main
   ```
2. Log in to **cPanel** for isoml.com
3. Open **Git Version Control**
4. **Clone** (first time) or **Pull** (updates):
   - URL: `https://github.com/timdfrost/isoml.git`
   - Path: e.g. `/home/apj6rcmrygbr/repos/isoml`
5. Click **Pull or Deploy** — `.cpanel.yml` copies files to `public_html`
6. Confirm `DEPLOYPATH` in `.cpanel.yml` matches your `public_html` path

## Option B — File Manager / FTP

Upload to **public_html** (enable **Show Hidden Files** for `.htaccess`):

- `index.html`, `.htaccess`
- Folders: `css/`, `js/`, `pages/`, `simulator/`

Back up any old `index.html` first (rename to `index.html.backup`).

## After deploy — verify

| URL | Expected |
|-----|----------|
| https://isoml.com/ | Comedy homepage (pre-order, Fan Lounge, etc.) |
| https://isoml.com/pages/how-to/ | Guide hub |
| https://isoml.com/pages/comedians-wanted.html | Comedians Wanted |
| https://isoml.com/simulator/ | TV simulator |

Hard refresh (**Cmd+Shift+R**) if you see a cached “Coming Soon” page.

## Updates

```bash
git add -A
git commit -m "Describe your change"
git push origin main
# cPanel → Git Version Control → Pull or Deploy
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 403 / blank page | `index.html` must be in document root |
| CSS/JS 404 | Upload entire `css/` and `js/` trees (including `js/site/`) |
| Guides 404 | Upload `pages/` folder |
| `.htaccess` ignored | Enable `mod_rewrite` / `mod_headers` with host |
| ES modules error | Serve over **HTTPS** (required for modules) |
| Old Coming Soon | Clear cache; confirm new `index.html` in `public_html` |

## Do not upload

- `.git/`
- `node_modules/` (none required)
- `README.md`, `DEPLOY.md` (optional)

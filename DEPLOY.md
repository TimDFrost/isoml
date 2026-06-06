# Deploy IsoML to GitHub + cPanel (isoml.com)

## 1. Push to GitHub

Create a new **empty** repository on GitHub (no README), then run:

```bash
cd /Users/timfrost/Projects/isoml

git remote add origin https://github.com/timdfrost/isoml.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/timdfrost/isoml.git
git push -u origin main
```

## 2. Deploy to cPanel (isoml.com)

### Option A — Git deploy (recommended)

1. Log in to **cPanel** for isoml.com
2. Open **Git Version Control**
3. **Create** → clone your GitHub repo:
   - URL: `https://github.com/timdfrost/isoml.git`
   - Repository path: e.g. `/home/youruser/repos/isoml`
4. Edit `.cpanel.yml` in the repo — set `REPLACE_USERNAME` to your cPanel username and confirm `DEPLOYPATH` points at `public_html` (or your domain docroot)
5. In Git Version Control, click **Pull or Deploy** — cPanel copies `index.html`, `css/`, `js/`, and `.htaccess` to the live site

### Option B — Manual upload

Upload these to `public_html` (or isoml.com document root):

```
index.html
css/
js/
.htaccess
```

No build step. No `node_modules`.

### Option C — FTP

Use FileZilla or cPanel File Manager. Upload the same files as Option B.

## 3. Domain check

- Document root should contain `index.html` at the top level
- Visit https://isoml.com — Control Room should load
- Hard refresh (Cmd+Shift+R) if you see a cached old page

## 4. Updates

```bash
# Local changes
git add -A
git commit -m "Your message"
git push

# cPanel: Pull or Deploy again (Option A)
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 403 / blank page | Confirm `index.html` is in document root |
| CSS/JS 404 | Ensure `css/` and `js/` folders uploaded |
| `.htaccess` ignored | Ask host to enable `mod_rewrite` |
| ES modules fail | Site must be served over HTTPS or localhost |

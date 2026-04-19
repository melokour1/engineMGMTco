# EngineMgmt — enginemanagement.co

Local SEO agency site. 4 pages, static HTML + CSS + JS. Deployed via GitHub Pages at `enginemanagement.co`.

---

## 📁 What's in this repo

```
enginemgmtco/
├── index.html          # Homepage (email capture)
├── watch.html          # Video delivery page (noindex)
├── strategy.html       # Long-form sales page (Calendly, FAQ, application form)
├── terms.html          # Terms of Service (placeholder — replace before launch)
├── 404.html            # Branded 404 page
├── styles.css          # All styles
├── main.js             # Form submissions + UTM capture + map toggle
├── robots.txt
├── sitemap.xml
├── CNAME               # Points to enginemanagement.co
└── assets/
    ├── logo.svg        # Horizontal wordmark
    ├── logo-icon.svg   # Icon only (for navbar)
    ├── logo-1x1.svg    # Square profile photo
    └── logo-16x9.svg   # Cover banner
```

---

## 🚀 Deploy — first time setup

### 1. Push to GitHub

```bash
cd enginemgmtco
git init
git add .
git commit -m "Initial V1 site"
git branch -M main
git remote add origin https://github.com/melokour1/enginemgmtco.git
git push -u origin main
```

### 2. Enable GitHub Pages

- Go to repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **main** / **(root)**
- Save

Site will live at `https://melokour1.github.io/enginemgmtco/` within a few minutes.

### 3. Configure custom domain

- In Settings → Pages, under "Custom domain" enter: `enginemanagement.co`
- Click Save. GitHub will verify DNS.
- Check "Enforce HTTPS" once verification completes (~10 min after DNS propagates).

### 4. Configure DNS at your domain registrar

Add these records for `enginemanagement.co`:

**For apex domain (enginemanagement.co):** 4 A records pointing to GitHub
```
Type: A   Host: @   Value: 185.199.108.153
Type: A   Host: @   Value: 185.199.109.153
Type: A   Host: @   Value: 185.199.110.153
Type: A   Host: @   Value: 185.199.111.153
```

**For www subdomain:**
```
Type: CNAME   Host: www   Value: melokour1.github.io
```

DNS propagation takes 5 min to 24 hours (usually ~30 min).

---

## 📝 Updating the site

After the initial push, any change is:

```bash
git add .
git commit -m "Describe what changed"
git push
```

GitHub Pages rebuilds within 1-2 minutes. Hard-refresh (Cmd+Shift+R) to see changes.

---

## ⚠️ Placeholders to replace BEFORE running ads

These are explicitly marked as placeholders in the site and need real content before you send paid traffic:

### Content
- [ ] **Both video placeholders** (homepage + strategy page) → embed actual video players once recorded
- [ ] **Team photos** — both team cards say "Photo coming soon"
- [ ] **Smail's LinkedIn URL** in `index.html` — currently points to `#`
- [ ] **Calendly embed** on `strategy.html` — swap the placeholder for the real embed code
- [ ] **Before/After map** — currently uses sample data, replace with real MGE California scan when ready
- [ ] **Terms of Service** — current content is a placeholder, needs attorney review

### Marketing copy (optional polish)
- [ ] Trust bar on strategy page is currently HTML-commented-out. Uncomment and fill in real numbers once you have clients.
- [ ] Footer tagline: currently "Show up first when your neighbors search" — change if you want something else.

---

## 🔌 Connected systems

### Email + notifications (n8n)
- Homepage form submits to: `https://mohammedelokour.app.n8n.cloud/webhook/emc-form-submission` with `form_type: "homepage"`
- Strategy form submits to the same URL with `form_type: "strategy"`
- Both trigger the `EMC_FORM_SUBMISSIONS` n8n workflow → Google Sheets + Outlook + Telegram
- If you change the webhook URL, update `WEBHOOK_URL` constant in `main.js`

### Calendly (when live)
- Calendly webhook should point at: `https://mohammedelokour.app.n8n.cloud/webhook/emc-calendly-booking`
- This triggers `EMC_CALENDLY_BOOKING` workflow

### Geo-location on /strategy
- Uses free `ipapi.co` API to show visitor's city in the hero pill
- Falls back to "Hawthorne, United States" if the API fails

### UTM tracking
- Any URL with `?utm_source=...&utm_medium=...&utm_campaign=...` parameters captures those automatically
- Passed to n8n → logged to the Google Sheet for campaign attribution

---

## 🧪 Testing checklist before going live

- [ ] All 4 pages load without console errors
- [ ] Homepage form submits successfully (sheet row + email + Telegram)
- [ ] Strategy form submits successfully (applications row + priority email + Telegram)
- [ ] Honeypot blocks bot submissions (hidden `website` field)
- [ ] Forms work on mobile (iPhone Safari + Android Chrome)
- [ ] All internal links work (home ↔ strategy ↔ terms, etc.)
- [ ] 404 page renders when hitting a non-existent URL
- [ ] Before/After map toggle animates properly
- [ ] FAQ accordion opens/closes on click
- [ ] Geo-location pill shows something reasonable
- [ ] Lighthouse score: Performance 90+, Accessibility 90+, SEO 95+

---

## 🎨 Design tokens

Defined in `:root` of `styles.css`:

| Token | Value | Purpose |
|---|---|---|
| `--cream` | `#F5EFE3` | Main background |
| `--cream-soft` | `#FBF7EE` | Card backgrounds |
| `--ink` | `#0A0A0A` | All text + buttons |
| `--font-body` | Inter | Body + headings |
| `--font-display` | Fraunces (italic 600) | Serif accents only |

All italic serif text uses the `.serif-accent` class. This is the design signature.

---

## 🆘 Common issues

**Forms submitting but not hitting the sheet**
→ Check n8n workflow is toggled Active. Check execution log for errors.

**Emails landing in spam**
→ Make sure SPF/DKIM/DMARC are set up correctly on enginemanagement.co in Microsoft 365.

**Site shows old content after update**
→ Hard refresh (Cmd+Shift+R). GitHub Pages caches aggressively.

**Custom domain won't verify**
→ DNS propagation takes time. Run `dig enginemanagement.co` — should show the 4 GitHub IPs. If not, DNS records are wrong.

---

## 📞 Contact

Engine Management Co
13900 Inglewood Ave, Suite A
Hawthorne, CA 90250
mohammed@enginemanagement.co
+1 (310) 219-0062

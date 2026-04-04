# TCLAW Website - Video Embed Session Log
**Date:** February 1, 2026

## Summary
Embedded YouTube videos on the TCLAW (Tony Carlos Law) practice area pages.

## Videos Added

### immigration.html (2 videos, side-by-side grid)
1. **Inmigración** - https://www.youtube.com/watch?v=ydcDJbhcc0w
2. **Are You in the Deportation Process?** - https://www.youtube.com/watch?v=9vHPMyjtCqo

### criminal-defense.html (1 video, single column)
3. **Clear Your Criminal History** - https://www.youtube.com/watch?v=p5wi9ZrhhVs

## Files Modified
- `styles.css` — Added responsive video section CSS (16:9 aspect ratio containers, 2-column grid, mobile stacking)
- `practice-areas/immigration.html` — Added 2 YouTube embeds after intro content, before "Family-Based Immigration" section
- `practice-areas/criminal-defense.html` — Added 1 YouTube embed after intro content, before "Criminal Cases We Handle" section

## Technical Notes
- Videos are embedded via YouTube iframes (free, no bandwidth cost on Netlify)
- All iframes use `loading="lazy"` for performance
- Video section headings include `data-en`/`data-es` attributes for bilingual toggle support
- YouTube embeds will show error 153 when opened as local files (`file://`). This is normal — they work correctly when served over HTTP (localhost or deployed to tonycarloslaw.com)
- Pages without videos yet: `dui.html`, `employment-law.html`, `personal-injury.html`

## Hosting Decision
Recommended YouTube embeds over self-hosting because:
- Netlify has bandwidth limits (100GB/month free tier); video files would consume this quickly
- YouTube handles encoding, adaptive streaming, and mobile playback
- No additional cost
- SEO benefit from YouTube channel presence

---

# TCLAW Website - GTM Integration & SSL Fix
**Date:** February 5, 2026

## Summary
Replaced Google Analytics with Google Tag Manager to give the Google Ads agency (Alberto) self-service access for tracking pixels. Also resolved SSL certificate issue.

## Google Tag Manager Setup

### Container ID
`GTM-NT6XCCV8`

### Files Modified (all 13 HTML files)
- `index.html`
- `practice-areas/criminal-defense.html`
- `practice-areas/dui.html`
- `practice-areas/employment-law.html`
- `practice-areas/immigration.html`
- `practice-areas/personal-injury.html`
- `locations/live-oak.html`
- `locations/marysville.html`
- `locations/olivehurst.html`
- `locations/wheatland.html`
- `locations/yuba-city.html`
- `privacy-policy.html`
- `thank-you.html`

### Changes Made
- Removed hardcoded Google Analytics (`G-MNGJQXTN4M`) from all pages
- Added GTM container script in `<head>` of all pages
- Added GTM noscript fallback after `<body>` tag in all pages

### Next Steps for GTM
1. Set up GA4 Configuration tag in GTM (Measurement ID: `G-MNGJQXTN4M`)
2. Add Alberto's email to GTM with Edit access
3. Agency can then add Google Ads conversion tracking, remarketing pixels, etc.

## SSL Certificate Issue

### Problem
Site was showing "Not Secure" warning. DNS verification passed but SSL certificate wasn't provisioning.

### Root Cause
Netlify was configured for Netlify DNS, but domain nameservers at registrar (Namecheap) were still pointing to `dns1.registrar-servers.com` / `dns2.registrar-servers.com`.

### Resolution
Clicked "Retry DNS verification" in Netlify dashboard, which kicked the Let's Encrypt provisioning back into action.

### Email Records (important for future DNS changes)
If switching to Netlify DNS, these MX records must be added:
- Priority 1: `aspmx.l.google.com`
- Priority 5: `alt1.aspmx.l.google.com`
- Priority 5: `alt2.aspmx.l.google.com`
- Priority 10: `aspmx2.googlemail.com`
- Priority 10: `aspmx3.googlemail.com`

TXT record: `google-site-verification=j7nM84OYV5EhoNq4052ji3GD48p3Ot-UqOhAdgHynaI`

## Deployment
Site deployed to production: https://tonycarloslaw.com

## Communication
Drafted email to Alberto (Google Ads agency) explaining:
- Custom site (no WordPress login)
- GTM access available for tracking management
- Landing pages can be created quickly on request

---

# TCLAW Website - Performance Optimization
**Date:** February 6, 2026

## Summary
Major performance overhaul to address poor PageSpeed scores (40/100 on mobile). The primary culprit was the TikTok embed, which was loading 12MB of resources on every page load.

## Before Optimization
| Metric | Score |
|--------|-------|
| Performance | 40 |
| First Contentful Paint | 8.1s |
| Largest Contentful Paint | 33.0s |
| Total Blocking Time | 630ms |
| Speed Index | 11.3s |

## Changes Made

### 1. Image Optimization (WebP Conversion)
Created optimized WebP versions of all images with fallbacks:

| File | Original | WebP | Savings |
|------|----------|------|---------|
| Hero background | 885 KB | 260 KB | 70% |
| Tony Headshot | 88 KB | 9.6 KB | 89% |
| Header Logo | 89 KB | 4.1 KB | 95% |
| Footer Logo | 69 KB | 6.8 KB | 90% |
| Yelp Logo | 44 KB | 3.3 KB | 93% |

**New files added:**
- `hero-bg.webp` (optimized hero background)
- `hero-bg-optimized.jpg` (JPEG fallback)
- `Tony Headshot.webp`
- `Tony Carlos Logo Really Big.webp`
- `Tony_Carlos_Logo_Big-removebg-preview.webp`
- `Yelp.webp`

### 2. TikTok Embed → Click-to-Load
The TikTok embed was the biggest performance killer:
- **11.7 MB** network payload from tiktokcdn-us.com
- **1,232 ms** main thread blocking
- **20+ JavaScript files** loaded immediately

**Solution:** Changed from auto-loading to click-to-load. TikTok now only loads when user clicks "Load TikTok Feed" button.

### 3. Lazy Loading
Added `loading="lazy"` to below-fold images:
- Tony Headshot (About section)
- Yelp logo (Social section)
- Footer logo

### 4. JavaScript Optimization
- Added `defer` attribute to `script.js` on all 13 pages
- TikTok script now loads on-demand only

### 5. Font Loading Optimization
Changed Google Fonts loading strategy:
- Added `preload` hint
- Changed to `media="print" onload="this.media='all'"` pattern
- Added `noscript` fallback

### 6. LCP Optimization
- Added `<link rel="preload">` for hero background image
- Ensures hero renders quickly without waiting for CSS parse

### 7. Accessibility Fix
- Added `title` attribute to GTM noscript iframe

## Files Modified
All 13 HTML files updated:
- `index.html`
- `practice-areas/*.html` (5 files)
- `locations/*.html` (5 files)
- `privacy-policy.html`
- `thank-you.html`

Plus:
- `styles.css` — Updated hero background to use WebP
- `script.js` — Added click-to-load TikTok functionality

## Technical Notes
- Used Python/Pillow for image optimization
- WebP with `<picture>` element provides automatic fallback for older browsers
- Click-to-load pattern respects user choice and saves bandwidth
- All optimizations are backwards compatible

## Deployment
Deployed via Netlify CLI:
```
netlify deploy --prod --message "Performance optimizations: WebP images, click-to-load TikTok, deferred JS, async fonts"
```

Live at: https://tonycarloslaw.com

## Expected Results
| Metric | Before | Expected After |
|--------|--------|----------------|
| Performance | 40 | 70-85+ |
| LCP | 33.0s | <4s |
| FCP | 8.1s | <2s |
| Total Blocking Time | 630ms | <200ms |

## Agency Response Draft
Drafted response to Alberto's agency inquiry about site access, explaining:
- Static HTML/CSS/JS site (no WordPress)
- Hosted on Netlify with built-in CDN
- GTM already installed for tracking management
- Can create landing pages on request
- Subdomains available if preferred
- Performance improvements in progress

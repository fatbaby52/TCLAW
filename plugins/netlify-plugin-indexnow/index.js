// Netlify build plugin: ping IndexNow after a production deploy.
//
// On each production deploy it figures out which HTML pages changed since the
// previously deployed commit and submits just those URLs to IndexNow. If it
// can't compute a reliable diff (e.g. the cached commit isn't in the shallow
// clone), it falls back to submitting every URL in sitemap.xml.
//
// No external dependencies — uses Node built-ins only.

const fs = require('fs')
const path = require('path')
const https = require('https')
const { execSync } = require('child_process')

const HOST = 'tonycarloslaw.com'
const KEY = 'b4a1e25e7492e6768ed5aae75b673fb8'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

// Map a repo file path to its canonical site URL, or null if it isn't a page.
function fileToUrl(file) {
  const f = file.replace(/\\/g, '/')
  if (!f.endsWith('.html')) return null
  let pathPart
  if (f === 'index.html') pathPart = '/'
  else if (f.endsWith('/index.html')) pathPart = '/' + f.slice(0, -'index.html'.length)
  else pathPart = '/' + f.slice(0, -'.html'.length) // clean URLs: strip .html
  return `https://${HOST}${pathPart}`
}

// Parse <loc> entries out of sitemap.xml into a Set of canonical URLs.
function readSitemapUrls(root) {
  const p = path.join(root, 'sitemap.xml')
  if (!fs.existsSync(p)) return new Set()
  const xml = fs.readFileSync(p, 'utf8')
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])
  return new Set(urls)
}

function submit(urls) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    })
    const req = https.request(
      ENDPOINT,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        res.resume() // drain
        res.on('end', () => resolve(res.statusCode))
      }
    )
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

module.exports = {
  async onSuccess({ utils }) {
    // Only act on real production deploys, not previews or branch deploys.
    if (process.env.CONTEXT !== 'production') {
      console.log(`IndexNow: skipping (deploy context is "${process.env.CONTEXT}", not production).`)
      return
    }

    const sitemapUrls = readSitemapUrls(process.cwd())
    const prev = process.env.CACHED_COMMIT_REF
    const cur = process.env.COMMIT_REF

    let urls = null // null = "couldn't diff, fall back to full sitemap"

    if (prev && cur && prev !== cur) {
      try {
        // Make sure the previously deployed commit is available locally.
        try {
          execSync(`git cat-file -e ${prev}^{commit}`, { stdio: 'ignore' })
        } catch {
          execSync(`git fetch --depth=100 origin ${prev}`, { stdio: 'ignore' })
        }
        const out = execSync(`git diff --name-only ${prev} ${cur}`, { encoding: 'utf8' })
        const changed = out.split('\n').filter(Boolean)
        urls = changed
          .map(fileToUrl)
          .filter((u) => u && sitemapUrls.has(u)) // only canonical, in-sitemap pages
      } catch (e) {
        console.log(`IndexNow: couldn't compute changed files (${e.message}); falling back to full sitemap.`)
        urls = null
      }
    }

    if (urls === null) {
      urls = [...sitemapUrls]
    }

    if (urls.length === 0) {
      console.log('IndexNow: no changed pages to submit.')
      return
    }

    try {
      const status = await submit(urls)
      console.log(`IndexNow: submitted ${urls.length} URL(s), HTTP ${status}.`)
      urls.forEach((u) => console.log(`  ${u}`))
    } catch (e) {
      // Don't fail the deploy just because the ping failed.
      console.log(`IndexNow: submission error (non-fatal): ${e.message}`)
    }
  },
}

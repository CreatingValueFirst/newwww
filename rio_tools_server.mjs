/**
 * Rio.bg Tools Server
 * -------------------------------------
 * Deploy on Vercel/Render/Fly/etc. Node 18+
 * npm i express got cheerio p-limit
 *
 * Exposes endpoints:
 *  - GET  /health
 *  - GET  /rio/search?city=sofia&category=krasota&q=масаж&limit=10&page=1
 *  - GET  /rio/top?city=sofia&category=pochivki&limit=10
 *  - GET  /rio/offer?url=https://rio.bg/oferti/...   (or id=J96OaL)
 *  - POST /rio/voucher/check  { voucherNumber, secretCode }  (requires cookie)
 *
 * Caveat: These endpoints scrape publicly available pages of Rio.bg.
 * Respect robots.txt and rate-limit requests. Add your contact email to User-Agent.
 */
import express from "express";
import got from "got";
import * as cheerio from "cheerio";
import PLimit from "p-limit";

const app = express();
app.use(express.json({ limit: "1mb" }));

// ------- Helpers -------
const UA = "VapiRioBot/1.0 (+contact: your-email@example.com)";
const BASE = "https://rio.bg";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const http = got.extend({
  headers: { "user-agent": UA, "accept-language": "bg,en;q=0.7" },
  retry: { limit: 1 },
  timeout: { request: 15000 }
});

function normalizeCity(city) {
  if (!city) return "";
  const map = {
    sofia: "sofia", plovdiv: "plovdiv", varna: "varna", burgas: "burgas",
    ruse: "ruse", pleven: "pleven", "stara-zagora": "stara-zagora",
    "veliko-tarnovo": "veliko-tarnovo", dobrich: "dobrich", blagoevgrad: "blagoevgrad",
    asenovgrad: "asenovgrad", "stara%20zagora":"stara-zagora"
  };
  const key = city.toLowerCase().replace(/\s+/g,"-");
  return map[key] || key;
}

function normalizeCategory(category) {
  if (!category) return "";
  const map = {
    krasota: "krasota",
    hapvane: "hapvane",
    pochivki: "pochivki",
    oferti: "", // all
  };
  const key = category.toLowerCase();
  return map[key] ?? key;
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildListURL({ city, category }) {
  const c = normalizeCity(city);
  const cat = normalizeCategory(category);
  if (c && cat) return `${BASE}/${c}/${cat}`; // e.g., /sofia/krasota (works for many combos)
  if (c) return `${BASE}/${c}`;              // e.g., /sofia
  if (cat) return `${BASE}/${cat}`;          // e.g., /krasota or /pochivki
  return `${BASE}/`;                          // homepage all deals
}

function absolute(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Extract numeric like "130 лв"
function pickPrice(text) {
  const m = (text || "").replace(/\u00A0/g," ").match(/(\d+(?:[\.,]\d+)?)\s*лв/i);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

async function scrapeList(url, { limit = 10, q } = {}) {
  const html = await http.get(url).text();
  const $ = cheerio.load(html);

  // Collect all links that look like offer pages: /oferti/...
  const links = [];
  $("a[href*='/oferti/']").each((_, a) => {
    const href = $(a).attr("href");
    if (!href) return;
    const text = $(a).text().trim().replace(/\s+/g, " ");
    // Try to pick a surrounding price
    const parentText = $(a).closest("li,div,article").text().trim().replace(/\s+/g, " ");
    const price = pickPrice(parentText) || pickPrice(text);
    links.push({ url: absolute(href), title: text, teaser: parentText.slice(0, 200), price });
  });

  const unique = uniqBy(links, x => x.url).slice(0, 80);

  // Optional keyword filter
  let filtered = unique;
  if (q) {
    const qlc = q.toLowerCase();
    filtered = unique.filter(x => (x.title + " " + x.teaser).toLowerCase().includes(qlc));
  }

  // Hydrate top N with details concurrently, but not too many
  const limitP = PLimit(4);
  const top = filtered.slice(0, limit);
  const detailed = await Promise.all(
    top.map(item => limitP(() => scrapeOffer(item.url).catch(() => ({ ...item, ok: false }))))
  );

  return detailed.map(x => ({ ...x, sourceUrl: url }));
}

function parseOfferOptions($) {
  const options = [];
  // List items containing "лв" under selectable options
  $("*").each((_, el) => {
    const t = $(el).text().trim();
    if (/лв/.test(t) && /(Избери|цена|минут|нощувк|ваучер)/i.test(t)) {
      const price = pickPrice(t);
      const label = t.replace(/\s+/g, " ").slice(0, 200);
      if (price) options.push({ label, price });
    }
  });
  // Deduplicate
  return uniqBy(options, o => `${o.label}-${o.price}`);
}

export async function scrapeOffer(urlOrId) {
  let url = urlOrId;
  if (!/^https?:\/\//i.test(urlOrId)) {
    // Accept rio id slug, e.g., J96OaL
    url = `${BASE}/oferti/${encodeURIComponent(urlOrId)}`;
  }
  const html = await http.get(url).text();
  const $ = cheerio.load(html);

  const title = ($("h1").first().text() || $("h2").first().text() || "").trim();
  // Top price
  let price = null;
  $("*").each((_, el) => {
    const txt = $(el).text().trim();
    if (!price && /ТОП ЦЕНА|Цена:/i.test(txt) && /лв/i.test(txt)) {
      price = pickPrice(txt);
    }
  });

  // Merchant name and location
  const merchant = ($("a[href*='/firmi/'], a[href*='/profil/']").first().text() || "").trim() ||
                   ($("section:contains('Адрес и контакти')").find("h3,h4").first().text() || "").trim();

  let address = "";
  $("section:contains('Адрес и контакти'), *:contains('Адрес и контакти')").each((_, sec) => {
    const t = $(sec).text().replace(/\s+/g, " ").trim();
    const m = t.match(/Адрес[^:]*:\s*([^|]+)|гр\.\s*[^,]+[^|]+/i);
    if (m) address = (m[1] || m[0]).trim();
  });

  // Validity period
  let validity = "";
  const bodyText = $("body").text().replace(/\s+/g, " ");
  const vm = bodyText.match(/Валидност на ваучера:\s*([^\.]+?\d{4}г?)/i);
  if (vm) validity = vm[0].replace("Валидност на ваучера:", "").trim();

  // Extract images
  const images = [];
  $("img").each((_, img) => {
    const src = $(img).attr("src");
    if (src && !/svg|icon/i.test(src)) images.push(absolute(src));
  });

  const options = parseOfferOptions($);
  const result = {
    ok: true,
    url,
    title,
    price,
    merchant: merchant || null,
    address: address || null,
    validity: validity || null,
    options,
    images: Array.from(new Set(images)).slice(0, 12)
  };
  return result;
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/rio/search", async (req, res) => {
  try {
    const { city = "", category = "", q = "", limit = "10", page = "1" } = req.query;
    // We ignore pagination for now; Rio pages use infinite scroll; we hydrate top results only
    const url = buildListURL({ city, category });
    const deals = await scrapeList(url, { limit: Math.min(parseInt(limit as string, 10) || 10, 20), q: String(q || "") });
    res.json({ ok: true, count: deals.length, city: normalizeCity(String(city)), category: normalizeCategory(String(category)), deals });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get("/rio/top", async (req, res) => {
  try {
    const { city = "", category = "", limit = "8" } = req.query;
    const url = buildListURL({ city, category });
    const deals = await scrapeList(url, { limit: Math.min(parseInt(limit as string, 10) || 8, 20) });
    res.json({ ok: true, deals });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get("/rio/offer", async (req, res) => {
  try {
    const { url, id } = req.query;
    if (!url && !id) return res.status(400).json({ ok: false, error: "Provide ?url= or ?id=" });
    const details = await scrapeOffer(String(url || id));
    res.json({ ok: true, offer: details });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * Voucher check requires being a merchant / partner.
 * If you have a valid Rio session cookie (after logging in),
 * forward it via header:  x-rio-cookie: "session=..."
 * This endpoint will forward the POST and parse a status from the HTML.
 * This is best effort and may stop working if Rio changes their site.
 */
app.post("/rio/voucher/check", async (req, res) => {
  try {
    const { voucherNumber, secretCode } = req.body || {};
    if (!voucherNumber || !secretCode) return res.status(400).json({ ok: false, error: "voucherNumber and secretCode are required" });
    const cookie = req.headers["x-rio-cookie"];
    if (!cookie) {
      return res.status(401).json({ ok: false, error: "Missing x-rio-cookie header with a valid logged-in session for voucher portal" });
    }
    const html = await http.post("https://www.rio.rockstar.bg/check-voucher.html", {
      headers: { cookie: String(cookie) },
      form: { number: voucherNumber, code: secretCode }
    }).text();
    const $ = cheerio.load(html);
    const txt = $("body").text().replace(/\s+/g, " ");
    let status = "unknown";
    if (/Статус:\s*Валиден/i.test(txt)) status = "valid";
    if (/Статус:\s*Не валиден/i.test(txt)) status = "invalid";
    res.json({ ok: true, voucherNumber, status, raw: txt.slice(0, 800) });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});


app.post("/rio/offer", async (req, res) => {
  try {
    const { url, id } = req.body || {};
    if (!url && !id) return res.status(400).json({ ok: false, error: "Provide url or id" });
    const details = await scrapeOffer(String(url || id));
    res.json({ ok: true, offer: details });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 404
app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

// Export default for serverless runtimes
export default app;

// If run as a standalone Node process
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3333;
  app.listen(port, () => console.log("Rio Tools server listening on :" + port));
}
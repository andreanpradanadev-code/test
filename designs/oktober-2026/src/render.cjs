// Render semua desain Oktober 2026 ke PNG.
// Pakai: node designs/oktober-2026/src/render.cjs
// Foto asli: taruh di designs/oktober-2026/photos/ dengan nama sesuai label di placeholder
// (mis. donat.jpg, banana-bread.jpg, menu-oktober.jpg), lalu jalankan ulang.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const src = __dirname;
const root = path.resolve(src, '..');
const out = path.join(root, 'png');
const photosDir = path.join(root, 'photos');

// Urutan grid Instagram setelah semua terposting (terbaru di kiri atas).
const FEED_ORDER = ['16_', '14a_', '13_', '12_', '11_', '10_', '09a_', '08_', '06_', '04_', '03_', '02_', '01_'];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const photos = {};
  if (fs.existsSync(photosDir)) {
    for (const f of fs.readdirSync(photosDir)) {
      if (/\.(jpe?g|png|webp)$/i.test(f)) photos[path.parse(f).name] = pathToFileURL(path.join(photosDir, f)).href;
    }
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  await page.addInitScript(p => { window.PHOTOS = p; }, photos);
  await page.goto(pathToFileURL(path.join(src, 'posts.html')).href);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  await page.waitForTimeout(300);

  const ids = await page.$$eval('.post', els => els.map(e => e.id));
  for (const f of fs.readdirSync(out)) if (f.endsWith('.png')) fs.unlinkSync(path.join(out, f));
  for (const id of ids) {
    await page.locator(`[id="${id}"]`).screenshot({ path: path.join(out, `${id}.png`) });
    console.log('✓', id);
  }

  // Preview grid feed + stories
  const files = fs.readdirSync(out).filter(f => f.endsWith('.png'));
  const pick = prefix => files.find(f => f.startsWith(prefix));
  const label = f => f.split('_')[1].replace('-', ' ').replace('okt', 'Okt');
  const tiles = FEED_ORDER.map(pick).filter(Boolean).map(f => `
    <div class="tile"><img src="../png/${f}" style="${f.includes('reels') ? 'object-position:center' : ''}">
    <span>${label(f)}${f.includes('reels') ? ' · Reels' : f.includes('carousel') ? ' · Carousel' : ''}</span></div>`).join('');
  const stories = files.filter(f => f.includes('_story_')).map(f => `
    <div class="st"><img src="../png/${f}"><span>${label(f)}</span></div>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#000;color:#f5f5f5;font-family:Helvetica,Arial,sans-serif;width:1120px;padding:40px}
    h1{font-size:30px;margin:0 0 6px} p{margin:0 0 28px;color:#aaa;font-size:18px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
    .tile{position:relative;aspect-ratio:3/4;overflow:hidden;background:#222}
    .tile img,.st img{width:100%;height:100%;object-fit:cover;display:block}
    span{position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.65);padding:5px 10px;border-radius:6px;font-size:15px}
    h2{font-size:24px;margin:44px 0 16px}
    .row{display:flex;gap:14px}.st{position:relative;width:210px;aspect-ratio:9/16;border-radius:14px;overflow:hidden}
  </style><h1>gusteebakery — preview feed Oktober 2026</h1><p>Urutan grid setelah semua terposting (terbaru di kiri atas)</p>
  <div class="grid">${tiles}</div><h2>Stories</h2><div class="row">${stories}</div>`;
  const previewHtml = path.join(src, 'preview.html');
  fs.writeFileSync(previewHtml, html);
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto(pathToFileURL(previewHtml).href);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(root, 'preview-feed-oktober.png'), fullPage: true });
  fs.unlinkSync(previewHtml);
  await browser.close();
  console.log(`Selesai: ${ids.length} desain + preview-feed-oktober.png`);
})();

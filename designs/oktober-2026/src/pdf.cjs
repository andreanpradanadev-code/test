// Ekspor desain Oktober 2026 ke PDF vektor (teks tetap teks) untuk diimpor ke Canva sebagai desain yang bisa diedit.
// Pakai: node designs/oktober-2026/src/pdf.cjs
// Hasil: designs/oktober-2026/canva/*.pdf — satu PDF per ukuran kanvas, satu halaman per desain.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const src = __dirname;
const root = path.resolve(src, '..');
const out = path.join(root, 'canva');
const photosDir = path.join(root, 'photos');

const GROUPS = [
  { file: 'gustee-oktober-2026_feed-1080x1440.pdf', kind: 'feed', height: 1440 },
  { file: 'gustee-oktober-2026_story-reels-1080x1920.pdf', kind: 'story', height: 1920 },
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const photos = {};
  if (fs.existsSync(photosDir)) {
    for (const f of fs.readdirSync(photosDir)) {
      if (/\.(jpe?g|png|webp)$/i.test(f)) photos[path.parse(f).name] = pathToFileURL(path.join(photosDir, f)).href;
    }
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.addInitScript(p => { window.PHOTOS = p; }, photos);
  await page.goto(pathToFileURL(path.join(src, 'posts.html')).href);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  // Font statis (bukan variable font) agar teks di PDF tetap teks yang bisa diedit di Canva.
  await page.evaluate(async () => {
    document.querySelector('link[href="fonts.css"]').remove();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'fonts-static.css';
    await new Promise(r => { l.onload = r; document.head.appendChild(l); });
    await Promise.all(['900 40px Fraunces', '600 40px Fraunces', '40px "Homemade Apple"', '500 40px "Cormorant Garamond"',
      '600 40px "Cormorant Garamond"', '700 40px "Cormorant Garamond"', 'italic 600 40px "Cormorant Garamond"',
      '500 20px Montserrat', '600 20px Montserrat', '700 20px Montserrat', '800 20px Montserrat', '900 20px Montserrat'].map(f => document.fonts.load(f)));
  });
  // Tanpa tekstur grain: overlay itu akan jadi satu gambar besar di atas teks dan mengunci desain di Canva.
  await page.addStyleTag({ content: `
    body { padding: 0 !important; gap: 0 !important; background: none !important; display: block !important; }
    .grain::after { display: none !important; }
    .post { break-after: page; }
    .post.last { break-after: auto; }
    .hide { display: none !important; }` });

  for (const g of GROUPS) {
    const ids = await page.$$eval('.post', (els, kind) => {
      els.forEach(e => { e.classList.toggle('hide', !e.classList.contains(kind)); e.classList.remove('last'); });
      const shown = els.filter(e => e.classList.contains(kind));
      shown[shown.length - 1].classList.add('last');
      return shown.map(e => e.id);
    }, g.kind);
    await page.pdf({ path: path.join(out, g.file), width: '1080px', height: `${g.height}px`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    fs.writeFileSync(path.join(out, g.file.replace('.pdf', '.halaman.txt')), ids.map((id, i) => `${i + 1}. ${id}`).join('\n') + '\n');
    console.log(`✓ ${g.file}: ${ids.length} halaman`);
  }
  await browser.close();
})();

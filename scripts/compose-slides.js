// Compose MakeLemonAd carousel slides → PNGs 1080x1350
// Uso: node compose-slides.js <config.json> [slideFilename]
// Se passar slideFilename, renderiza só aquele slide (útil pra iterar)

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const LOGO_PATH = path.resolve(__dirname, "../make/social/identidade-visual/logos/logo_make_oficial.png");

async function renderSlide(browser, template, slide, outPath) {
  let html = template;

  // Background
  html = html.replace("{{BG_CLASS}}", `bg-${slide.bg || "black"}`);

  // Top-left (hashtag nas capas, numeração nos internos, nada no CTA)
  let topLeft = "";
  if (slide.isCover) {
    topLeft = `<div class="hashtag">#performance<strong>estratégica</strong>360</div>`;
  } else if (slide.number && !slide.isCta) {
    topLeft = `<div class="slide-num">${String(slide.number).padStart(2, "0")}</div>`;
  }
  html = html.replace("{{TOP_LEFT}}", topLeft);

  // Top-right (selo Make nas capas)
  let topRight = "";
  if (slide.isCover) {
    const logoData = fs.readFileSync(LOGO_PATH).toString("base64");
    topRight = `<div class="logo-top"><img src="data:image/png;base64,${logoData}" alt=""></div>`;
  }
  html = html.replace("{{TOP_RIGHT}}", topRight);

  // Content (substitui LOGO_PLACEHOLDER pelo logo base64 se houver)
  let content = slide.content || "";
  if (content.includes("LOGO_PLACEHOLDER")) {
    const logoData = fs.readFileSync(LOGO_PATH).toString("base64");
    content = content.replace(/LOGO_PLACEHOLDER/g, `data:image/png;base64,${logoData}`);
  }
  html = html.replace("{{CONTENT}}", content);

  // Footer (não no CTA)
  let footer = "";
  if (!slide.isCta) {
    const slogan = slide.footerSlogan || "Conexão que Gera Conversão";
    footer = `<div class="footer">
      <span class="handle">@make.lemonad</span>
      <span class="signature">Strategy + Branding + Performance = <em>${slogan}</em></span>
    </div>`;
  }
  html = html.replace("{{FOOTER}}", footer);

  // Side strip = cor do próximo slide. Seta = cor do slide atual invadindo a faixa.
  let sideStrip = "";
  if (!slide.isCta && slide.nextBg) {
    sideStrip = `<div class="side-strip ${slide.nextBg}"></div>
      <div class="slide-arrow from-${slide.bg || "black"}"></div>`;
  }
  html = html.replace("{{SIDE_STRIP}}", sideStrip);

  // Render
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(700); // fonts
  await page.screenshot({ path: outPath, type: "png", clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
}

async function main() {
  const configPath = process.argv[2];
  const filterFilename = process.argv[3];
  if (!configPath) { console.error("Uso: node compose-slides.js <config.json> [slideFilename]"); process.exit(1); }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const outDir = path.resolve(path.dirname(configPath), config.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const template = fs.readFileSync(path.resolve(__dirname, "templates/slide.html"), "utf8");

  const slides = filterFilename
    ? config.slides.filter(s => s.filename === filterFilename)
    : config.slides;

  if (!slides.length) { console.error(`Nenhum slide casa com ${filterFilename}`); process.exit(1); }

  const browser = await chromium.launch();
  for (const slide of slides) {
    const outPath = path.join(outDir, slide.filename);
    await renderSlide(browser, template, slide, outPath);
    console.log(`  OK: ${slide.filename}`);
  }
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });

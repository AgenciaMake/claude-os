// Compose MakeLemonAd carousel slides → PNGs 1080x1350
// Uso: node compose-slides.js <config.json>
// config.json = { outDir, slides: [ { filename, bg, isCover, isCta, number, content, footerSlogan } ] }

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const LOGO_PATH = path.resolve(__dirname, "../make/social/identidade-visual/logos/logo_make_oficial.png");

async function renderSlide(browser, template, slide, outPath) {
  let html = template;

  // Background
  html = html.replace("{{BG_CLASS}}", `bg-${slide.bg || "black"}`);

  // Top-left (hashtag nas capas, numeração nos internos)
  let topLeft = "";
  if (slide.isCover) {
    topLeft = `<div class="top-left"><span class="hashtag">#performance<strong>estratégica</strong>360</span></div>`;
  } else if (slide.number && !slide.isCta) {
    topLeft = `<div class="top-left"><span class="slide-num">${String(slide.number).padStart(2, "0")}</span></div>`;
  }
  html = html.replace("{{TOP_LEFT}}", topLeft);

  // Top-right (selo Make nas capas)
  let topRight = "";
  if (slide.isCover) {
    const logoData = fs.readFileSync(LOGO_PATH).toString("base64");
    topRight = `<div class="top-right"><img src="data:image/png;base64,${logoData}" alt=""></div>`;
  }
  html = html.replace("{{TOP_RIGHT}}", topRight);

  // Content (substitui LOGO_PLACEHOLDER pelo logo base64)
  let content = slide.content || "";
  if (content.includes("LOGO_PLACEHOLDER")) {
    const logoData = fs.readFileSync(LOGO_PATH).toString("base64");
    content = content.replace(/LOGO_PLACEHOLDER/g, `data:image/png;base64,${logoData}`);
  }
  html = html.replace("{{CONTENT}}", content);

  // Next arrow (internos, não CTA)
  const nextArrow = slide.isCta ? "" : `<div class="next-arrow"></div>`;
  html = html.replace("{{NEXT_ARROW}}", nextArrow);

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

  // Render
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(500); // fonts
  await page.screenshot({ path: outPath, type: "png", omitBackground: false, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
}

async function main() {
  const configPath = process.argv[2];
  if (!configPath) { console.error("Uso: node compose-slides.js <config.json>"); process.exit(1); }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const outDir = path.resolve(path.dirname(configPath), config.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const template = fs.readFileSync(path.resolve(__dirname, "templates/slide.html"), "utf8");

  const browser = await chromium.launch();
  for (const slide of config.slides) {
    const outPath = path.join(outDir, slide.filename);
    await renderSlide(browser, template, slide, outPath);
    console.log(`  OK: ${slide.filename}`);
  }
  await browser.close();
  console.log(`\nSalvou ${config.slides.length} slides em ${outDir}`);
}

main().catch(e => { console.error(e); process.exit(1); });

// Compose MakeLemonAd carousel slides → PNGs 1080x1350
// Uso: node compose-slides.js <config.json> [slideFilename]
// Se passar slideFilename, renderiza só aquele slide (útil pra iterar)

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const LOGO_PNG_PATH = path.resolve(__dirname, "../make/social/identidade-visual/logos/logo_make_oficial.png");
const LOGO_SVG_PATH = path.resolve(__dirname, "../make/social/identidade-visual/logos/logo_make.svg");

// Espaço útil pro conteúdo central (entre margens, sem invadir hashtag/logo no topo,
// rodapé no rodapé, ou faixa lateral à direita). Usado pelo auto-fit.
const SAFE_AREA = { width: 920, height: 1000 };

// Carrega o SVG do logo e troca a cor do círculo (fill da classe .st0) pela cor pedida.
function getLogoSvg(fillColor) {
  const raw = fs.readFileSync(LOGO_SVG_PATH, "utf8");
  return raw.replace(/\.st0\s*{\s*fill:\s*#[0-9a-fA-F]{3,6};?\s*}/, `.st0 { fill: ${fillColor}; }`);
}

// Auto-fit: clona o conteúdo num test zone sem constraint pra medir o tamanho NATURAL
// do texto (sem ser limitado pela largura do flex). Depois aplica transform: scale se necessário.
async function fitContent(page) {
  await page.evaluate(({ width, height }) => {
    const content = document.querySelector(".content");
    if (!content) return;
    content.style.transform = "";
    content.style.transformOrigin = "left top";

    // Test zone: clone do conteúdo com largura/altura livres pra medir natural size
    const test = document.createElement("div");
    test.style.cssText = "position:absolute;top:-99999px;left:-99999px;width:auto;height:auto;max-width:none;white-space:nowrap;";
    test.innerHTML = content.innerHTML;
    document.body.appendChild(test);

    let maxW = 0;
    let totalH = 0;

    // Cada filho direto do content vira uma "linha" cuja largura natural medimos sem quebra
    [...test.children].forEach(line => {
      // remove white-space:nowrap só se a linha for explicitamente multilinha
      const lineRect = line.getBoundingClientRect();
      if (lineRect.width > maxW) maxW = lineRect.width;
      totalH += lineRect.height;
    });

    // Também considera descendentes profundos (caso tenha spans/inline-blocks que extrapolam)
    test.querySelectorAll("*").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > maxW) maxW = r.width;
    });

    document.body.removeChild(test);

    let scale = 1;
    if (maxW   > width)  scale = Math.min(scale, width  / maxW);
    if (totalH > height) scale = Math.min(scale, height / totalH);

    if (scale < 1) {
      content.style.transform = `scale(${scale})`;
    }
  }, SAFE_AREA);
}

async function renderSlide(browser, template, slide, outPath) {
  let html = template;

  // Background. Se tem coverImage, adiciona a div da imagem + ajusta classes.
  let bgClass = `bg-${slide.bg || "black"}`;
  let coverImageBlock = "";
  if (slide.coverImage) {
    bgClass += " has-cover-image";
    const imgPath = path.resolve(path.dirname(process.argv[2]), slide.coverImage);
    const imgB64 = fs.readFileSync(imgPath).toString("base64");
    const imgMime = slide.coverImage.endsWith(".jpg") ? "image/jpeg" : "image/png";
    coverImageBlock = `<div class="cover-image-area" style="background-image:url('data:${imgMime};base64,${imgB64}');"></div>
      <div class="cover-text-area"></div>`;
  }
  html = html.replace("{{BG_CLASS}}", bgClass);

  // Top-left (hashtag nas capas, numeração nos internos, nada no CTA)
  // Suporta override explícito de cor: slide.hashtagColor / slide.numColor (hex ou var())
  let topLeft = "";
  if (slide.isCover) {
    const colorStyle = slide.hashtagColor ? ` style="color:${slide.hashtagColor};"` : "";
    topLeft = `<div class="hashtag"${colorStyle}>#performance<strong>estratégica</strong>360</div>`;
  } else if (slide.number && !slide.isCta) {
    const colorStyle = slide.numColor ? ` style="color:${slide.numColor};"` : "";
    topLeft = `<div class="slide-num"${colorStyle}>${String(slide.number).padStart(2, "0")}</div>`;
  }
  html = html.replace("{{TOP_LEFT}}", topLeft);

  // Top-right (selo Make nas capas)
  // logoStyle: "png-oficial" (default) | "svg-{cor}" — ex: "svg-#000000", "svg-#434244", "svg-#FFFFFF"
  let topRight = "";
  if (slide.isCover) {
    const style = slide.logoStyle || "png-oficial";
    if (style === "png-oficial") {
      const logoData = fs.readFileSync(LOGO_PNG_PATH).toString("base64");
      topRight = `<div class="logo-top"><img src="data:image/png;base64,${logoData}" alt=""></div>`;
    } else if (style.startsWith("svg-")) {
      const fill = style.slice(4);
      const svgRaw = getLogoSvg(fill);
      const svgB64 = Buffer.from(svgRaw).toString("base64");
      topRight = `<div class="logo-top"><img src="data:image/svg+xml;base64,${svgB64}" alt=""></div>`;
    }
  }
  html = html.replace("{{TOP_RIGHT}}", topRight);

  // Content (substitui LOGO_PLACEHOLDER pelo logo base64 — usa PNG oficial)
  let content = slide.content || "";
  if (content.includes("LOGO_PLACEHOLDER")) {
    const logoData = fs.readFileSync(LOGO_PNG_PATH).toString("base64");
    content = content.replace(/LOGO_PLACEHOLDER/g, `data:image/png;base64,${logoData}`);
  }
  // Auto-converte qualquer <img src='X.png|jpg'> pra base64 (caminho relativo ao config.json)
  content = content.replace(/<img\s+([^>]*\s)?src=['"]([^'"]+\.(png|jpg|jpeg))['"]/gi, (match, before, imgSrc, ext) => {
    if (imgSrc.startsWith("data:") || imgSrc.startsWith("http")) return match;
    const imgPath = path.resolve(path.dirname(process.argv[2]), imgSrc);
    if (!fs.existsSync(imgPath)) {
      console.warn(`  WARN: imagem não encontrada: ${imgPath}`);
      return match;
    }
    const imgB64 = fs.readFileSync(imgPath).toString("base64");
    const mime = ext.toLowerCase() === "jpg" || ext.toLowerCase() === "jpeg" ? "image/jpeg" : "image/png";
    return `<img ${before || ""}src="data:${mime};base64,${imgB64}"`;
  });
  html = html.replace("{{CONTENT}}", content);
  html = html.replace("{{COVER_IMAGE}}", coverImageBlock);

  // Footer (não no CTA). Override de cor: slide.footerColor
  let footer = "";
  if (!slide.isCta) {
    const slogan = slide.footerSlogan || "Conexão que Gera Conversão";
    const colorStyle = slide.footerColor ? ` style="color:${slide.footerColor};"` : "";
    footer = `<div class="footer"${colorStyle}>
      <span class="handle">@make.lemonad</span>
      <span class="signature">Strategy + Branding + Performance = <em>${slogan}</em></span>
    </div>`;
  }
  html = html.replace("{{FOOTER}}", footer);

  // Side strip = cor do próximo slide. Seta = cor do slide atual invadindo a faixa.
  // Override explícito: slide.arrowColor (necessário em fundos split, onde a cor do bg
  // do slide atual depende da posição vertical da seta).
  let sideStrip = "";
  if (!slide.isCta && slide.nextBg) {
    const arrowStyle = slide.arrowColor ? ` style="border-left-color:${slide.arrowColor};"` : "";
    sideStrip = `<div class="side-strip ${slide.nextBg}"></div>
      <div class="slide-arrow from-${slide.bg || "black"}"${arrowStyle}></div>`;
  }
  html = html.replace("{{SIDE_STRIP}}", sideStrip);

  // Render
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(700); // fonts
  await fitContent(page); // auto-fit caso o conteúdo central transborde a área útil
  await page.waitForTimeout(100);
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

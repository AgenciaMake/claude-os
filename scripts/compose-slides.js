// Compose MakeLemonAd carousel slides → PNGs 1080x1350 (feed) ou 1080x1920 (story)
// Uso: node compose-slides.js <config.json> [slideFilename]
// Se passar slideFilename, renderiza só aquele slide (útil pra iterar)
// config.json pode ter "height": 1920 e "templateFile": "story.html" pra stories

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const LOGO_PNG_PATH = path.resolve(__dirname, "../make/social/identidade-visual/logos/logo_make_oficial.png");
const LOGO_SVG_PATH = path.resolve(__dirname, "../make/social/identidade-visual/logos/logo_make.svg");

// Espaço útil pro conteúdo central. Grade Make: 70px em todos os lados.
// Stories: altura menor porque UI do Instagram cobre topo (~200px) e rodapé (~300px).
const SAFE_AREA_FEED  = { width: 940, height: 1100 };
const SAFE_AREA_STORY = { width: 940, height: 1480 };

// Safe areas alternativas (CitraChat usa 90px → área útil 900×1170)
const SAFE_AREA_FEED_90  = { width: 900, height: 1170 };
const SAFE_AREA_STORY_90 = { width: 900, height: 1740 };

// Cor do duplo chevron de continuidade, contrastando com o fundo do slide.
const ARROW_COLOR = {
  'black':        '#ffffff',
  'dark-gray':    '#ffffff',
  'white':        '#000000',
  'light-gray':   '#434244',
  'lime':         '#000000',
  'green2':       '#ffffff',
  'split-hv':     '#000000',
  'split-hv-inv': '#ffffff',
  'split-hv-gb':  '#434244',
  'split-vl':     '#000000',
};

// Carrega o SVG do logo e troca a cor do círculo (fill da classe .st0) pela cor pedida.
function getLogoSvg(fillColor) {
  const raw = fs.readFileSync(LOGO_SVG_PATH, "utf8");
  return raw.replace(/\.st0\s*{\s*fill:\s*#[0-9a-fA-F]{3,6};?\s*}/, `.st0 { fill: ${fillColor}; }`);
}

// Auto-fit: força a largura útil da SAFE_AREA, mede a altura natural com essa largura,
// e aplica transform: scale APENAS se a altura ultrapassar o disponível. Largura fica
// SEMPRE 100% do safe-area (preserva o "fit horizontal" de texto/imagem).
async function fitContent(page, safeArea) {
  await page.evaluate(({ width, height }) => {
    const content = document.querySelector(".content");
    if (!content) return;
    content.style.transform = "";
    content.style.transformOrigin = "left top";
    content.style.width = "";

    // Mede altura natural do conteúdo com largura FIXA = safe-area.width (clone no DOM).
    const test = document.createElement("div");
    test.style.cssText = `position:absolute;top:-99999px;left:-99999px;width:${width}px;`;
    test.innerHTML = content.innerHTML;
    document.body.appendChild(test);
    const naturalH = test.scrollHeight;
    document.body.removeChild(test);

    if (naturalH > height) {
      // Passa do alto disponível: aplica scale e compensa a largura pra que
      // visualmente o conteúdo continue ocupando os `width`px (fit horizontal).
      const scale = height / naturalH;
      content.style.width = (width / scale) + "px";
      content.style.transform = `scale(${scale})`;
    } else {
      // Cabe sem scale — só fixa a largura no safe-area pra usar 100% da largura útil.
      content.style.width = width + "px";
    }
  }, safeArea);
}

async function renderSlide(browser, template, slide, outPath, slideHeight, safeArea, configFlags, configLogoPng) {
  let html = template;

  // Background. Se tem coverImage (TV4) ou fullBleedImage, adiciona a div da imagem + ajusta classes.
  let bgClass = `bg-${slide.bg || "black"}`;
  if (slide.isCta) bgClass += " has-cta";
  let coverImageBlock = "";
  if (slide.coverImage) {
    bgClass += " has-cover-image";
    const imgPath = path.resolve(path.dirname(process.argv[2]), slide.coverImage);
    const imgB64 = fs.readFileSync(imgPath).toString("base64");
    const imgMime = slide.coverImage.endsWith(".jpg") ? "image/jpeg" : "image/png";
    coverImageBlock = `<div class="cover-image-area" style="background-image:url('data:${imgMime};base64,${imgB64}');"></div>
      <div class="cover-text-area"></div>`;
  } else if (slide.fullBleedImage) {
    bgClass += " has-fullbleed";
    const imgPath = path.resolve(path.dirname(process.argv[2]), slide.fullBleedImage);
    const imgB64 = fs.readFileSync(imgPath).toString("base64");
    const imgMime = slide.fullBleedImage.endsWith(".jpg") ? "image/jpeg" : "image/png";
    coverImageBlock = `<div class="fullbleed-image-area" style="background-image:url('data:${imgMime};base64,${imgB64}');"></div>`;
  } else if (slide.sideImage) {
    bgClass += " has-side-image";
    const imgPath = path.resolve(path.dirname(process.argv[2]), slide.sideImage);
    const imgB64 = fs.readFileSync(imgPath).toString("base64");
    const imgMime = slide.sideImage.endsWith(".jpg") ? "image/jpeg" : "image/png";
    const fadeColor = slide.sideFadeColor || "#000000";
    coverImageBlock = `<div class="side-image-area" style="background-image:url('data:${imgMime};base64,${imgB64}');--side-fade-color:${fadeColor};"></div>`;
  }
  html = html.replace("{{BG_CLASS}}", bgClass);

  const noTopElements = configFlags.noTopElements;
  const noFooter = configFlags.noFooter;

  // Top-left (hashtag nas capas, numeração nos internos, nada no CTA)
  // Suporta override explícito de cor: slide.hashtagColor / slide.numColor (hex ou var())
  let topLeft = "";
  if (!noTopElements) {
    if (slide.isCover) {
      const colorStyle = slide.hashtagColor ? ` style="color:${slide.hashtagColor};"` : "";
      topLeft = `<div class="hashtag"${colorStyle}>Agência Boutique 360</div>`;
    } else if (slide.number && !slide.isCta) {
      const colorStyle = slide.numColor ? ` style="color:${slide.numColor};"` : "";
      topLeft = `<div class="slide-num"${colorStyle}>${String(slide.number).padStart(2, "0")}</div>`;
    }
  }
  html = html.replace("{{TOP_LEFT}}", topLeft);

  // Top-right (selo nas capas). slide.noLogo = true omite o logo.
  // logoStyle: "png-oficial" (default) | "svg-{cor}" — ex: "svg-#000000"
  // configLogoPng: override do logo via config (ex: CitraChat)
  let topRight = "";
  if (!noTopElements && slide.isCover && !slide.noLogo) {
    const style = slide.logoStyle || "png-oficial";
    const activeLogo = configLogoPng || LOGO_PNG_PATH;
    if (style === "png-oficial" || configLogoPng) {
      const logoData = fs.readFileSync(activeLogo).toString("base64");
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

  // Footer (não no CTA, não quando noFooter). Override de cor: slide.footerColor
  let footer = "";
  if (!slide.isCta && !noFooter) {
    const slogan = slide.footerSlogan || configFlags.footerSlogan || "Menos Ruído. Mais Resultado.";
    const handle = slide.footerHandle || configFlags.footerHandle || "@make.lemonad";
    const colorStyle = slide.footerColor ? ` style="color:${slide.footerColor};"` : "";
    footer = `<div class="footer"${colorStyle}>
      <span class="handle">${handle}</span>
      <span class="signature"><em>${slogan}</em></span>
    </div>`;
  }
  html = html.replace("{{FOOTER}}", footer);

  // Swipe arrow (feed) ou swipe-up indicator (story). Ausente no CTA e quando noArrow: true.
  let swipeArrow = "";
  if (!slide.isCta && !slide.noArrow) {
    const color = ARROW_COLOR[slide.bg || 'black'] || '#ffffff';
    if (slideHeight === 1920) {
      // Story: indicador de swipe-up no rodapé
      const label = slide.swipeLabel || "Ver no feed";
      swipeArrow = `<div class="swipe-up" style="color:${color};">
        <svg viewBox="0 0 32 20" width="32" height="20" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4,16 16,4 28,16"/>
        </svg>
        <span>${label}</span>
      </div>`;
    } else {
      swipeArrow = `<svg class="swipe-arrow" viewBox="0 0 54 28" width="54" height="28" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4,4 18,14 4,24" opacity="0.3"/>
        <polyline points="26,4 40,14 26,24"/>
      </svg>`;
    }
  }
  const swipeKey = slideHeight === 1920 ? "{{SWIPE_UP}}" : "{{SWIPE_ARROW}}";
  html = html.replace(swipeKey, swipeArrow);
  // Limpa placeholder não usado (story.html tem {{SWIPE_UP}}, feed tem {{SWIPE_ARROW}})
  html = html.replace("{{SWIPE_UP}}", "").replace("{{SWIPE_ARROW}}", "");

  // Render
  const page = await browser.newPage({ viewport: { width: 1080, height: slideHeight } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(700); // fonts
  if (!slide.isCta) await fitContent(page, safeArea);
  await page.waitForTimeout(100);
  await page.screenshot({ path: outPath, type: "png", clip: { x: 0, y: 0, width: 1080, height: slideHeight } });
  await page.close();
}

async function main() {
  const configPath = process.argv[2];
  const filterFilename = process.argv[3];
  if (!configPath) { console.error("Uso: node compose-slides.js <config.json> [slideFilename]"); process.exit(1); }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const outDir = path.resolve(path.dirname(configPath), config.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const slideHeight = config.height || 1350;
  const margin90 = config.margin === 90;
  const safeArea = slideHeight === 1920
    ? (margin90 ? SAFE_AREA_STORY_90 : SAFE_AREA_STORY)
    : (margin90 ? SAFE_AREA_FEED_90  : SAFE_AREA_FEED);
  const templateFile = config.templateFile || "slide.html";
  const template = fs.readFileSync(path.resolve(__dirname, "templates", templateFile), "utf8");
  const configLogoPng = config.logoPng
    ? path.resolve(path.dirname(configPath), config.logoPng)
    : null;
  const configFlags = {
    noTopElements:  config.noTopElements  || false,
    noFooter:       config.noFooter       || false,
    footerHandle:   config.footerHandle   || null,
    footerSlogan:   config.footerSlogan   || null,
  };

  const slides = filterFilename
    ? config.slides.filter(s => s.filename === filterFilename)
    : config.slides;

  if (!slides.length) { console.error(`Nenhum slide casa com ${filterFilename}`); process.exit(1); }

  const browser = await chromium.launch();
  for (const slide of slides) {
    const outPath = path.join(outDir, slide.filename);
    await renderSlide(browser, template, slide, outPath, slideHeight, safeArea, configFlags, configLogoPng);
    console.log(`  OK: ${slide.filename}`);
  }
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });

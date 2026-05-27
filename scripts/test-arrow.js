const { chromium } = require('playwright');
const fs = require('fs');

const content = `<div style='line-height:1.0;'><div style='font-size:64px;font-weight:800;color:var(--black);text-transform:uppercase;font-style:italic;letter-spacing:-1px;line-height:0.95;margin-bottom:44px;'>3 ações que valem<br><em style='font-style:italic;'>agora</em>:</div><div style='display:flex;flex-direction:column;gap:36px;'><div style='display:flex;gap:24px;align-items:center;'><div style='font-size:120px;font-weight:800;color:transparent;-webkit-text-stroke:3px var(--black);line-height:0.85;font-style:italic;flex:0 0 auto;'>01</div><div style='flex:1;'><div style='font-size:46px;font-weight:700;color:var(--black);line-height:1.0;'>Conteúdo <em style='font-style:italic;'>citável</em>.</div><div style='font-size:24px;font-weight:400;color:var(--black);line-height:1.3;margin-top:6px;opacity:0.8;'>Dados, fontes, autoridade — não só palavras-chave.</div></div></div><div style='display:flex;gap:24px;align-items:center;'><div style='font-size:120px;font-weight:800;color:transparent;-webkit-text-stroke:3px var(--black);line-height:0.85;font-style:italic;flex:0 0 auto;'>02</div><div style='flex:1;'><div style='font-size:46px;font-weight:700;color:var(--black);line-height:1.0;'>Pensa em <em style='font-style:italic;'>AEO</em>, não só SEO.</div><div style='font-size:24px;font-weight:400;color:var(--black);line-height:1.3;margin-top:6px;opacity:0.8;'>Answer Engine Optimization — ser a resposta da IA.</div></div></div><div style='display:flex;gap:24px;align-items:center;'><div style='font-size:120px;font-weight:800;color:transparent;-webkit-text-stroke:3px var(--black);line-height:0.85;font-style:italic;flex:0 0 auto;'>03</div><div style='flex:1;'><div style='font-size:46px;font-weight:700;color:var(--black);line-height:1.0;'>Diversifica canais.</div><div style='font-size:24px;font-weight:400;color:var(--black);line-height:1.3;margin-top:6px;opacity:0.8;'>Vídeo, social, newsletter — quem depende só do Google já perdeu.</div></div></div></div></div>`;

const baseCSS = `
  :root { --lime:#D6DE23;--black:#000;--text-dark:#434244;--white:#fff;--bg-white:#DEDEDE; }
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body { width:1080px; height:1350px; font-family:'Rubik',sans-serif; overflow:hidden; -webkit-font-smoothing:antialiased; }
  .slide { position:relative; width:1080px; height:1350px; padding:50px; display:flex; flex-direction:column; justify-content:center; overflow:hidden; }
  .bg-lime { background:var(--lime); color:var(--text-dark); }
  .slide-num { position:absolute; top:50px; left:50px; border:1.2px solid #000; padding:4px 14px; font-size:16px; font-weight:400; font-style:italic; z-index:5; color:#000; }
  .footer { position:absolute; bottom:50px; left:50px; right:50px; display:flex; justify-content:space-between; align-items:center; font-size:16px; z-index:5; color:#000; }
  .footer .handle { font-style:italic; font-weight:500; }
  .footer .signature em { font-weight:600; font-style:italic; }
  .content { position:relative; z-index:2; width:100%; }
`;

const arrows = [
  {
    id: 'A',
    label: 'Chevron simples',
    svg: `<svg viewBox="0 0 32 64" width="32" height="64" style="position:absolute;right:50px;top:50%;transform:translateY(-50%);z-index:5;" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,6 26,32 6,58"/></svg>`
  },
  {
    id: 'B',
    label: 'Seta com traço',
    svg: `<svg viewBox="0 0 56 32" width="56" height="32" style="position:absolute;right:50px;top:50%;transform:translateY(-50%);z-index:5;" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="16" x2="50" y2="16"/><polyline points="32,4 50,16 32,28"/></svg>`
  },
  {
    id: 'C',
    label: 'Duplo chevron',
    svg: `<svg viewBox="0 0 54 64" width="54" height="64" style="position:absolute;right:50px;top:50%;transform:translateY(-50%);z-index:5;" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 20,32 4,58" opacity="0.3"/><polyline points="26,6 42,32 26,58"/></svg>`
  },
];

(async () => {
  const browser = await chromium.launch();
  for (const a of arrows) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,700;0,800;1,400;1,700;1,800&display=swap" rel="stylesheet">
    <style>${baseCSS}</style></head>
    <body><div class="slide bg-lime">
      <div class="slide-num">06</div>
      <div class="content">${content}</div>
      ${a.svg}
      <div class="footer">
        <span class="handle">@make.lemonad</span>
        <span class="signature">Strategy + Branding + Performance = <em>Conexão que Gera Conversão</em></span>
      </div>
    </div></body></html>`;

    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const out = `../make/social/posts/2026-04-23_trafego-organico/test-arrow-${a.id}.png`;
    await page.screenshot({ path: out, type: 'png', clip: { x:0, y:0, width:1080, height:1350 } });
    await page.close();
    console.log(`OK: ${a.id} — ${a.label}`);
  }
  await browser.close();
})();

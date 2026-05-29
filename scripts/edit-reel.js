// edit-reel.js — Edição automática de Reels da Make
// Uso: node edit-reel.js <video.mp4> [--no-cuts] [--no-captions]
//
// O que faz:
//   1. Remove pausas e silêncios longos (cortes secos)
//   2. Transcreve com Gemini e gera legendas no estilo Make
//   3. Exporta vídeo pronto em make/social/videos/saida/
//
// Requer: GEMINI_API_KEY no .env

const fs   = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const FFMPEG = require("ffmpeg-static");

// --- Configurações ---
const SILENCE_THRESHOLD_DB = "-35dB";   // volume abaixo disso = silêncio
const SILENCE_MIN_DURATION  = 0.4;      // segundos de silêncio pra cortar
const SILENCE_KEEP_PADDING  = 0.08;     // segundos que mantém antes/depois do corte
const OUTPUT_WIDTH   = 1080;
const OUTPUT_HEIGHT  = 1920;

// Estilo da legenda — identidade Make
const CAPTION_FONT_COLOR   = "white";
const CAPTION_BOX_COLOR    = "0x000000@0.75";
const CAPTION_FONT_SIZE    = 52;
const CAPTION_FONT         = "Helvetica-Bold";
const CAPTION_MAX_CHARS    = 32;        // máximo de chars por linha de legenda
const CAPTION_POSITION_Y   = "h*0.78"; // posição vertical (% da altura)

// --- Helpers ---
function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: opts.quiet ? "pipe" : "inherit", ...opts });
}

function ffmpeg(args, quiet = true) {
  const result = spawnSync(FFMPEG, args, { encoding: "utf8", stdio: quiet ? "pipe" : "inherit" });
  if (result.status !== 0 && !quiet) throw new Error(result.stderr);
  return result;
}

function tmpFile(ext) {
  return path.join(require("os").tmpdir(), `reel_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
}

// --- 1. Detectar silêncios e gerar segmentos de fala ---
function detectSpeechSegments(inputPath, duration) {
  console.log("  Detectando pausas...");
  const result = spawnSync(FFMPEG, [
    "-i", inputPath,
    "-af", `silencedetect=noise=${SILENCE_THRESHOLD_DB}:duration=${SILENCE_MIN_DURATION}`,
    "-f", "null", "-"
  ], { encoding: "utf8", stdio: "pipe" });

  const stderr = result.stderr || "";
  const silences = [];

  // Parse silence_start / silence_end do output do ffmpeg
  const startRe = /silence_start:\s*([\d.]+)/g;
  const endRe   = /silence_end:\s*([\d.]+)/g;
  let m;

  const starts = [];
  const ends   = [];
  while ((m = startRe.exec(stderr)) !== null) starts.push(parseFloat(m[1]));
  while ((m = endRe.exec(stderr))   !== null) ends.push(parseFloat(m[1]));

  for (let i = 0; i < starts.length; i++) {
    silences.push({ start: starts[i], end: ends[i] ?? duration });
  }

  // Inverter silêncios → segmentos de fala
  const segments = [];
  let cursor = 0;

  for (const s of silences) {
    const segStart = cursor;
    const segEnd   = Math.max(cursor, s.start + SILENCE_KEEP_PADDING);
    if (segEnd - segStart > 0.1) segments.push({ start: segStart, end: segEnd });
    cursor = Math.max(cursor, s.end - SILENCE_KEEP_PADDING);
  }

  // Segmento final até o fim do vídeo
  if (cursor < duration - 0.1) segments.push({ start: cursor, end: duration });

  console.log(`  ${silences.length} pausas encontradas → ${segments.length} segmentos de fala`);
  return segments;
}

// --- 2. Montar vídeo sem pausas ---
function cutSilences(inputPath, segments, outPath) {
  if (segments.length === 0) {
    console.log("  Nenhuma pausa detectada — mantendo vídeo original");
    fs.copyFileSync(inputPath, outPath);
    return;
  }

  console.log("  Cortando pausas...");

  // Gera filter_complex com todos os segmentos
  const filterParts = segments.map((s, i) =>
    `[0:v]trim=start=${s.start}:end=${s.end},setpts=PTS-STARTPTS[v${i}];` +
    `[0:a]atrim=start=${s.start}:end=${s.end},asetpts=PTS-STARTPTS[a${i}]`
  );

  const concatInputs = segments.map((_, i) => `[v${i}][a${i}]`).join("");
  const filter = filterParts.join(";") + ";" +
    `${concatInputs}concat=n=${segments.length}:v=1:a=1[outv][outa]`;

  ffmpeg([
    "-i", inputPath,
    "-filter_complex", filter,
    "-map", "[outv]", "-map", "[outa]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k",
    "-y", outPath
  ], false);
}

// --- 3. Ajustar para 9:16 se necessário ---
function ensureVertical(inputPath, outPath) {
  const probeResult = spawnSync(FFMPEG, [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=s=x:p=0",
    "-i", inputPath
  ], { encoding: "utf8", stdio: "pipe" });

  // probe via ffprobe-like via ffmpeg
  const probe = spawnSync(FFMPEG, ["-i", inputPath], { encoding: "utf8", stdio: "pipe" });
  let width = 0, height = 0;
  const dimMatch = (probe.stderr || "").match(/(\d{3,5})x(\d{3,5})/);
  if (dimMatch) { width = parseInt(dimMatch[1]); height = parseInt(dimMatch[2]); }

  const isVertical = height >= width;
  if (isVertical) {
    console.log(`  Vídeo já é vertical (${width}x${height}) — sem recorte`);
    fs.copyFileSync(inputPath, outPath);
    return;
  }

  console.log(`  Recortando ${width}x${height} → ${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}...`);
  ffmpeg([
    "-i", inputPath,
    "-vf", `crop=${Math.min(width, height * OUTPUT_WIDTH / OUTPUT_HEIGHT)}:${height},scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}`,
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "copy",
    "-y", outPath
  ], false);
}

// --- 4. Transcrever com Gemini ---
async function transcribe(inputPath) {
  console.log("  Transcrevendo com Gemini...");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Extrai áudio em mp3 pra enviar pro Gemini
  const audioTmp = tmpFile("mp3");
  ffmpeg(["-i", inputPath, "-vn", "-ar", "16000", "-ac", "1", "-b:a", "64k", "-y", audioTmp], false);

  const audioData = fs.readFileSync(audioTmp).toString("base64");
  fs.unlinkSync(audioTmp);

  const prompt = `Transcreva este áudio em português brasileiro.
Retorne APENAS um JSON válido com este formato exato:
{
  "segments": [
    { "start": 0.0, "end": 2.5, "text": "frase aqui" },
    ...
  ]
}
Cada segmento deve ter no máximo ${CAPTION_MAX_CHARS} caracteres.
Quebre frases longas em múltiplos segmentos.
NÃO inclua nada além do JSON.`;

  const result = await model.generateContent([
    { inlineData: { data: audioData, mimeType: "audio/mp3" } },
    prompt
  ]);

  const raw = result.response.text().trim();

  // Extrai JSON mesmo se vier com markdown
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini não retornou JSON válido:\n" + raw.slice(0, 300));

  const parsed = JSON.parse(jsonMatch[0]);
  console.log(`  ${parsed.segments.length} segmentos transcritos`);
  return parsed.segments;
}

// --- 5. Gerar arquivo SRT ---
function toSrt(seconds) {
  const h  = Math.floor(seconds / 3600);
  const m  = Math.floor((seconds % 3600) / 60);
  const s  = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")},${String(ms).padStart(3,"0")}`;
}

function generateSrt(segments, srtPath) {
  const lines = segments.map((seg, i) =>
    `${i + 1}\n${toSrt(seg.start)} --> ${toSrt(seg.end)}\n${seg.text}\n`
  );
  fs.writeFileSync(srtPath, lines.join("\n"), "utf8");
  console.log(`  SRT salvo: ${path.basename(srtPath)}`);
}

// --- 6. Queimar legendas no vídeo ---
function burnCaptions(inputPath, srtPath, outPath) {
  console.log("  Queimando legendas...");

  const escapedSrt = srtPath.replace(/'/g, "'\\''").replace(/:/g, "\\:");

  ffmpeg([
    "-i", inputPath,
    "-vf", `subtitles='${srtPath}':force_style='FontName=${CAPTION_FONT},FontSize=${CAPTION_FONT_SIZE},PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BackColour=&H40000000,Bold=1,Outline=2,Shadow=0,Alignment=2,MarginV=${Math.round(OUTPUT_HEIGHT * 0.18)}'`,
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    "-c:a", "copy",
    "-y", outPath
  ], false);
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(a => !a.startsWith("--"));
  const noCuts     = args.includes("--no-cuts");
  const noCaptions = args.includes("--no-captions");

  if (!inputArg) {
    console.error("Uso: node edit-reel.js <video.mp4> [--no-cuts] [--no-captions]");
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY não encontrada no .env");
    process.exit(1);
  }

  const inputPath = path.resolve(inputArg);
  if (!fs.existsSync(inputPath)) {
    console.error(`Arquivo não encontrado: ${inputPath}`);
    process.exit(1);
  }

  const basename = path.basename(inputPath, path.extname(inputPath));
  const outDir   = path.resolve(__dirname, "../make/social/videos/saida");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\nEditando: ${path.basename(inputPath)}`);
  console.log(`Cortes automáticos: ${noCuts ? "NÃO" : "SIM"}`);
  console.log(`Legendas: ${noCaptions ? "NÃO" : "SIM"}`);
  console.log("");

  // Detectar duração
  // Detecta duração via ffmpeg -i (ffprobe não está incluído no ffmpeg-static)
  const probeOut = spawnSync(FFMPEG, ["-i", inputPath], { encoding: "utf8", stdio: "pipe" });
  let duration = 60;
  const durMatch = (probeOut.stderr || "").match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  if (durMatch) {
    duration = parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60 + parseFloat(durMatch[3]);
  }

  let current = inputPath;
  const temps  = [];

  // Passo 1: cortar silêncios
  if (!noCuts) {
    const segments = detectSpeechSegments(current, duration);
    const cutOut   = tmpFile("mp4");
    temps.push(cutOut);
    cutSilences(current, segments, cutOut);
    current = cutOut;
  }

  // Passo 2: garantir 9:16
  const vertOut = tmpFile("mp4");
  temps.push(vertOut);
  ensureVertical(current, vertOut);
  current = vertOut;

  // Passo 3: legendas
  let finalOut = path.join(outDir, `${basename}_editado.mov`);
  if (!noCaptions) {
    const segments = await transcribe(current);
    const srtPath  = path.join(outDir, `${basename}.srt`);
    generateSrt(segments, srtPath);
    burnCaptions(current, srtPath, finalOut);
  } else {
    fs.copyFileSync(current, finalOut);
  }

  // Limpar temporários
  for (const t of temps) {
    try { fs.unlinkSync(t); } catch (_) {}
  }

  const sizeMB = (fs.statSync(finalOut).size / 1024 / 1024).toFixed(1);
  console.log(`\nPronto! → ${finalOut} (${sizeMB} MB)`);
}

main().catch(e => { console.error("\nErro:", e.message); process.exit(1); });

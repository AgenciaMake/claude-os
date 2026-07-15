import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType,
} from 'docx';

function parseInlineRuns(text) {
  const runs = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index) }));
    }
    runs.push(new TextRun({ text: match[1], bold: true }));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex) }));
  }
  if (runs.length === 0) runs.push(new TextRun({ text: '' }));
  return runs;
}

// Largura útil de uma página A4/Carta com margens padrão do docx, em twips (DXA).
const PAGE_WIDTH_DXA = 9000;

function buildTable(tableLines) {
  const rows = tableLines
    .map(l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))
    .filter(cells => !cells.every(c => /^:?-{2,}:?$/.test(c)));

  if (rows.length === 0) return null;

  const numCols = rows[0].length;
  // A lib docx precisa de columnWidths em DXA no Table pra montar o tblGrid
  // corretamente. Sem isso, o tblGrid cai num valor default minúsculo e o
  // Word quebra o texto letra por letra dentro de cada célula.
  const columnWidths = Array.from({ length: numCols }, () => Math.floor(PAGE_WIDTH_DXA / numCols));
  const cellWidthDxa = columnWidths[0];

  const tableRows = rows.map((cells, rowIndex) =>
    new TableRow({
      children: cells.map(cellText =>
        new TableCell({
          width: { size: cellWidthDxa, type: WidthType.DXA },
          shading: rowIndex === 0 ? { fill: 'EDEDED' } : undefined,
          children: [new Paragraph({ children: parseInlineRuns(cellText) })],
        })
      ),
    })
  );

  return new Table({
    rows: tableRows,
    columnWidths,
    width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
  });
}

function markdownToBlocks(markdown) {
  const lines = (markdown || '').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) { i++; continue; }
    if (/^-{3,}\s*$/.test(line.trim())) { i++; continue; }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const headingLevel = level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
      blocks.push(new Paragraph({ children: parseInlineRuns(heading[2]), heading: headingLevel, spacing: { before: 240, after: 120 } }));
      i++; continue;
    }

    if (line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const table = buildTable(tableLines);
      if (table) blocks.push(table, new Paragraph({ text: '' }));
      continue;
    }

    const checklist = line.match(/^\s*-\s+\[([ xX])\]\s+(.*)$/);
    if (checklist) {
      const checked = checklist[1].toLowerCase() === 'x';
      blocks.push(new Paragraph({
        children: [new TextRun({ text: checked ? '☑ ' : '☐ ' }), ...parseInlineRuns(checklist[2])],
        indent: { left: 360 },
      }));
      i++; continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      blocks.push(new Paragraph({ children: parseInlineRuns(bullet[1]), bullet: { level: 0 } }));
      i++; continue;
    }

    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (numbered) {
      blocks.push(new Paragraph({ children: parseInlineRuns(numbered[1]), indent: { left: 360 } }));
      i++; continue;
    }

    blocks.push(new Paragraph({ children: parseInlineRuns(line) }));
    i++;
  }

  return blocks;
}

// Briefings concluídos antes desse formato JSON existir salvaram a transcrição como
// texto plano "Speaker: conteúdo" separado por linha em branco, sem marcar onde cada
// turno realmente começava — um parágrafo extra de uma mesma fala virava um "turno"
// órfão. Só abre turno novo quando reconhece "Alfred:" ou o nome do cliente no início;
// qualquer outro trecho solto é continuação da fala anterior.
function legacyFlatTranscriptToTurns(text, clientName) {
  const knownSpeakers = ['Alfred', clientName].filter(Boolean);
  const turns = [];

  for (const chunk of text.split('\n\n').filter(Boolean)) {
    const sepIndex = chunk.indexOf(': ');
    const maybeSpeaker = sepIndex !== -1 ? chunk.slice(0, sepIndex) : null;

    if (maybeSpeaker && knownSpeakers.includes(maybeSpeaker)) {
      turns.push({ speaker: maybeSpeaker, text: chunk.slice(sepIndex + 2) });
    } else if (turns.length > 0) {
      turns[turns.length - 1].text += '\n\n' + chunk;
    } else {
      turns.push({ speaker: '', text: chunk });
    }
  }

  return turns;
}

function transcriptBlocks(clientName, transcriptJson) {
  if (!transcriptJson) {
    return [new Paragraph({ text: 'Conversa completa não disponível para este briefing.' })];
  }

  let turns;
  try {
    const parsed = JSON.parse(transcriptJson);
    turns = Array.isArray(parsed) ? parsed : null;
  } catch {
    turns = null;
  }
  if (!turns) turns = legacyFlatTranscriptToTurns(transcriptJson, clientName);
  if (turns.length === 0) return [new Paragraph({ text: 'Conversa completa não disponível para este briefing.' })];

  const blocks = [];
  for (const turn of turns) {
    const lines = String(turn.text || '').split('\n');
    const children = [new TextRun({ text: `${turn.speaker}: `, bold: true })];
    lines.forEach((line, idx) => {
      if (idx > 0) children.push(new TextRun({ text: '', break: 1 }));
      children.push(new TextRun({ text: line }));
    });
    blocks.push(new Paragraph({ children, spacing: { after: 200 } }));
  }
  return blocks;
}

export async function buildBriefingDocx({ clientName, services, summary, transcript }) {
  const children = [
    new Paragraph({ text: `Briefing — ${clientName}`, heading: HeadingLevel.TITLE, spacing: { after: 120 } }),
  ];

  if (services) {
    children.push(new Paragraph({ children: parseInlineRuns(`Serviços contratados: ${services}`) }));
  }
  children.push(new Paragraph({ text: '' }));

  children.push(new Paragraph({ text: 'Resumo do Briefing', heading: HeadingLevel.HEADING_1, spacing: { after: 120 } }));
  children.push(...markdownToBlocks(summary || 'Resumo não disponível para este briefing.'));
  children.push(new Paragraph({ text: '' }));

  children.push(new Paragraph({ text: 'Conversa completa', heading: HeadingLevel.HEADING_1, spacing: { after: 120 } }));
  children.push(...transcriptBlocks(clientName, transcript));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return new Uint8Array(await blob.arrayBuffer());
}

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

function transcriptParagraphs(clientName, transcriptText) {
  if (!transcriptText) {
    return [new Paragraph({ text: 'Conversa completa não disponível para este briefing.' })];
  }

  const turns = transcriptText.split('\n\n').filter(Boolean);
  const paragraphs = [];

  for (const turn of turns) {
    const sepIndex = turn.indexOf(': ');
    if (sepIndex === -1) {
      paragraphs.push(new Paragraph({ text: turn }));
      paragraphs.push(new Paragraph({ text: '' }));
      continue;
    }
    const speaker = turn.slice(0, sepIndex);
    const content = turn.slice(sepIndex + 2);
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({ text: `${speaker}: `, bold: true }),
        new TextRun({ text: content }),
      ],
    }));
    paragraphs.push(new Paragraph({ text: '' }));
  }

  return paragraphs;
}

export async function buildBriefingDocx({ clientName, services, summary, transcript }) {
  const children = [
    new Paragraph({ text: `Briefing — ${clientName}`, heading: HeadingLevel.TITLE }),
  ];

  if (services) {
    children.push(new Paragraph({ text: `Serviços contratados: ${services}` }));
  }
  children.push(new Paragraph({ text: '' }));

  children.push(new Paragraph({ text: 'Resumo do Briefing', heading: HeadingLevel.HEADING_1 }));
  const summaryLines = (summary || 'Resumo não disponível para este briefing.').split('\n');
  for (const line of summaryLines) {
    children.push(new Paragraph({ text: line }));
  }
  children.push(new Paragraph({ text: '' }));

  children.push(new Paragraph({ text: 'Conversa completa', heading: HeadingLevel.HEADING_1 }));
  children.push(...transcriptParagraphs(clientName, transcript));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return new Uint8Array(await blob.arrayBuffer());
}

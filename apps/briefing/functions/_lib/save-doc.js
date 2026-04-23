// Gera e salva o Google Doc do briefing na pasta do cliente

export async function saveBriefingDoc(token, env, client, messages) {
  // Busca a pasta 03. Materiais do Cliente do cliente
  const folderId = await findClientMaterialsFolder(token, client);
  if (!folderId) {
    console.error(`Pasta do cliente ${client.name} (n° ${client.number}) não encontrada.`);
    return null;
  }

  // Gera conteúdo estruturado com a Claude API
  const briefingText = await generateBriefingContent(env.CLAUDE_API_KEY, client, messages);

  // Cria o Google Doc
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);

  const slug = client.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  const docTitle = `MAKE_BRIEFING_${slug}_${dd}.${mm}.${yy}`;

  // Cria Doc
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: docTitle }),
  });
  const doc = await createRes.json();
  const docId = doc.documentId;

  // Insere o conteúdo
  await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: briefingText,
          },
        },
      ],
    }),
  });

  // Move o Doc pra pasta do cliente
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${docId}?addParents=${folderId}&supportsAllDrives=true`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return docId;
}

async function findClientMaterialsFolder(token, client) {
  // Busca pelo nome "NUMERO. NOME" dentro de 02. CLIENTES
  const clientesFolder = '1R6NWb_YjeiMryxSS_a4U-ye5a0F2Wh4q';
  const expectedName = `${String(client.number).padStart(2, '0')}. ${client.name}`;

  const q = `'${clientesFolder}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&supportsAllDrives=true&includeItemsFromAllDrives=true&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  const clientFolder = (data.files || []).find(f =>
    f.name === expectedName ||
    f.name.toLowerCase() === expectedName.toLowerCase()
  );

  if (!clientFolder) return null;

  // Encontra "03. Materiais do Cliente" dentro da pasta do cliente
  const subQ = `'${clientFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const subRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(subQ)}&supportsAllDrives=true&includeItemsFromAllDrives=true&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const subData = await subRes.json();
  const materiais = (subData.files || []).find(f => f.name.includes('Materiais do Cliente'));
  return materiais?.id || null;
}

async function generateBriefingContent(apiKey, client, messages) {
  const conversationText = messages
    .map(m => `${m.role === 'user' ? client.name : 'Alfred'}: ${m.content}`)
    .join('\n\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: `Você é um analista de briefings da MakeLemonAd. Receba a transcrição de uma entrevista com um cliente e gere um documento de briefing estruturado, claro e aproveitável pela equipe.

Estrutura do documento:
1. Cabeçalho com nome do cliente, serviços contratados, responsável, data
2. Resumo executivo (3-4 linhas, o essencial)
3. Pessoas e contatos (listar cada pessoa envolvida com nome, cargo, email, WhatsApp — inclua contato financeiro separadamente)
4. Sobre o negócio (bullet points ou parágrafos curtos)
5. Objetivos e metas
6. Concorrência
7. Histórico de marketing
8. **Estrutura digital detectada** — quando a transcrição tiver trechos marcados como "[Análise automática...]", consolide aqui: URL do site, status (no ar / fora do ar / com erro), stack detectada (CMS, plataforma de e-commerce, framework), pixels e tracking (GA, GTM, Meta Pixel, TikTok Pixel, Hotjar, Clarity), título e proposta de valor percebida na home. Liste só o que foi detectado de verdade — não invente.
9. Redes sociais (uma linha por rede: @, nº de seguidores, frequência, quem cuida hoje)
10. Detalhes por serviço contratado
11. Materiais e acessos disponíveis
12. Observações importantes
13. Próximos passos recomendados

Regras:
- Seja direto, sem enrolação
- Nunca use travessão "—"
- Não invente informação que não esteja na transcrição
- Se algo ficou vago, marque como "A confirmar"
- Use linguagem de quem está no mercado de verdade`,
      messages: [
        {
          role: 'user',
          content: `Cliente: ${client.name}\nServiços contratados: ${client.services}\nResponsável interno: ${client.responsible}\nNúmero: ${client.number}\n\nTranscrição da entrevista:\n\n${conversationText}\n\nGere o documento de briefing completo seguindo a estrutura indicada.`,
        },
      ],
    }),
  });

  const data = await res.json();
  return data.content?.[0]?.text || 'Erro ao gerar briefing.';
}

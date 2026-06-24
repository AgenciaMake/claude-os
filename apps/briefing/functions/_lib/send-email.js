// Envio de email via Resend API
// Chamado quando o Alfred conclui um briefing

const RESEND_API = 'https://api.resend.com/emails';

export async function sendBriefingCompletionEmail(resendApiKey, toEmails, clientName, docUrl, briefingSummary) {
  if (!resendApiKey || !toEmails || toEmails.length === 0) return;

  const summaryBlock = briefingSummary
    ? `<div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-top:16px;"><pre style="font-family:sans-serif;font-size:13px;white-space:pre-wrap;color:#333;">${briefingSummary.slice(0, 2000)}${briefingSummary.length > 2000 ? '\n...' : ''}</pre></div>`
    : '';

  const driveLink = docUrl
    ? `<p style="margin-top:16px;"><a href="${docUrl}" style="background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;">Ver transcrição completa no Drive</a></p>`
    : '';

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222;">
      <div style="background:#D6DE23;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;font-size:20px;color:#111;">Briefing concluído: ${clientName}</h1>
      </div>
      <div style="background:#fff;padding:24px 32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
        <p style="font-size:14px;color:#555;">O Alfred finalizou a entrevista de briefing com o cliente <strong>${clientName}</strong>. O resumo abaixo foi gerado automaticamente ao final da conversa.</p>
        ${summaryBlock}
        ${driveLink}
        <p style="font-size:11px;color:#aaa;margin-top:24px;">MakeLemonAd — CitraDesk Briefing</p>
      </div>
    </div>
  `;

  await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Alfred MakeLemonAd <alfred@makelemonad.com.br>',
      to: toEmails,
      subject: `Briefing concluído: ${clientName}`,
      html,
    }),
  });
}

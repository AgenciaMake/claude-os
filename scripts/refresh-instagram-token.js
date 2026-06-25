#!/usr/bin/env node
/**
 * Renova o token do Instagram antes de expirar (60 dias).
 * Roda via /schedule a cada 45 dias.
 *
 * Uso: node --env-file=../.env scripts/refresh-instagram-token.js
 */

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const accountId = process.env.POSTFORME_INSTAGRAM_ACCOUNT_ID;
const postformeKey = process.env.POSTFORME_API_KEY;

if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN não encontrado no .env');
  process.exit(1);
}

async function refreshToken() {
  console.log('Renovando token do Instagram...');

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );

  if (!res.ok) {
    const body = await res.text();
    console.error('Erro ao renovar token:', body);
    process.exit(1);
  }

  const data = await res.json();
  const newToken = data.access_token;
  const expiresInDays = Math.floor(data.expires_in / 86400);

  console.log(`Token renovado. Expira em ${expiresInDays} dias.`);
  console.log(`Novo token: ${newToken.substring(0, 20)}...`);

  // Atualiza o .env
  const fs = await import('fs');
  const path = await import('path');
  const envPath = path.resolve(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');

  if (envContent.includes('INSTAGRAM_ACCESS_TOKEN=')) {
    envContent = envContent.replace(
      /INSTAGRAM_ACCESS_TOKEN=.*/,
      `INSTAGRAM_ACCESS_TOKEN=${newToken}`
    );
  } else {
    envContent += `\nINSTAGRAM_ACCESS_TOKEN=${newToken}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('.env atualizado com o novo token.');

  // Atualiza também no Post for Me se tiver a conta configurada
  if (accountId && postformeKey) {
    const pfRes = await fetch(
      `https://api.postforme.dev/v1/social-accounts/${accountId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${postformeKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: newToken }),
      }
    );

    if (pfRes.ok) {
      console.log('Token atualizado no Post for Me.');
    } else {
      console.warn('Aviso: não foi possível atualizar token no Post for Me automaticamente. Reconecta manualmente em postforme.dev se necessário.');
    }
  }

  console.log('Tudo certo. Próxima renovação em 45 dias.');
}

refreshToken().catch(err => {
  console.error('Erro inesperado:', err.message);
  process.exit(1);
});

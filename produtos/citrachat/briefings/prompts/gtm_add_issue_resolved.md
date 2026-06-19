# Prompt: Adicionar evento citrachat_issue_resolved no GTM

**Para usar:** Cole esse prompt num Claude com acesso ao navegador (computer use).

---

## Contexto

Os containers GTM abaixo já têm os 6 eventos anteriores do CitraChat configurados. Preciso apenas adicionar o novo evento `citrachat_issue_resolved` em cada um — um acionador e uma tag GA4.

---

## Containers que precisam ser atualizados

| Conta | Container | GA4 |
|---|---|---|
| CitraChat (própria) | GTM-KQBZRCHG | G-8PCHNQ40G4 |
| Make (cliente) | GTM-5R5ZM77 | G-3026YN424E |

Faça os passos abaixo nos dois containers, um de cada vez.

---

## O que fazer em cada container

Acesse https://tagmanager.google.com, selecione o container e repita:

### Passo 1 — Criar o acionador

1. Menu lateral → **Acionadores** → **Novo**
2. Tipo: **Evento personalizado**
3. Nome do evento: `citrachat_issue_resolved`
4. Fires on: **Todos os eventos personalizados**
5. Nome do acionador: `CitraChat - Problema Resolvido`
6. **Salvar**

### Passo 2 — Criar a tag GA4

1. Menu lateral → **Tags** → **Novo**
2. Tipo: **Google Analytics: Evento do GA4**
3. ID de medição: *(usar o GA4 correspondente ao container da tabela acima)*
4. Nome do evento: `citrachat_issue_resolved`
5. Parâmetros do evento → adicionar linha: `source` = `citrachat`
6. Acionamento: selecionar **CitraChat - Problema Resolvido**
7. Nome da tag: `GA4 - CitraChat Problema Resolvido`
8. **Salvar**

### Passo 3 — Publicar

1. **Enviar** → nome da versão: `issue_resolved adicionado`
2. **Publicar**

---

## Após publicar nos dois containers: marcar como conversão no GA4

Fazer em cada propriedade GA4:

1. https://analytics.google.com → selecionar a propriedade
2. Admin (engrenagem) → **Eventos**
3. Localizar `citrachat_issue_resolved` *(pode levar até 24h para aparecer — se não estiver, pular por agora)*
4. Toggle **Marcar como conversão** → ativar

# TV4 — Imagem na Capa

Capa de carrossel com **imagem fotorrealista na metade superior** (gerada via Nano Banana seguindo o script de realismo brasileiro) e **bloco de tipografia na metade inferior preta**, conectados por um **fade gradient** longo (não corte seco).

## Preview

![TV4](preview-tv4.png)

## Quando usar

- Posts que tratam de cenário do mundo real, comportamento de consumidor, mudança de mercado
- Quando o tema pede **rosto humano** ou contexto de ambiente (escritório, cidade, dia a dia) pra ancorar o problema
- Notícias / dados de mercado (zero-click search, mudança de algoritmo, comportamento)
- Updates da Make em formato editorial (case com pessoa real)

**Não usar pra:** conceitos abstratos puros, frases de provocação isoladas, manifestos. Use TV1, TV2 ou TV3 nesses casos.

## Spec visual

| Elemento | Valor |
|---|---|
| **Fundo do slide** | `bg-black` + classe automática `has-cover-image` quando o config tem `coverImage` |
| **Imagem (metade superior)** | `coverImage`: caminho relativo ao `config.json` do post. Ocupa 60% do topo. `background-size: cover; background-position: center` |
| **Fade gradient inferior da imagem** | 280px de altura, `transparent → var(--black)` — transição suave (não corte seco) |
| **Fade gradient superior da imagem** | 160px de altura, `rgba(0,0,0,0.45) → transparent` — escurece sutilmente o topo pra contraste do logo/hashtag |
| **Logo** | PNG oficial (selo verde com texto preto cheio) — sobre a imagem com fade |
| **Hashtag** | Cor branco (default), 16px Light italic + Medium italic em "estratégica" — sobre a imagem com fade |
| **Tipografia (metade inferior)** | 3 níveis em Rubik:<br>1. Headline: Bold 700 italic CAIXA ALTA verde limão (~128px, com auto-fit)<br>2. Sustentação: Bold 700 italic CAIXA ALTA branca (~96px, com auto-fit)<br>3. Subtítulo: Medium 500 CAIXA ALTA branca (~30px, regular case-feel) |
| **Margens do bloco de texto** | `left: 50px`, `right: 110px` (padrão da grade Make) |
| **Rodapé** | Cor branco (default) — sobre o preto |
| **Seta** | Cor `var(--black)` (default `from-black`) — preto invadindo a faixa lateral |

## Snippet pronto pra colar

```json
{
  "filename": "slide01-capa.png",
  "bg": "black",
  "isCover": true,
  "nextBg": "light-gray",
  "logoStyle": "png-oficial",
  "coverImage": "cover-tv4.png",
  "content": "<div style='line-height:0.95;'><div style='font-size:128px;font-weight:700;color:var(--lime);letter-spacing:-3px;text-transform:uppercase;font-style:italic;line-height:0.96;'>{{HEADLINE}}</div><div style='font-size:96px;font-weight:700;color:var(--white);letter-spacing:-2px;text-transform:uppercase;font-style:italic;line-height:1.0;margin-top:22px;'>{{SUSTENTACAO}}</div><div style='font-size:30px;font-weight:500;color:var(--white);margin-top:30px;line-height:1.3;text-transform:uppercase;letter-spacing:0.5px;'>{{SUBTITULO}}</div></div>"
}
```

## Slots

| Slot | Função | Exemplo |
|---|---|---|
| `coverImage` | Caminho da imagem fotorrealista (PNG/JPG) gerada via Nano Banana — relativo ao config.json | `cover-tv4.png` |
| `{{HEADLINE}}` | Frase de impacto em verde limão, pode quebrar com `<br>` | "Seu tráfego<br>orgânico caiu." |
| `{{SUSTENTACAO}}` | Frase complementar branca | "E a culpa não é sua." |
| `{{SUBTITULO}}` | Provocação/contexto em 1 frase | "O usuário parou de clicar — e ninguém te avisou." |

## Geração da imagem (passo obrigatório antes de aplicar o template)

A imagem **sempre** segue [marca/direcao-de-arte.md](../../marca/direcao-de-arte.md) — realismo absoluto + contexto brasileiro/SP.

**Nunca** gerar com texto, logos ou tipografia dentro da imagem.

Template de prompt pra Nano Banana (adaptar conforme o tema do post):

```
Photograph taken in Brazil (São Paulo context), shot on a DSLR camera with a 50mm
lens and shallow depth of field, natural [evening|daylight] light, subtle lens grain,
real-world imperfections, documentary photography style.

[DESCRIÇÃO DA PESSOA — gênero, idade, traços físicos brasileiros, postura natural,
expressão sutil não posada, NUNCA olhando direto pra câmera]

[CONTEXTO/AMBIENTE — home-office em SP / escritório vivido / cena urbana real,
com plantas, mug, papéis, imperfeições naturais]

[ELEMENTO NARRATIVO — laptop com gráfico, smartphone com app, etc., apenas elementos
visuais, sem texto legível]

[ILUMINAÇÃO — mistura de luz natural e artificial típica do Brasil/SP]

Aspect ratio: landscape 3:2 (wider than tall) OR square depending on composition needs.

NOT a stock photo. NOT a product ad. NOT a 3D render. Looks like a real photograph.
No text overlays, no logos, no typography, no captions visible anywhere in the frame.
```

## Como gerar a imagem via API

Comando exemplo (com `GEMINI_API_KEY` já no `.env`):

```bash
KEY=$(grep GEMINI_API_KEY .env | cut -d= -f2)
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$KEY" \
  -H "Content-Type: application/json" \
  -d @prompt.json -o response.json
```

Decodificar a resposta:
```python
import json, base64
r = json.load(open('response.json'))
data = r['candidates'][0]['content']['parts'][0]['inlineData']['data']
open('cover.png', 'wb').write(base64.b64decode(data))
```

## Regra de leitura

A capa funciona em 3 níveis:
1. **Imagem** — ancora o problema na vida real (rosto + cenário brasileiro = empatia imediata)
2. **Headline verde** — declara o problema com a cor da marca
3. **Sustentação branca + subtítulo** — alivia a culpa do leitor e justifica o porquê

A combinação imagem + texto cria narrativa: "isso pode ser você" → "isso é o problema" → "mas não é sua culpa". Ideal pra posts com peso emocional.

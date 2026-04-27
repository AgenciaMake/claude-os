# Templates de capa — MakeLemonAd

Templates aprovados pra capas de carrossel. Cada arquivo `.md` contém o spec visual completo + snippet JSON pronto pra colar no `config.json` de um post novo, alterando só os textos.

**Por que templates:** garante coerência visual entre posts e elimina decisão aleatória a cada nova arte. Se uma variação ficar boa e for aprovada, vira template oficial aqui.

## Disponíveis

| Template | Estilo | Quando usar | Preview |
|---|---|---|---|
| [TV1](tv1-bloco-dividido.md) | Bloco dividido — verde limão em cima, preto embaixo | Provocação/hook em cima e palavra-chave de impacto embaixo. Tom mais "alarme leve". | [preview-tv1.png](preview-tv1.png) |
| [TV2](tv2-preto-puro.md) | Fundo preto puro, tipografia em 3 pesos (bold + italic + outline) com acento em verde limão | Posts conceituais/provocativos onde a tipografia carrega tudo. Pausa visual no feed entre posts coloridos. | [preview-tv2.png](preview-tv2.png) |
| [TV3](tv3-bloco-dividido-invertido.md) | Bloco dividido invertido — preto em cima, verde limão embaixo | Mesmo conceito do TV1 com inversão. Tom mais "afirmação institucional". | [preview-tv3.png](preview-tv3.png) |

## Como aplicar

1. Escolher o template adequado ao tom do post
2. Copiar o snippet JSON do template
3. Colar no `config.json` do post novo (em `make/social/posts/<data>_<slug>/`)
4. Trocar **só os textos** dos slots — manter background, cores, pesos e logo intactos
5. Rodar `node scripts/compose-slides.js <caminho>/config.json`

Auto-fit do script garante que o texto cabe na grade mesmo se palavras forem maiores que de costume.

# Sons reais dos animais na Orquestra Animal

## Objetivo
Substituir os sons sintetizados (Web Audio API) por **gravações reais** de cada animal (leão, elefante, gato, etc.), usando uma fonte gratuita.

## Análise das APIs sugeridas

- **Xeno-canto** — Excelente, mas **só pássaros**. Cobre apenas coruja (de 10 animais). Não serve sozinho.
- **animalaudiograms.org** — É um banco de **audiogramas** (gráficos de sensibilidade auditiva), **não** gravações de sons. Não serve.
- **freeanimalsounds.org** — Site de download manual, sem API pública.

### Solução proposta
Usar **Wikimedia Commons API** (gratuita, sem chave, CC-licensed) como fonte principal — tem MP3/OGG de praticamente todos os animais (lion roar, elephant trumpet, cat meow, dog bark, frog croak, etc.). Complementar com **Xeno-canto** para a coruja (qualidade superior em pássaros).

Alternativa caso o usuário prefira: pré-baixar ~10 arquivos curtos de domínio público e servir do próprio projeto (mais rápido, offline, sem CORS).

## Mudanças

1. **`src/pages/orquestra-animal/data/orchestraAnimals.ts`**
   - Adicionar campo `soundUrl` em cada animal apontando para o MP3/OGG (Wikimedia direct file URL, ex: `https://upload.wikimedia.org/wikipedia/commons/.../Lion_roar.ogg`).

2. **`src/pages/orquestra-animal/utils/orchestraAudioEngine.ts`**
   - Reescrever para usar `HTMLAudioElement` (`new Audio(url)`) — toca arquivo real.
   - Manter `playInstrument()` sintetizado para a parte musical do instrumento (tuba, flauta…), tocando **junto** com o som do animal, OU substituir por apenas o som do animal (a decidir abaixo).
   - `playTutti()`: toca todos os sons de animais em sequência rápida (cacofonia divertida) ou sobrepostos.

3. **`src/pages/orquestra-animal/index.tsx`**
   - Sem mudanças estruturais; apenas chama o engine novo.

## Detalhes técnicos
- Wikimedia URLs são CORS-friendly para `<audio>`/`new Audio()`.
- Pré-carregar (`audio.preload = 'auto'`) ao montar a página para tocar instantaneamente no clique.
- Fallback: se o fetch falhar, cair no sintetizador atual.

## Perguntas antes de implementar
1. Ao clicar no animal, você quer ouvir **só o som do animal** (rugido, miado) ou **animal + instrumento** tocando juntos?
2. Posso usar **Wikimedia Commons** (CC-licensed, sem chave, funciona já) como fonte principal? Ou prefere que eu baixe ~10 arquivos curtos e coloque dentro do projeto (mais rápido, funciona offline)?
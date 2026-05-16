
# Orquestra Animal Infantil

Nova página interativa onde a criança clica em personagens animais dispostos num palco e cada um toca o som de um instrumento (sintetizado via Web Audio API) misturado a um efeito do animal.

## O que será criado

### 1. Nova rota e página
- Rota: `/orquestra-animal`
- Arquivo: `src/pages/orquestra-animal/index.tsx`
- Registrar em `src/App.tsx` (mesmo padrão das outras páginas)

### 2. Item no menu lateral
Em `src/components/sidebar/constants.ts`, adicionar em `toolsMenuItems`:
```
{ icon: Music2, text: "🎺 Orquestra Animal", path: "/orquestra-animal", gradient: "from-orange-500 to-pink-600", isNew: true }
```

### 3. Estrutura visual (estilo infantil / circo musical)
- Cenário de palco com cortinas vermelhas (inspirado no site de referência)
- Arco semicircular com 10 animais-músicos dispostos como uma orquestra
- Maestro central (animal regente) que, ao ser clicado, toca todos os instrumentos juntos (TUTTI)
- Tipografia infantil (fonte arredondada), cores saturadas, animações suaves
- Animais saltitam/balançam enquanto tocam; partículas de notas musicais sobem do instrumento
- Card lateral mostrando o animal selecionado com nome, instrumento e curiosidade

### 4. Elenco (10 animais + instrumentos)
| Animal | Instrumento | Naipe |
|---|---|---|
| 🦁 Leão | Tuba | Metais |
| 🐘 Elefante | Trompete | Metais |
| 🦒 Girafa | Trombone | Metais |
| 🐰 Coelho | Flauta | Madeiras |
| 🦉 Coruja | Clarinete | Madeiras |
| 🐱 Gato | Violino | Cordas |
| 🐻 Urso | Violoncelo | Cordas |
| 🐸 Sapo | Contrabaixo | Cordas |
| 🐶 Cachorro | Bateria | Percussão |
| 🐵 Macaco | Xilofone | Percussão |

Filtros por naipe (botões coloridos): Tutti / Cordas / Madeiras / Metais / Percussão.

### 5. Áudio (Web Audio API — sem arquivos externos)
Criar `src/pages/orquestra-animal/utils/orchestraAudioEngine.ts`:
- AudioContext singleton inicializado no primeiro clique
- Função `playInstrument(instrumentId)` com timbres distintos:
  - **Cordas**: oscilador sawtooth + filtro passa-baixa + envelope com ataque suave (~80ms)
  - **Madeiras**: oscilador triangle/sine + leve vibrato (LFO 5Hz)
  - **Metais**: oscilador square + filtro + ataque mais marcado, brilho metálico
  - **Percussão**: ruído branco filtrado (bateria) ou onda curta com decay rápido (xilofone)
- Função `playAnimalSound(animalId)` com sons curtos sintetizados que evocam o animal (rugido grave, latido, miado agudo) — tudo via osciladores e ruído filtrado
- Função `playTutti()` que dispara todos os instrumentos em harmonia (acorde C maior distribuído)
- Reaproveitar padrão já existente em `src/pages/musicogram/utils/teaAudioService.ts` e `src/utils/teaAudioEngine.ts`

### 6. Componentes
```
src/pages/orquestra-animal/
  index.tsx                          # página principal
  components/
    OrchestraStage.tsx               # palco com cortinas e arco de animais
    AnimalMusician.tsx               # personagem clicável (emoji grande + instrumento + animação)
    InstrumentInfoCard.tsx           # card lateral com info do animal selecionado
    SectionFilter.tsx                # botões de naipe (Tutti/Cordas/...)
    ConductorButton.tsx              # maestro central que toca tutti
    MusicalNotesParticles.tsx        # notas musicais flutuando quando toca
  data/
    orchestraAnimals.ts              # array com os 10 animais
  utils/
    orchestraAudioEngine.ts          # motor de áudio Web Audio API
```

### 7. Acessibilidade & responsividade
- Mobile: layout 2 colunas com grid de animais grandes (touch-friendly)
- Desktop: arco semicircular renderizado com posicionamento absoluto + transformações
- Botão "Parar tudo" sempre visível
- `aria-label` em cada animal: "Clique para ouvir o leão tocar tuba"

## Fora do escopo
- **Spleeter**: roda em Python/TensorFlow, inviável no navegador. Sons reais separados não serão usados nesta entrega. Caso queira no futuro, podemos hospedar MP3 prontos no Supabase Storage.
- Não modifica páginas existentes (Musicograma, Bell Hero, etc.).

## Arquivos tocados
- ✏️ `src/components/sidebar/constants.ts` (adicionar item)
- ✏️ `src/App.tsx` (registrar rota)
- 🆕 9 arquivos novos em `src/pages/orquestra-animal/`

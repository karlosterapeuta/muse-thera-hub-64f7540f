# Melhorias — Planos Musicoterapêuticos

Objetivo: elevar a estrutura e o acabamento profissional do módulo de Planos Musicoterapêuticos, mantendo e refinando a identidade visual atual (gradientes roxo/rosa, cards, logo dourado, paleta dourada no PDF). Atua em três frentes: **Editor**, **Listagem** e **PDF**.

## 1. Editor do plano (`src/pages/musicotherapy-treatment-plan/index.tsx`)

### Navegação (problema atual: 10 abas espremidas em `grid-cols-10`, ilegíveis no desktop)
Substituir por um layout de duas colunas no desktop e empilhado no mobile:

```text
DESKTOP                              MOBILE
┌───────────┬───────────────────┐   ┌─────────────────────┐
│ STEPPER   │  Conteúdo da       │   │ abas horizontais    │
│ 1 ✓ Ident.│  seção ativa       │   │ com scroll + ✓      │
│ 2 ✓ Aval. │  (card)            │   ├─────────────────────┤
│ 3 • Obj.  │                    │   │ conteúdo da seção   │
│ ...       │                    │   │                     │
│ 10  Reav. │                    │   │ [Anterior][Próxima] │
└───────────┴───────────────────┘   └─────────────────────┘
```

- Novo componente `PlanSectionNav` (stepper vertical no desktop, abas roláveis no mobile).
- Cada seção mostra ícone de status: concluída (✓ verde), em andamento (• âmbar) ou vazia.
- Reaproveita a lógica de preenchimento já existente em `completion` (extrair para um mapa por seção).

### Estrutura das seções
- Cabeçalho padronizado por seção: número em badge gradiente + título + **subtítulo de orientação clínica** (curto), dando tom profissional e consistente.
- **Seção 5 (Recursos)**: hoje funde 4 categorias num único campo e perde a estrutura. Separar visualmente em 4 grupos (Instrumentos, Recursos tecnológicos, Voz/corpo, Materiais complementares), cada um com seu `ResourcesSelector`, preservando os campos do banco.
- Padronizar componentes: campos hoje em `Textarea` simples (Interesses musicais, Comportamentos observados, Dinâmicas rítmicas) recebem o mesmo tratamento visual dos demais.
- Rodapé de navegação Anterior/Próxima com rótulo da próxima seção e barra de progresso coerente.

### Refino visual
- Cards com cantos mais suaves, espaçamento e tipografia consistentes; manter `PlanStickyHeader` e a barra de progresso atuais (apenas pequenos ajustes de hierarquia).
- Animações suaves de transição entre seções (framer-motion), respeitando a regra de rolar ao topo.

## 2. Listagem (`src/pages/musicotherapy-treatment-plans/index.tsx` + `PlanListCard`, `PlanStatsHeader`)
A base já é boa; refinos pontuais:
- Indicador de **progresso/completude** no card (mini barra), reaproveitando os campos do plano.
- Densidade e alinhamento dos botões de ação revisados (ações secundárias em menu "⋯" para reduzir poluição no card).
- Pequeno polimento dos cards de estatística e do estado vazio para coerência com o editor.

## 3. PDF (`src/components/MusicotherapyTreatmentPlanPDFv2.tsx`)
Já é profissional (paleta dourada, cabeçalhos serifados). Refinos:
- Capa/cabeçalho do documento com identidade reforçada (logo + dados do profissional + número/data do plano).
- Sumário das 10 seções na primeira página.
- Espaçamento e quebras de página revisados para evitar seções cortadas; rodapé com paginação consistente.
- Mantém todas as regras de geração (A4, margens [10,10], imagens em Base64, estilos inline, sem filtros CSS).

## Notas técnicas
- Sem mudanças de banco de dados nem na lógica de salvamento/auto-save: os campos e o hook `useMusicotherapyTreatmentPlan` permanecem iguais.
- Refatorar o editor extraindo a navegação e o cabeçalho de seção em componentes próprios para reduzir o arquivo de ~1048 linhas.
- Tokens semânticos do design system (sem cores cruas), mantendo a identidade cósmica/dourada.
- QA visual do PDF (render por página) antes de concluir.

Posso começar pela navegação/estrutura do editor (maior impacto) e seguir para listagem e PDF.
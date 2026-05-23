
# Redesign do Wizard Relatório MuseTera TEA

Refinamento completo de UI/UX em todas as 11 etapas do wizard, mantendo a identidade noir & gold já estabelecida, mas tornando a navegação mais limpa, organizada e moderna.

## Problemas atuais identificados

1. **Stepper horizontal** ocupa muito espaço, fica apertado com 11 etapas e exige scroll horizontal no mobile.
2. **Hero editorial** é grande demais — empurra o conteúdo da etapa para baixo a cada navegação.
3. **Templates profissionais** usam cor roxa (`purple-200/600`) que destoa da paleta dourada do resto do wizard.
4. **Campos de formulário** ficam soltos, sem agrupamento visual ou hierarquia clara entre grupos de campos.
5. **Footer de navegação** mistura "Sincronizado com Nuvem" + botões, fica visualmente carregado.
6. **Sem indicador de campos obrigatórios** no topo da etapa — usuário só descobre ao tentar avançar.
7. **Etapa Revisão Final** (`FinalReviewSection`) e **Informações Básicas** (`BasicInformationSection`) precisam alinhar visualmente com o novo padrão.
8. **Mobile**: stepper, hero e padding dos cards consomem viewport demais.

## Nova arquitetura visual

### Layout geral
- Hero **compacto** (1 linha de título + chip + barra de progresso fina) — reduz ~60% da altura atual.
- Stepper **vertical-collapsável no desktop** (sidebar esquerda fixa, 240px, com numeração e títulos completos) e **horizontal-scroll minimalista no mobile** (apenas bolinhas numeradas + título da etapa atual destacado abaixo).
- Card central com **respiração maior** (padding interno reduzido nas bordas externas, aumentado no conteúdo).
- Painel lateral direito (Quick Fill) reformulado para flutuar e abrir sob demanda, em vez de ocupar grid permanente.

### Cabeçalho de cada etapa (dentro do card)
- Chip dourado "Etapa 03 / 11" + ícone.
- Título serifado grande.
- Subtítulo em uma linha.
- **Linha de meta-informação** nova: "X campos · Y obrigatórios · Z preenchidos" com mini-barra de completude da etapa.

### Templates profissionais
- Migrar do roxo para a paleta **noir & gold** (borda `#c9a84c/30`, fundo `#1a1a1a`, accent dourado).
- Cards de template viram **chips horizontais** com ícone, título, descrição curta e check quando ativos.
- Adicionar botão "Limpar template" quando um template está aplicado.

### Campos de formulário
- Agrupar campos relacionados em **fieldsets visuais** (ex: na etapa "Comunicação", separar "Vocalizações", "CAA", "Pragmática").
- Indicador visual sutil (asterisco dourado) em obrigatórios.
- Estado de "campo preenchido" com borda dourada fina à esquerda do campo.
- Guidance (`MusicoterapiaGuidance`) vira um popover discreto acionado por ícone de info, em vez de bloco persistente embaixo do campo — reduz ruído visual.

### Navegação (footer)
- Remover indicador "Sincronizado com Nuvem" do footer (vai para o topo, ao lado da barra de progresso, como ícone discreto).
- Footer fica apenas: `Voltar` | contador "03 / 11" centralizado | `Próxima Seção`.
- Mensagem de campos faltantes vira um **toast inline** acima do botão Próxima, listando quais campos faltam (clicáveis para scrollar até eles).

### Etapas específicas

| Etapa | Ajuste principal |
|---|---|
| 1. Informações Básicas | Reformatar `BasicInformationSection` em 2 colunas (paciente / profissional) com avatar e selo dourado. |
| 2. Objetivos Terapêuticos | Agrupar campos em duas seções: "Objetivos gerais" e "Metas específicas" com divisor sutil. |
| 3. Sessão e Atividades | Subdividir em 3 grupos colapsáveis: "Setting & Estrutura", "Técnicas musicais", "Recursos sonoros" (campo a campo fica longo demais sem agrupamento). |
| 4. Comunicação e Linguagem | Grupos: "Vocalizações", "CAA", "Pragmática" + templates noir/gold. |
| 5. Evolução do Paciente | Grupo "Comparativo baseline" separado de "Metas (atingidas / em progresso / não atingidas)" com cards coloridos discretos (verde/âmbar/cinza). |
| 6. Plano Futuro | Timeline visual vertical para curto / médio / longo prazo. |
| 7. Encaminhamentos | Grupos por destinatário: Família, Escola, Equipe interdisciplinar. |
| 8. Fundamentação Teórica | Templates em destaque (escolher abordagem primeiro), campos abaixo. |
| 9. Conclusão | Layout simples e arejado, foco no textarea grande. |
| 10. Observações Complementares | Layout minimalista, sem subdivisões. |
| 11. Revisão Final | Reformatar `FinalReviewSection` com resumo em cards por etapa (todas marcadas como completas/incompletas) + botão único dourado "Gerar relatório com IA e salvar". |

### Tokens reutilizados
- Cores: `#0d0d0d` (fundo), `#1a1a1a` (cards), `#c9a84c` / `#f0d78c` (dourado), `text-gray-400/500` (texto secundário).
- Fontes: `Instrument Serif` (títulos), `Work Sans` (corpo) — mantidas.
- Sem novas dependências.

## Implementação técnica

### Arquivos a editar
- `src/components/musicoterapia/MusicoterapiaReportWizard.tsx` — reescrever layout (hero compacto, stepper vertical desktop / horizontal mobile, footer simplificado, templates noir/gold, grupos de campos via novo helper).
- `src/components/musicoterapia/BasicInformationSection.tsx` — layout 2 colunas + cards dourados.
- `src/components/musicoterapia/FinalReviewSection.tsx` — sumário por etapa + CTA único.
- `src/components/musicoterapia/MusicoterapiaFormField.tsx` — estado "preenchido" com borda dourada à esquerda, asterisco dourado em obrigatórios.
- `src/components/musicoterapia/MusicoterapiaGuidance.tsx` — converter para popover acionado por ícone de info (manter API).

### Arquivos novos
- `src/components/musicoterapia/WizardStepper.tsx` — stepper vertical desktop / horizontal mobile (extrair para limpar o wizard principal).
- `src/components/musicoterapia/WizardFieldGroup.tsx` — wrapper de agrupamento de campos com título dourado pequeno e divisor.
- `src/components/musicoterapia/WizardStepHeader.tsx` — cabeçalho com chip, título, meta-info de progresso da etapa.

### Sem mudança de lógica
- Estrutura de `STEPS`, validação, salvamento, integração com IA e templates permanecem idênticas.
- Apenas reorganização visual + extração de subcomponentes de apresentação.

## Fora de escopo
- Mudanças em PDFs gerados.
- Mudanças no template de dados (`musicoterapiaTemplate.ts`).
- Alterações em outras páginas (Processes, Evaluation, etc).

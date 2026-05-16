## Mudanças no Relatório MuseTera TEA

### 1. Remover tópicos 2, 3, 4 e 5

Em `src/components/musicoterapia/MusicoterapiaReportWizard.tsx`, remover do array `STEPS`:

- **2. Identificação Clínica** (`clinical_identification`)
- **3. Identidade Sonora (ISO)** (`iso_identity`)
- **4. Avaliação Sensório-Musical** (`sensory_profile`)
- **5. Domínios IMTAP** (`imtap_domains`)

O wizard passa de 16 para **12 etapas**. As demais são renumeradas automaticamente pela ordem do array (títulos passam a ser "2. Objetivos Terapêuticos", "3. Sessão e Atividades", etc.). Os campos das seções removidas permanecem definidos no template para não quebrar geração de PDF/IA, apenas deixam de aparecer no wizard.

### 2. Templates prontos nos tópicos 9, 11 e 13

Após a renumeração, esses passam a ser:

- **9 → Fundamentação Teórica** (`theoretical_foundation`)
- **11 → (não existe mais, total = 12)** — *ver nota abaixo*
- **13 → (não existe mais)** — *ver nota abaixo*

**Nota importante:** com a remoção de 4 etapas, só restam 12 etapas, então "tópico 11" e "tópico 13" originais (Plano Terapêutico Futuro e Fundamentação Teórica) precisam ser identificados pelo conteúdo, não pelo número antigo. Assumindo que o usuário se refere aos tópicos **conforme numeração atual antes da remoção**:

- **9. Comunicação e Linguagem** (`communication_language`)
- **11. Plano Terapêutico Futuro** (`future_plan`)
- **13. Fundamentação Teórica** (`theoretical_foundation`)

Para cada um, criar um objeto `STEP_TEMPLATES` em `MusicoterapiaReportWizard.tsx` mapeando `fieldId → texto pronto`. Ao entrar na etapa, se o campo estiver vazio, pré-preencher com o template via `handleFieldUpdate`. Também adicionar um botão **"Aplicar template"** no topo da etapa para reaplicar.

**Templates propostos:**

**Comunicação e Linguagem (9):**
- `vocalizations_observed`: "Paciente apresenta vocalizações espontâneas durante atividades musicais, com variação de altura e intensidade, especialmente em resposta a estímulos melódicos preferidos."
- `verbal_output_during_music`: "Observa-se aumento da produção verbal durante o canto e atividades rítmicas, com tentativas de acompanhar trechos de canções familiares."
- `echolalia_musical`: "Presença de ecolalia musical funcional, com repetição de fragmentos melódicos e refrões como forma de comunicação e autorregulação."
- `aac_use`: "Não utiliza sistema de Comunicação Aumentativa e Alternativa (CAA) no momento. Comunicação predominantemente gestual e vocal."
- `pragmatic_skills`: "Habilidades pragmáticas em desenvolvimento, com iniciativa comunicativa crescente em contexto musical estruturado, troca de turnos com apoio do terapeuta."

**Plano Terapêutico Futuro (11):**
- `next_objectives_short`: "Curto prazo (1-3 meses): Ampliar repertório de canções funcionais; consolidar troca de turnos musicais; aumentar tempo de atenção compartilhada."
- `next_objectives_medium`: "Médio prazo (3-6 meses): Desenvolver autorregulação por meio de improvisações estruturadas; estimular comunicação intencional via instrumentos."
- `next_objectives_long`: "Longo prazo (6-12 meses): Promover autonomia musical, generalização de habilidades para outros contextos e participação em atividades grupais."
- `proposed_interventions`: "Intervenções receptivas, recriativas e improvisacionais conforme modelo de Bruscia, com foco em ISO de Benenzon e adaptações sensoriais."
- `expected_outcomes`: "Espera-se evolução nas dimensões comunicativa, socioemocional e sensório-motora, com generalização para contextos familiar e escolar."
- `revaluation_date`: "Reavaliação prevista em 3 meses, com aplicação de escalas IMTAP e registro qualitativo."

**Fundamentação Teórica (13):**
- `theoretical_framework`: "O presente relatório fundamenta-se no Modelo Benenzon (Princípio do ISO), nas práticas de Nordoff-Robbins (Musicoterapia Criativa), no modelo de Bruscia (níveis de prática) e nos domínios clínicos da IMTAP (Individualized Music Therapy Assessment Profile), associados às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11."
- `assessment_tools_used`: "Instrumentos: IMTAP (Baxter et al., 2007), Escala MuseTera de avaliação musicoterapêutica, observação clínica sistematizada e Perfil Sensorial de Dunn."
- `references_cited`: "Benenzon, R. (1985). Manual de Musicoterapia. Bruscia, K. (2000). Definindo Musicoterapia. Nordoff, P.; Robbins, C. (2007). Creative Music Therapy. Baxter et al. (2007). The Individualized Music Therapy Assessment Profile. APA (2022). DSM-5-TR."

### 3. Mecânica de aplicação

No componente, adicionar:

```ts
const STEP_TEMPLATES: Record<string, Record<string, string>> = { ... }

useEffect(() => {
  const tmpl = STEP_TEMPLATES[currentStepData.id];
  if (!tmpl) return;
  const updates: Record<string, any> = {};
  Object.entries(tmpl).forEach(([fid, txt]) => {
    if (!reportData.fieldValues?.[fid]) updates[fid] = txt;
  });
  if (Object.keys(updates).length) {
    onUpdateData({ ...reportData, fieldValues: { ...reportData.fieldValues, ...updates }});
  }
}, [currentStep]);
```

E botão "Aplicar template padrão" acima dos campos quando `STEP_TEMPLATES[currentStepData.id]` existir, que força a sobrescrita.

### Arquivos alterados

- `src/components/musicoterapia/MusicoterapiaReportWizard.tsx` (único)

Nenhuma alteração em template/PDF/IA — os campos continuam existindo e sendo exportados normalmente.
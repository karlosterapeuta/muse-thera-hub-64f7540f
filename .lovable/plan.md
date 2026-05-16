## Objetivo

Transformar o "Relatório MuseTera TEA" em um documento clínico de padrão profissional, alinhado às boas práticas internacionais de musicoterapia para TEA (modelos Nordoff‑Robbins, Benenzon/ISO, Bruscia, IMTAP) e à classificação diagnóstica vigente (DSM‑5‑TR / CID‑11 6A02), mantendo o fluxo de wizard e o PDF atuais.

## Novas etapas e campos do wizard

Os campos atuais permanecem; a expansão acrescenta 6 novas etapas (passando de 8 → 14) e enriquece as existentes. Tudo continua opcional (regra já adotada na Anamnese).

### 1. Identificação clínica ampliada (etapa 1)
- `cid_code` — CID‑11 (6A02) / DSM‑5‑TR equivalente
- `support_level` — Nível de suporte (1, 2 ou 3)
- `comorbidities` — Comorbidades (TDAH, deficiência intelectual, ansiedade, epilepsia, TPS…)
- `current_medications` — Medicações em uso
- `referral_source` — Encaminhamento (neuropediatra, escola, família…)
- `session_count` / `treatment_start_date` / `session_frequency` / `session_duration`

### 2. Identidade Sonora (ISO de Benenzon) — NOVA etapa
- `iso_gestational` — ISO Gestacional
- `iso_universal` — ISO Universal
- `iso_cultural` — ISO Cultural
- `iso_complementary` — ISO Complementar
- `iso_group` — ISO Grupal
- `sound_preferences` — Sons/timbres preferidos e aversivos
- `musical_repertoire_favorites` — Repertório significativo

### 3. Avaliação Sensório‑Musical (perfil sensorial) — NOVA etapa
Escalas 1–10 + observações livres:
- `auditory_processing` — Processamento auditivo
- `sound_tolerance` — Tolerância a volume/timbre
- `vestibular_response_music` — Resposta vestibular ao ritmo
- `tactile_instrument_response` — Resposta tátil a instrumentos
- `proprioceptive_response` — Resposta proprioceptiva
- `sensory_seeking_vs_avoiding` — Buscador vs. evitador sensorial
- `sensory_profile_notes` — Síntese descritiva

### 4. Avaliação clínica musicoterapêutica (IMTAP/inspirada) — NOVA etapa
Domínios avaliados em escala 1–10 com campo de evidências:
- `domain_musicality` — Musicalidade (ritmo, melodia, dinâmica)
- `domain_communication_verbal` — Comunicação verbal via música
- `domain_communication_nonverbal` — Comunicação não‑verbal/gestual
- `domain_social_interaction` — Interação social musical
- `domain_emotional` — Expressão e regulação emocional
- `domain_cognitive` — Cognição (atenção, memória, sequenciamento)
- `domain_motor_gross` — Motricidade ampla
- `domain_motor_fine` — Motricidade fina (manuseio instrumental)
- `domain_sensory_integration` — Integração sensorial
- `domain_autonomy` — Autonomia e iniciativa musical
- `domain_evidences` — Evidências clínicas observadas em cada domínio

### 5. Sessão estruturada — expansão da etapa 3
- `session_setting` — Setting (individual, dupla, familiar)
- `session_structure` — Estrutura (hello song, exploração, fechamento)
- `improvisation_use` — Uso de improvisação clínica (modelo Bruscia)
- `receptive_techniques` — Técnicas receptivas (audição dirigida, GIM adaptado)
- `recreative_techniques` — Técnicas recriativas (canto/canção, performance)
- `compositional_techniques` — Técnicas composicionais (songwriting terapêutico)
- `instruments_used` — Instrumentos (mantém)
- `musical_genres` — Gêneros e modos musicais
- `tempo_dynamics_used` — Andamentos e dinâmicas exploradas
- `vocal_work` — Trabalho vocal

### 6. Análise comportamental durante a sessão — NOVA etapa
- `eye_contact_quality` — Contato visual (escala)
- `joint_attention` — Atenção compartilhada (escala)
- `stereotypies_during_music` — Estereotipias durante a música
- `self_regulation_strategies` — Estratégias de autorregulação observadas
- `meltdown_shutdown_episodes` — Episódios de meltdown/shutdown
- `transitions_response` — Resposta a transições
- `imitation_skills` — Imitação musical e gestual (escala)
- `turn_taking_musical` — Alternância de turnos musicais (escala)

### 7. Comunicação e linguagem — NOVA etapa
- `vocalizations_observed` — Vocalizações observadas
- `verbal_output_during_music` — Produção verbal durante a música
- `echolalia_musical` — Ecolalia musical (funcional/não funcional)
- `aac_use` — Uso de CAA (comunicação aumentativa)
- `pragmatic_skills` — Habilidades pragmáticas musicais

### 8. Evolução clínica — expansão da etapa 4
Mantém `patient_evolution` e adiciona:
- `evolution_compared_baseline` — Comparativo com avaliação inicial
- `goals_achieved` — Objetivos alcançados (lista)
- `goals_in_progress` — Em progresso (lista)
- `goals_not_achieved` — Não alcançados + hipóteses
- `quantitative_indicators` — Indicadores quantitativos (frequência, duração)

### 9. Plano terapêutico futuro — NOVA etapa
- `next_objectives` — Próximos objetivos (curto/médio/longo prazo)
- `proposed_interventions` — Intervenções propostas
- `expected_outcomes` — Resultados esperados
- `revaluation_date` — Data de reavaliação prevista

### 10. Orientações à família e equipe — expansão da etapa 5
- `home_activities` (mantém)
- `family_guidance` (mantém)
- `school_recommendations` — Orientações à escola
- `interdisciplinary_team_notes` — Articulação com equipe (fono, TO, psicologia)
- `playlist_recommended` — Playlist recomendada para casa
- `red_flags_to_monitor` — Sinais de alerta para a família monitorar

### 11. Fundamentação teórica — NOVA etapa
- `theoretical_framework` — Abordagem (Nordoff‑Robbins, Benenzon, Bruscia, GIM, Neurologic Music Therapy…)
- `references_cited` — Referências bibliográficas citadas
- `assessment_tools_used` — Instrumentos de avaliação aplicados (IMTAP, MAKS, ABA musical etc.)

### 12. Conclusão, observações, assinatura
Mantém etapas atuais (Conclusão, Observações Complementares, Revisão Final/Assinatura) integradas após as novas etapas.

## Mudanças no PDF (`generatePDFContent`)

- Renderizar todas as novas seções condicionalmente (só aparecem se preenchidas).
- Adicionar bloco "Resumo Quantitativo" com tabela das escalas 1–10 (domínios IMTAP + sensoriais + comportamentais) para leitura rápida.
- Sumário executivo opcional no topo (Diagnóstico • Nível de suporte • Nº de sessões • Data de reavaliação).
- Página de fundamentação teórica e referências ao final, antes do rodapé com carimbo (mantém o footer atual com assinatura digital e carimbo dourado).
- Numeração de páginas e cabeçalho compacto a partir da página 2 (nome do paciente + data).

## Mudanças no Wizard

- Atualizar `STEPS` em `MusicoterapiaReportWizard.tsx` para 14 etapas; manter o ícone, descrição e agrupamento.
- Reaproveitar componentes existentes (`MusicoterapiaFormField`, escala, textarea, multiselect).
- Aplicar a regra já vigente: nenhum campo obrigatório bloqueia salvar/baixar.
- Manter scroll-to-top suave entre etapas (regra de memória do projeto).
- Quick‑fill (frases pré‑definidas) será estendido com sugestões clínicas para cada novo domínio em `src/data/musicoterapiaPhrases.ts`.

## Arquivos a alterar

- `src/data/musicoterapiaTemplate.ts` — acrescentar ~60 novos campos com `guidance` clínico.
- `src/data/musicoterapiaPhrases.ts` — frases pré‑definidas para cada novo campo.
- `src/components/musicoterapia/MusicoterapiaReportWizard.tsx` — novos passos no array `STEPS`.
- `src/pages/processes/musicoterapia/index.tsx` — função `generatePDFContent`: novas seções, tabela‑resumo de escalas, sumário executivo, página de fundamentação.
- `src/components/musicoterapia/MusicoterapiaPreview.tsx` — espelhar novas seções no preview.

## Fora de escopo nesta entrega

- Persistir novos campos no banco (já são salvos como JSON em `fieldValues` — sem migração necessária).
- Mudar identidade visual / cores (mantém o teal atual + carimbo dourado MuseTera).
- Reescrever o wizard em outra arquitetura.

## Critérios de aceite

1. 14 etapas no wizard, todas opcionais, salvando e baixando PDF mesmo em branco.
2. PDF inclui apenas seções preenchidas; tabela resumo só aparece se houver ao menos uma escala preenchida.
3. Frases pré‑definidas disponíveis nos novos campos.
4. Preview na tela espelha o PDF.
5. Build limpo, sem alterações no fluxo de assinatura/carimbo/storage.
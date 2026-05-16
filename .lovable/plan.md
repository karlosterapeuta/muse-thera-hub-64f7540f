## Substituir auto-preenchimento por seletor de templates

Nas etapas **Comunicação e Linguagem**, **Plano Terapêutico Futuro** e **Fundamentação Teórica** do wizard MuseTera TEA, trocar o auto-preenchimento por uma **galeria de opções de templates** que o usuário escolhe manualmente.

### Mudanças em `src/components/musicoterapia/MusicoterapiaReportWizard.tsx`

1. **Remover** o `useEffect` que chama `applyStepTemplate(false)` ao entrar na etapa — nada é preenchido automaticamente.

2. **Reestruturar `STEP_TEMPLATES`** para suportar múltiplas variantes por etapa:

```ts
const STEP_TEMPLATES: Record<string, { id: string; label: string; description: string; values: Record<string,string> }[]> = {
  communication_language: [
    { id: 'verbal_emerging', label: 'Comunicação verbal emergente', description: 'Paciente com vocalizações e produção verbal em desenvolvimento.', values: {...} },
    { id: 'nonverbal_caa', label: 'Não-verbal com CAA', description: 'Paciente não-verbal que utiliza Comunicação Aumentativa e Alternativa.', values: {...} },
    { id: 'echolalic_functional', label: 'Ecolalia funcional', description: 'Paciente com ecolalia musical como recurso comunicativo.', values: {...} },
  ],
  future_plan: [
    { id: 'initial_stage', label: 'Início de tratamento', description: 'Foco em vínculo, exploração e regulação básica.', values: {...} },
    { id: 'consolidation', label: 'Fase de consolidação', description: 'Ampliação de habilidades e generalização.', values: {...} },
    { id: 'advanced', label: 'Fase avançada / alta', description: 'Autonomia musical e preparação para alta terapêutica.', values: {...} },
  ],
  theoretical_foundation: [
    { id: 'benenzon_iso', label: 'Modelo Benenzon (ISO)', description: 'Fundamentação centrada no Princípio do ISO.', values: {...} },
    { id: 'nordoff_robbins', label: 'Nordoff-Robbins Criativa', description: 'Musicoterapia Criativa de Nordoff-Robbins.', values: {...} },
    { id: 'bruscia_imtap', label: 'Bruscia + IMTAP', description: 'Modelo de Bruscia com avaliação IMTAP.', values: {...} },
    { id: 'integrative', label: 'Abordagem integrativa', description: 'Combinação de Benenzon, Bruscia, Nordoff-Robbins e IMTAP.', values: {...} },
  ],
};
```

Cada variante traz textos diferentes para os mesmos campos da etapa (mesma estrutura dos templates atuais, mas em 3-4 versões cada).

3. **Novo bloco de UI** acima dos campos, quando a etapa tem templates: em vez do banner único + botão "Aplicar", renderizar **cards selecionáveis** (1 por variante) com `label`, `description` e botão "Usar este template". Ao clicar:
   - Confirma se já há conteúdo nos campos (toast simples), e
   - Aplica os valores da variante via `handleFieldUpdate` para cada campo.
   - Marca a variante como ativa (estado `selectedTemplate[stepId]`).

4. **Comportamento padrão**: os campos começam **vazios**. O usuário pode escolher uma variante, editar livremente, ou preencher do zero.

5. Manter o resto do wizard (validação opcional, navegação, IA, salvar/baixar) intacto.

### Arquivos alterados
- `src/components/musicoterapia/MusicoterapiaReportWizard.tsx` (único)

Nenhuma alteração em template/PDF/IA.
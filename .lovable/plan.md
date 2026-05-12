## Problema

Os blocos **"Identificação e Encaminhamento"** e **"Medicação em Uso"** não aparecem na anamnese salva nem no PDF exportado porque:

1. **Colunas inexistentes no banco** — os campos `diagnosis_details`, `cid_code`, `clinical_details`, `medication_schedule` e `medication_effects` são preenchidos no formulário mas a tabela `anamnesis` não possui essas colunas. O `filterDatabaseFields` em `AnamnesisFormWrapper.tsx` descarta tudo que não existe no banco, então esses dados nunca são gravados.
2. **`AnamnesisView` desatualizado** — mostra "Informações do Paciente" e "Tratamento e Medicação" sem renderizar `diagnosis_details`, `cid_code`, `medication_schedule` nem `medication_effects` (mesmo que existissem no banco).
3. **PDF** — o gerador (`anamnesisePDFGenerator.ts`) já renderiza esses campos, então só falta a persistência funcionar.

## Mudanças

### 1. Migração no banco (Lovable Cloud)
Adicionar colunas faltantes na tabela `public.anamnesis`:
- `diagnosis_details text`
- `cid_code text`
- `clinical_details text`
- `medication_schedule text`
- `medication_effects text`

### 2. `src/pages/anamnesis/AnamnesisFormWrapper.tsx`
Incluir os 5 novos campos no array `basicDatabaseFields` para que sejam reconhecidos como persistíveis e o cache de colunas seja invalidado.

### 3. `src/pages/anamnesis/components/AnamnesisView.tsx`
- Renomear o bloco "Informações do Paciente" para **"Identificação e Encaminhamento"** e adicionar `diagnosis_details` e `cid_code`.
- Renomear "Tratamento e Medicação" para **"Medicação em Uso"** e exibir `current_medication`, `medication_schedule` e `medication_effects` (mover `therapeutic_goals`/`treatment_approach` para um bloco separado "Objetivos Terapêuticos").
- Garantir que os blocos apareçam quando qualquer um dos campos estiver preenchido.

### 4. Validação
Após implementar:
- Criar/editar uma anamnese, preencher os campos das seções 1 e 3, salvar.
- Reabrir a visualização → confirmar que os blocos aparecem com os dados.
- Exportar o PDF → confirmar que os blocos aparecem.

Não vou alterar a lógica de outras seções nem mexer no formulário em si — apenas habilitar a persistência e a exibição dos campos que já existem na UI.

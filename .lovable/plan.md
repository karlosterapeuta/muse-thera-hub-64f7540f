## Objetivo

Na aba **Financeiro → Recibos**, adicionar um botão "Importar Comprovante" que aceita JPG/PNG/PDF do comprovante de pagamento (PIX, transferência, etc.), extrai automaticamente os dados do pagador (nome, CPF/CNPJ, valor, data, método) via IA, e abre o diálogo de emissão de recibo já pré-preenchido para revisão antes de gerar o PDF.

## Fluxo do usuário

1. Usuário clica em **"Importar Comprovante"** (botão novo, destacado, no topo da aba Recibos).
2. Seleciona ou arrasta um arquivo (JPG/PNG/PDF, até 10 MB).
3. Loading: "Lendo comprovante..." (2–6 s).
4. Abre o diálogo **Emitir Recibo** já preenchido com:
   - Nome do pagador
   - CPF/CNPJ (se detectado)
   - Valor
   - Data do pagamento
   - Método (PIX/TED/dinheiro)
   - Descrição padrão ("Sessão de Musicoterapia") — editável
5. Usuário revisa, ajusta o que precisar e clica **Gerar PDF**.
6. Comprovante original fica salvo no bucket `payment-proofs` e vinculado ao recibo.

## Detalhes técnicos

### 1. Edge Function `parse-payment-proof`
- Recebe `{ fileBase64, mimeType }`.
- Para PDF: envia direto pro Gemini (suporta PDF nativamente). Para imagem: envia como `inline_data`.
- Usa **Lovable AI Gateway** (`LOVABLE_API_KEY`, modelo `google/gemini-2.5-flash`) com `response_format` JSON Schema:
  ```
  { payer_name, payer_document, amount, payment_date (YYYY-MM-DD),
    payment_method (pix|transferência|boleto|dinheiro|cartão),
    bank_origin?, transaction_id?, confidence (0-1) }
  ```
- Prompt instrui a extrair somente o **pagador** (não o beneficiário/recebedor), retornar `null` em campos não encontrados e detectar moeda BRL.
- Trata `429`/`402` retornando mensagem amigável.
- Faz upload do arquivo original para `payment-proofs/{user_id}/{uuid}.{ext}` e retorna o path.

### 2. Frontend — `ImportProofButton.tsx` + `ImportProofDialog.tsx`
- Novo componente em `src/components/finance/receipts/`.
- Dropzone simples (input file + drag&drop), preview da miniatura.
- Chama `supabase.functions.invoke('parse-payment-proof', ...)`.
- Em sucesso: monta um `FinancialRecord` "virtual" (sem `id` real, com `_isVirtual: true`) contendo os dados extraídos e dispara `EmitReceiptDialog`.

### 3. Ajustes em `EmitReceiptDialog`
- Aceitar `record` virtual (sem `financial_record_id`): salvar recibo com `financial_record_id = null`.
- Quando vier de comprovante, exibir badge "Importado de comprovante" e link para visualizar o arquivo original.
- Passar `payment_proof_path` opcional no insert do `payment_receipts` (campo já existe via observations ou novo campo).

### 4. Migration mínima
- Adicionar coluna `payment_proof_path TEXT` em `payment_receipts` para guardar o caminho do comprovante original no bucket `payment-proofs` (bucket já existe e é privado).
- Garantir policy de SELECT em `storage.objects` para `payment-proofs` restrita ao dono via `(storage.foldername(name))[1] = auth.uid()::text`.

### 5. Integração na UI
- Em `src/pages/finance/FinancePage.tsx` (ou onde a aba Recibos é renderizada), adicionar o `<ImportProofButton />` ao lado do título da seção Recibos.

## Bibliotecas
- Nenhuma nova. Usa `supabase.functions.invoke`, `react-dropzone` nativo via `<input type="file">`, `sonner` para toasts.

## Custos / privacidade
- Lovable AI Gateway: ~$0.001 por comprovante (Gemini 2.5 Flash).
- Comprovantes ficam em bucket privado, acessíveis apenas pelo dono.

## Arquivos a criar/editar
- `supabase/functions/parse-payment-proof/index.ts` (novo)
- `src/components/finance/receipts/ImportProofDialog.tsx` (novo)
- `src/hooks/useParsePaymentProof.ts` (novo)
- `src/components/finance/EmitReceiptDialog.tsx` (ajuste: aceitar record virtual + exibir badge/origem)
- `src/pages/finance/...` (botão "Importar Comprovante" na aba Recibos)
- Migration: `ALTER TABLE payment_receipts ADD COLUMN payment_proof_path TEXT` + policies de storage para `payment-proofs`.

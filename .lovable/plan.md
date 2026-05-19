# Sistema de Recibos Premium — Expansão

Vou evoluir o sistema atual de "Recibos" (que já tem emissão básica, validação CPF/CNPJ via BrasilAPI, PDF com QR Code/hash, histórico simples) para um módulo completo estilo SaaS premium.

## 1. Banco de dados (migrations)

**Novas tabelas:**
- `receipt_clients` — cadastro de pagadores reutilizáveis (nome, CPF/CNPJ, email, telefone, endereço) por usuário, com RLS.
- `receipt_templates` — modelos prontos de recibo (título, descrição padrão, valor sugerido, forma de pagamento) por usuário.

**Alterações em tabelas existentes:**
- `payment_receipts`: adicionar `city`, `observations`, `template_id`, `unique_code` (código único curto tipo `REC-2026-XXXXXX`), índice em `unique_code`.
- `receipt_issuer_profiles`: adicionar `signature_url` (URL de assinatura manual carregada no bucket `digital-signatures`).

Tudo com RLS `auth.uid() = user_id`.

## 2. Hooks de dados
- `useReceiptClients` — list/create/update/delete clientes.
- `useReceiptTemplates` — list/create/delete modelos.
- Estender `useReceiptIssuerProfile` para `signature_url`.
- Estender `usePaymentReceipts` para os novos campos + função `duplicateReceipt`.

## 3. Geração de PDF (`receiptPDFGenerator.ts`)
- Incluir `city`, `observations`, `unique_code` (impresso ao lado do número).
- Renderizar imagem da assinatura digital (se houver) acima da linha de assinatura.
- Valor por extenso já existe — manter.
- Botão "Imprimir" usando `window.print()` num iframe com o blob, no dialog.

## 4. UI — nova arquitetura de páginas Finance / Recibos

### `/finance/receipts` — Dashboard + Histórico (substitui a página atual)
Tabs: **Dashboard | Recibos | Clientes | Modelos | Emissor**

**Dashboard tab:**
- Cards: Total recebido no mês, Qtde de recibos no mês, Ticket médio, Recibos cancelados.
- Gráfico (Recharts) de receita por dia nos últimos 30 dias.
- Lista "Últimos 5 recibos".
- Top 5 clientes mais frequentes.
- Distribuição de métodos de pagamento (pizza).

**Recibos tab:**
- Busca por nome / CPF / data / valor / código único.
- Filtros: status, período, método.
- Ações por recibo: visualizar, baixar PDF, imprimir, **duplicar**, cancelar.

**Clientes tab:**
- CRUD de pagadores com validação CPF/CNPJ (BrasilAPI para CNPJ).
- Busca rápida.

**Modelos tab:**
- CRUD de modelos prontos. Botão "Emitir a partir deste modelo".

**Emissor tab:**
- Form do `receipt_issuer_profile` + upload de assinatura digital (bucket `digital-signatures`, pasta `${userId}/signature.png`).

### Dialog de emissão melhorado (`EmitReceiptDialog`)
- Autocomplete de clientes já cadastrados (Combobox); ao escolher, preenche nome+documento.
- Seletor de modelo pronto (preenche descrição/valor/método).
- Campos novos: **Cidade**, **Observações**.
- Valor por extenso exibido em tempo real abaixo do input.
- **Pré-visualização ao vivo** do recibo (painel lateral) atualizada conforme digita.
- Anti-duplicidade: avisa se já existe recibo com mesmo `financial_record_id` ou mesmo (cliente + valor + data) nas últimas 24h.
- Salvamento automático em `sessionStorage` (rascunho).
- Botão "Emitir e Imprimir" além do "Emitir e Baixar".

## 5. Tema claro/escuro
Já existe `useTheme`. Garantir que todas as novas telas usem tokens semânticos do design system (sem cores hard-coded) e respondam ao tema.

## 6. Responsivo mobile
- Tabs roláveis horizontalmente em telas pequenas.
- Cards de dashboard em grid 1-col no mobile, 2-col em md, 4-col em lg.
- Dialog vira full-screen no mobile.

## 7. Detalhes técnicos
- Código único gerado client-side: `REC-${ano}-${nano(6)}` checado contra DB antes de inserir.
- Assinatura: usuário pode desenhar (canvas) **ou** fazer upload de imagem PNG. Salva no bucket existente `digital-signatures` (já criado).
- Impressão: abrir blob em iframe oculto e chamar `print()`.
- Toda validação de input com zod nos forms.

## Arquivos a criar
- `supabase/migrations/<ts>_receipt_clients_templates.sql`
- `src/hooks/useReceiptClients.ts`
- `src/hooks/useReceiptTemplates.ts`
- `src/components/finance/receipts/ReceiptsDashboard.tsx`
- `src/components/finance/receipts/ReceiptsHistory.tsx`
- `src/components/finance/receipts/ClientsManager.tsx`
- `src/components/finance/receipts/TemplatesManager.tsx`
- `src/components/finance/receipts/IssuerProfileForm.tsx`
- `src/components/finance/receipts/SignaturePad.tsx`
- `src/components/finance/receipts/ReceiptLivePreview.tsx`
- `src/utils/uniqueCodeGenerator.ts`

## Arquivos a modificar
- `src/pages/finance/receipts.tsx` (vira shell com Tabs)
- `src/pages/finance/receipt-profile.tsx` (redirect para `/finance/receipts?tab=emissor`)
- `src/components/finance/EmitReceiptDialog.tsx` (autocomplete, modelos, preview, cidade, observações)
- `src/utils/receiptPDFGenerator.ts` (assinatura, cidade, observações, código único)
- `src/hooks/usePaymentReceipts.ts` (novos campos + duplicate)
- `src/hooks/useReceiptIssuerProfile.ts` (signature_url)

Confirma que posso começar?

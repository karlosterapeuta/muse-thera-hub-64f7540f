## Visão geral

Adicionar emissão de recibos de pagamento em PDF profissional na Gestão Financeira, com perfil de "Emissor de Recibos" validado via BrasilAPI (CNPJ gratuito e público).

## 1. Perfil Profissional Validado (Emissor)

Nova tabela `receipt_issuer_profiles` (1 por usuário):
- `user_id`, `document_type` ('cpf'|'cnpj'), `document_number`, `legal_name`, `trade_name`, `address`, `city`, `state`, `zip_code`, `phone`, `email`, `verified` (bool), `verified_at`.
- Valida CNPJ pela **BrasilAPI** pública e gratuita: `https://brasilapi.com.br/api/cnpj/v1/{cnpj}` — autopreenche razão social, endereço, etc.
- Para CPF: valida apenas algoritmo (dígitos verificadores) — não existe API pública gratuita oficial para consulta de CPF.
- RLS: usuário só lê/edita o próprio perfil.

Tela: `/finance/receipt-profile` — formulário com input de CNPJ que dispara busca automática, badge "✓ Validado" após sucesso.

## 2. Tabela de Recibos Emitidos

`payment_receipts`:
- `id`, `user_id`, `receipt_number` (sequencial por usuário: 0001, 0002...), `financial_record_id` (FK), `patient_name`, `patient_document` (opcional), `amount`, `service_description`, `payment_date`, `issued_at`, `pdf_path` (storage), `verification_hash` (SHA-256).
- RLS: dono.
- Trigger gera `receipt_number` sequencial por `user_id`.

## 3. Botão "Emitir Recibo"

Na página `src/pages/finance/index.tsx` e na lista de registros (`/finance/records`):
- Botão "📄 Emitir Recibo" em cada `FinancialRecord` (ícone Receipt).
- Pré-condição: usuário precisa ter `receipt_issuer_profile` completo — se não tiver, abre modal "Complete seu perfil de emissor" com link para `/finance/receipt-profile`.
- Ao clicar: abre modal `ReceiptPreviewDialog` com dados pré-preenchidos da sessão (paciente, valor, data, descrição editável, forma de pagamento).
- Ações no modal: **Gerar PDF**, **Download**, **Compartilhar WhatsApp**, **Compartilhar Email**.

## 4. Geração de PDF (premium, A4)

Usar **jsPDF + html2canvas** (já no projeto) seguindo padrão dos PDFs clínicos:
- Cabeçalho dourado/cosmic com logo MuseTera
- Bloco "RECIBO Nº 0001"
- Dados do emissor (validado ✓), dados do pagador, valor por extenso (BRL), descrição do serviço, data
- Cláusula de quitação: *"Para clareza, firmo o presente recibo dando plena, geral e irrevogável quitação da quantia acima especificada."*
- Local, data, assinatura digital do profissional (busca em `professionals.digital_signature_url`)
- Rodapé: hash SHA-256 + QR Code de verificação (`/verify-receipt/{id}`)
- Salvar automaticamente em bucket `clinical-pdfs` (`{user_id}/receipts/recibo-{number}.pdf`)

## 5. Compartilhamento

- **WhatsApp**: `https://wa.me/?text=...` com link público do PDF
- **Email**: `mailto:` com assunto e corpo pré-preenchido
- **Download** direto

## 6. Histórico de Recibos

Nova aba "Recibos Emitidos" em Finance ou rota `/finance/receipts`:
- Lista com filtro por período/paciente
- Reimprimir, baixar novamente, marcar como cancelado

## 7. Página pública de verificação

`/verify-receipt/:id` — mostra dados públicos do recibo (número, valor, data, emissor, hash) provando autenticidade via QR Code.

## Arquivos

**Novos:**
- `supabase/migrations/*.sql` (2 tabelas + trigger + RLS)
- `supabase/functions/validate-cnpj/index.ts` (proxy BrasilAPI com cache)
- `src/pages/finance/receipt-profile/index.tsx`
- `src/pages/finance/receipts/index.tsx`
- `src/pages/verify-receipt/[id].tsx`
- `src/components/finance/EmitReceiptDialog.tsx`
- `src/components/finance/ReceiptPDF.tsx`
- `src/hooks/useReceiptIssuerProfile.ts`
- `src/hooks/usePaymentReceipts.ts`
- `src/utils/receiptPDFGenerator.ts`
- `src/utils/cpfCnpjUtils.ts` (validação algorítmica + máscaras)
- `src/utils/numberToWords.ts` (valor por extenso BRL)

**Modificados:**
- `src/pages/finance/index.tsx` (botão "Recibos Emitidos" + "Perfil Emissor")
- `src/pages/finance/records/*` (ação "Emitir Recibo" por linha)
- `src/nav-items.tsx` (rotas)

## Design

Mesma identidade cosmic/dourada glassmorphic já aplicada: `bg-card/60 backdrop-blur-xl`, gradient `from-primary to-amber-500`, blobs ambientais, ícones lucide (`Receipt`, `FileCheck`, `ShieldCheck`, `QrCode`).

## API gratuita usada

**BrasilAPI** (https://brasilapi.com.br) — 100% gratuita, sem chave, mantida pela comunidade. Sem necessidade de secrets.

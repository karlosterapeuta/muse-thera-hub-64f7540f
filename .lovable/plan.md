## Objetivo

Transformar o módulo financeiro em um fluxo profissional de **contas a receber**: o profissional registra a sessão, marca quando recebe (com valor, data, forma de pagamento e comprovante opcional), e o sistema gera o recibo automaticamente e abre o envio ao cliente.

## Fluxo do usuário

```
1. Registrar sessão (já existe)
        ↓
2. Sessão fica "Pendente" na lista A Receber
        ↓
3. Cliente paga → profissional clica "Confirmar Recebimento"
        ↓
4. Modal: valor confirmado · data · forma de pagamento · anexar comprovante (opcional)
        ↓
5. Sistema marca como Pago + gera PDF do recibo automaticamente
        ↓
6. Abre modal de envio: WhatsApp · E-mail · Download · Imprimir
```

## Alterações no banco

Adicionar à tabela `financial_records`:
- `payment_status` (`pendente` | `pago` | `atrasado`) — default `pendente`
- `paid_at` (timestamp) — quando o pagamento foi confirmado
- `payment_method` (text) — `pix` | `dinheiro` | `transferencia` | `cartao` | `boleto` | `outro`
- `payment_proof_url` (text) — caminho do comprovante no Storage (opcional)
- `payment_notes` (text) — observações sobre o recebimento

Novo bucket de Storage: `payment-proofs` (privado, RLS por user_id na pasta).

Trigger: ao gerar `financial_records`, definir `payment_status = 'pendente'`. Marcar como `atrasado` via job/UI quando `session_date` < hoje - 7 dias e ainda `pendente`.

## Alterações de interface

**1. Página `/finance/records`**
- Nova coluna "Status de Pagamento" com badge colorido (amarelo pendente / verde pago / vermelho atrasado).
- Filtros: Todos · Pendentes · Pagos · Atrasados.
- Substituir botão "Emitir Recibo" por **"Confirmar Recebimento"** quando pendente; quando pago, mostrar "Ver Recibo" / "Reenviar".

**2. Novo componente `ConfirmPaymentDialog`**
- Campos: valor (pré-preenchido), data do pagamento (hoje), forma de pagamento (select), upload de comprovante (drag & drop, opcional), observações.
- Validação Zod.
- Ao confirmar: atualiza `financial_records`, faz upload do comprovante se houver, chama o pipeline de geração de recibo já existente, e abre o `EmitReceiptDialog` (modo envio) com o PDF pronto.

**3. Novo card no dashboard `/finance`**
- "Contas a Receber" — total pendente + total atrasado, com link para a lista filtrada.
- Linguagem 100% financeira (mantendo a decisão já registrada).

**4. Atualizar `FinancialStatCards`**
- Separar "Recebido no período" (apenas `payment_status = pago`) de "Faturado no período" (todos os registros).

## Detalhes técnicos

- Hook novo: `useConfirmPayment(recordId)` → faz update + upload + dispara `generateReceiptPDF` + `savePDFToStorage` + insert em `payment_receipts`.
- Reaproveitar 100% do pipeline atual de recibo (`EmitReceiptDialog` continua funcionando para casos avulsos).
- RLS do bucket `payment-proofs`: `(storage.foldername(name))[1] = auth.uid()::text`.
- Validação: não permitir confirmar pagamento sem perfil de emissor preenchido (legal_name + document_number).
- Marcação de atrasados: query computada no front (`session_date < today - 7d AND status = pendente`), sem job pesado.

## Fora de escopo (sugestões para depois)

- OCR de comprovante PIX com IA (custo + imprecisão — fica como melhoria futura opcional).
- Lembrete automático por WhatsApp para clientes em atraso.
- Conciliação bancária automática via Open Finance.

# Anamnese por Link Público (preenchida pela mãe)

## Objetivo
Permitir que o profissional gere um link único para enviar à mãe/responsável do paciente. A mãe abre o link (sem login), preenche o formulário de anamnese, e os dados ficam salvos automaticamente no sistema, vinculados ao profissional que enviou o link e ao paciente correspondente.

## Fluxo do usuário
```
Profissional (Anamnese)
   → seleciona/escolhe paciente
   → clica "Enviar link para responsável"
   → sistema gera link único + opção de copiar / WhatsApp
        │
        ▼
Mãe / responsável (abre o link, sem login)
   → vê nome do profissional e do paciente
   → preenche o formulário de anamnese
   → envia
        │
        ▼
Dados salvos na anamnese do paciente, vinculados ao profissional
   → profissional vê a anamnese preenchida na sua lista (marcada como "Preenchida pelo responsável")
```

## Banco de dados (migração)
Criar tabela `anamnesis_invitations`:
- `token` (texto único, gerado aleatoriamente — usado na URL)
- `professional_id` (dono do link)
- `patient_id` (paciente alvo)
- `status` (`pending` / `completed`)
- `anamnesis_id` (preenchido após envio)
- `expires_at` (validade, ex.: 14 dias)
- `completed_at`
- campos padrão (id, created_at, updated_at)

Regras de acesso:
- Profissional pode criar/ver/excluir apenas os próprios convites (RLS por `professional_id = auth.uid()`).
- O acesso público (mãe sem login) NÃO usa RLS direto — será feito por Edge Functions com privilégio de servidor, validando o token. Assim o link não expõe a tabela inteira.
- GRANTs adequados para `authenticated` e `service_role`.

## Edge Functions (acesso público sem login)
1. `get-public-anamnesis` — recebe o `token`, valida (existe, não expirado, status pending) e retorna apenas o necessário para a tela: nome do paciente e nome do profissional/clínica. Não retorna dados sensíveis.
2. `submit-public-anamnesis` — recebe `token` + dados do formulário. Valida o token, insere (ou atualiza) o registro na tabela `anamnesis` usando o `professional_id` e `patient_id` do convite, marca o convite como `completed` e vincula `anamnesis_id`. Marca a anamnese como originada de preenchimento externo.

Ambas com CORS e validação de entrada (Zod). Usam `SUPABASE_SERVICE_ROLE_KEY` internamente.

## Frontend
1. **Botão "Enviar link para o responsável"** na tela de Anamnese (junto às ações). Ao clicar:
   - Garante que um paciente está selecionado.
   - Cria um convite (token) para aquele paciente.
   - Abre um diálogo com o link gerado, botão "Copiar link" e botão "Enviar por WhatsApp".

2. **Nova rota pública** `/anamnese-publica/:token` (fora da área autenticada, em `App.tsx`):
   - Tela com a identidade visual MuseTera (logo dourado, fundo cósmico).
   - Chama `get-public-anamnesis` para validar o token e mostrar "Anamnese de **[paciente]** — solicitada por **[profissional]**".
   - Reaproveita o componente `InitialEvaluationForm` existente para o preenchimento.
   - Ao enviar, chama `submit-public-anamnesis` e mostra tela de confirmação ("Obrigado! As informações foram enviadas.").
   - Trata estados: token inválido/expirado e já preenchido.

3. **Indicação na lista de anamneses**: mostrar um selo "Preenchida pelo responsável" nas anamneses originadas de link, para o profissional diferenciar.

## Detalhes técnicos
- O token será um valor aleatório (ex.: `crypto.randomUUID()` ou string de 32 chars) gerado no cliente/edge e guardado na tabela.
- A rota pública não passa pelos guards de autenticação; será adicionada antes/fora do layout protegido em `App.tsx`.
- O formulário público reusa a mesma estrutura de campos (`InitialEvaluationForm`), garantindo consistência com o formulário interno.
- A anamnese salva fica idêntica às demais (mesma tabela `anamnesis`), portanto aparece normalmente na lista e nos PDFs do profissional.

## Observação
A autenticação do profissional já existe e funciona — apenas o link da mãe é público (validado por token via Edge Function), o que mantém a segurança sem expor os dados de outros pacientes.
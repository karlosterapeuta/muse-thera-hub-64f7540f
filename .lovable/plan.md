## Objetivo

Substituir/atualizar a edge function pública `public-register` para receber cadastros do bot do WhatsApp, com novo secret, rate limit e painel admin para aprovar/rejeitar.

## Estado atual (descobertas)

- A função `supabase/functions/public-register/index.ts` **já existe** e funciona muito parecido com o pedido, mas usa o secret antigo `WHATSAPP_BOT_API_KEY` (sem timing-safe compare, sem rate limit, sem Zod).
- A tabela `profiles` já existe com coluna `status` (default `'pending'`) e o trigger `handle_new_user` cria o perfil automaticamente.
- A tabela `user_roles` já existe com enum `app_role = ('admin' | 'professional')` e função `has_role()`. **Não existe role `'user'`** — vou adicionar.
- Já existe `update_user_status` RPC e o painel `PendingUsersPanel.tsx` no dashboard que aprova/rejeita. Vou criar uma página dedicada `/admin/cadastros-pendentes` mais completa.
- `profiles` não tem coluna `phone` nem `email` — vou adicioná-las para o bot conseguir gravar/exibir.

## Mudanças

### 1. Banco de dados (migration)

- Adicionar valor `'user'` ao enum `public.app_role`.
- Adicionar colunas `email text` e `phone text` em `public.profiles` (nullable).
- Atualizar o trigger `handle_new_user` para também copiar `email` e `phone` do `raw_user_meta_data`.
- Criar RPC `delete_pending_user(target_user_id uuid)` (security definer, só admin) que apaga `profiles` + `auth.users` para o botão "Rejeitar".

### 2. Secrets

- Gerar valor aleatório com `openssl rand -hex 32` e salvar como **`BOT_REGISTER_API_KEY`** via tool de secrets do Lovable Cloud.
- Mostrar o valor uma única vez no chat (após a criação) para você copiar.
- Manter `WHATSAPP_BOT_API_KEY` antigo intocado (você pode deletar manualmente depois).

### 3. Edge function `public-register` (reescrever)

`supabase/functions/public-register/index.ts`:

- `verify_jwt = false` (já está em `config.toml`).
- CORS com header `x-api-key` permitido.
- **Rate limit em memória**: `Map<ip, timestamps[]>`, 5 req/min por IP. Excedeu → `429 { success:false, error:"rate_limited" }`.
- Lê `x-api-key`, compara com `BOT_REGISTER_API_KEY` usando **timing-safe compare** (loop XOR de bytes de tamanho fixo). Falha → `401 { success:false, error:"Unauthorized" }`.
- Valida body com **Zod**: `name (1-100)`, `email (email, ≤255)`, `password (min 8, max 72)`, `phone (opcional, E.164 regex)`. Falha → `400 { success:false, error:"<mensagem>" }`.
- `supabase.auth.admin.createUser({ email_confirm: true, user_metadata: { name, phone, registration_source: "whatsapp_bot" } })`.
- Trigger `handle_new_user` cria o profile com `status='pending'` + email + phone.
- Email duplicado → `409 { success:false, error:"email_exists" }`.
- Sucesso → `200 { success:true, userId, status:"pending", message:"Cadastro recebido, aguardando aprovação" }`.
- Logs: `console.log` apenas com email, status code e userId. **Nunca** logar `password` nem `x-api-key`.

### 4. Painel admin `/admin/cadastros-pendentes`

Nova página `src/pages/admin/CadastrosPendentes.tsx` + rota em `src/App.tsx`:

- Protegida via `useAdmin()` (redireciona se não-admin).
- Lista `profiles` com `status='pending'` (nome, email, phone, created_at).
- Botão **Aprovar** → chama RPC `update_user_status(id, 'active')` + insere `user_roles { user_id, role: 'user' }`.
- Botão **Rejeitar** → chama RPC `delete_pending_user(id)` (apaga auth.users + profile).
- Toasts de sucesso/erro, loading states, refetch automático.
- Adicionar link no menu admin do sidebar.

### 5. Resposta final ao usuário

Após deploy, mostrar:

```
URL:         https://jztbkimlcrfndooyhohg.supabase.co/functions/v1/public-register
API KEY:     <valor gerado de 64 hex chars>
```

Para o bot configurar como `MUSETERA_REGISTER_URL` e `MUSETERA_REGISTER_API_KEY`.

## Detalhes técnicos

```text
Fluxo de cadastro:
  Bot WhatsApp
    │ POST + x-api-key + JSON body
    ▼
  public-register (edge function)
    ├─ rate limit (5/min/IP)
    ├─ timing-safe API key check
    ├─ Zod validate
    ├─ auth.admin.createUser ──► trigger handle_new_user ──► profiles (status=pending)
    └─ 200 { userId, status:"pending" }

Fluxo de aprovação:
  Admin abre /admin/cadastros-pendentes
    ├─ Aprovar ──► update_user_status('active') + insert user_roles(role='user')
    └─ Rejeitar ──► delete_pending_user() (auth.users + profile cascade)
```

## Arquivos

- **migration SQL** (alter enum + alter table + update trigger + new RPC)
- `supabase/functions/public-register/index.ts` (reescrita)
- `src/pages/admin/CadastrosPendentes.tsx` (novo)
- `src/App.tsx` (rota)
- `src/components/sidebar/constants.ts` ou similar (link no menu)

## Pontos de confirmação

1. Posso adicionar `'user'` ao enum `app_role`? (atualmente só tem `admin` e `professional`)
2. O secret antigo `WHATSAPP_BOT_API_KEY` continuará existindo — quer que eu remova depois ou prefere manter?
## Diagnóstico

Os logs do Supabase Auth mostram **dezenas de eventos `token_revoked` por segundo** vindos de `/creator-login` e culminando em **HTTP 429 (rate limit)**. Quando o refresh token falha por 429, o SDK do Supabase derruba a sessão silenciosamente — exatamente o que você descreve: "desloga sozinho, sem mensagem".

A causa é uma **avalanche de chamadas paralelas a `supabase.auth.getUser()`** disparada simultaneamente por vários componentes ao montar:

- `InstantAuthChecker` (em `App.tsx`)
- `AuthStatusChecker` (em `App.tsx`, refaz checagem a cada 1 min)
- `Layout` (route guard com getSession + profile)
- `Index.tsx` (verifica sessão + profile)
- `useAdmin` (getUser + RPC)
- `usePatientsData`, `useDashboardCounts`, `useProfessionalData`, `useCourses*`, `UserExpirationWarning`, `PushNotificationManager`, `SidebarFooter`, `creator/dashboard`, `creator/login` — todos chamam `getUser()` ao montar.

Cada `getUser()` força um round-trip ao servidor e, se o token estiver perto de expirar, dispara um refresh. Múltiplas instâncias paralelas tentam refrescar o mesmo refresh token → o servidor revoga o anterior, retorna 429, e a sessão é descartada localmente. Resultado: redirect silencioso para `/login` em qualquer navegação.

Além disso, **`Index.tsx`** faz `await supabase.auth.signOut()` se o profile vier nulo (transient) — sem mostrar toast, completando o quadro do "logout sem mensagem".

## Mudanças

### 1. Trocar `getUser()` por `getSession()` em todo o código cliente
`getSession()` lê do localStorage (sem rede, sem refresh forçado). `getUser()` só é necessário quando se exige validação server-side do JWT — o que **não é o nosso caso** em queries de perfil/contadores/etc., já que RLS já valida.

Arquivos a converter:
- `src/hooks/use-admin.ts`
- `src/hooks/usePatientsData.ts` (2 chamadas)
- `src/hooks/useDashboardCounts.ts` (4 chamadas)
- `src/hooks/useProfessionalData.ts`
- `src/hooks/useCourses.ts`, `useCoursesWithStats.ts`, `useCourseProgress.ts` (4 chamadas)
- `src/components/auth/UserExpirationWarning.tsx`
- `src/components/sidebar/hooks/useSidebarData.ts`
- `src/pages/creator/login.tsx` (verificação de sessão pré-login)
- `src/pages/creator/dashboard.tsx`

Padrão:
```ts
const { data: { session } } = await supabase.auth.getSession();
const user = session?.user;
if (!user) { /* sair sem signOut */ }
```

### 2. Consolidar os 3 auth-checkers redundantes
Remover `AuthStatusChecker` (intervalo de 1 min só piora a tempestade) e simplificar `InstantAuthChecker` para **apenas reagir a `SIGNED_OUT`** sem chamar `getUser()`/profile na montagem. O `Layout` já faz a validação completa por rota e é suficiente.

- `src/App.tsx` — remover `<AuthStatusChecker />` e `<InstantAuthChecker />` (Layout assume).
- Manter `src/components/auth/AuthStatusChecker.tsx` no projeto (caso seja reusado depois) mas desligar do app.

### 3. Não chamar `signOut()` em estados transitórios
- `src/pages/Index.tsx`: usar `.maybeSingle()`; se `profile` vier nulo, **navegar para `/dashboard`** (Layout decide), nunca `signOut()` silencioso.

### 4. Reduzir trabalho no startup do Dashboard
- `src/pages/Dashboard/*` e seus hooks só executam queries depois que `getSession()` retornar `session?.user`. Isso evita a explosão inicial de `getUser()` paralelos enquanto a sessão ainda está sendo hidratada do storage.

### 5. Validação
Após aplicar:
- Logar com `musicoterapeutakarlos@gmail.com` e navegar entre páginas — não deve sair sozinho.
- Conferir Auth logs do Supabase: a quantidade de `token_revoked` por minuto deve cair drasticamente e não deve aparecer 429.

## Detalhes técnicos

```text
ANTES (montagem do Dashboard):
  Layout.getSession ─┐
  InstantAuth.getSession ─┤
  AuthStatusChecker.getSession ─┤  → 6+ requests
  useAdmin.getUser ─┤              → /user + refresh
  useDashboardCountsx4.getUser ─┤  → 4× /user
  usePatientsData.getUser ─┤
  useProfessionalData.getUser ┘
  → /token refresh storm → 429 → SIGNED_OUT silencioso

DEPOIS:
  Layout.getSession (única fonte de verdade) → 1 leitura local
  hooks usam getSession (sem rede)
  InstantAuthChecker só escuta SIGNED_OUT
  → zero refreshes em paralelo
```

Sem mudança de schema, sem mudança em Edge Functions, sem alterar comportamento de bloqueio de usuários inativos/expirados (continua sendo feito pelo `Layout`).

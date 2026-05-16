## Objetivo
Ao acessar `portal.musetera.com.br/`, redirecionar para `/login` em vez de `/dashboard`.

## Mudança
Em `src/App.tsx`, a rota index atualmente faz:
```tsx
<Route index element={<Navigate to="/dashboard" replace />} />
```
Alterar para:
```tsx
<Route index element={<Navigate to="/login" replace />} />
```

## Observação
A página `/login` já redireciona automaticamente para `/dashboard` usuários com sessão ativa, então usuários logados continuarão chegando ao dashboard normalmente — apenas passando rapidamente pelo `/login`.

Se preferir que usuários já autenticados continuem indo direto para `/dashboard` sem passar pelo `/login`, posso ajustar `src/pages/Index.tsx` em vez do App.tsx — me avise qual prefere.
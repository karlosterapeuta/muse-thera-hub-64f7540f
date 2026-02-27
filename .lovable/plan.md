

## Plano: Limpeza Automática de Cache do Sistema

### Problema
Usuários estão usando versões desatualizadas do sistema porque o Service Worker e caches do navegador estão servindo conteúdo antigo.

### Solução
Implementar um sistema de versionamento que força a limpeza automática de todos os caches quando uma nova versão é detectada, garantindo que todos os usuários sempre usem a versão mais recente.

---

### Alterações

#### 1. Criar `src/utils/versionManager.ts`
Sistema de controle de versão que:
- Armazena a versão atual do app (timestamp do build)
- Compara com a versão salva no `localStorage`
- Se diferente, limpa **todos** os caches automaticamente:
  - Cache API do navegador (caches do Service Worker)
  - localStorage (exceto dados essenciais como tema)
  - sessionStorage
  - Cache interno do `globalCacheManager`
- Desregistra Service Workers antigos e força reload

#### 2. Atualizar `src/main.tsx`
- Executar verificação de versão **antes** de renderizar o app
- Se versão mudou: limpar tudo e recarregar a página
- Se versão atual: continuar normalmente
- Tornar o SW mais agressivo no `onNeedRefresh` (já faz `updateSW(true)`, manter)

#### 3. Atualizar `vite.config.ts`
- Reduzir tempo de cache dos recursos estáticos (JS/CSS) de 24h para 1h
- Adicionar `navigateFallback` para garantir que o HTML sempre busca da rede primeiro

---

### Detalhes Técnicos

**`versionManager.ts` - Lógica principal:**

```text
1. APP_VERSION = timestamp do build (gerado pelo Vite via import.meta.env)
2. Ao carregar:
   - Ler versão salva no localStorage
   - Se diferente ou inexistente:
     a. Limpar todos os caches via caches.keys() + caches.delete()
     b. Desregistrar todos os Service Workers
     c. Limpar globalCacheManager
     d. Salvar nova versão
     e. Forçar reload (window.location.reload)
   - Se igual: não fazer nada
```

**Caches que serão limpos:**
- `html-cache` (SW runtime cache)
- `static-resources` (SW runtime cache)
- `images-cache` (SW runtime cache)
- `google-fonts-cache` (SW runtime cache)
- `workbox-precache-*` (SW precache)
- Cache interno do `globalCacheManager`
- `sessionStorage`
- Itens temporários do `localStorage`

**Dados preservados no localStorage:**
- `theme` (preferência visual)
- `sb-*` (tokens do Supabase)

### Resultado Esperado
Sempre que o sistema for atualizado (novo deploy), todos os usuários terão seus caches limpos automaticamente na próxima visita, garantindo que usem a versão mais recente.


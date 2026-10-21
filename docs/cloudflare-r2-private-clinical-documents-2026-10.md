# MuseTera — implantação do arquivo clínico PRIVADO no Cloudflare R2
Data: 21/10/2026. Projeto Supabase: `jztbkimlcrfndooyhohg`.

## Situação atual
- 455 PDFs / 813,50 MB continuam em `clinical-pdfs` (Supabase), sem exclusão.
- `public.clinical_documents` foi adicionada com RLS por profissional e referência opcional ao paciente.
- `supabase/functions/clinical-documents/index.ts` é uma API autenticada para gravar, listar e baixar PDFs no R2.
- `src/utils/r2ClinicalDocuments.ts` é o cliente frontend, **ainda não acoplado aos botões de PDF**.
- NÃO ativar a nova função na produção antes de configurar o bucket, segredos e executar o piloto.

## Cloudflare — ações a realizar no painel da conta do proprietário
1. Em **Storage & databases > R2 > Overview**, ativar o R2 se necessário. A contratação pode pedir meio de pagamento. A franquia grátis não impede cobrança quando ultrapassada.
2. Criar bucket **`musetera-documentos-privados`**, classe **Standard**. **Não habilitar r2.dev, domínio público, nem acesso anônimo.**
3. Em **Manage R2 API tokens**, gerar uma chave **Object Read & Write**, restrita a ESSE bucket. Evitar token Admin e permissão a todos os buckets. Guardar Access Key e Secret Key localmente.
4. Anotar o Account ID no painel. Não publicar nem transmitir chaves pelo chat, GitHub, frontend, ou arquivo .env versionado.
5. Em Supabase **Edge Functions > Secrets**, salvar:
   - `R2_ACCOUNT_ID`: Account ID hex de 32 caracteres.
   - `R2_BUCKET`: `musetera-documentos-privados`.
   - `R2_ACCESS_KEY_ID`: chave R2.
   - `R2_SECRET_ACCESS_KEY`: segredo R2.
   - `R2_ALLOWED_ORIGINS`: `https://portal.musetera.com.br` (adicionar origem de QA se necessário).
6. A função lê `SUPABASE_URL` e `SUPABASE_ANON_KEY` predefinidos. Conferir disponibilidade dessas variáveis no projeto. Não inserir chaves no navegador.

Documentação:
- https://developers.cloudflare.com/r2/get-started/
- https://developers.cloudflare.com/r2/api/tokens/
- https://supabase.com/docs/guides/functions/secrets
- https://developers.cloudflare.com/r2/pricing/

## Proteção clínica / LGPD
- `R2` recebe apenas arquivos, nunca credenciais ou informações estruturadas do paciente. A chave do objeto é `owner_user_id/uuid.pdf`.
- A função **valida o JWT com Supabase Auth**. Para PDF associado a paciente, também verifica `patients.professional_id = user.id`.
- O navegador não recebe segredo de R2 nem endereço público do objeto. Downloads passam pelo backend após verificar RLS e hash SHA-256.
- Não habilitar acesso público, CORS aberto nem links permanentes. Rever requisitos de conservação, localização de dados, contratos com suboperador e eventual transferência internacional antes da transferência de dados clínicos reais.

## Prova de funcionamento (antes de ativar)
1. Implantar a função `clinical-documents` com `verify_jwt=true`, **somente após configurar segredos**.
2. Fazer upload de um PDF SINTÉTICO (sem paciente real) por usuário autenticado; ler `id`, `sha256` e `byteSize` da resposta.
3. Usar `getPrivateClinicalPdf(id)` e validar bytes e hash. Sem token → 401; outro usuário → 404; objeto alterado → 502.
4. Verificar que o bucket continua privado e que o registro pertence somente ao próprio usuário.
5. Confirmar download/visualização no navegador do Mac, PC e smartphone.
6. Só após aprovação clínica e técnica, habilitar arquivamento voluntário no frontend. Downloads normais continuam sem upload automático.

## Migração de PDFs legados — SOMENTE CÓPIA INICIAL
A migração dos 455 PDFs será uma fase separada, com manifesto que inclui bucket de origem, path, owner, tamanho, hash, chave destino, estado da cópia, resultados de leitura/recuperação, e referência de cadastro.
1. Inventariar todos os objetos via Storage API e validar owner e contexto. Não presumir que cada PDF está ligado à mesma linha de `reports`.
2. Fazer backup seguro fora do Supabase, sem imprimir dados clínicos em logs.
3. Copiar em lotes pequenos do Supabase para R2, **sem remover origem**; calcular SHA-256 nos bytes em ambas as pontas.
4. Registrar cada objeto na tabela com owner autenticado, tipo e paciente quando comprovados; validar acesso cruzado negado.
5. Testar restauração/download e a integridade de **100% dos objetos do lote** antes de expandir.
6. Somente considerar eliminação da CÓPIA redundante do Supabase após analisar a retenção aplicável, preservação legal, vínculo de download antigo, logs, consentimento e autorização por lote.
7. Para remover do Supabase quando apropriado: somente API Storage, nunca `DELETE FROM storage.objects` via SQL.
8. Medir `storage.objects.metadata.size` após cada lote e comparar com GB-hora do painel; não esperar queda instantânea.

## Cuidados de capacidade / custo
- Limite gratuito R2 Standard: 10 GB-mês, 1 milhão operações Classe A e 10 milhões operações Classe B mensais. Verificar o plano e configurar alertas; custo não é garantidamente zero.
- Não ativar `Infrequent Access` para depender do free tier.
- Cada PDF deve ter no máximo 20 MB no upload via Edge Function; para arquivos maiores será necessário outro fluxo.
- Nenhum job de exclusão ou limpeza automática faz parte desta PR.

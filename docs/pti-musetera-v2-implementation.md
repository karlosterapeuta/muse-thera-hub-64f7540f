# PTI MuseTera — plano de reestruturação gradual

**Status:** fase 1 em branch de desenvolvimento, sem migração de dados, publicação ou alteração de esquema Supabase.

## Diagnóstico dos módulos existentes

- `/pti`: editor `src/pages/pti/editor.tsx`, listagem, reavaliação, PDF e tabelas `pti_plans`, `pti_versions`. O campo `progress` mede **preenchimento do formulário**, não evolução clínica.
- `/musicotherapy-treatment-plan`: formulário musicoterapêutico com modelos, sugestões de IA, importação do prontuário, PDF e snapshots em `treatment_plan_versions`. Seus planos ficam em `treatment_plans`.
- `/treatment-plan` redireciona para `/musicotherapy-treatment-plan`.
- As duas implementações possuem estruturas de dados diferentes. Não apagar tabelas, não redirecionar pacientes antigos automaticamente e não migrar registros antes de validar mapeamentos, autorização e reversibilidade.

## Referência funcional: PTI Portage

A análise autorizada com REA descreveu, pela leitura de código entregue ao navegador e inspeção passiva, um painel de pacientes, avaliação Portage, catálogo de objetivos/atividades/materiais, intervenções por tentativas e acertos, histórico e exportação PDF. A execução integral desses fluxos **não foi validada**.

A implementação MuseTera deve ser própria e específica para musicoterapia. Não importar marca, textos institucionais, formulários protegidos ou catálogo proprietário de terceiros sem licença adequada.

## Fase 1 — Proteção dos documentos e da experiência atual

Arquivos alterados: `src/hooks/usePtiPlans.ts`, `src/pages/pti/editor.tsx`, `src/pages/pti/index.tsx`, `src/components/pti/PtiPDF.tsx`.

1. Gravar `pti_plans` pelo autosave sem criar registros adicionais em `pti_versions` a cada edição.
2. Criar um snapshot em `pti_versions` apenas no salvamento explícito, incluindo a ação Exportar PDF.
3. Serializar gravações por editor para evitar inserções duplicadas na criação e exportação fora de ordem.
4. Caso o primeiro INSERT de plano conclua mas o snapshot falhe, manter o ID salvo em memória para a próxima tentativa não criar outro plano.
5. Bloquear a geração PDF quando o salvamento/snapshot obrigatório falhar; usar no PDF o mesmo conteúdo enviado para salvar.
6. Distinguir “preenchimento do plano” de “evolução terapêutica” no editor e dashboard.
7. Alinhar a tipografia de destaque do PDF à identidade verde MuseTera.

**Limite técnico da fase 1:** snapshots e plano ainda usam duas gravações separadas em Supabase. Se a gravação da versão falhar, o plano pode ter sido salvo sem snapshot; o editor comunica essa situação e não gera PDF. Atomicidade deve ser considerada numa fase futura via transação/RPC. A versão pode ser registrada novamente ao repetir o salvamento manual. A exportação atual registra um novo snapshot explícito a cada tentativa válida.

## Etapa 1B — Editor V2 guiado (implementado nesta branch)

O editor `/pti/novo` e `/pti/:id` passa a apresentar uma navegação de oito etapas: identificação, contexto clínico, objetivos/metas, intervenções, acompanhamento, família/equipe, revisão e relatório.

- Interface responsiva e identidade verde MuseTera com resumo de paciente, objetivos e metas.
- Biblioteca **original** pesquisável de sugestões musicoterapêuticas. A seleção adiciona objetivo, atividade e instrumentos editáveis no mesmo registro.
- Metas terapêuticas permitem registrar linha de base observada (opcional).
- Importação **opt-in** de campos preenchidos da anamnese, com confirmação e sem sobrescrever campos existentes. O profissional deve conferir o conteúdo e não se presume que exista resultado de avaliação integrado.
- Reavaliação disponível no módulo anterior, sem converter mudanças de formulário em sessões.
- Nova etapa de revisão antes da geração de PDF, incluindo atividade, material e linha de base no documento.
- Campos adicionais são opcionais e compatíveis com registros antigos em `pti_plans.content`.
- Para novos planos, após a primeira gravação a navegação utiliza a URL do plano persistido, reduzindo riscos de duplicação por atualização do navegador.

**Ainda pendente:** validação visual e funcional do preview Cloudflare; verificação de RLS e build. A integração com a Escala MuseTera TEA e o registro por sessão ainda não foram implementados nesta fase.

## Fase 2 — Unificação funcional, sem exclusão dos módulos antigos

- Definir **/pti** como acesso unificado e preservar rotas legadas enquanto houver usuários/planos ativos.
- Desenhar contrato para `Plano`, `VersaoPlano`, `FonteClinica`, `Objetivo`, `Meta`, `Intervencao`, `Sessao`, `MedicaoMeta` e `RelatorioGerado`, com mapeamento reversível para tabelas antigas.
- Importar dados existentes de pacientes, anamnese e avaliação com identificação da fonte, data e autorização individual; dados faltantes devem ser “não informado”.
- Exibir separadamente percentual de preenchimento, cobertura da avaliação, desempenho e evolução ao longo do tempo.
- Permitir objetivo → meta mensurável → atividade/intervenção → registro de sessão → revisão; nunca transformar mudança de campo em nova sessão.
- Exigir revisão profissional de sugestões de IA; não inventar observações, diagnósticos, participação ou melhorias.
- Preservar o PDF de uma versão aprovada, com autoria e data, e validar legibilidade, assinatura/carimbo e quebras de página.
- Validar RLS de `pti_plans`, `pti_versions`, `treatment_plans` e fontes clínicas antes da disponibilização a profissionais.

## Checklist mínimo para revisão manual/QA

- [ ] Abrir um plano legado em `/pti/:id` e conferir dados sem modificá-los.
- [ ] Criar PTI para **paciente fictício**: alternar campos durante 10 segundos, confirmar que o autosave não criou histórico de snapshots.
- [ ] Clicar **Salvar**, conferir plano persistido e um novo snapshot na tabela `pti_versions`.
- [ ] Alterar uma meta e exportar PDF: verificar salvamento antes do download, conteúdo idêntico ao snapshot e layout verde.
- [ ] Simular falha na versão: verificar erro visível, download interrompido e ausência de duplicação do plano na nova tentativa.
- [ ] Simular duas ações de salvar consecutivas e comparar ordem do conteúdo salvo.
- [ ] Confirmar que percentuais do dashboard indicam preenchimento, não evolução clínica.
- [ ] Validar papéis/acesso por profissional e RLS com usuários de testes distintos.
- [ ] Executar `npm run build` e `npm run lint` em ambiente com as dependências instaladas.
- [ ] Revisar a versão em preview antes de permitir deploy de produção.

**Publicação:** nenhuma migração, merge ou deploy de produção deve ocorrer sem revisão do diff e testes acima.

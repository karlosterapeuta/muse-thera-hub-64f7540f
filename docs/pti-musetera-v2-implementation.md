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

## Etapa 1B — Reconstrução contínua baseada nos prints

O editor `/pti/novo` e `/pti/:id` foi reconstruído como **formulário contínuo**, substituindo o assistente de oito etapas que estava apenas na branch de testes.

- Cabeçalho claro, compactado, com nome do paciente e ações reais **Salvar**, **Nova avaliação** e **PDF do PTI**.
- Abas horizontais **PTI**, **Consolidado**, **PEI · Intervenção** e **Evolução**; todas apontam para dados existentes. Consolidado apresenta contagem do plano; intervenção mostra as atividades planejadas, sem inventar sessões; evolução lê `pti_reavaliacoes` e oferece acesso à rota existente.
- Blocos visuais em laranja sobre fundo claro: dados complementares, breve história clínica, objetivos por área, comportamentos-problema e considerações/plano de intervenção.
- Campos novos em `content.formulario` (JSON opcional), incluindo mãe, pai, medicação informada, protocolo, histórico guiado, comportamentos, referências e devolutiva. Nenhuma mudança SQL e nenhum campo preexistente apagado.
- Importação da anamnese com consentimento e preservação dos campos já preenchidos; inclui nomes dos responsáveis, CID, diagnóstico, medicações já informadas, histórico musical e informações clínicas disponíveis.
- Catálogo próprio de **55 sugestões musicoterapêuticas** e pequenas coleções por seis outras especialidades, agrupadas, pesquisáveis e com contagem de incluídos. Conteúdo original e editável; não são itens Portage validados.
- Grade de edição `OBJETIVO / ATIVIDADE / MATERIAL` e metas com linha de base, indicador e prazo.
- Síntese clínica baseada apenas nos textos efetivamente fornecidos, sem alegar fatos não observados.
- PDF profissional reorganizado conforme as seções do formulário, com opções de assinatura/carimbo e rodapé.
- Os dados clínicos antigos permanecem acessíveis em “Campos musicoterapêuticos complementares e dados anteriores”, inclusive critérios, avaliação descritiva e fundamentação.
- Botões de avaliação são **links ao módulo MuseTera existente**; importação automática dos objetivos da Escala MuseTera ainda requer integração própria.

**Restrições:** não copiar a marca, o catálogo proprietário ou materiais protegidos do produto PTI Portage. A semelhança concentra-se em organização e padrão de interação de formulário clínico. A equipe responsável precisa validar a aplicabilidade das sugestões de outras especialidades.

**Pendências de QA:** preview Cloudflare atualizado, exercício com paciente fictício, PDF, RLS e autorização por profissional, acessibilidade e responsividade. Não houve migração ou publicação em produção.

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

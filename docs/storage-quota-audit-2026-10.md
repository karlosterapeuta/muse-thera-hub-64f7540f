# MuseTera Storage — auditoria e plano seguro

## Medição do projeto Supabase (21/10/2026)

Projeto `jztbkimlcrfndooyhohg`; somente leitura via Supabase MCP.

| Bucket | Objetos | MB |
|--|--:|--:|
| clinical-pdfs | 452 | 808.21 |
| digital-signatures | 293 | 207.22 |
| avatars | 55 | 87.37 |
| report-logos | 64 | 33.92 |
| professional-avatars | 34 | 19.22 |
| patients | 10 | 16.29 |
| payment-proofs | 6 | 2.78 |
| Total | 914 | 1175.01 |

Metadados de Storage não equivalem exatamente à métrica acumulada do painel de faturamento.

- 276 PDFs / 528.29 MB têm mais de 90 dias, mas **não são elegíveis a exclusão somente por idade**.
- 240 arquivos de assinaturas / 175.36 MB têm mais de 90 dias. A consulta de URLs atuais na tabela professionals encontrou 107 / 81.54 MB associados aos campos digital_signature_url, digital_stamp_url ou stamp_photo_url. Isso **não comprova que os demais sejam órfãos**; arquivos antigos podem estar referenciados em registros externos, PDFs emitidos ou outras tabelas.
- O bucket clinical-pdfs é privado. Não mover para bucket público ou remover arquivos para contornar limite de armazenamento.
- digital-signatures está configurado como **público**; revisar política de privacidade e acesso separadamente, sem alterar permissões em produção sem testes.

## Correções de prevenção nesta branch

- Fotos de carimbo passam por redução para JPEG 1200px e qualidade 0.82, sem alterar arquivos anteriores.
- Fotos de pacientes passam por compressão e limite máximo de entrada, evitando novos uploads muito grandes.
- Canvas de assinatura/carimbo passa de escala 4 para 2. Validar legibilidade das imagens nos PDFs antes do merge.

## Recuperação de espaço — NÃO IMPLEMENTADA

1. Criar manifest contendo bucket, path, bytes, data, referências, hash e resultado de download (sem dados pessoais em relatórios públicos).
2. Fazer backup autenticado e testado dos PDFs clínicos e imagens; verificar documentos assinados.
3. Verificar referências de caminhos em banco e código, inclusive versões históricas do portal e usos de URLs públicas.
4. Remover somente arquivos individualmente aprovados e comprovadamente redundantes pela API Storage, nunca por `DELETE FROM storage.objects`.
5. Conferir uso atual no Storage e métrica da organização; esta última pode ser acumulada no ciclo.
6. Avaliar retenção documental, LGPD, consentimento e isolamento por profissional antes de mudar armazenamento.

**Critério de aceite**: nenhum prontuário, PDF necessário, imagem ativa ou dado de usuário perdido; download e novas exportações funcionam; meta de liberar ao menos 250 MB com folga adicional conforme ciclo.

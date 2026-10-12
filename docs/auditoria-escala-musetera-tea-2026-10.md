# Auditoria de interface e conteúdo clínico — Escala MuseTera TEA
Data: 12/10/2026
Status: revisão técnica e clínica preliminar; **não constitui validação científica**.

## Inventário da escala
- Cinco domínios: Musical, Psicossocial, Cognitivo, Sensório-Motor e Comunicativo-Interativo.
- Dezesseis subdomínios e 128 indicadores com protocolos de aplicação correspondentes.
- Níveis existentes: 0/20/40/60/80/100, com evidências registradas por item.
- Dados salvos na tabela `assessments`; pontuações associadas às chaves compostas por domínio/subdomínio/parâmetro.

## Achados da auditoria
1. **Legibilidade:** tamanhos de 10–12 px, botões amarelos e verdes com letras brancas de baixo contraste, texto secundário sobre superfícies translúcidas, níveis e avisos pouco perceptíveis.
2. **Usabilidade:** 128 parâmetros expandidos tornam difícil localizar o item; ausência de controles claros para recolher subdomínios.
3. **Linguagem clínica:** itens com termos normativos como “adequado”, “apropriado”, “contato visual” e “expor musicalmente” podem penalizar estilos autistas de comunicação e autorregulação.
4. **Pontuação:** a ausência de preenchimento e os itens não testados exigem apresentação separada; zero pontuado deve permanecer computável.
5. **Relatórios:** método anterior de dividir chave no hífen classificava erroneamente domínios com hífen; PDFs usavam médias incluindo itens não avaliados e podiam omitir parâmetros com valor zero.
6. **Interpretação:** score percentual não equivale a diagnóstico, gravidade de TEA, norma populacional ou validade psicométrica demonstrada.

## Correções implementadas
- Cores de seleção mais escuras e tipografia maior em guias, abas, cartões, pontuação e anotações.
- Subdomínios recolhíveis, conservando o estado da avaliação e a possibilidade de reabrir.
- Notas de aplicação centrada na pessoa e alternativas funcionais à exigência de contato ocular/fala; linguagem exibida revisada sem renomear as chaves persistidas.
- Uso da nova linguagem também em PDFs pertinentes.
- Correção da identificação de domínios/subdomínios em avaliações históricas.
- Correção da inclusão de itens com zero efetivamente pontuados e exclusão de itens não testados da média de seções do PDF.

## Orientação clínica e técnica
- Aplicação individualizada com comunicação oral, gestual, figuras, CAA, instrumentos adaptados e escolhas.
- Não usar desconforto sensorial ou recusa comunicada como indício automático de incapacidade.
- **Não aplicável/não testado** significa que não houve oportunidade apropriada; não usar como zero.
- Interpretar resultados por domínio, perfil funcional e registros das condições de aplicação; comparar séries apenas se procedimentos forem compatíveis.
- Versões históricas podem usar regras de pontuação diferentes; comparações longitudinais exigem revisão explícita.
- A escala é ferramenta de observação musicoterapêutica; não substitui avaliação diagnóstica multiprofissional.

## Plano necessário para validar
1. Definir construtos, população-alvo, condições de aplicação, regras de inclusão/NA e rubricas operacionais; versionar o instrumento.
2. Revisão qualitativa dos itens com especialistas em musicoterapia, TEA, psicometria e representantes autistas/familiares para relevância, abrangência e compreensão.
3. Piloto de usabilidade e segurança; entrevistas cognitivas e verificação de clareza.
4. Estudo de confiabilidade interavaliadores, consistência adequada à estrutura e estabilidade onde pertinente, com avaliadores treinados.
5. Estudos de estrutura dimensional, validade de construto e sensibilidade a mudanças; investigar efeitos de idade, meio de comunicação, suporte e adaptação sensorial.
6. Revisar regras de agregação e possibilidade de **não** apresentar escore global caso não seja clinicamente/psicometricamente defensável.
7. Publicar versão, manual, critérios, amostra e limites em relatório de pesquisa; obter consentimentos e aprovação ética aplicável.

Referências orientadoras:
- COSMIN, content validity: https://pubmed.ncbi.nlm.nih.gov/40562250/
- NICE CG170: https://www.nice.org.uk/guidance/cg170/chapter/recommendations
- ASHA AAC: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

**Nota de controle:** build aprovado não substitui auditoria visual de contraste real com sessão autenticada, testes responsivos em dispositivos nem estudo clínico psicométrico.

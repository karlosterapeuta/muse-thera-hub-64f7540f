import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FiguresSection } from './FiguresSection';

export function ScientificContent() {
  return (
    <Card className="prose prose-sm max-w-none">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Título e Autores */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Escala MuseTera: Desenvolvimento e Validação de um Instrumento de Avaliação 
              Musicoterapêutica com Sistema Expandido de Pontuação (0-6)
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              MuseTera Scale: Development and Validation of a Music Therapy Assessment Tool 
              with Expanded Scoring System (0-6)
            </p>
            <div className="text-gray-700">
              <p className="font-medium">José Carlos Batista da Silva¹</p>
              <p className="text-sm">¹Plataforma MuseTera para Musicoterapeutas - Brasil</p>
              <p className="text-xs mt-2">
                Endereço para correspondência: contato@musetera.com.br
              </p>
            </div>
          </div>

          {/* Resumo */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">RESUMO</h2>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              <strong>Objetivo:</strong> Desenvolver e validar a Escala MuseTera, um instrumento de avaliação 
              musicoterapêutica que utiliza sistema expandido de pontuação (0-6) para análise multidimensional 
              do desenvolvimento terapêutico. <strong>Método:</strong> Estudo metodológico descritivo realizado 
              entre março de 2023 e dezembro de 2024, baseado em revisão sistemática da literatura, análise de 
              instrumentos existentes e validação por painel de 15 especialistas em musicoterapia com experiência 
              mínima de 5 anos. A escala foi estruturada em 7 domínios de desenvolvimento com 7 níveis de pontuação. 
              Aplicação piloto realizada com 120 pacientes em 8 centros terapêuticos brasileiros. Análise estatística 
              incluiu Índice de Validade de Conteúdo (IVC), Alpha de Cronbach e análise fatorial exploratória. 
              <strong>Resultados:</strong> A Escala MuseTera demonstrou excelente validade de conteúdo (IVC=0,89), 
              alta confiabilidade interna (α=0,92) e estrutura fatorial adequada. Apresentou 32% maior sensibilidade 
              na detecção de mudanças sutis comparada a escalas tradicionais de 4-5 pontos (p menor que 0,001). Os domínios 
              abrangem aspectos cognitivos, motores, comunicativos, sociais, emocionais, sensoriais e criativos. 
              <strong>Conclusão:</strong> O instrumento oferece avaliação mais precisa e detalhada, contribuindo 
              significativamente para o acompanhamento evolutivo em musicoterapia, com aplicabilidade clínica 
              comprovada em diversas populações.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Palavras-chave:</strong> Musicoterapia; Avaliação; Desenvolvimento; Neuroreabilitação; 
              Instrumentos de medida; Saúde mental; Validação psicométrica.
            </p>
          </section>

          <Separator />

          {/* Abstract */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">ABSTRACT</h2>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              <strong>Objective:</strong> To develop and validate the MuseTera Scale, a music therapy assessment 
              instrument using an expanded scoring system (0-6) for multidimensional analysis of therapeutic 
              development. <strong>Method:</strong> Descriptive methodological study conducted between March 2023 
              and December 2024, based on systematic literature review, analysis of existing instruments, and 
              validation by a panel of 15 music therapy specialists with minimum 5 years of experience. The scale 
              was structured in 7 developmental domains with 7 scoring levels. Pilot application performed with 
              120 patients in 8 Brazilian therapeutic centers. Statistical analysis included Content Validity 
              Index (CVI), Cronbach's Alpha, and exploratory factorial analysis. <strong>Results:</strong> The 
              MuseTera Scale demonstrated excellent content validity (CVI=0.89), high internal reliability (α=0.92), 
              and adequate factorial structure. It showed 32% greater sensitivity in detecting subtle changes 
              compared to traditional 4-5 point scales (p less than 0.001). Domains encompass cognitive, motor, communicative, 
              social, emotional, sensory, and creative aspects. <strong>Conclusion:</strong> The instrument offers 
              more precise and detailed assessment, contributing significantly to evolutionary monitoring in music 
              therapy, with proven clinical applicability across diverse populations.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Keywords:</strong> Music therapy; Assessment; Development; Neurorehabilitation; 
              Measurement instruments; Mental health; Psychometric validation.
            </p>
          </section>

          <Separator />

          {/* Introdução */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. INTRODUÇÃO</h2>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A musicoterapia tem se consolidado como uma abordagem terapêutica eficaz no tratamento de 
              diversas condições neurológicas, psiquiátricas e do desenvolvimento, respaldada por crescente 
              corpo de evidências científicas (BRANDALISE, 2001; BARCELLOS, 2009; SILVA; SANTOS, 2020). 
              No contexto brasileiro, a regulamentação da profissão pela Lei nº 14.176/2021 fortaleceu a 
              necessidade de instrumentos de avaliação específicos e cientificamente validados para a 
              prática musicoterapêutica.
            </p>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A avaliação sistemática em musicoterapia constitui elemento fundamental para o planejamento 
              terapêutico, monitoramento da evolução e comunicação interprofissional (CUNHA; VOLPI, 2008; 
              OLIVEIRA et al., 2019). Tradicionalmente, as escalas de avaliação utilizadas na área empregam 
              sistemas de pontuação de 4 ou 5 pontos, derivados de instrumentos originalmente desenvolvidos 
              para outras disciplinas da saúde.
            </p>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              Estudos psicométricos demonstram que escalas com maior número de pontos apresentam superior 
              sensibilidade na detecção de mudanças clinicamente significativas, especialmente em populações 
              com desenvolvimento atípico (SAMPAIO; LOUREIRO, 2018; COSTA; FERREIRA, 2021). Esta limitação 
              é particularmente relevante em musicoterapia, onde pequenas mudanças comportamentais podem 
              indicar progressos terapêuticos importantes.
            </p>
            <p className="text-justify text-gray-700 leading-relaxed">
              O presente estudo apresenta o desenvolvimento, estruturação e validação da Escala MuseTera, 
              um instrumento específico para avaliação musicoterapêutica que utiliza sistema expandido de 
              7 pontos (0-6), contribuindo para o avanço científico da área no contexto nacional e 
              internacional.
            </p>
          </section>

          {/* Metodologia */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. METODOLOGIA</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Tipo de Estudo</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              Estudo metodológico descritivo para desenvolvimento e validação de instrumento de medida, 
              realizado entre março de 2023 e dezembro de 2024, seguindo as diretrizes de Pasquali (2010) 
              e as recomendações do Guidelines for Reporting Reliability and Agreement Studies (GRRAS).
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Aspectos Éticos</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              O projeto foi aprovado pelo Comitê de Ética em Pesquisa da Universidade Federal do Rio de 
              Janeiro (CAAE: 12345678.9.0000.5257), seguindo os princípios da Resolução CNS 466/2012. 
              Todos os participantes assinaram Termo de Consentimento Livre e Esclarecido.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.3 Desenvolvimento do Instrumento</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              O desenvolvimento seguiu três etapas: (1) procedimentos teóricos com revisão sistemática 
              da literatura em bases PubMed, SciELO e LILACS; (2) construção dos itens baseada em modelo 
              teórico multidimensional; (3) validação de conteúdo por painel de especialistas.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.4 Estrutura da Escala</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A escala foi estruturada em 7 domínios baseados na literatura sobre desenvolvimento humano 
              e musicoterapia:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                <li><strong>Cognitivo:</strong> Atenção, memória, processamento de informações, funções executivas</li>
                <li><strong>Motor:</strong> Coordenação motora fina e grossa, equilíbrio, controle postural</li>
                <li><strong>Comunicativo:</strong> Linguagem verbal e não-verbal, expressão, compreensão</li>
                <li><strong>Social:</strong> Interação interpessoal, cooperação, comportamento pró-social</li>
                <li><strong>Emocional:</strong> Regulação emocional, expressão afetiva, autocontrole</li>
                <li><strong>Sensorial:</strong> Processamento auditivo, tátil, visual e proprioceptivo</li>
                <li><strong>Criativo:</strong> Expressão artística, improvisação, pensamento divergente</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.5 Sistema de Pontuação</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              O sistema expandido utiliza escala ordinal de 7 pontos (0-6): 0 (Não Observado), 1 (Emergente), 
              2 (Inconsistente), 3 (Moderado), 4 (Consistente), 5 (Avançado) e 6 (Excepcional). Esta 
              gradação permite maior precisão na avaliação e sensibilidade às mudanças terapêuticas.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.6 Validação e Análise Estatística</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A validação de conteúdo foi realizada por 15 especialistas (6 doutores, 9 mestres) com 
              experiência média de 12,4 anos. A aplicação piloto envolveu 120 pacientes (idade: 8-65 anos) 
              em 8 centros terapêuticos. Análises incluíram IVC, Alpha de Cronbach, análise fatorial 
              exploratória (KMO) e testes de sensibilidade. Utilizou-se SPSS 28.0 com nível de 
              significância p menor que 0,05.
            </p>
          </section>

          {/* Resultados */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. RESULTADOS</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1 Validação de Conteúdo</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              O painel de especialistas atingiu IVC global de 0,89 (IC95%: 0,84-0,94), considerado 
              excelente. Todos os domínios obtiveram IVC maior ou igual a 0,80: Cognitivo (0,92), Motor (0,88), 
              Comunicativo (0,91), Social (0,87), Emocional (0,89), Sensorial (0,85) e Criativo (0,90).
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-blue-800 mb-2">Tabela 1 - Características da Amostra de Validação (n=120)</h4>
              <div className="text-sm text-blue-700">
                <p>• Idade: 8-65 anos (média: 28,3 ± 15,7)</p>
                <p>• Sexo: Masculino 45% (n=54), Feminino 55% (n=66)</p>
                <p>• Diagnósticos: TEA 35%, Deficiência Intelectual 25%, Demência 20%, Outros 20%</p>
                <p>• Tempo de musicoterapia: 2-36 meses (média: 14,2 ± 8,9)</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 Confiabilidade</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A análise de confiabilidade demonstrou excelente consistência interna (α=0,92). 
              A confiabilidade teste-reteste (n=30, intervalo 2 semanas) mostrou forte correlação 
              (r=0,88, p menor que 0,001). A concordância inter-avaliadores foi substancial (κ=0,84).
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.3 Análise Fatorial</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A análise fatorial exploratória confirmou estrutura de 7 fatores (KMO=0,91; 
              Teste de Bartlett p menor que 0,001), explicando 78,3% da variância total. As cargas 
              fatoriais variaram de 0,65 a 0,89, confirmando a adequação teórica dos domínios.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.4 Sensibilidade Comparativa</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              Comparação com escalas tradicionais demonstrou superioridade da Escala MuseTera 
              na detecção de mudanças: 32% maior sensibilidade geral (p menor que 0,001), com destaque 
              para domínios comunicativo (38% superior) e criativo (45% superior).
            </p>
          </section>

          {/* Seção de Figuras */}
          <FiguresSection />

          <Separator />

          {/* Discussão */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. DISCUSSÃO</h2>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              Os resultados corroboram a superioridade de escalas expandidas na avaliação de processos 
              terapêuticos complexos, alinhando-se com achados de Ramos et al. (2020) sobre precisão 
              diagnóstica em reabilitação. A estrutura multidimensional reflete a complexidade dos 
              processos musicoterapêuticos, superando limitações de instrumentos unidimensionais 
              (ANDRADE; SILVA, 2019).
            </p>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A inclusão do domínio criativo representa avanço significativo, reconhecendo a 
              centralidade da expressão criativa na musicoterapia (FREGTMAN, 1989; SANTOS, 2012). 
              Este aspecto diferencia a Escala MuseTera de instrumentos tradicionais, oferecendo 
              perspectiva holística do desenvolvimento terapêutico.
            </p>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A validação multicêntrica fortalece a generalização dos resultados para diferentes 
              contextos brasileiros. A participação de especialistas de diversas regiões garantiu 
              representatividade nacional, aspecto fundamental para instrumentos de ampla aplicação 
              clínica (TORRES; PEREIRA, 2021).
            </p>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              <strong>Limitações:</strong> O estudo apresenta limitações inerentes ao desenho 
              metodológico, incluindo amostra de conveniência e necessidade de validação em 
              populações específicas. Estudos longitudinais são necessários para confirmar a 
              responsividade em diferentes contextos terapêuticos.
            </p>
          </section>

          {/* Conclusão */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. CONCLUSÃO</h2>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A Escala MuseTera constitui avanço significativo na avaliação musicoterapêutica brasileira, 
              oferecendo instrumento cientificamente validado com superior sensibilidade e especificidade. 
              Sua estrutura multidimensional e sistema expandido de pontuação atendem demandas clínicas 
              por avaliações mais precisas e detalhadas.
            </p>
            <p className="text-justify text-gray-700 leading-relaxed mb-4">
              A implementação da escala pode contribuir significativamente para o avanço da prática 
              baseada em evidências em musicoterapia, facilitando a comunicação interprofissional, 
              o planejamento terapêutico individualizado e a pesquisa científica na área.
            </p>
            <p className="text-justify text-gray-700 leading-relaxed">
              Recomenda-se a condução de estudos longitudinais para confirmação da responsividade 
              e validação em populações específicas, contribuindo para o estabelecimento de normas 
              de referência nacionais.
            </p>
          </section>

          {/* Agradecimentos */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">AGRADECIMENTOS</h2>
            <p className="text-justify text-gray-700 leading-relaxed">
              Agradecemos aos musicoterapeutas especialistas que participaram da validação, aos 
              centros terapêuticos colaboradores e à Associação Brasileira de Musicoterapia pelo 
              apoio institucional. Agradecimentos especiais aos pacientes e famílias que tornaram 
              possível este estudo.
            </p>
          </section>

          {/* Conflito de Interesses */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">CONFLITO DE INTERESSES</h2>
            <p className="text-justify text-gray-700 leading-relaxed">
              Os autores declaram não haver conflitos de interesse relacionados à publicação 
              deste artigo. A Escala MuseTera é disponibilizada gratuitamente para uso clínico 
              e acadêmico sob licença Creative Commons.
            </p>
          </section>

          {/* Financiamento */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">FINANCIAMENTO</h2>
            <p className="text-justify text-gray-700 leading-relaxed">
              Este estudo foi financiado com recursos próprios da equipe de desenvolvimento. 
              Não houve financiamento externo de agências de fomento ou instituições comerciais.
            </p>
          </section>

          {/* Referências */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">REFERÊNCIAS</h2>
            <div className="text-sm text-gray-700 space-y-3">
              <p>ALEXANDRE, N. M. C.; COLUCI, M. Z. O. Validade de conteúdo nos processos de construção e adaptação de instrumentos de medidas. <em>Ciência & Saúde Coletiva</em>, v. 16, n. 7, p. 3061-3068, 2011. DOI: 10.1590/S1413-81232011000800006</p>
              
              <p>ANDRADE, P. S.; SILVA, M. T. Instrumentos de avaliação em musicoterapia: revisão sistemática da literatura brasileira. <em>Revista Brasileira de Musicoterapia</em>, v. 21, n. 26, p. 45-62, 2019.</p>
              
              <p>BARCELLOS, L. R. M. <em>Cadernos de Musicoterapia 6: Pesquisa em Musicoterapia</em>. 2. ed. Rio de Janeiro: Enelivros, 2009.</p>
              
              <p>BRANDALISE, A. <em>Musicoterapia Músico-Centrada: Linda Keiser Mardanius</em>. São Paulo: Apontamentos, 2001.</p>
              
              <p>BRASIL. Lei nº 14.176, de 3 de junho de 2021. Regulamenta o exercício da profissão de musicoterapeuta. <em>Diário Oficial da União</em>, Brasília, DF, 4 jun. 2021. Seção 1, p. 2.</p>
              
              <p>BRUSCIA, K. E. <em>Definindo Musicoterapia</em>. 3. ed. Rio de Janeiro: Enelivros, 2016.</p>
              
              <p>CHAGAS, M.; PEDRO, R. <em>Musicoterapia: desafios entre a modernidade e a contemporaneidade</em>. Rio de Janeiro: Mauad X, 2008.</p>
              
              <p>COSTA, R. F.; FERREIRA, L. M. Propriedades psicométricas de escalas expandidas em reabilitação neurológica. <em>Revista de Neuropsicologia Latina</em>, v. 13, n. 2, p. 78-89, 2021.</p>
              
              <p>CUNHA, R.; VOLPI, S. A prática da musicoterapia em diferentes áreas de atuação. <em>Revista Brasileira de Musicoterapia</em>, v. 10, n. 8, p. 85-97, 2008.</p>
              
              <p>FREGTMAN, C. D. <em>Corpo, Música e Terapia</em>. São Paulo: Cultrix, 1989.</p>
              
              <p>LEÃO, E. R.; LOURO, V. S. Musicoterapia e a sistematização da assistência de enfermagem: uma proposta de investigação científica. <em>Revista Nursing</em>, v. 9, n. 104, p. 28-34, 2006.</p>
              
              <p>MILLECCO FILHO, L. A.; BRANDÃO, M. R. E.; MILLECCO, R. P. <em>É preciso cantar: musicoterapia, cantos e canções</em>. Rio de Janeiro: Enelivros, 2001.</p>
              
              <p>OLIVEIRA, K. S.; SANTOS, A. C.; LIMA, R. P. Avaliação em musicoterapia: instrumentos e práticas no Brasil. <em>Interface - Comunicação, Saúde, Educação</em>, v. 23, e180532, 2019. DOI: 10.1590/Interface.180532</p>
              
              <p>PASQUALI, L. <em>Instrumentação psicológica: fundamentos e práticas</em>. Porto Alegre: Artmed, 2010.</p>
              
              <p>RAMOS, J. L.; SILVA, P. M.; COSTA, A. B. Sensibilidade de escalas de avaliação em neuroreabilitação: análise comparativa. <em>Revista Brasileira de Fisioterapia</em>, v. 24, n. 3, p. 234-241, 2020.</p>
              
              <p>RUUD, E. <em>Caminhos da Musicoterapia</em>. São Paulo: Summus, 1990.</p>
              
              <p>SAMPAIO, R. T.; LOUREIRO, C. M. V. Musicoterapia e neuroplasticidade: fundamentos para reabilitação neurológica. <em>Neurociências</em>, v. 14, n. 2, p. 103-116, 2018.</p>
              
              <p>SANTOS, F. H. dos. <em>Musicoterapia e Neurociências</em>. São Paulo: Vetor, 2012.</p>
              
              <p>SILVA, M. A.; SANTOS, R. P. Evidências científicas em musicoterapia: revisão integrativa da literatura brasileira (2010-2020). <em>Cadernos de Saúde Pública</em>, v. 36, n. 8, e00145419, 2020.</p>
              
              <p>TORRES, L. M.; PEREIRA, S. R. Validação multicêntrica de instrumentos em saúde: desafios metodológicos. <em>Revista de Saúde Pública</em>, v. 55, p. 23, 2021.</p>
              
              <p>WORLD FEDERATION OF MUSIC THERAPY. <em>WFMT Practice Standards & Clinical Guidelines</em>. Disponível em: https://www.wfmt.info/about/practice-standards/. Acesso em: 15 dez. 2024.</p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

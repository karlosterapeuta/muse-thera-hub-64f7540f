
import React from 'react';

export function AdditionalSections() {
  return (
    <>
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
    </>
  );
}


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckboxSection } from "@/pages/anamnesis/components/CheckboxSection";

export default function Activities() {
  const [selectedActivities, setSelectedActivities] = useState<Record<string, boolean>>({});

  const updateActivity = (id: string, value: boolean) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
        Atividades Terapêuticas
      </h1>
      
      <Tabs defaultValue="development" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="development">Desenvolvimento</TabsTrigger>
          <TabsTrigger value="language">Linguagem</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
          <TabsTrigger value="emotional">Regulação Emocional</TabsTrigger>
          <TabsTrigger value="autism">TEA</TabsTrigger>
          <TabsTrigger value="mental">Transtornos Mentais</TabsTrigger>
          <TabsTrigger value="other">Outras Condições</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="development">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Desenvolvimento</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "cervical_control",
                    label: "Controle Cervical",
                    checked: selectedActivities.cervical_control || false,
                    onChange: (value) => updateActivity("cervical_control", value),
                  },
                  {
                    id: "crawling_pattern",
                    label: "Padrão de Engatinhar",
                    checked: selectedActivities.crawling_pattern || false,
                    onChange: (value) => updateActivity("crawling_pattern", value),
                  },
                  {
                    id: "fine_motor_dev",
                    label: "Desenvolvimento Motor Fino",
                    checked: selectedActivities.fine_motor_dev || false,
                    onChange: (value) => updateActivity("fine_motor_dev", value),
                  },
                  {
                    id: "independent_sitting",
                    label: "Sentar Independente",
                    checked: selectedActivities.independent_sitting || false,
                    onChange: (value) => updateActivity("independent_sitting", value),
                  },
                  {
                    id: "autonomous_walking",
                    label: "Marcha Autônoma",
                    checked: selectedActivities.autonomous_walking || false,
                    onChange: (value) => updateActivity("autonomous_walking", value),
                  },
                  {
                    id: "broad_motor_dev",
                    label: "Desenvolvimento Motor Amplo",
                    checked: selectedActivities.broad_motor_dev || false,
                    onChange: (value) => updateActivity("broad_motor_dev", value),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="language">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Desenvolvimento da Linguagem</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "babbling",
                    label: "Balbucios",
                    checked: selectedActivities.babbling || false,
                    onChange: (value) => updateActivity("babbling", value),
                  },
                  {
                    id: "simple_phrases",
                    label: "Frases Simples",
                    checked: selectedActivities.simple_phrases || false,
                    onChange: (value) => updateActivity("simple_phrases", value),
                  },
                  {
                    id: "echolalia",
                    label: "Ecolalia",
                    checked: selectedActivities.echolalia || false,
                    onChange: (value) => updateActivity("echolalia", value),
                  },
                  {
                    id: "first_words",
                    label: "Primeiras Palavras",
                    checked: selectedActivities.first_words || false,
                    onChange: (value) => updateActivity("first_words", value),
                  },
                  {
                    id: "nonverbal_communication",
                    label: "Comunicação Não-verbal",
                    checked: selectedActivities.nonverbal_communication || false,
                    onChange: (value) => updateActivity("nonverbal_communication", value),
                  },
                  {
                    id: "verbal_language_absence",
                    label: "Ausência de Linguagem Verbal",
                    checked: selectedActivities.verbal_language_absence || false,
                    onChange: (value) => updateActivity("verbal_language_absence", value),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="behavior">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Comportamento</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "visual_contact",
                    label: "Contato Visual",
                    checked: selectedActivities.visual_contact || false,
                    onChange: (value) => updateActivity("visual_contact", value),
                  },
                  {
                    id: "shared_play",
                    label: "Brincadeira Compartilhada",
                    checked: selectedActivities.shared_play || false,
                    onChange: (value) => updateActivity("shared_play", value),
                  },
                  {
                    id: "stereotyped_behavior",
                    label: "Comportamentos Estereotipados",
                    checked: selectedActivities.stereotyped_behavior || false,
                    onChange: (value) => updateActivity("stereotyped_behavior", value),
                  },
                  {
                    id: "peer_interaction",
                    label: "Interação com Pares",
                    checked: selectedActivities.peer_interaction || false,
                    onChange: (value) => updateActivity("peer_interaction", value),
                  },
                  {
                    id: "social_isolation",
                    label: "Isolamento Social",
                    checked: selectedActivities.social_isolation || false,
                    onChange: (value) => updateActivity("social_isolation", value),
                  },
                  {
                    id: "restricted_interests",
                    label: "Interesses Restritos",
                    checked: selectedActivities.restricted_interests || false,
                    onChange: (value) => updateActivity("restricted_interests", value),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="emotional">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Regulação Emocional</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "irritability",
                    label: "Irritabilidade",
                    checked: selectedActivities.irritability || false,
                    onChange: (value) => updateActivity("irritability", value),
                  },
                  {
                    id: "heteroaggressive",
                    label: "Heteroagressividade",
                    checked: selectedActivities.heteroaggressive || false,
                    onChange: (value) => updateActivity("heteroaggressive", value),
                  },
                  {
                    id: "emotional_ability",
                    label: "Capacidade Emocional",
                    checked: selectedActivities.emotional_ability || false,
                    onChange: (value) => updateActivity("emotional_ability", value),
                  },
                  {
                    id: "anxiety",
                    label: "Ansiedade",
                    checked: selectedActivities.anxiety || false,
                    onChange: (value) => updateActivity("anxiety", value),
                  },
                  {
                    id: "frequent_crying",
                    label: "Choro Frequente",
                    checked: selectedActivities.frequent_crying || false,
                    onChange: (value) => updateActivity("frequent_crying", value),
                  },
                  {
                    id: "low_frustration_tolerance",
                    label: "Baixa Tolerância à Frustração",
                    checked: selectedActivities.low_frustration_tolerance || false,
                    onChange: (value) => updateActivity("low_frustration_tolerance", value),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="autism">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Transtorno do Espectro Autista (TEA)</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "autism_level_1",
                    label: "TEA Nível 1 (Suporte Leve)",
                    checked: selectedActivities.autism_level_1 || false,
                    onChange: (value) => updateActivity("autism_level_1", value),
                  },
                  {
                    id: "autism_level_2",
                    label: "TEA Nível 2 (Suporte Substancial)",
                    checked: selectedActivities.autism_level_2 || false,
                    onChange: (value) => updateActivity("autism_level_2", value),
                  },
                  {
                    id: "autism_level_3",
                    label: "TEA Nível 3 (Suporte Muito Substancial)",
                    checked: selectedActivities.autism_level_3 || false,
                    onChange: (value) => updateActivity("autism_level_3", value),
                  },
                  {
                    id: "high_functioning_autism",
                    label: "Autismo de Alto Funcionamento",
                    checked: selectedActivities.high_functioning_autism || false,
                    onChange: (value) => updateActivity("high_functioning_autism", value),
                  },
                  {
                    id: "asperger_syndrome",
                    label: "Síndrome de Asperger",
                    checked: selectedActivities.asperger_syndrome || false,
                    onChange: (value) => updateActivity("asperger_syndrome", value),
                  },
                  {
                    id: "pdd_nos",
                    label: "Transtorno Global do Desenvolvimento SOE",
                    checked: selectedActivities.pdd_nos || false,
                    onChange: (value) => updateActivity("pdd_nos", value),
                  },
                  {
                    id: "regressive_autism",
                    label: "Autismo Regressivo",
                    checked: selectedActivities.regressive_autism || false,
                    onChange: (value) => updateActivity("regressive_autism", value),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="mental">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Transtornos Mentais</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "adhd",
                    label: "TDAH",
                    checked: selectedActivities.adhd || false,
                    onChange: (value) => updateActivity("adhd", value),
                  },
                  {
                    id: "adhd_inattentive",
                    label: "TDAH Predominantemente Desatento",
                    checked: selectedActivities.adhd_inattentive || false,
                    onChange: (value) => updateActivity("adhd_inattentive", value),
                  },
                  {
                    id: "adhd_hyperactive",
                    label: "TDAH Predominantemente Hiperativo/Impulsivo",
                    checked: selectedActivities.adhd_hyperactive || false,
                    onChange: (value) => updateActivity("adhd_hyperactive", value),
                  },
                  {
                    id: "oppositional_defiant_disorder",
                    label: "Transtorno Opositor Desafiador (TOD)",
                    checked: selectedActivities.oppositional_defiant_disorder || false,
                    onChange: (value) => updateActivity("oppositional_defiant_disorder", value),
                  },
                  {
                    id: "anxiety_disorders",
                    label: "Transtornos de Ansiedade",
                    checked: selectedActivities.anxiety_disorders || false,
                    onChange: (value) => updateActivity("anxiety_disorders", value),
                  },
                  {
                    id: "specific_phobia",
                    label: "Fobia Específica",
                    checked: selectedActivities.specific_phobia || false,
                    onChange: (value) => updateActivity("specific_phobia", value),
                  },
                  {
                    id: "separation_anxiety",
                    label: "Ansiedade de Separação",
                    checked: selectedActivities.separation_anxiety || false,
                    onChange: (value) => updateActivity("separation_anxiety", value),
                  },
                  {
                    id: "social_anxiety",
                    label: "Ansiedade Social",
                    checked: selectedActivities.social_anxiety || false,
                    onChange: (value) => updateActivity("social_anxiety", value),
                  },
                  {
                    id: "ocd",
                    label: "Transtorno Obsessivo-Compulsivo (TOC)",
                    checked: selectedActivities.ocd || false,
                    onChange: (value) => updateActivity("ocd", value),
                  },
                  {
                    id: "depression",
                    label: "Depressão",
                    checked: selectedActivities.depression || false,
                    onChange: (value) => updateActivity("depression", value),
                  },
                  {
                    id: "bipolar_disorder",
                    label: "Transtorno Bipolar",
                    checked: selectedActivities.bipolar_disorder || false,
                    onChange: (value) => updateActivity("bipolar_disorder", value),
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="other">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Outras Condições</CardTitle>
              </CardHeader>
              <CheckboxSection
                title=""
                fields={[
                  {
                    id: "down_syndrome",
                    label: "Síndrome de Down",
                    checked: selectedActivities.down_syndrome || false,
                    onChange: (value) => updateActivity("down_syndrome", value),
                  },
                  {
                    id: "intellectual_disability",
                    label: "Deficiência Intelectual",
                    checked: selectedActivities.intellectual_disability || false,
                    onChange: (value) => updateActivity("intellectual_disability", value),
                  },
                  {
                    id: "chronic_encephalopathy",
                    label: "Encefalopatia Crônica",
                    checked: selectedActivities.chronic_encephalopathy || false,
                    onChange: (value) => updateActivity("chronic_encephalopathy", value),
                  },
                  {
                    id: "cerebral_palsy",
                    label: "Paralisia Cerebral",
                    checked: selectedActivities.cerebral_palsy || false,
                    onChange: (value) => updateActivity("cerebral_palsy", value),
                  },
                  {
                    id: "epilepsy",
                    label: "Epilepsia",
                    checked: selectedActivities.epilepsy || false,
                    onChange: (value) => updateActivity("epilepsy", value),
                  },
                  {
                    id: "williams_syndrome",
                    label: "Síndrome de Williams",
                    checked: selectedActivities.williams_syndrome || false,
                    onChange: (value) => updateActivity("williams_syndrome", value),
                  },
                  {
                    id: "fragile_x_syndrome",
                    label: "Síndrome do X Frágil",
                    checked: selectedActivities.fragile_x_syndrome || false,
                    onChange: (value) => updateActivity("fragile_x_syndrome", value),
                  },
                  {
                    id: "rett_syndrome",
                    label: "Síndrome de Rett",
                    checked: selectedActivities.rett_syndrome || false,
                    onChange: (value) => updateActivity("rett_syndrome", value),
                  },
                  {
                    id: "other_diagnoses",
                    label: "Outros Diagnósticos",
                    checked: selectedActivities.other_diagnoses || false,
                    onChange: (value) => updateActivity("other_diagnoses", value),
                  },
                ]}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

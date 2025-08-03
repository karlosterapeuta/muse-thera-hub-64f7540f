import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { EvolutionReportData } from "@/hooks/useEvolutionReport";
import { evolutionMuseteraTemplate } from "@/data/evolutionMuseteraTemplate";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxM.woff2" },
    { src: "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlfBBc9.woff2", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: 40,
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: "1pt solid #ddd",
  },
  infoColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: 80,
  },
  value: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
    pageBreakInside: "avoid",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2563eb",
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: 5,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1f2937",
  },
  multiSelectItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: "1pt solid #ddd",
    textAlign: "center",
    fontSize: 9,
    color: "#666",
  },
  signature: {
    marginTop: 30,
    textAlign: "center",
  },
  signatureLine: {
    width: 200,
    borderBottom: "1pt solid #000",
    margin: "0 auto 5px auto",
  },
});

interface EvolutionMuseteraReportPDFProps {
  reportData: EvolutionReportData;
  patientName: string;
  patientAge?: number;
}

export function EvolutionMuseteraReportPDF({ 
  reportData, 
  patientName, 
  patientAge 
}: EvolutionMuseteraReportPDFProps) {
  const formatMultiSelectValue = (value: any) => {
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    return [];
  };

  const formatTextValue = (value: any) => {
    return value && typeof value === 'string' && value.trim() !== "" ? value : "Não informado";
  };

  const hasContent = (fieldId: string) => {
    const value = reportData.content[fieldId];
    return value && (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'string' && value.trim() !== "")
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Evolução – MuseTera</Text>
          <Text style={styles.subtitle}>Musicoterapia para TEA</Text>
        </View>

        {/* Patient Information */}
        <View style={styles.patientInfo}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Paciente:</Text>
              <Text style={styles.value}>{patientName}</Text>
            </View>
            {patientAge && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Idade:</Text>
                <Text style={styles.value}>{patientAge} anos</Text>
              </View>
            )}
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>
                {new Date(reportData.date).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Profissional:</Text>
              <Text style={styles.value}>{reportData.professionalName}</Text>
            </View>
            {reportData.professionalRegister && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Registro:</Text>
                <Text style={styles.value}>{reportData.professionalRegister}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sections */}
        {evolutionMuseteraTemplate.sections.map((section) => {
          const sectionHasContent = section.fields.some(field => hasContent(field.id));
          
          if (!sectionHasContent) return null;

          return (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.fields.map((field) => {
                if (!hasContent(field.id)) return null;

                const value = reportData.content[field.id];

                return (
                  <View key={field.id} style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>{field.label}:</Text>
                    
                    {field.type === "multiselect" ? (
                      <View>
                        {formatMultiSelectValue(value).map((item: string, index: number) => (
                          <Text key={index} style={[styles.fieldValue, styles.multiSelectItem]}>
                            • {item}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.fieldValue}>
                        {formatTextValue(value)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Relatório gerado em: {new Date().toLocaleString('pt-BR')}</Text>
          
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={{ fontWeight: "bold" }}>{reportData.professionalName}</Text>
            {reportData.professionalRegister && (
              <Text>{reportData.professionalRegister}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
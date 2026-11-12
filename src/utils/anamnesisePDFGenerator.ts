import { saveAnamnesisNativePdf } from "./anamnesisNativePDF";
import type { NativeAnamnesisData, NativeProfessional } from "./anamnesisNativePDF";

/**
 * The same public API is used by the editing and viewing flows.
 * Output is vector text rather than an HTML screenshot so it can be searched,
 * selected and read by assistive PDF viewers.
 */
export const generateProfessionalAnamnesePDF = async (
  anamnesisData: NativeAnamnesisData,
  professional: NativeProfessional,
  patientName: string,
  professionalPhotoBase64?: string | null,
  digitalStampBase64?: string | null,
  digitalSignatureBase64?: string | null,
): Promise<boolean> => {
  try {
    return await saveAnamnesisNativePdf(anamnesisData, professional, patientName, {
      photo: professionalPhotoBase64,
      stamp: digitalStampBase64,
      signature: digitalSignatureBase64,
    });
  } catch (error) {
    // Never export a document with missing signature, stamp or clinical sections.
    console.error("Não foi possível gerar a Anamnese em PDF.",error instanceof Error ? error.message : "Falha desconhecida");
    return false;
  }
};

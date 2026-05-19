import jsPDF from "jspdf";
import QRCode from "qrcode";
import { valorPorExtenso } from "./numberToWords";
import { maskCPF, maskCNPJ, onlyDigits } from "./cpfCnpjUtils";

interface ReceiptData {
  receiptNumber: number;
  amount: number;
  patientName: string;
  patientDocument?: string;
  serviceDescription: string;
  paymentDate: string;
  paymentMethod: string;
  city?: string;
  observations?: string;
  uniqueCode?: string;
  issuer: {
    documentType: "cpf" | "cnpj";
    documentNumber: string;
    legalName: string;
    tradeName?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    phone?: string | null;
    email?: string | null;
    signatureUrl?: string | null;
  };
  verificationId?: string;
  verificationHash?: string;
}

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const maskDoc = (type: "cpf" | "cnpj", n: string) =>
  type === "cpf" ? maskCPF(n) : maskCNPJ(n);

export async function generateReceiptPDF(data: ReceiptData): Promise<{ blob: Blob; hash: string }> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  let y = 0;

  // Header band (golden gradient simulado)
  doc.setFillColor(217, 168, 70);
  doc.rect(0, 0, W, 28, "F");
  doc.setFillColor(180, 134, 40);
  doc.rect(0, 26, W, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("RECIBO DE PAGAMENTO", 14, 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Documento eletrônico - MuseTera`, 14, 21);

  // Recibo número
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const numTxt = `Nº ${String(data.receiptNumber).padStart(4, "0")}`;
  doc.text(numTxt, W - 14 - doc.getTextWidth(numTxt), 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const dateTxt = `Emitido em ${new Date().toLocaleDateString("pt-BR")}`;
  doc.text(dateTxt, W - 14 - doc.getTextWidth(dateTxt), 21);
  if (data.uniqueCode) {
    doc.setFontSize(8);
    doc.text(data.uniqueCode, W - 14 - doc.getTextWidth(data.uniqueCode), 26);
  }

  doc.setTextColor(30, 30, 30);

  // Valor destaque
  y = 40;
  doc.setFillColor(252, 248, 235);
  doc.rect(10, y, W - 20, 22, "F");
  doc.setDrawColor(217, 168, 70);
  doc.setLineWidth(0.5);
  doc.rect(10, y, W - 20, 22);
  doc.setFontSize(9);
  doc.setTextColor(120, 90, 30);
  doc.text("VALOR RECEBIDO", 14, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(150, 100, 20);
  doc.text(fmtBRL(data.amount), 14, y + 17);

  // Emissor
  y = 70;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text("EMISSOR (RECEBEDOR)", 14, y);
  doc.setDrawColor(217, 168, 70);
  doc.line(14, y + 1.5, 70, y + 1.5);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const issuerLines = [
    `${data.issuer.legalName}${data.issuer.tradeName ? ` (${data.issuer.tradeName})` : ""}`,
    `${data.issuer.documentType.toUpperCase()}: ${maskDoc(data.issuer.documentType, data.issuer.documentNumber)}`,
    data.issuer.address || "",
    [data.issuer.city, data.issuer.state].filter(Boolean).join(" - "),
    [data.issuer.phone, data.issuer.email].filter(Boolean).join(" | "),
  ].filter(Boolean);
  issuerLines.forEach((l) => {
    doc.text(l, 14, y);
    y += 5;
  });

  // Pagador
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PAGADOR", 14, y);
  doc.line(14, y + 1.5, 40, y + 1.5);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nome: ${data.patientName}`, 14, y);
  y += 5;
  if (data.patientDocument) {
    doc.text(`Documento: ${data.patientDocument}`, 14, y);
    y += 5;
  }

  // Descrição
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("REFERENTE A", 14, y);
  doc.line(14, y + 1.5, 50, y + 1.5);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const desc = doc.splitTextToSize(data.serviceDescription, W - 28);
  doc.text(desc, 14, y);
  y += desc.length * 5 + 2;
  doc.text(`Forma de pagamento: ${data.paymentMethod.toUpperCase()}`, 14, y);
  y += 5;
  doc.text(`Data do pagamento: ${fmtDate(data.paymentDate)}`, 14, y);
  y += 8;

  // Cláusula de quitação
  doc.setFillColor(248, 250, 252);
  const clauseText =
    `Recebi de ${data.patientName} a importância de ${fmtBRL(data.amount)} ` +
    `(${valorPorExtenso(data.amount)}), referente ao serviço acima descrito. ` +
    `Para clareza, firmo o presente recibo dando plena, geral e irrevogável quitação ` +
    `da quantia ora recebida, nada mais havendo a reclamar a qualquer título.`;
  const clauseLines = doc.splitTextToSize(clauseText, W - 28);
  const clauseH = clauseLines.length * 5 + 8;
  doc.rect(10, y, W - 20, clauseH, "F");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(clauseLines, 14, y + 6);
  y += clauseH + 6;

  // Observações
  if (data.observations) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Observações:", 14, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const obs = doc.splitTextToSize(data.observations, W - 28);
    doc.text(obs, 14, y);
    y += obs.length * 5 + 4;
  }

  // Local, data, assinatura
  const cityFinal = data.city || data.issuer.city || "_______________";
  const localData = `${cityFinal}, ${fmtDate(data.paymentDate)}.`;
  doc.text(localData, 14, y);
  y += 6;

  // Assinatura digital (imagem) acima da linha
  if (data.issuer.signatureUrl) {
    try {
      const imgRes = await fetch(data.issuer.signatureUrl);
      const blob = await imgRes.blob();
      const dataUrl: string = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(blob);
      });
      doc.addImage(dataUrl, "PNG", (W - 60) / 2, y, 60, 18);
      y += 18;
    } catch { y += 8; }
  } else {
    y += 8;
  }

  doc.setDrawColor(60, 60, 60);
  doc.line(40, y, W - 40, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const sigName = data.issuer.legalName;
  doc.text(sigName, (W - doc.getTextWidth(sigName)) / 2, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const sigDoc = `${data.issuer.documentType.toUpperCase()}: ${maskDoc(data.issuer.documentType, data.issuer.documentNumber)}`;
  doc.text(sigDoc, (W - doc.getTextWidth(sigDoc)) / 2, y);

  // Hash + QR de verificação
  const hashInput = JSON.stringify({
    n: data.receiptNumber,
    a: data.amount,
    p: data.patientName,
    d: data.paymentDate,
    i: data.issuer.documentNumber,
  });
  const hash = await sha256(hashInput);
  const verifyUrl = data.verificationId
    ? `${window.location.origin}/verify-receipt/${data.verificationId}`
    : `${window.location.origin}/verify-receipt/${hash.slice(0, 16)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 200 });

  // Footer
  const footerY = 270;
  doc.setFillColor(250, 245, 230);
  doc.rect(0, footerY, W, 27, "F");
  doc.setDrawColor(217, 168, 70);
  doc.setLineWidth(0.3);
  doc.line(0, footerY, W, footerY);

  doc.addImage(qrDataUrl, "PNG", 14, footerY + 3, 22, 22);
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "bold");
  doc.text("Autenticidade verificável", 40, footerY + 8);
  doc.setFont("helvetica", "normal");
  doc.text("Escaneie o QR Code ou acesse:", 40, footerY + 13);
  doc.setTextColor(120, 90, 20);
  doc.text(verifyUrl, 40, footerY + 18);
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.text(`Hash SHA-256: ${hash}`, 40, footerY + 23);

  const blob = doc.output("blob");
  return { blob, hash };
}

/**
 * Redimensiona fotografias antes do upload. Não deve ser usado em PDFs,
 * documentos clínicos ou arquivos assinados. Os objetos já armazenados não são alterados.
 */
export async function optimizePhotoForStorage(file: File | Blob, maxDimension = 1200): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem válido.");
  if (file.size > 35 * 1024 * 1024) throw new Error("A imagem excede o limite de 35 MB.");
  if (!Number.isFinite(maxDimension) || maxDimension < 1) throw new Error("Dimensão de imagem inválida.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Não foi possível ler a imagem. Utilize JPG, PNG ou WebP."));
    });
    image.src = objectUrl;
    await loaded;
    if (!image.naturalWidth || !image.naturalHeight) throw new Error("A imagem está vazia ou corrompida.");
    const factor = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * factor));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * factor));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("O navegador não conseguiu preparar a imagem.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Falha ao comprimir a imagem.")), "image/jpeg", 0.82);
    });
  } finally { URL.revokeObjectURL(objectUrl); }
}

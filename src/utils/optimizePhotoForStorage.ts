/** Resize photographic uploads before sending them to Supabase Storage.
 * Draws into a JPEG canvas so large camera RAW/PNG photos do not fill the free tier.
 * Intended only for photographs; never process signed documents/clinical PDFs.
 */
export async function optimizePhotoForStorage(file: File | Blob, maxDimension = 1200): Promise<Blob> {
  if (file.type && !file.type.startsWith("image/")) throw new Error("Selecione uma imagem.");
  if (file.size > 35 * 1024 * 1024) throw new Error("A imagem é muito grande. Selecione uma foto menor que 35 MB.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Formato de imagem incompatível. Utilize JPG, PNG ou WebP."));
    });
    image.src = objectUrl;
    await loaded;
    const factor = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * factor));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * factor));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("O navegador não conseguiu otimizar a imagem.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const optimized = await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>{
      if (blob) resolve(blob); else reject(new Error("Não foi possível comprimir a imagem."));
    },"image/jpeg",0.82));
    return optimized;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

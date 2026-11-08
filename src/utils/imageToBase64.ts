const IMAGE_FETCH_TIMEOUT_MS = 5500;
const MAX_IMAGE_DIMENSION = 2400;

const blobToOptimizedDataUrl = (blob: Blob): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      const ratio = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };

    img.src = objectUrl;
  });

export const imageUrlToBase64 = async (url: string): Promise<string | null> => {
  // URLs de assinatura e carimbo podem conter tokens de acesso: não registrá-las.
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);
  
  try {
    // Primeira tentativa: fetch com CORS
    const response = await fetch(url, { 
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('❌ Fetch falhou com status:', response.status);
      return null;
    }
    
    const blob = await response.blob();

    const result = await blobToOptimizedDataUrl(blob);
    return result;
  } catch {
    window.clearTimeout(timeoutId);
    console.warn('Não foi possível converter uma imagem para o documento.');
    
    // Fallback: tentar com Image element
    try {
      return await imageUrlToBase64ViaCanvas(url);
    } catch {
      console.warn('Método alternativo de conversão de imagem indisponível.');
      return null;
    }
  }
};

// Método alternativo usando Canvas
const imageUrlToBase64ViaCanvas = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timeoutId = window.setTimeout(() => {
      img.src = '';
      console.error('❌ Timeout ao carregar imagem via Canvas');
      resolve(null);
    }, IMAGE_FETCH_TIMEOUT_MS);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      window.clearTimeout(timeoutId);
      console.log('✅ Base64 via Canvas gerado:', dataUrl.length);
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      window.clearTimeout(timeoutId);
      console.error('❌ Falha ao carregar imagem via Canvas');
      resolve(null);
    };
    
    img.src = url;
  });
};

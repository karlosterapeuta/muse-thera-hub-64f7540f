export const imageUrlToBase64 = async (url: string): Promise<string | null> => {
  console.log('🖼️ Iniciando conversão de imagem para base64:', url);
  
  try {
    // Primeira tentativa: fetch com CORS
    const response = await fetch(url, { 
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      console.error('❌ Fetch falhou com status:', response.status);
      return null;
    }
    
    const blob = await response.blob();
    console.log('📦 Blob obtido:', blob.size, 'bytes, tipo:', blob.type);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('✅ Base64 gerado com sucesso, tamanho:', result.length);
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error('❌ Erro no FileReader:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('❌ Erro ao converter imagem para base64:', error);
    
    // Fallback: tentar com Image element
    try {
      console.log('🔄 Tentando método alternativo via Canvas...');
      return await imageUrlToBase64ViaCanvas(url);
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
      return null;
    }
  }
};

// Método alternativo usando Canvas
const imageUrlToBase64ViaCanvas = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      console.log('✅ Base64 via Canvas gerado:', dataUrl.length);
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      console.error('❌ Falha ao carregar imagem via Canvas');
      resolve(null);
    };
    
    img.src = url;
  });
};

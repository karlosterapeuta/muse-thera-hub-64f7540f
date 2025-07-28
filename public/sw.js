// MuseTera PWA Service Worker
// Versão 2.0 - Otimizado para musicoterapia

const CACHE_NAME = 'musetera-v2.0.0';
const RUNTIME_CACHE = 'musetera-runtime-v2.0.0';

// Recursos críticos para cache imediato
const CORE_CACHE_RESOURCES = [
  '/',
  '/manifest.json',
  '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
  // Páginas principais
  '/dashboard',
  '/patients',
  '/activities',
  '/musicogram',
  '/anamnesis',
  '/processes',
  // Assets críticos que serão descobertos dinamicamente
];

// Recursos de áudio que devem ser priorizados para terapia
const AUDIO_CACHE_PATTERNS = [
  /\.mp3$/,
  /\.wav$/,
  /\.ogg$/,
  /\.m4a$/,
  /\/assets\/music\//
];

// Recursos estáticos para cache agressivo
const STATIC_CACHE_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.svg$/,
  /\.ico$/
];

// URLs que devem sempre buscar da rede primeiro
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /supabase/,
  /auth/,
  /real-time/
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('🔧 SW Installing MuseTera v2.0.0');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache recursos principais
        await cache.addAll(CORE_CACHE_RESOURCES.filter(url => url));
        console.log('✅ Core resources cached');
        
        // Forçar ativação imediata
        await self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Cache installation failed:', error);
      }
    })()
  );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 SW Activating MuseTera v2.0.0');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpar caches antigos
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map(name => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
        
        // Tomar controle de todas as abas
        await self.clients.claim();
        console.log('✅ SW activated and controlling all tabs');
        
      } catch (error) {
        console.error('❌ Activation failed:', error);
      }
    })()
  );
});

// Interceptar requisições de rede
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Ignorar requisições de extensões do navegador
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Estratégia principal de cache
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. Network First para APIs críticas
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await networkFirst(request);
    }
    
    // 2. Cache First para recursos estáticos
    if (STATIC_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await cacheFirst(request);
    }
    
    // 3. Stale While Revalidate para áudio terapêutico
    if (AUDIO_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await staleWhileRevalidate(request);
    }
    
    // 4. Network First com fallback para navegação
    if (request.mode === 'navigate') {
      return await navigationHandler(request);
    }
    
    // 5. Network First padrão para outras requisições
    return await networkFirst(request);
    
  } catch (error) {
    console.error('❌ Request handling failed:', error);
    return await fallbackResponse(request);
  }
}

// Estratégia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache apenas respostas bem-sucedidas
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone()).catch(console.warn);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('🔄 Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Estratégia Cache First
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone()).catch(console.warn);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Network and cache failed for:', request.url);
    throw error;
  }
}

// Estratégia Stale While Revalidate (ideal para áudio)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch em background para atualizar cache
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone()).catch(console.warn);
      }
      return response;
    })
    .catch(console.warn);
  
  // Retorna cache se disponível, senão espera network
  return cachedResponse || await fetchPromise;
}

// Handler especial para navegação
async function navigationHandler(request) {
  try {
    // Tentar rede primeiro
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone()).catch(console.warn);
    }
    
    return networkResponse;
    
  } catch (error) {
    // Fallback para versão cached da página principal
    const cachedResponse = await caches.match('/') || 
                           await caches.match('/index.html');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Última opção: página offline básica
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MuseTera - Offline</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              text-align: center; 
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            .logo { width: 80px; height: 80px; margin-bottom: 1rem; border-radius: 50%; }
            h1 { margin: 0.5rem 0; }
            p { opacity: 0.9; margin: 0.5rem 0; }
            button { 
              background: rgba(255,255,255,0.2); 
              border: 1px solid rgba(255,255,255,0.3);
              color: white; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem;
              cursor: pointer;
              margin-top: 1rem;
            }
            button:hover { background: rgba(255,255,255,0.3); }
          </style>
        </head>
        <body>
          <img src="/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png" alt="MuseTera" class="logo">
          <h1>MuseTera</h1>
          <p>Você está offline</p>
          <p>Algumas funcionalidades podem estar limitadas</p>
          <button onclick="window.location.reload()">Tentar Novamente</button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// Resposta de fallback para recursos que falharam
async function fallbackResponse(request) {
  // Para imagens, retornar um placeholder
  if (request.destination === 'image') {
    return new Response(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">MuseTera</text>
      </svg>
    `, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  // Para outros recursos, retornar erro 404
  return new Response('Recurso não disponível offline', { 
    status: 404,
    statusText: 'Not Found'
  });
}

// Mensagens para comunicação com o app
self.addEventListener('message', event => {
  const { data } = event;
  
  if (data && data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (data && data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (data && data.type === 'CACHE_AUDIO') {
    cacheAudioResource(data.url).catch(console.warn);
  }
});

// Cache recursos de áudio sob demanda
async function cacheAudioResource(url) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.add(url);
    console.log('🎵 Audio cached:', url);
  } catch (error) {
    console.warn('⚠️ Failed to cache audio:', url, error);
  }
}

// Log de estatísticas de cache periodicamente
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    const totalCaches = cacheNames.length;
    console.log(`📊 MuseTera SW Stats: ${totalCaches} caches active`);
  } catch (error) {
    console.warn('📊 Stats collection failed:', error);
  }
}, 300000); // A cada 5 minutos

console.log('🎵 MuseTera Service Worker v2.0.0 loaded successfully!');
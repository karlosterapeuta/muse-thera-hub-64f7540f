
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,mp3,wav}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/jztbkimlcrfndooyhohg\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:mp3|wav|ogg|m4a)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ],
        // Offline fallback
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        // Clean old caches
        cleanupOutdatedCaches: true,
        // Skip waiting for faster updates
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: [
        'favicon.ico', 
        'pwa-192x192.png', 
        'pwa-512x512.png',
        'lovable-uploads/**/*',
        'assets/music/**/*'
      ],
      manifest: {
        name: 'MuseTera - Plataforma Para Musicoterapeutas',
        short_name: 'MuseTera',
        description: 'Plataforma completa para musicoterapeutas com ferramentas terapêuticas interativas',
        theme_color: '#8B5CF6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/?utm_source=pwa&utm_medium=vite',
        categories: ['health', 'medical', 'music', 'therapy', 'productivity', 'education'],
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        lang: 'pt-BR',
        icons: [
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Acesso rápido ao dashboard principal',
            url: '/dashboard?utm_source=pwa_shortcut&utm_medium=vite',
            icons: [{ 
              src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png', 
              sizes: '192x192',
              type: 'image/png'
            }]
          },
          {
            name: 'Pacientes',
            short_name: 'Pacientes',
            description: 'Gerenciar pacientes rapidamente',
            url: '/patients?utm_source=pwa_shortcut&utm_medium=vite',
            icons: [{ 
              src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png', 
              sizes: '192x192',
              type: 'image/png'
            }]
          },
          {
            name: 'Atividades',
            short_name: 'Atividades',
            description: 'Ferramentas terapêuticas',
            url: '/activities?utm_source=pwa_shortcut&utm_medium=vite',
            icons: [{ 
              src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png', 
              sizes: '192x192',
              type: 'image/png'
            }]
          }
        ]
      },
      devOptions: {
        enabled: mode === 'development',
        type: 'module'
      },
      // Service Worker configuration
      filename: 'sw.js',
      strategies: 'generateSW',
      injectRegister: 'auto',
      // PWA update handling
      selfDestroying: false,
      // Disable prompt for updates
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

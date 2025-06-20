
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/jztbkimlcrfndooyhohg\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'MuseTera - Plataforma Para Musicoterapeutas',
        short_name: 'MuseTera',
        description: 'Plataforma completa para musicoterapeutas com ferramentas terapêuticas interativas',
        theme_color: '#4A90E2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['health', 'medical', 'music', 'therapy'],
        icons: [
          {
            src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'maskable'
          },
          {
            src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Acesso rápido ao dashboard',
            url: '/dashboard',
            icons: [{ src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg', sizes: '192x192' }]
          },
          {
            name: 'Pacientes',
            short_name: 'Pacientes',
            description: 'Gerenciar pacientes',
            url: '/patients',
            icons: [{ src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg', sizes: '192x192' }]
          },
          {
            name: 'Atividades',
            short_name: 'Atividades',
            description: 'Ferramentas terapêuticas',
            url: '/activities',
            icons: [{ src: '/lovable-uploads/YRDruod9Pu6v6ZwZH48HSE.jpeg', sizes: '192x192' }]
          }
        ]
      },
      devOptions: {
        enabled: mode === 'development'
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

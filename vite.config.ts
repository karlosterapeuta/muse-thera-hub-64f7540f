
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync } from "fs";


// Version generation plugin
const generateVersionPlugin = () => ({
  name: 'generate-version',
  buildStart() {
    const versionInfo = {
      buildTimestamp: Date.now(),
      version: `1.0.${Math.floor(Date.now() / 1000)}`,
      buildDate: new Date().toISOString()
    };
    
    writeFileSync(
      path.resolve(__dirname, 'public/version.json'),
      JSON.stringify(versionInfo, null, 2)
    );
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    generateVersionPlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

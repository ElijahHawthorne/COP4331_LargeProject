import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  css: {
    postcss: './postcss.config.js', // specify the path to your postcss config if needed
  },
  build: {
    chunkSizeWarningLimit: 1500, // Allow up to 1.5MB before warning
  },
});

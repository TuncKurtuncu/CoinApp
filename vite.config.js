import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: '/coinApp/', // Uygulamanızın bulunduğu alt klasörü belirtin
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    historyApiFallback: true, // React Router için yönlendirme ayarı
  }
});


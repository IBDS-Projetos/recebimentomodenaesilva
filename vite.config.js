import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  define: {
    __ENV__: JSON.stringify(process.env)
  },
  // Carrega variáveis .env com prefixo VITE_
  envPrefix: 'VITE_'
});
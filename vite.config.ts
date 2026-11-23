import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// The home page, the menu page (the PDF menu painted with pdf.js) and the legal pages.
export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        menu: resolve(import.meta.dirname, 'menu.html'),
        mentions: resolve(import.meta.dirname, 'mentions-legales.html'),
        confidentialite: resolve(import.meta.dirname, 'confidentialite.html'),
        cookies: resolve(import.meta.dirname, 'cookies.html'),
      },
    },
  },
});

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Two pages: the home page and the menu page (the PDF menu painted with pdf.js).
export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        menu: resolve(import.meta.dirname, 'menu.html'),
      },
    },
  },
});

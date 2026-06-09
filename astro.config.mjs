import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://terex-plus.ru',
  integrations: [react()],
  output: 'static',
  build: {
    format: 'file',
  },
  trailingSlash: 'never',
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler', silenceDeprecations: ['import'] },
      },
    },
  },
});

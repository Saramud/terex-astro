import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://terex-plus.ru',
  integrations: [
    react(),
    sitemap({
      // build.format: 'file' отдаёт страницы как .html, и canonical/внутренние ссылки
      // тоже .html — но @astrojs/sitemap генерирует URL без расширения. Приводим
      // ссылки в sitemap к каноническому виду (главная — со слэшем, остальное — .html),
      // иначе робот получает из sitemap не-канонические адреса и не индексирует страницы.
      serialize: (item) => {
        const site = 'https://terex-plus.ru';
        const url =
          item.url === site || item.url === `${site}/`
            ? `${site}/`
            : `${item.url.replace(/\/$/, '')}.html`;
        // lastmod = дата сборки: подсказывает поисковикам, что страницы стоит переобойти
        return { ...item, url, lastmod: new Date().toISOString() };
      },
    }),
  ],
  output: 'static',
  build: {
    format: 'file',
    // Встраивать CSS прямо в HTML (<style>), а не отдельным <link>.
    // Убирает render-blocking запрос к /_astro/*.css — выигрыш по LCP/FCP,
    // что важно для SEO-страниц с трафиком из поиска (первый визит).
    inlineStylesheets: 'always',
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

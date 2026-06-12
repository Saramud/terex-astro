// Уведомление поисковиков (Яндекс, Bing и др.) об изменённых страницах по протоколу IndexNow:
//   npm run build && npm run indexnow
// Запускать ПОСЛЕ выкладки dist/ на хостинг — поисковик сразу проверяет
// ключ по адресу keyLocation, и страницы должны быть уже доступны.
import { readFileSync } from 'node:fs';

const HOST = 'terex-plus.ru';
const KEY = 'b4118430623f3da4313700d25218cea1'; // совпадает с public/<KEY>.txt

const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.error('В dist/sitemap-0.xml не найдено ни одного URL — сначала npm run build');
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

if (res.ok) {
  console.log(`✓ Отправлено ${urlList.length} URL (HTTP ${res.status})`);
} else {
  console.error(`✗ Ошибка IndexNow: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}

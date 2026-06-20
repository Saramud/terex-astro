// Одноразовый скрипт пережатия статичных изображений под реальный размер показа.
// Запуск: node scripts/optimize-images.mjs
// Оригиналы хранятся в git — при необходимости откатить через `git checkout`.
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const KiB = (b) => (b / 1024).toFixed(1) + ' KiB';

async function processFile(file, { max, quality, format }) {
  // Читаем в буфер, чтобы не держать файловый хендл (на Windows иначе EBUSY).
  const input = await readFile(file);
  const before = input.length;
  let pipeline = sharp(input).resize({
    width: max,
    height: max,
    fit: 'inside',
    withoutEnlargement: true,
  });
  if (format === 'webp') pipeline = pipeline.webp({ quality });
  else if (format === 'png') pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality });
  const output = await pipeline.toBuffer();
  await writeFile(file, output);
  return { before, after: output.length };
}

let totalBefore = 0;
let totalAfter = 0;

// 1. Фото техники
const machinesDir = 'public/img/machines';
for (const name of await readdir(machinesDir)) {
  if (!/\.webp$/i.test(name)) continue;
  const { before, after } = await processFile(path.join(machinesDir, name), {
    max: 600,
    quality: 80,
    format: 'webp',
  });
  totalBefore += before;
  totalAfter += after;
}

// 2. Hero (LCP) — запас побольше
{
  const { before, after } = await processFile('public/img/hero-loader.webp', {
    max: 700,
    quality: 80,
    format: 'webp',
  });
  totalBefore += before;
  totalAfter += after;
  console.log('hero-loader.webp:', KiB(before), '→', KiB(after));
}

// 3. Логотип — остаётся PNG
{
  const { before, after } = await processFile('public/img/logo.png', {
    max: 200,
    quality: 90,
    format: 'png',
  });
  totalBefore += before;
  totalAfter += after;
  console.log('logo.png:', KiB(before), '→', KiB(after));
}

console.log('\n=== TOTAL ===');
console.log(KiB(totalBefore), '→', KiB(totalAfter), `(saved ${KiB(totalBefore - totalAfter)})`);

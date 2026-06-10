// Генерация растровых изображений из фирменных SVG:
//   node scripts/generate-images.mjs
// Создаёт: public/img/og.png (1200×630), public/img/logo.png (512×512),
//          public/img/video-poster.png (800×450)
import sharp from 'sharp';
import { readFileSync } from 'fs';

const heroSvg = readFileSync('public/img/hero-excavator.svg', 'utf8');
// содержимое hero-svg без обёртки <svg>, для встраивания в композиции
const heroInner = heroSvg.replace(/<svg[^>]*>/, '').replace('</svg>', '');

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1f1f1f"/>
  <rect y="610" width="1200" height="20" fill="#ffc61a"/>
  <text x="80" y="170" font-family="Arial, sans-serif" font-size="76" font-weight="bold" fill="#ffc61a">ТЕРЕКС-ПЛЮС</text>
  <text x="80" y="260" font-family="Arial, sans-serif" font-size="48" fill="#ffffff">Аренда спецтехники</text>
  <text x="80" y="325" font-family="Arial, sans-serif" font-size="48" fill="#ffffff">в Санкт-Петербурге и ЛО</text>
  <text x="80" y="420" font-family="Arial, sans-serif" font-size="38" fill="#bbbbbb">Работаем 24/7 · Оператор включён</text>
  <text x="80" y="500" font-family="Arial, sans-serif" font-size="46" font-weight="bold" fill="#ffc61a">8 (812) 989-03-32</text>
  <g transform="translate(700 220) scale(1.25)">${heroInner}</g>
</svg>`;

const posterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
  <rect width="800" height="450" fill="#1f1f1f"/>
  <rect y="436" width="800" height="14" fill="#ffc61a"/>
  <text x="48" y="120" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#ffc61a">ТЕРЕКС-ПЛЮС</text>
  <text x="48" y="180" font-family="Arial, sans-serif" font-size="30" fill="#ffffff">Видео о нашей технике в работе</text>
  <g transform="translate(420 130) scale(0.85)">${heroInner}</g>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile('public/img/og.png');
console.log('✓ public/img/og.png');

await sharp(Buffer.from(posterSvg)).png().toFile('public/img/video-poster.png');
console.log('✓ public/img/video-poster.png');

await sharp('public/img/logo.svg', { density: 300 })
  .resize(512, 512)
  .png()
  .toFile('public/img/logo.png');
console.log('✓ public/img/logo.png');

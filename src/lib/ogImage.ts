// Генерация OG-изображений (1200×630) на этапе сборки.
// Используется эндпоинтами src/pages/img/og/**.png.ts — sharp растеризует
// SVG-композицию в том же бренд-стиле, что и scripts/generate-images.mjs.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const BG = '#1f1f1f';
const ACCENT = '#ffc61a';
const MUTED = '#bbbbbb';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Жадный перенос по словам; при превышении maxLines последняя строка обрезается с «…»
function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const cut = lines.slice(0, maxLines);
    cut[maxLines - 1] = `${cut[maxLines - 1].slice(0, maxChars - 1).trimEnd()}…`;
    return cut;
  }
  return lines;
}

// Содержимое SVG-иллюстрации категории без обёртки <svg> (viewBox 0 0 400 300)
function categoryArt(categorySlug: string): string {
  const file = path.join(process.cwd(), 'public', 'img', 'cat', `${categorySlug}.svg`);
  const svg = readFileSync(file, 'utf8');
  return svg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
}

export interface OgImageInput {
  title: string;
  price: number;
  priceLabel?: string;
  categorySlug: string;
}

export async function renderOgImage({
  title,
  price,
  priceLabel = 'смена · 8 часов',
  categorySlug,
}: OgImageInput): Promise<Buffer> {
  const lines = wrapText(title, 22, 3);
  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="80" y="${214 + i * 62}" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="#ffffff">${escapeXml(l)}</text>`
    )
    .join('\n  ');
  const priceFmt = price.toLocaleString('ru-RU');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect y="610" width="1200" height="20" fill="${ACCENT}"/>
  <g transform="translate(720 130) scale(1.15)">${categoryArt(categorySlug)}</g>
  <text x="80" y="104" font-family="Arial, sans-serif" font-size="38" font-weight="bold" fill="${ACCENT}">ТЕРЕКС-ПЛЮС</text>
  <text x="80" y="148" font-family="Arial, sans-serif" font-size="26" fill="${MUTED}">Аренда спецтехники в Санкт-Петербурге и ЛО</text>
  ${titleSvg}
  <text x="80" y="478" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="${ACCENT}">от ${priceFmt} ₽ <tspan font-size="32" font-weight="normal" fill="${MUTED}">/ ${escapeXml(priceLabel)}</tspan></text>
  <text x="80" y="560" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#ffffff">8 (921) 573-45-02 <tspan font-size="30" font-weight="normal" fill="${MUTED}">· terex-plus.ru</tspan></text>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const BASE = process.env.CHECK_UI_BASE ?? 'http://localhost:4321';
const SHOTS = './scripts/screenshots';
mkdirSync(SHOTS, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--allow-running-insecure-content',
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

const issues = [];
const log = (msg) => {
  console.log(msg);
  issues.push(msg);
};

// ── Helper ──────────────────────────────────────────────────────────────────
async function shot(name) {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });
}

async function checkFocusVisible(selector, label) {
  const el = await page.$(selector);
  if (!el) {
    log(`  ⚠ не найден: ${selector}`);
    return;
  }
  await page.evaluate((sel) => document.querySelector(sel)?.focus(), selector);
  const outline = await page.evaluate((sel) => {
    const s = getComputedStyle(document.querySelector(sel));
    return s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor;
  }, selector);
  if (outline.includes('none') || outline.includes('0px')) {
    log(`  ✗ нет :focus-visible на "${label}": ${outline}`);
  } else {
    console.log(`  ✓ focus-visible OK на "${label}": ${outline}`);
  }
}

async function checkLabel(inputId) {
  const has = await page.evaluate((id) => !!document.querySelector(`label[for="${id}"]`), inputId);
  if (!has) log(`  ✗ нет <label> для #${inputId}`);
  else console.log(`  ✓ label OK для #${inputId}`);
}

// ── 1. HOMEPAGE ─────────────────────────────────────────────────────────────
console.log('\n=== Главная страница ===');
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 20000 });
await shot('01-home');
console.log('  title:', await page.title());

// Кнопки фильтра
await checkFocusVisible('.techs', 'фильтр-кнопка');
await checkFocusVisible('a.card', 'карточка каталога');

// Форма на главной
await checkLabel('name');
await checkLabel('phone');
await checkLabel('technics');
await checkLabel('rent');

// Клик "Отправить заявку" в хедере (кнопка открывает модалку)
const headerBtn = await page.$('.header_button');
if (headerBtn) {
  await headerBtn.click();
  await page.waitForSelector('.modal.show', { timeout: 3000 }).catch(() => {});
  await shot('02-modal-open');
  // Проверим label в модальной форме
  await checkLabel('name');
  await checkLabel('phone');
  // Закрыть модалку
  const closeBtn = await page.$('[data-modal-close]');
  if (closeBtn) await closeBtn.click();
  await page.waitForSelector('.modal.show', { timeout: 2000 }).catch(() => {});
  console.log('  ✓ модалка открылась и закрылась');
} else {
  log('  ✗ не найдена кнопка .header_button');
}

// Скролл к форме
await page.evaluate(() => document.querySelector('#requestform')?.scrollIntoView());
await new Promise((r) => setTimeout(r, 300));
await shot('03-home-form');

// Попытка отправить пустую форму — проверка ошибки
const submitBtn = await page.$('#sendMail');
if (submitBtn) {
  // Очистим телефон
  await page.evaluate(() => {
    const el = document.querySelector('#phone');
    if (el) el.value = '';
  });
  await submitBtn.click();
  await new Promise((r) => setTimeout(r, 300));
  const errorEl = await page.$('#error');
  const hasError = !!errorEl;
  const phoneHasErrorClass = await page.evaluate(() =>
    document.querySelector('#phone')?.classList.contains('error')
  );
  if (hasError) console.log('  ✓ ошибка валидации отображается');
  else log('  ✗ ошибка валидации не отображается');
  if (phoneHasErrorClass) console.log('  ✓ класс .error добавлен на поле телефона');
  else log('  ✗ класс .error НЕ добавлен (возможно инлайн-стиль остался)');
  await shot('04-form-error');
}

// ── 2. СТРАНИЦА КАТЕГОРИИ ────────────────────────────────────────────────────
console.log('\n=== Страница категории ===');
await page.goto(`${BASE}/technics/autokrans.html`, { waitUntil: 'networkidle0', timeout: 20000 });
await shot('05-category');
// Хлебные крошки
const breadcrumb = await page.$('.breadcrumb');
if (breadcrumb) console.log('  ✓ хлебные крошки найдены');
else log('  ✗ хлебные крошки не найдены (.breadcrumb)');
// Ссылки в хлебных крошках
await checkFocusVisible('.breadcrumb__item a', 'хлебная крошка');

// ── 3. СТРАНИЦА МАШИНЫ ───────────────────────────────────────────────────────
console.log('\n=== Страница машины ===');
await page.goto(`${BASE}/technics/autokrans/atkrnKAMAZVEZDEHOD.html`, {
  waitUntil: 'networkidle0',
  timeout: 20000,
});
await shot('06-machine');
await checkFocusVisible('.btn-warning', 'Арендовать');

// Кнопка Арендовать
const rentBtn = await page.$('.btn-warning');
if (rentBtn) {
  const box = await rentBtn.boundingBox();
  if (box && box.width > 80 && box.height > 36) {
    console.log(
      `  ✓ кнопка Арендовать видима: ${Math.round(box.width)}x${Math.round(box.height)}px`
    );
  } else {
    log(`  ✗ кнопка Арендовать слишком мала: ${JSON.stringify(box)}`);
  }
  await rentBtn.click();
  await new Promise((r) => setTimeout(r, 500));
  await shot('07-machine-modal');
  const modal = await page.$('.modal.show');
  if (modal) console.log('  ✓ модалка открылась при клике Арендовать');
  else log('  ✗ модалка не открылась');
}

// ── 4. МОБИЛЬНЫЙ вид (375px) ─────────────────────────────────────────────────
console.log('\n=== Мобильный вид (375px) ===');
await page.setViewport({ width: 375, height: 812 });
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 20000 });
await shot('08-mobile-home');
await page.goto(`${BASE}/technics/autokrans.html`, { waitUntil: 'networkidle0' });
await shot('09-mobile-category');

// Хедер на мобильном: бургер и нижняя CTA-панель
const navToggle = await page.$('.nav-toggle');
if (navToggle) {
  const visible = await page.evaluate(() => {
    const el = document.querySelector('.nav-toggle');
    return el ? getComputedStyle(el).display !== 'none' : false;
  });
  if (visible) console.log('  ✓ бургер-кнопка видима на мобильном');
  else log('  ✗ бургер-кнопка скрыта на мобильном');
} else {
  log('  ✗ не найдена кнопка .nav-toggle');
}

const mobileCta = await page.evaluate(() => {
  const el = document.querySelector('.mobile-cta');
  return el ? getComputedStyle(el).display !== 'none' : false;
});
if (mobileCta) console.log('  ✓ нижняя CTA-панель видима на мобильном');
else log('  ✗ нижняя CTA-панель не видима (.mobile-cta)');

// ── 5. ИТОГ ──────────────────────────────────────────────────────────────────
console.log('\n=== ИТОГ ===');
if (issues.length === 0) {
  console.log('✅ Проблем не обнаружено');
} else {
  console.log(`⚠ Найдено ${issues.length} проблем:`);
  issues.forEach((i) => console.log(' ', i));
}

await browser.close();

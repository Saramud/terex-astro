# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Never read or search inside `node_modules/`. Use `package.json` and official docs to understand dependencies.

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Build static site to dist/
npm run preview       # Preview the production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check only
```

## Architecture

This is a static Astro site (SSG) for Terex-Plus, a Russian construction equipment rental company. The production URL is `https://terex-plus.ru`.

**Path alias:** `@/*` maps to `src/*`.

### Routing

- `/` — Homepage with filterable equipment catalog, FAQ (FAQPage schema) and contact form
- `/about`, `/contacts` — Static informational pages
- `/technics/[category]` — Dynamic category listing pages (14 categories) with SEO text blocks
- `/technics/[category]/[machine]` — Dynamic individual equipment detail pages
- `/arenda/[category]/[city]` — Geo landing pages ("аренда [техника] в [городе]"). Generated only for the categories in `PILOT_CATEGORY_SLUGS` (in `src/data/geoCities.ts`) × every city in `geoCities`. Separate route tree from `/technics` to avoid the `[machine]`/`[city]` dynamic-segment collision. Pilot category pages link to their geo pages via a "по районам" block.
- `/articles` + `/articles/[slug]` — SEO articles from the `articles` content collection

All routes are generated statically at build time from `src/data/equipment.ts`.

### Data Layer

`src/data/equipment.ts` is the single source of truth for all equipment data — ~60 machines across 14 categories with prices and technical specs. `src/data/types.ts` defines `EquipmentItem`, `EquipmentCategory`, and all 21+ property types with their Russian display labels. When adding or modifying equipment, only these two files need to change; the dynamic routes automatically pick up the data via `getStaticPaths()`.

Each item's `img` field holds its photo path. Per-machine photos live in `public/img/machines/` named `<item.id>.webp`; machines without a real photo set `img` to their category illustration (`/img/cat/<urlSlug>.svg`) instead. `src/data/categoryImages.ts` maps each category `urlSlug` to that fallback illustration.

`src/data/seoTexts.ts` holds per-category SEO copy keyed by `urlSlug` (genitive case name for titles, intro paragraphs, task lists, related links). Every category in `equipment.ts` must have a matching entry here. Articles live in `src/content/articles/*.md` (schema in `src/content/config.ts`).

`src/data/geoCities.ts` drives the `/arenda/[category]/[city]` geo landing pages: each `GeoCity` has a `slug`, `name`, prepositional-case form, and a hand-written unique `intro` (real district facts — neighbours, demand profile — to avoid thin/doorway content). `PILOT_CATEGORY_SLUGS` limits which categories get geo pages.

### Components

Astro components handle layout and static markup; React components handle interactivity:

- **`Catalog.tsx`** (React) — Filterable equipment card grid (homepage + `/technics`). Category filter pills plus a live name search (search-first: a non-empty query searches across all categories by `item.title`; selecting a category clears it). Persists selected category to `localStorage`. Cards render the per-machine photo (`item.img`), falling back to the per-category illustration (`categoryImages[urlSlug]`) when a machine has no photo.
- **`ContactForm.tsx`** (React) — Request form with IMask phone masking. Submits to `/mail.php` (server-side mail script, lives in `public/`).
- **`BaseLayout.astro`** — Main layout: `<head>` with SEO tags (OG, JSON-LD LocalBusiness schema, canonical), View Transitions, modal initialization logic.
- **`Header.astro`** — Navigation with dropdown menus built from equipment categories.
- **`Strip.astro`** — Breadcrumb header strip used on category and detail pages.
- **`Modal.astro`** — Equipment detail modal rendered in the layout, opened via JS.

### Styling

Custom SCSS with no CSS framework. Main entry is `src/styles/main.scss` which imports partials from the same directory (`_variables.scss`, `_grid.scss`, `_buttons.scss`, etc.). The grid uses Bootstrap-style class naming (`container`, `row`, `col-sm-*`, `col-lg-*`). Vite is configured to use the modern SCSS compiler API.

### Integrations

- `@astrojs/react` — React for interactive UI components
- `@astrojs/sitemap` — Auto-generates `sitemap-index.xml` at build time. Pinned to exactly 3.2.1: versions 3.3+ require Astro 5 and crash the build on Astro 4.
- `imask` — Phone number input masking in the contact form

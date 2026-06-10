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
- `/technics/[category]` — Dynamic category listing pages (10 categories) with SEO text blocks
- `/technics/[category]/[machine]` — Dynamic individual equipment detail pages
- `/articles` + `/articles/[slug]` — SEO articles from the `articles` content collection

All routes are generated statically at build time from `src/data/equipment.ts`.

### Data Layer

`src/data/equipment.ts` is the single source of truth for all equipment data — ~80+ machines across 10 categories with prices and technical specs. `src/data/types.ts` defines `EquipmentItem`, `EquipmentCategory`, and all 21+ property types with their Russian display labels. When adding or modifying equipment, only these two files need to change; the dynamic routes automatically pick up the data via `getStaticPaths()`.

`src/data/seoTexts.ts` holds per-category SEO copy keyed by `urlSlug` (genitive case name for titles, intro paragraphs, task lists, related links). Every category in `equipment.ts` must have a matching entry here. Articles live in `src/content/articles/*.md` (schema in `src/content/config.ts`).

### Components

Astro components handle layout and static markup; React components handle interactivity:

- **`Catalog.tsx`** (React) — Filterable equipment card grid on the homepage. Persists selected category to `localStorage`.
- **`ContactForm.tsx`** (React) — Request form with IMask phone masking. Submits to `/telegram.php` (server-side script not in this repo).
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

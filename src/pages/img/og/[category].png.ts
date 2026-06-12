import type { APIRoute } from 'astro';
import { categories } from '@/data/equipment';
import { categorySeo } from '@/data/seoTexts';
import { renderOgImage } from '@/lib/ogImage';

export function getStaticPaths() {
  return categories.map((cat) => ({
    params: { category: cat.urlSlug },
    props: { category: cat },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { category } = props;
  const seo = categorySeo[category.urlSlug];
  const minPrice = Math.min(...category.items.map((i) => i.price));
  const png = await renderOgImage({
    title: `Аренда ${seo.genitive}`,
    price: minPrice,
    categorySlug: category.urlSlug,
  });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};

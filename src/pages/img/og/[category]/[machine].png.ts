import type { APIRoute } from 'astro';
import { categories } from '@/data/equipment';
import { renderOgImage } from '@/lib/ogImage';

export function getStaticPaths() {
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({
      params: { category: cat.urlSlug, machine: item.id },
      props: { category: cat, item },
    }))
  );
}

export const GET: APIRoute = async ({ props }) => {
  const { category, item } = props;
  const png = await renderOgImage({
    title: item.title,
    price: item.price,
    categorySlug: category.urlSlug,
  });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};

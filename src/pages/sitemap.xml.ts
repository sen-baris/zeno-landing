import type { APIRoute } from 'astro';
import { getAllLocalizedRouteEntries } from '../lib/i18n/routes';
import { withBase } from '../lib/routing/base-path';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://heyzeno.com');
  const urls = getAllLocalizedRouteEntries()
    .map(({ path }) => new URL(withBase(path), origin).href)
    .map((url) => `<url><loc>${escapeXml(url)}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'content-type': 'application/xml' },
    },
  );
};

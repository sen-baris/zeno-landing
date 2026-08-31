import type { APIRoute } from 'astro';
import { withBase } from '../lib/routing/base-path';

const paths = ['/', '/product', '/ai-readiness', '/demo'];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://heyzeno.com');
  const urls = paths
    .map((path) => `<url><loc>${new URL(withBase(path), origin).href}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'content-type': 'application/xml' },
    },
  );
};

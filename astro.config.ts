import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// A preview deployment overrides the origin and, for a project site, the subpath it is served
// from. Both default to the production values so local development and CI are unaffected.
const site = process.env.PUBLIC_SITE_ORIGIN ?? 'https://heyzeno.com';
const base = process.env.PUBLIC_SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

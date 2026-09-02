import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, passthroughImageService } from 'astro/config';

// A preview deployment overrides the origin and, for a project site, the subpath it is served
// from. Both default to the production values so local development and CI are unaffected.
const site = process.env.PUBLIC_SITE_ORIGIN ?? 'https://heyzeno.com';
const base = process.env.PUBLIC_SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  devToolbar: { enabled: false },
  // Sharp is present in the pnpm store but not linked into this project, and adding it would mean a
  // new dependency and an intake record for three decorative photographs. The team images are
  // encoded at the size they are displayed instead, so there is nothing left to optimise at build
  // time; astro:assets still gives them hashed URLs and intrinsic dimensions to protect layout.
  image: { service: passthroughImageService() },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

/**
 * Internal links are written as root-absolute app paths (`/demo`, `/#trust`). When the site is
 * served below a domain root — a GitHub Pages project site, a review deployment, a reverse proxy
 * subpath — every one of those paths needs the deployment prefix in front of it.
 *
 * Astro exposes the configured `base` as `import.meta.env.BASE_URL`. It is `/` for local
 * development, the test suites, and any root deployment, so `withBase` is a no-op there.
 */
export function siteBase(base: string = import.meta.env.BASE_URL): string {
  const trimmed = base.trim();
  if (trimmed === '' || trimmed === '/') return '';
  const leading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return leading.endsWith('/') ? leading.slice(0, -1) : leading;
}

/**
 * Prefixes a root-absolute app path with the deployment base. Anything that is not root-absolute —
 * an external URL, a bare fragment, a mail link — is returned untouched, because it does not
 * address this deployment.
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  if (!path.startsWith('/')) return path;

  const prefix = siteBase(base);
  if (prefix === '') return path;

  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
}

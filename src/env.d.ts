/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_LEAD_ADAPTER?: 'synthetic' | 'gateway';
  readonly PUBLIC_LEAD_ENDPOINT?: string;
  /** 'true' marks a shared preview deployment, which must not be indexed. */
  readonly PUBLIC_PREVIEW_DEPLOY?: string;
  /** Astro's configured `base`, used by `withBase` to prefix root-absolute app paths. */
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

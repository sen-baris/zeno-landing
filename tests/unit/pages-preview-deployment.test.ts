import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');

describe('GitHub Pages preview deployment', () => {
  it('builds a noindex preview with synthetic demo receipts and no lead endpoint', () => {
    expect(workflow).toContain('CONTENT_MODE: preview');
    expect(workflow).toContain("PUBLIC_PREVIEW_DEPLOY: 'true'");
    expect(workflow).toContain("PUBLIC_LEAD_ADAPTER: 'synthetic'");
    expect(workflow).not.toContain('PUBLIC_LEAD_ENDPOINT:');
  });
});

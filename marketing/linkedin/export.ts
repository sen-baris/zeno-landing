import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import {
  bannerClaimIds,
  bannerHeadline,
  banners,
  concepts,
  cropGuides,
  narrativeLabels,
} from './manifest';

const directory = fileURLToPath(new URL('./', import.meta.url));
const root = fileURLToPath(new URL('../../', import.meta.url));
const output = `${directory}exports`;
await mkdir(output, { recursive: true });
// Standalone HTML embeds the installed fonts, so keep their redistribution license beside it.
await writeFile(
  `${output}/FONT-LICENSE.txt`,
  [
    await readFile(`${root}node_modules/@fontsource/ibm-plex-serif/LICENSE`, 'utf8'),
    await readFile(`${root}node_modules/@fontsource-variable/ibm-plex-sans/LICENSE`, 'utf8'),
  ].join('\n\n'),
);
const template = await readFile(`${directory}banner.html`, 'utf8');
const css = await readFile(`${directory}banner.css`, 'utf8');
const serif = await readFile(
  `${root}node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-normal.woff2`,
);
const sans = await readFile(
  `${root}node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2`,
);
const fonts = `
@font-face { font-family: 'IBM Plex Serif'; font-weight: 400; src: url(data:font/woff2;base64,${serif.toString('base64')}) format('woff2'); }
@font-face { font-family: 'IBM Plex Sans'; font-weight: 100 900; src: url(data:font/woff2;base64,${sans.toString('base64')}) format('woff2'); }
`;
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const arrow =
  '<svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8H98M91 2L98 8L91 14" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>';
const motif = `<div class="motif" aria-label="${narrativeLabels.join(' → ')}">${narrativeLabels.map((label, index) => `${index ? arrow : ''}<span data-critical class="node ${index === 1 ? 'agent' : ''}">${label}</span>`).join('')}</div>`;
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const images = new Map<string, string>();
const report = [];
try {
  for (const banner of banners) {
    const claims = resolveApprovedClaims(
      claimRegistry,
      bannerClaimIds,
      `marketing.linkedin.${banner.placement}`,
    );
    if (
      claims[0]!.statement !== bannerHeadline ||
      claims[1]!.statement !== narrativeLabels.join(' → ')
    )
      throw new Error('Banner copy differs from its exact approval.');
    const html = template
      .replace('/* FONTS */', fonts)
      .replace('/* STYLES */', css)
      .replaceAll('{{headline}}', escapeHtml(bannerHeadline))
      .replace('{{concept}}', banner.id)
      .replace('{{placement}}', banner.placement)
      .replace('{{motif}}', banner.id === 'product-narrative' ? motif : '')
      .replace(/[ \t]+$/gm, '');
    await page.setViewportSize({ width: banner.width, height: banner.height });
    await page.setContent(html);
    const check = await page.evaluate(async () => {
      await document.fonts.ready;
      const headline = document.querySelector('h1')!;
      const text = document.createRange();
      text.selectNodeContents(headline);
      return {
        headline: headline.textContent,
        fonts: [...document.fonts].map((font) => ({ family: font.family, status: font.status })),
        bounds: [...document.querySelectorAll('[data-critical]')].map((element) => {
          const box = element.getBoundingClientRect();
          let background: Element = element;
          while (
            getComputedStyle(background).backgroundColor === 'rgba(0, 0, 0, 0)' &&
            background.parentElement
          )
            background = background.parentElement;
          const [fg, bg] = [
            getComputedStyle(element).color,
            getComputedStyle(background).backgroundColor,
          ].map((color) => {
            const channels = color
              .match(/[\d.]+/g)!
              .slice(0, 3)
              .map(Number)
              .map((value) => {
                const channel = value / 255;
                return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
              });
            return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
          }) as [number, number];
          return {
            label: element.textContent,
            contrast: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05),
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
          };
        }),
        textBounds: [...text.getClientRects()].map((box) => ({
          right: box.right,
          bottom: box.bottom,
        })),
      };
    });
    const guides = cropGuides[banner.placement];
    if (
      check.headline !== bannerHeadline ||
      check.fonts.some(
        (font) =>
          font.status !== 'loaded' &&
          (banner.id === 'product-narrative' || font.family.includes('Serif')),
      )
    )
      throw new Error(`Copy or fonts failed: ${banner.filename}`);
    for (const box of check.bounds) {
      if (box.contrast < 4.5)
        throw new Error(`Text contrast failed: ${banner.filename}: ${box.label}`);
      if (
        box.left < guides.edge ||
        box.right > guides.criticalRight ||
        box.top < 24 ||
        box.bottom > banner.height - 24 ||
        (box.left < guides.photoRight && box.bottom > guides.photoTop)
      )
        throw new Error(`Crop-safe bounds failed: ${banner.filename}: ${box.label}`);
    }
    if (
      check.textBounds.some(
        (box) => box.right > guides.criticalRight || box.bottom > banner.height - 24,
      )
    )
      throw new Error(`Headline clipping: ${banner.filename}`);
    const png = await page.screenshot({ type: 'png', animations: 'disabled' });
    if (
      png.readUInt32BE(16) !== banner.width ||
      png.readUInt32BE(20) !== banner.height ||
      png.length >= banner.maxBytes
    )
      throw new Error(`PNG dimensions or size failed: ${banner.filename}`);
    await writeFile(`${output}/${banner.filename}`, png);
    await writeFile(`${output}/${banner.filename.replace('.png', '.html')}`, html);
    images.set(banner.filename, `data:image/png;base64,${png.toString('base64')}`);
    report.push({
      file: banner.filename,
      width: banner.width,
      height: banner.height,
      bytes: png.length,
      sha256: createHash('sha256').update(png).digest('hex'),
      ...check,
    });
  }

  const sheetCss = `
    ${fonts}
    *{box-sizing:border-box}body{margin:0;padding:48px;background:#e9e4de;color:#171518;font:18px 'IBM Plex Sans'}
    h1{font:40px 'IBM Plex Serif';margin:0 0 10px}p{margin:0 0 32px}h2{font-size:20px;font-weight:500;margin:30px 0 12px}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}figcaption{margin:10px 0 20px;font-size:15px}
    img{display:block;width:100%}.crop{position:relative;overflow:hidden;background:#fffefc;aspect-ratio:4}.crop.company{aspect-ratio:1512/256}.crop img{height:100%;object-fit:cover}.crop.mobile img{width:114%;max-width:none;margin-left:-7%}
    .photo{position:absolute;left:5%;bottom:-7%;height:46%;aspect-ratio:1;border:3px solid white;border-radius:50%;background:#c7c4c0}
    .company .photo{height:48%;left:5%;border-radius:4px}.mobile.company .photo{height:65%}
  `;
  const renderSheet = async (name: string, title: string, intro: string, body: string) => {
    const html =
      `<!doctype html><html lang="en"><meta charset="UTF-8"><title>${title}</title><style>${sheetCss}</style><body><h1>${title}</h1><p>${intro}</p>${body}</body></html>`.replace(
        /[ \t]+$/gm,
        '',
      );
    await page.setViewportSize({ width: 1680, height: 1100 });
    await page.setContent(html);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    await writeFile(`${output}/${name}.html`, html);
  };
  await renderSheet(
    'comparison',
    'Zeno / LinkedIn banner kit',
    'Three directions. Personal profile on the left, company page on the right.',
    concepts
      .map(
        (concept) =>
          `<h2>${concept.label}</h2><div class="row">${banners
            .filter((banner) => banner.id === concept.id)
            .map(
              (banner) =>
                `<figure><img src="${images.get(banner.filename)}" alt="${banner.label}, ${banner.placement}"><figcaption>${banner.placement === 'profile' ? 'Personal profile' : 'Company page'} · ${banner.width} × ${banner.height}</figcaption></figure>`,
            )
            .join('')}</div>`,
      )
      .join(''),
  );
  await renderSheet(
    'crop-review',
    'Zeno / Crop and photo-overlap review',
    'Conservative simulations, not exact LinkedIn UI. Desktop at left. Narrow center crop at right. Gray shapes represent profile photos.',
    banners
      .map(
        (banner) =>
          `<h2>${banner.label} / ${banner.placement}</h2><div class="row">${['desktop', 'mobile'].map((size) => `<figure><div class="crop ${size} ${banner.placement}"><img src="${images.get(banner.filename)}" alt="${banner.label}, ${size} crop"><div class="photo"></div></div><figcaption>${size === 'desktop' ? 'Desktop simulation' : 'Mobile simulation, 88% center crop'}</figcaption></figure>`).join('')}</div>`,
      )
      .join(''),
  );
  await writeFile(
    `${output}/verification.json`,
    `${JSON.stringify({ browser: browser.version(), headline: bannerHeadline, exports: report }, null, 2)}\n`,
  );
  console.log(
    report
      .map(
        (file) =>
          `${file.file}: ${file.width} × ${file.height}, ${(file.bytes / 1000).toFixed(1)} kB`,
      )
      .join('\n'),
  );
} finally {
  await browser.close();
}

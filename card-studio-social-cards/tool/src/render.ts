import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { loadFonts } from './fonts';
import { resolveBrand } from './brand';
import { resolveSticker } from './sticker';
import { classifyAspect, getPreset } from './presets';
import { getTheme } from './themes';
import { getTemplate } from './registry';
import { isZh } from './templates/shared';
import type { RenderOptions, TemplateContext } from './types';

/** Area-based scale factor, 1.0 at the OG baseline (1200x630). */
function scaleFor(w: number, h: number): number {
  return Math.sqrt(w * h) / Math.sqrt(1200 * 630);
}

export async function renderSvg(opts: RenderOptions): Promise<{ svg: string; width: number; height: number }> {
  const template = getTemplate(opts.template);
  const size = opts.preset ? getPreset(opts.preset) : undefined;
  const width = opts.width ?? size?.width;
  const height = opts.height ?? size?.height;
  if (!width || !height) throw new Error('Pass a preset id or explicit width/height.');
  const themeId = opts.theme ?? template.themes[0];
  if (!themeId) throw new Error(`Template "${template.id}" declares no themes.`);
  const theme = getTheme(themeId);
  const s = scaleFor(width, height);
  const sticker = await resolveSticker(opts.content.sticker);
  const ctx: TemplateContext = {
    c: opts.content,
    t: theme,
    b: resolveBrand(opts.brand),
    ...(sticker ? { sticker } : {}),
    w: width,
    h: height,
    aspect: classifyAspect(width, height),
    s,
    u: (n: number) => Math.round(n * s * 100) / 100,
    zh: isZh(opts.content),
  };
  const node = template.render(ctx);
  const svg = await satori(node as never, { width, height, fonts: loadFonts() });
  return { svg, width, height };
}

export async function renderCard(opts: RenderOptions): Promise<Buffer> {
  const { svg, width } = await renderSvg(opts);
  if (opts.format === 'svg') return Buffer.from(svg, 'utf8');
  const scale = opts.scale ?? 1;
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: Math.round(width * scale) },
    font: { loadSystemFonts: false },
  });
  return Buffer.from(resvg.render().asPng());
}

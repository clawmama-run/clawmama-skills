import type { Brand, Theme } from './types';

/**
 * Default brand: ClawMama. The mark is the site-header SVG verbatim, with
 * color placeholders so each theme can tint it:
 *   {color}  — arc stroke (primary accent)
 *   {color2} — satellite dot (secondary accent)
 *   {color3} — dot core (light on dark themes, paper on light themes)
 */
export const DEFAULT_BRAND: Brand = {
  name: 'ClawMama',
  domain: 'clawmama.run',
  markSvg:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
    '<path d="M34 12.5 A16.5 16.5 0 1 0 34 35.5" fill="none" stroke="{color}" stroke-width="7.5" stroke-linecap="round"/>' +
    '<circle cx="41" cy="24" r="5.4" fill="{color2}"/>' +
    '<circle cx="41" cy="24" r="2.4" fill="{color3}"/>' +
    '</svg>',
};

export function resolveBrand(partial?: Partial<Brand>): Brand {
  if (!partial) return DEFAULT_BRAND;
  // A renamed brand must not inherit the ClawMama mark: without an explicit
  // markSvg it renders wordmark-only.
  const renamed = partial.name !== undefined && partial.name !== DEFAULT_BRAND.name;
  const markSvg = partial.markSvg !== undefined ? partial.markSvg : renamed ? undefined : DEFAULT_BRAND.markSvg;
  return {
    name: partial.name ?? DEFAULT_BRAND.name,
    domain: partial.domain ?? DEFAULT_BRAND.domain,
    ...(markSvg ? { markSvg } : {}),
  };
}

/**
 * Resolves the mark SVG against the theme and returns it as a data URI for a
 * satori <img> node. A custom markSvg without placeholders is used verbatim.
 */
export function markDataUri(brand: Brand, theme: Theme, primary?: string): string | null {
  if (!brand.markSvg) return null;
  const svg = brand.markSvg
    .split('{color2}').join(theme.brand2)
    .split('{color3}').join(theme.mode === 'dark' ? theme.text : theme.surface)
    .split('{color}').join(primary ?? theme.brand);
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
}

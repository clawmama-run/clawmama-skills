import type { Brand, Theme } from './types';
/**
 * Default brand: ClawMama. The mark is the site-header SVG verbatim, with
 * color placeholders so each theme can tint it:
 *   {color}  — arc stroke (primary accent)
 *   {color2} — satellite dot (secondary accent)
 *   {color3} — dot core (light on dark themes, paper on light themes)
 */
export declare const DEFAULT_BRAND: Brand;
export declare function resolveBrand(partial?: Partial<Brand>): Brand;
/**
 * Resolves the mark SVG against the theme and returns it as a data URI for a
 * satori <img> node. A custom markSvg without placeholders is used verbatim.
 */
export declare function markDataUri(brand: Brand, theme: Theme, primary?: string): string | null;
//# sourceMappingURL=brand.d.ts.map
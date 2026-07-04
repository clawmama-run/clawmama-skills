/** Element tree node in the shape satori accepts (React-element-like plain objects). */
export type VNode = {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: VChild;
    [key: string]: unknown;
  };
};

export type VChild = VNode | string | number | null | undefined | VChild[];

export type Aspect = 'landscape' | 'square' | 'portrait' | 'tall';

export type Preset = {
  id: string;
  platform: string;
  use: string;
  width: number;
  height: number;
};

export type Brand = {
  /** Wordmark text shown next to the mark. */
  name: string;
  /** Default footer text (domain or handle). */
  domain: string;
  /**
   * Inline SVG markup for the logo mark, rendered via data URI. May contain
   * {color} / {color2} / {color3} placeholders resolved against the active
   * theme (primary accent / secondary accent / core). Omit for wordmark-only.
   */
  markSvg?: string;
};

export type Theme = {
  id: string;
  label: string;
  mode: 'dark' | 'light';
  /** Base canvas color. */
  bg: string;
  /** Optional glow/gradient layers painted on the canvas (CSS radial/linear-gradient strings). */
  bgLayers?: string[];
  /** Card/panel surface color. */
  surface: string;
  surfaceBorder: string;
  text: string;
  muted: string;
  brand: string;
  brand2: string;
  /** Marker-pen highlight color for ==keyword== spans (defaults to a soft yellow). */
  highlight?: string;
  /** Family names as registered with the font loader. */
  fontSans: string;
  fontDisplay: string;
  fontMono: string;
  /** CJK-capable display family (serif themes swap display for CJK text). */
  fontDisplayCjk?: string;
};

/**
 * Normalized content model shared by every template. Templates pick a layout
 * ("scene") from which fields are present: quote > stats > bullets > title.
 */
export type CardContent = {
  lang?: 'en' | 'zh';
  /** Small label above the title, e.g. "BLOG" or "AGENT SPOTLIGHT". */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Longer paragraph, used by editorial layouts. */
  body?: string;
  bullets?: string[];
  stats?: { value: string; label: string }[];
  quote?: string;
  /** Quote author or byline. */
  attribution?: string;
  /** Bottom-left anchor text, defaults to the brand domain. */
  footer?: string;
  /** Small pill next to the footer, e.g. "NEW" or "v0.18". */
  badge?: string;
  date?: string;
  /** Carousel position, renders page dots / "02·05" markers. */
  page?: { index: number; count: number };
  /** A single emoji rendered as a large sticker (fetched from twemoji at render time). */
  sticker?: string;
};

export type TemplateContext = {
  c: CardContent;
  t: Theme;
  /** Resolved brand (defaults to ClawMama). */
  b: Brand;
  w: number;
  h: number;
  aspect: Aspect;
  /** Area-based scale factor; 1 at 1200x630. Use u() for scaled px values. */
  s: number;
  u: (n: number) => number;
  /** True when content is Chinese (affects font family + letter spacing). */
  zh: boolean;
  /** Data URI of the resolved sticker emoji, when content.sticker was set. */
  sticker?: string;
};

export type TemplateDef = {
  id: string;
  label: string;
  description: string;
  /** Theme ids this template is designed for; first entry is the default. */
  themes: string[];
  render: (ctx: TemplateContext) => VNode;
};

export type RenderOptions = {
  template: string;
  content: CardContent;
  /** Preset id; alternatively pass explicit width/height. */
  preset?: string;
  width?: number;
  height?: number;
  theme?: string;
  /** Brand overrides (name, domain, markSvg); defaults to ClawMama. */
  brand?: Partial<Brand>;
  format?: 'png' | 'svg';
  /** Output pixel multiplier for png (e.g. 0.5 for previews, 2 for retina). */
  scale?: number;
};

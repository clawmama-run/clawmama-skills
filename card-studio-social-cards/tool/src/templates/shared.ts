import { h, text } from '../h';
import { markDataUri } from '../brand';
import type { CardContent, TemplateContext, VNode } from '../types';

export const CJK_RE = /[　-鿿豈-﫿]/;

export function isZh(c: CardContent): boolean {
  return c.lang === 'zh' || CJK_RE.test([c.title, c.quote, c.subtitle, c.body].filter(Boolean).join(''));
}

export type Scene = 'quote' | 'stats' | 'list' | 'title';

export function sceneOf(c: CardContent): Scene {
  if (c.quote) return 'quote';
  if (c.stats && c.stats.length > 0) return 'stats';
  if (c.bullets && c.bullets.length > 0) return 'list';
  return 'title';
}

/** Approximate visual length: CJK glyphs count double. */
export function weightedLen(s: string): number {
  let n = 0;
  for (const ch of s) n += CJK_RE.test(ch) ? 2 : 1;
  return n;
}

/**
 * Title font size that adapts to aspect ratio and shrinks smoothly for long
 * titles so they never collide with the rest of the layout.
 */
export function titleSize(ctx: TemplateContext, title: string, base?: number): number {
  const byAspect = { landscape: 74, square: 84, portrait: 88, tall: 92 } as const;
  const b = base ?? byAspect[ctx.aspect];
  const budget = { landscape: 30, square: 26, portrait: 26, tall: 24 }[ctx.aspect];
  const len = Math.max(weightedLen(title), 8);
  const factor = Math.min(1, Math.pow(budget / len, 0.55));
  return Math.round(ctx.u(b) * Math.max(factor, 0.55));
}

/** Display font family for the current language. */
export function displayFamily(ctx: TemplateContext): string {
  if (ctx.zh && ctx.t.fontDisplayCjk) return ctx.t.fontDisplayCjk;
  if (ctx.zh) return 'Noto Sans SC';
  return ctx.t.fontDisplay;
}

export function sansFamily(ctx: TemplateContext): string {
  return ctx.zh ? 'Noto Sans SC' : ctx.t.fontSans;
}

/** Small uppercase label pill with a dot, used as the eyebrow. */
export function eyebrowPill(ctx: TemplateContext, label: string): VNode {
  const { t, u } = ctx;
  return h(
    'div',
    {
      alignItems: 'center',
      gap: u(10),
      border: `1px solid ${t.brand}55`,
      backgroundColor: t.mode === 'dark' ? `${t.brand}1f` : `${t.brand}14`,
      borderRadius: 999,
      padding: `${u(9)}px ${u(18)}px`,
      alignSelf: 'flex-start',
    },
    h('div', { width: u(9), height: u(9), borderRadius: 999, backgroundColor: t.brand }),
    text(label, {
      fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
      fontSize: u(21),
      fontWeight: 700,
      letterSpacing: ctx.zh ? u(3) : u(2.6),
      textTransform: 'uppercase',
      color: t.mode === 'dark' ? t.brand2 : t.brand,
    })
  );
}

/** Bottom row: footer text left, badge / page marker right. */
export function footerRow(ctx: TemplateContext, opts: { color?: string; mutedColor?: string } = {}): VNode {
  const { c, t, u } = ctx;
  const color = opts.color ?? t.brand;
  const muted = opts.mutedColor ?? t.muted;
  const right: VNode[] = [];
  if (c.badge) {
    right.push(
      h(
        'div',
        {
          border: `1px solid ${t.surfaceBorder}`,
          borderRadius: 999,
          padding: `${u(6)}px ${u(14)}px`,
        },
        text(c.badge, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 700, color: muted, letterSpacing: u(1) })
      )
    );
  }
  if (c.page) {
    right.push(
      text(`${String(c.page.index).padStart(2, '0')} / ${String(c.page.count).padStart(2, '0')}`, {
        fontFamily: t.fontMono,
        fontSize: u(20),
        fontWeight: 700,
        color: muted,
        letterSpacing: u(2),
      })
    );
  }
  return h(
    'div',
    { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    text(c.footer ?? ctx.b.domain, {
      fontFamily: t.fontMono,
      fontSize: u(21),
      fontWeight: 700,
      color,
      letterSpacing: u(1),
    }),
    h('div', { alignItems: 'center', gap: u(12) }, ...right)
  );
}

/** Logo mark: the brand's real SVG, tinted by the theme, as an <img>. */
export function brandMark(ctx: TemplateContext, size: number, color?: string): VNode | null {
  const src = markDataUri(ctx.b, ctx.t, color);
  if (!src) return null;
  return { type: 'img', props: { src, width: size, height: size, style: { width: size, height: size } } };
}

/** Brand mark + wordmark row. */
export function brandRow(ctx: TemplateContext, opts: { color?: string; textColor?: string; size?: number } = {}): VNode {
  const { t, u } = ctx;
  const size = opts.size ?? u(44);
  return h(
    'div',
    { alignItems: 'center', gap: u(14) },
    brandMark(ctx, size, opts.color),
    text(ctx.b.name, {
      fontFamily: t.fontSans,
      fontSize: size * 0.62,
      fontWeight: 800,
      letterSpacing: -0.5,
      color: opts.textColor ?? t.text,
    })
  );
}

/** Decorative orbital arcs used by the ember template, kept behind text. */
export function orbitalArcs(ctx: TemplateContext, opts: { right?: number; top?: number; size?: number; color?: string; opacity?: number } = {}): VNode {
  const { u, t } = ctx;
  const size = opts.size ?? u(420);
  const color = opts.color ?? t.brand;
  const ring = (scale: number, alpha: string, rot: number, strokeMul: number) =>
    h('div', {
      position: 'absolute',
      right: -size * (0.5 - scale * 0.12),
      top: (opts.top ?? 0) + size * (1 - scale) * 0.5,
      width: size * scale,
      height: size * scale,
      borderRadius: 999,
      border: `${Math.max(3, Math.round(size * 0.028 * strokeMul))}px solid ${color}${alpha}`,
      borderTopColor: 'transparent',
      transform: `rotate(${rot}deg)`,
    });
  return h(
    'div',
    {
      position: 'absolute',
      right: opts.right ?? 0,
      top: opts.top ?? 0,
      width: size,
      height: size,
      opacity: opts.opacity ?? 1,
    },
    ring(1.0, '52', 28, 1),
    ring(0.78, '7a', -12, 1.1),
    ring(0.56, 'a8', 52, 1.2),
    h('div', {
      position: 'absolute',
      right: size * 0.3,
      top: size * 0.42,
      width: size * 0.11,
      height: size * 0.11,
      borderRadius: 999,
      backgroundColor: `${t.brand2}cc`,
    })
  );
}

/** Canvas root with theme background + glow layers. */
export function canvas(ctx: TemplateContext, style: Record<string, unknown>, ...children: (VNode | null)[]): VNode {
  const { t, w, h: hh } = ctx;
  const layers = t.bgLayers?.join(', ');
  return h(
    'div',
    {
      width: w,
      height: hh,
      backgroundColor: t.bg,
      ...(layers ? { backgroundImage: layers } : {}),
      position: 'relative',
      flexDirection: 'column',
      ...style,
    },
    ...children.filter((x): x is VNode => x != null)
  );
}

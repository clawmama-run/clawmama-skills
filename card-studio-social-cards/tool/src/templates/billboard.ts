import { h, text } from '../h';
import { fitBodySize, richTextBlock } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { canvas, sansFamily } from './shared';

/**
 * Billboard — 大字报封面卡。One flat saturated color, giant type, highlighted
 * ==keywords== flip to the accent color. Built for 抖音/TikTok covers and
 * loud single-statement posts.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, aspect } = ctx;
  const pad = u(aspect === 'landscape' ? 80 : 100);
  const family = sansFamily(ctx);
  const main = c.body ?? c.title ?? '';
  const fs = fitBodySize(ctx, main, { widthFrac: 0.82, heightFrac: 0.46, max: 140, min: 40, lineHeight: 1.36 });

  return canvas(
    ctx,
    { padding: pad, flexDirection: 'column' },
    // oversized outline circle, top right
    h('div', {
      position: 'absolute',
      right: u(-160),
      top: u(-160),
      width: u(520),
      height: u(520),
      borderRadius: 999,
      border: `2px solid ${t.mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.2)'}`,
    }),
    h('div', {
      position: 'absolute',
      right: u(120),
      bottom: u(150),
      width: u(18),
      height: u(18),
      borderRadius: 999,
      backgroundColor: t.brand,
    }),
    c.eyebrow
      ? h(
          'div',
          { alignSelf: 'flex-start', backgroundColor: t.brand, padding: `${u(10)}px ${u(20)}px`, borderRadius: u(10) },
          text(ctx.zh ? c.eyebrow : c.eyebrow.toUpperCase(), {
            fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
            fontSize: u(24),
            fontWeight: 800,
            letterSpacing: ctx.zh ? u(3) : u(2.5),
            color: t.bg,
          })
        )
      : null,
    h(
      'div',
      { flexDirection: 'column', flex: 1, justifyContent: 'center', gap: u(34) },
      richTextBlock(ctx, main, {
        fontSize: fs,
        fontFamily: family,
        fontWeight: 900,
        color: t.text,
        lineHeight: 1.36,
        highlightStyle: 'accent',
      }),
      c.subtitle
        ? richTextBlock(ctx, c.subtitle, {
            fontSize: Math.round(fs * 0.42),
            fontFamily: family,
            fontWeight: 500,
            color: t.muted,
            lineHeight: 1.55,
          })
        : null
    ),
    h(
      'div',
      { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
      text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(23), fontWeight: 700, color: t.text, letterSpacing: u(1), opacity: 0.8 }),
      c.page
        ? text(`${c.page.index}/${c.page.count}`, { fontFamily: t.fontMono, fontSize: u(24), fontWeight: 700, color: t.brand })
        : c.badge
          ? text(c.badge, { fontFamily: t.fontMono, fontSize: u(22), fontWeight: 700, color: t.brand, letterSpacing: u(2) })
          : null
    )
  );
}

export const billboard: TemplateDef = {
  id: 'billboard',
  label: 'Billboard',
  description: '大字报封面卡 — flat saturated ground, giant type, accent-colored ==keywords==. For 抖音/TikTok covers and loud statements.',
  themes: ['cobalt', 'ember', 'botanical', 'swiss'],
  render,
};

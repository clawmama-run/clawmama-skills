import { h, text } from '../h';
import { fitBodySize, richTextBlock } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { canvas, sansFamily } from './shared';

/**
 * Neon — 霓虹灯牌卡。Deep night ground, glowing tube frame, text with real
 * glow; ==keywords== burn in the accent color. For loud hooks and night-mode
 * statements.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, aspect } = ctx;
  const pad = u(aspect === 'landscape' ? 72 : 88);
  const family = sansFamily(ctx);
  const main = c.body ?? c.title ?? '';
  const fs = fitBodySize(ctx, main, { widthFrac: 0.72, heightFrac: 0.34, max: 92, min: 36, lineHeight: 1.5 });

  return canvas(
    ctx,
    { padding: u(26) },
    h(
      'div',
      {
        flex: 1,
        flexDirection: 'column',
        border: `2.5px solid ${t.brand2}aa`,
        borderRadius: u(40),
        boxShadow: `0 0 ${u(44)}px ${t.brand2}44, inset 0 0 ${u(60)}px ${t.brand2}22`,
        padding: pad,
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
      },
      h(
        'div',
        { flexDirection: 'column', alignItems: 'center', gap: u(14) },
        text((c.eyebrow ?? ctx.b.name).toUpperCase(), {
          fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
          fontSize: u(24),
          fontWeight: 700,
          letterSpacing: ctx.zh ? u(8) : u(7),
          color: t.brand2,
          textShadow: `0 0 ${u(16)}px ${t.brand2}, 0 0 ${u(40)}px ${t.brand2}77`,
        }),
        h('div', {
          width: u(120),
          height: 2,
          backgroundColor: `${t.brand2}cc`,
          boxShadow: `0 0 ${u(12)}px ${t.brand2}`,
          borderRadius: 2,
        })
      ),
      h(
        'div',
        { flexDirection: 'column', justifyContent: 'center', flex: 1, width: '100%', paddingTop: u(30), paddingBottom: u(30) },
        richTextBlock(ctx, main, {
          fontSize: fs,
          fontFamily: family,
          fontWeight: 900,
          color: t.text,
          lineHeight: 1.5,
          highlightStyle: 'accent',
          align: 'center',
          textShadow: '0 0 14px rgba(255,255,255,0.3)',
          accentShadow: `0 0 ${u(18)}px ${t.brand}, 0 0 ${u(52)}px ${t.brand}88`,
        }),
        c.subtitle
          ? h(
              'div',
              { justifyContent: 'center', width: '100%', marginTop: u(30) },
              text(c.subtitle, {
                fontFamily: family,
                fontSize: Math.round(fs * 0.34),
                fontWeight: 500,
                color: t.muted,
                lineHeight: 1.6,
                textAlign: 'center',
                maxWidth: '78%',
                lineClamp: 2,
              })
            )
          : null
      ),
      h(
        'div',
        { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
        text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(21), fontWeight: 700, color: t.muted, letterSpacing: u(1.5) }),
        c.page
          ? text(`${c.page.index}/${c.page.count}`, { fontFamily: t.fontMono, fontSize: u(21), fontWeight: 700, color: t.brand2 })
          : c.badge
            ? text(c.badge, { fontFamily: t.fontMono, fontSize: u(20), fontWeight: 700, color: t.brand2, letterSpacing: u(2) })
            : null
      )
    )
  );
}

export const neon: TemplateDef = {
  id: 'neon',
  label: 'Neon',
  description: '霓虹灯牌卡 — glowing tube frame, luminous type, accent ==keywords==. For loud hooks and night statements.',
  themes: ['midnight', 'aurora', 'carbon'],
  render,
};

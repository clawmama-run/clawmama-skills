import { h, text } from '../h';
import { fitBodySize, richTextBlock } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { sansFamily } from './shared';

/**
 * Cinema — 电影台词卡。Letterboxed frame, centered bilingual caption,
 * scene/timestamp chrome. ==keywords== glow amber. For film-quote cards,
 * one-liners, and moody statements.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, w, h: hh, aspect } = ctx;
  const barH = Math.round(hh * (aspect === 'landscape' ? 0.14 : 0.11));
  const family = sansFamily(ctx);
  const main = c.body ?? c.quote ?? c.title ?? '';
  const fs = fitBodySize(ctx, main, { widthFrac: 0.74, heightFrac: 0.3, max: 76, lineHeight: 1.75 });

  const bar = (children: VNode[]) =>
    h(
      'div',
      {
        height: barH,
        backgroundColor: '#050505',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${u(64)}px`,
        width: '100%',
        flexShrink: 0,
      },
      ...children
    );

  const mono = (value: string, color?: string) =>
    text(value, { fontFamily: t.fontMono, fontSize: u(20), fontWeight: 400, color: color ?? t.muted, letterSpacing: u(3) });

  return h(
    'div',
    { width: w, height: hh, backgroundColor: '#050505', flexDirection: 'column' },
    bar([
      mono((c.eyebrow ?? 'SCENE 01').toUpperCase()),
      c.date ? mono(c.date) : mono('◦ ◦ ◦'),
    ]),
    // the "screen": vignette + centered caption
    h(
      'div',
      {
        flex: 1,
        backgroundColor: t.bg,
        ...(t.bgLayers ? { backgroundImage: t.bgLayers.join(', ') } : {}),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${u(60)}px ${u(72)}px`,
        gap: u(34),
      },
      richTextBlock(ctx, main, {
        fontSize: fs,
        fontFamily: family,
        fontWeight: 700,
        color: t.text,
        lineHeight: 1.75,
        highlightStyle: 'accent',
        align: 'center',
        maxWidth: '88%',
        textShadow: '0 2px 24px rgba(0,0,0,0.9)',
      }),
      c.subtitle
        ? text(c.subtitle, {
            fontFamily: t.fontSans,
            fontSize: Math.round(fs * 0.36),
            fontWeight: 400,
            color: t.muted,
            letterSpacing: u(1.5),
            lineHeight: 1.6,
            textAlign: 'center',
            maxWidth: '80%',
            lineClamp: 2,
          })
        : null,
      c.attribution
        ? text(`— ${c.attribution}`, {
            fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
            fontSize: Math.round(fs * 0.34),
            fontWeight: 400,
            color: t.brand,
            letterSpacing: u(2),
            marginTop: u(6),
          })
        : null
    ),
    bar([
      h(
        'div',
        { alignItems: 'center', gap: u(12) },
        h('div', { width: u(13), height: u(13), borderRadius: 999, backgroundColor: '#e33b2e' }),
        mono('REC', t.brand2)
      ),
      mono(c.footer ?? ctx.b.domain, t.muted),
      c.page ? mono(`${String(c.page.index).padStart(2, '0')} · ${String(c.page.count).padStart(2, '0')}`) : mono('16:9 ▸'),
    ])
  );
}

export const cinema: TemplateDef = {
  id: 'cinema',
  label: 'Cinema',
  description: '电影台词卡 — letterbox, centered bilingual caption, amber ==keywords==. For film quotes and moody one-liners.',
  themes: ['noir', 'ember', 'midnight'],
  render,
};

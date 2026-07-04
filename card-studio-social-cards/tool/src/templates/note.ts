import { h, text } from '../h';
import { fitBodySize, richTextBlock } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { canvas, sansFamily } from './shared';

/**
 * Note — 便签风短文卡。Flat pastel background, oversized bold text with
 * marker-pen ==keyword== highlights, optional emoji sticker. Built for
 * text-first posts on 小红书 / 抖音 / TikTok / Instagram.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, aspect } = ctx;
  const pad = u(aspect === 'landscape' ? 72 : 92);
  const family = sansFamily(ctx);
  const main = c.body ?? c.title ?? '';
  const hasSticker = Boolean(ctx.sticker);

  const eyebrow = h(
    'div',
    { alignItems: 'center', gap: u(12), opacity: 0.55 },
    h('div', { width: u(22), height: u(22), borderRadius: 999, border: `${Math.max(2, u(3))}px solid ${t.muted}` }),
    text(c.eyebrow ?? 'Note', {
      fontFamily: t.fontSans,
      fontSize: u(26),
      fontWeight: 600,
      letterSpacing: u(1),
      color: t.muted,
    })
  );

  let middle: VNode;
  if (c.bullets && c.bullets.length > 0 && !c.body) {
    const max = { landscape: 4, square: 5, portrait: 6, tall: 7 }[aspect];
    const items = c.bullets.slice(0, max);
    const fs = fitBodySize(ctx, items.join('，'), { heightFrac: hasSticker ? 0.4 : 0.48, max: 54, lineHeight: 1.5 });
    middle = h(
      'div',
      { flexDirection: 'column', gap: u(26), flex: 1, justifyContent: 'center' },
      c.title
        ? richTextBlock(ctx, c.title, { fontSize: Math.round(fs * 1.3), fontFamily: family, fontWeight: 900, color: t.text, lineHeight: 1.35 })
        : null,
      ...items.map((b) =>
        h(
          'div',
          { alignItems: 'flex-start', gap: u(16) },
          h('div', { width: u(12), height: u(12), borderRadius: 4, backgroundColor: t.brand, marginTop: fs * 0.55 - u(6), flexShrink: 0 }),
          richTextBlock(ctx, b, { fontSize: fs, fontFamily: family, fontWeight: 700, color: t.text, lineHeight: 1.5 })
        )
      )
    );
  } else {
    const fs = fitBodySize(ctx, main, { heightFrac: hasSticker ? 0.46 : 0.54, lineHeight: 1.6 });
    middle = h(
      'div',
      { flexDirection: 'column', gap: u(28), flex: 1, justifyContent: 'center', paddingBottom: hasSticker ? u(120) : 0 },
      richTextBlock(ctx, main, { fontSize: fs, fontFamily: family, fontWeight: 900, color: t.text, lineHeight: 1.62 }),
      c.subtitle
        ? richTextBlock(ctx, c.subtitle, { fontSize: Math.round(fs * 0.52), fontFamily: family, fontWeight: 500, color: t.muted, lineHeight: 1.6 })
        : null
    );
  }

  const sticker = ctx.sticker
    ? h(
        'div',
        { position: 'absolute', right: u(88), bottom: u(130), transform: 'rotate(-8deg)' },
        { type: 'img', props: { src: ctx.sticker, width: u(230), height: u(230), style: { width: u(230), height: u(230) } } }
      )
    : null;

  const footer = h(
    'div',
    { justifyContent: 'space-between', alignItems: 'center', width: '100%', opacity: 0.6 },
    text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(22), fontWeight: 700, color: t.brand2, letterSpacing: u(1) }),
    c.page
      ? text(`${String(c.page.index).padStart(2, '0')} / ${String(c.page.count).padStart(2, '0')}`, {
          fontFamily: t.fontMono,
          fontSize: u(21),
          fontWeight: 700,
          color: t.muted,
          letterSpacing: u(2),
        })
      : null
  );

  return canvas(
    ctx,
    { padding: pad, flexDirection: 'column', gap: u(40) },
    sticker,
    eyebrow,
    middle,
    footer
  );
}

export const note: TemplateDef = {
  id: 'note',
  label: 'Note',
  description: '便签风短文卡 — flat pastel, marker highlights (==关键词==), emoji sticker. For text-first 小红书/抖音/IG posts.',
  themes: ['sky', 'lemon', 'blush', 'porcelain'],
  render,
};

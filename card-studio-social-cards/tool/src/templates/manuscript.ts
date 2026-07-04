import { h, text } from '../h';
import { fitBodySize, richTextBlock } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { displayFamily } from './shared';

/**
 * Manuscript — 稿纸风短文卡。Paper background with ruled lines and a margin
 * rule, serif body with underline-style ==keyword== emphasis. The literary
 * cousin of `note` for essays, book excerpts, and observations.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, w, h: hh, aspect } = ctx;
  const pad = u(aspect === 'landscape' ? 76 : 96);
  const marginX = pad + u(44);
  const serif = displayFamily(ctx);
  const main = c.body ?? c.title ?? '';
  const fs = fitBodySize(ctx, main, { widthFrac: 0.78, heightFrac: 0.5, max: 68, lineHeight: 1.8 });
  const lineGap = Math.round(fs * 1.8);
  const textTop = pad + u(120);

  // ruled lines sharing the text rhythm: one line under each row of glyphs
  const rules: VNode[] = [];
  for (let y = textTop + lineGap; y < hh - pad - u(70); y += lineGap) {
    rules.push(h('div', { position: 'absolute', left: pad, right: pad, top: y, height: 1, backgroundColor: t.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(33,28,21,0.08)' }));
  }

  return h(
    'div',
    {
      width: w,
      height: hh,
      backgroundColor: t.bg,
      ...(t.bgLayers ? { backgroundImage: t.bgLayers.join(', ') } : {}),
      flexDirection: 'column',
      position: 'relative',
      padding: pad,
    },
    ...rules,
    // margin rule
    h('div', { position: 'absolute', left: marginX - u(26), top: pad, bottom: pad, width: 1.5, backgroundColor: `${t.brand}66` }),
    h(
      'div',
      { justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: marginX - pad },
      text((c.eyebrow ?? ctx.b.name).toUpperCase(), {
        fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
        fontSize: u(21),
        fontWeight: 700,
        letterSpacing: ctx.zh ? u(6) : u(4),
        color: t.brand,
      }),
      c.date ? text(c.date, { fontFamily: t.fontMono, fontSize: u(19), color: t.muted }) : null
    ),
    h(
      'div',
      { flexDirection: 'column', flex: 1, justifyContent: 'flex-start', paddingLeft: marginX - pad, paddingTop: textTop - pad - u(58), gap: u(36) },
      richTextBlock(ctx, main, {
        fontSize: fs,
        fontFamily: serif,
        fontWeight: ctx.zh ? 500 : 500,
        color: t.text,
        lineHeight: 1.8,
        highlightStyle: 'underline',
        maxWidth: '94%',
      }),
      c.attribution
        ? h(
            'div',
            { alignItems: 'center', gap: u(14), alignSelf: 'flex-end', marginRight: u(20) },
            h('div', { width: u(40), height: 1.5, backgroundColor: t.brand }),
            text(c.attribution, { fontFamily: serif, fontSize: u(24), fontWeight: 500, color: t.muted })
          )
        : null
    ),
    h(
      'div',
      { justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: marginX - pad },
      text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(20), fontWeight: 700, color: t.brand, letterSpacing: u(1), opacity: 0.75 }),
      c.page
        ? text(`No. ${String(c.page.index).padStart(2, '0')}`, { fontFamily: t.fontMono, fontSize: u(20), color: t.muted, letterSpacing: u(2) })
        : null
    )
  );
}

export const manuscript: TemplateDef = {
  id: 'manuscript',
  label: 'Manuscript',
  description: '稿纸风短文卡 — ruled paper, serif body, underline ==emphasis==. For essays, excerpts, and quiet observations.',
  themes: ['porcelain', 'botanical'],
  render,
};

import { h, text } from '../h';
import { plainText } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';

/**
 * Receipt — 小票卡。A thermal-paper receipt: mono type, dashed rules,
 * itemized rows, a TOTAL line, and a barcode. Playful, screenshot-bait
 * format for lists, weekly recaps, and "成本核算" content.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, w, h: hh, aspect } = ctx;
  const paperInk = '#26241f';
  const paperMuted = '#8a8577';
  const zhMono = ctx.zh ? 'Noto Sans SC' : t.fontMono;
  const paperW = aspect === 'landscape' ? '52%' : '78%';

  const dashed = (m = 18) =>
    h('div', { width: '100%', borderTop: `2px dashed ${paperInk}33`, marginTop: u(m), marginBottom: u(m) });

  const row = (left: string, right: string, bold = false, big = false) =>
    h(
      'div',
      { justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: u(16) },
      text(left, {
        fontFamily: zhMono,
        fontSize: u(big ? 30 : 23),
        fontWeight: bold ? 700 : 400,
        color: paperInk,
        lineClamp: 1,
        maxWidth: '72%',
      }),
      text(right, { fontFamily: t.fontMono, fontSize: u(big ? 34 : 23), fontWeight: bold ? 700 : 400, color: paperInk })
    );

  const items: VNode[] = [];
  if (c.stats && c.stats.length > 0) {
    for (const st of c.stats.slice(0, 7)) items.push(row(st.label, st.value));
  } else if (c.bullets && c.bullets.length > 0) {
    c.bullets.slice(0, 7).forEach((b, i) => items.push(row(`${String(i + 1).padStart(2, '0')}  ${plainText(b)}`, '✓')));
  }

  const seed = [...plainText(c.title ?? 'receipt')].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const bars: VNode[] = [];
  for (let i = 0; i < 34; i++) {
    bars.push(h('div', { width: u(2 + ((seed >> (i % 24)) % 3) * 2), height: u(46), backgroundColor: paperInk, flexShrink: 0 }));
  }

  return h(
    'div',
    {
      width: w,
      height: hh,
      backgroundColor: t.bg,
      ...(t.bgLayers ? { backgroundImage: t.bgLayers.join(', ') } : {}),
      alignItems: 'center',
      justifyContent: 'center',
    },
    h(
      'div',
      {
        width: paperW,
        maxHeight: '88%',
        backgroundColor: '#fbfaf4',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${u(52)}px ${u(44)}px`,
        transform: 'rotate(1.2deg)',
        boxShadow: '0 26px 70px rgba(0,0,0,0.28)',
        overflow: 'hidden',
      },
      text(ctx.b.name.toUpperCase(), { fontFamily: t.fontMono, fontSize: u(30), fontWeight: 700, color: paperInk, letterSpacing: u(4) }),
      text(`* * * ${(c.eyebrow ?? 'RECEIPT').toUpperCase()} * * *`, {
        fontFamily: ctx.zh && c.eyebrow ? 'Noto Sans SC' : t.fontMono,
        fontSize: u(19),
        fontWeight: 400,
        color: paperMuted,
        letterSpacing: u(2),
        marginTop: u(10),
      }),
      c.date
        ? text(c.date, { fontFamily: t.fontMono, fontSize: u(18), color: paperMuted, marginTop: u(8) })
        : null,
      dashed(),
      c.title
        ? text(plainText(c.title), {
            fontFamily: zhMono,
            fontSize: u(34),
            fontWeight: 700,
            color: paperInk,
            lineHeight: 1.3,
            lineClamp: 2,
            textAlign: 'center',
            marginBottom: u(items.length ? 18 : 0),
          })
        : null,
      items.length > 0 ? h('div', { flexDirection: 'column', gap: u(14), width: '100%' }, ...items) : null,
      dashed(),
      c.badge
        ? row(ctx.zh ? '合计 TOTAL' : 'TOTAL', c.badge, true, true)
        : row(ctx.zh ? '合计 TOTAL' : 'TOTAL', c.stats || c.bullets ? String((c.stats ?? c.bullets ?? []).length).padStart(2, '0') : '01', true, true),
      dashed(),
      h('div', { alignItems: 'center', gap: u(3), marginTop: u(4) }, ...bars),
      text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 700, color: paperInk, letterSpacing: u(2), marginTop: u(14) }),
      text(ctx.zh ? '— 感谢惠顾 THANK YOU —' : '— THANK YOU —', {
        fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
        fontSize: u(17),
        color: paperMuted,
        letterSpacing: u(2),
        marginTop: u(8),
      })
    )
  );
}

export const receipt: TemplateDef = {
  id: 'receipt',
  label: 'Receipt',
  description: '小票卡 — thermal receipt with itemized rows, TOTAL line, and barcode. For lists, recaps, and playful cost breakdowns.',
  themes: ['carbon', 'swiss', 'midnight', 'blush'],
  render,
};

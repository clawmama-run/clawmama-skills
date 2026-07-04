import { h, text } from '../h';
import { plainText } from '../rich';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { sansFamily, titleSize } from './shared';

function hashCode(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}

/** Deterministic barcode strip derived from the title. */
function barcode(ctx: TemplateContext, count: number, height: number, color: string): VNode {
  const seed = hashCode(plainText(ctx.c.title ?? ctx.b.name));
  const bars: VNode[] = [];
  for (let i = 0; i < count; i++) {
    const v = (seed >> (i % 27)) ^ (seed * (i + 3));
    bars.push(h('div', { width: ctx.u(2 + (Math.abs(v) % 3) * 2.4), height, backgroundColor: color, flexShrink: 0 }));
  }
  return h('div', { alignItems: 'center', gap: ctx.u(3.4) }, ...bars);
}

/**
 * Ticket — 票根卡。Perforated ticket with notches, meta rows, and a real
 * barcode stub. For events, launches, releases, and 日签-style passes.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, w, h: hh, aspect } = ctx;
  const family = sansFamily(ctx);
  const landscape = aspect === 'landscape';
  const ink = t.text;
  const paper = t.surface;

  const tFs = titleSize(ctx, c.title ?? '', landscape ? 58 : 64);
  const notch = (side: 'left' | 'right' | 'top' | 'bottom', pos: Record<string, unknown>) =>
    h('div', {
      position: 'absolute',
      width: u(44),
      height: u(44),
      borderRadius: 999,
      backgroundColor: t.bg,
      ...pos,
    });

  const metaPairs: { label: string; value: string }[] = [];
  if (c.date) metaPairs.push({ label: ctx.zh ? '日期 DATE' : 'DATE', value: c.date });
  if (c.stats) for (const st of c.stats.slice(0, 3)) metaPairs.push({ label: st.label, value: st.value });
  if (metaPairs.length === 0) metaPairs.push({ label: ctx.zh ? '入口 VIA' : 'VIA', value: c.footer ?? ctx.b.domain });

  const mainSection = h(
    'div',
    { flexDirection: 'column', flex: 1, padding: u(landscape ? 56 : 68), justifyContent: 'space-between' },
    h(
      'div',
      { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
      text((c.eyebrow ?? 'ADMIT ONE').toUpperCase(), {
        fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
        fontSize: u(21),
        fontWeight: 700,
        letterSpacing: ctx.zh ? u(6) : u(4.5),
        color: t.brand,
      }),
      c.badge
        ? h(
            'div',
            { border: `1.5px solid ${ink}`, borderRadius: u(8), padding: `${u(5)}px ${u(12)}px` },
            text(c.badge, { fontFamily: t.fontMono, fontSize: u(18), fontWeight: 700, color: ink, letterSpacing: u(1) })
          )
        : null
    ),
    h(
      'div',
      { flexDirection: 'column', gap: u(20), flex: 1, justifyContent: 'center' },
      text(c.title ?? '', {
        fontFamily: family,
        fontSize: tFs,
        fontWeight: 900,
        lineHeight: 1.14,
        letterSpacing: ctx.zh ? 0 : -1,
        color: ink,
        lineClamp: 3,
      }),
      c.subtitle
        ? text(c.subtitle, { fontFamily: family, fontSize: u(26), fontWeight: 400, lineHeight: 1.55, color: t.muted, lineClamp: 3, maxWidth: '92%' })
        : null
    ),
    h(
      'div',
      { flexDirection: 'column', gap: u(12), width: '100%' },
      ...metaPairs.map((m) =>
        h(
          'div',
          { justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: `1px dashed ${t.surfaceBorder}`, paddingTop: u(12) },
          text(m.label.toUpperCase(), { fontFamily: t.fontMono, fontSize: u(17), fontWeight: 400, color: t.muted, letterSpacing: u(2) }),
          text(m.value, { fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono, fontSize: u(20), fontWeight: 700, color: ink })
        )
      )
    )
  );

  const stubSection = landscape
    ? h(
        'div',
        {
          width: '27%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: u(48),
          borderLeft: `2.5px dashed ${t.surfaceBorder}`,
          flexShrink: 0,
        },
        text((c.eyebrow ?? 'ADMIT ONE').toUpperCase(), {
          fontFamily: t.fontMono,
          fontSize: u(16),
          fontWeight: 700,
          letterSpacing: u(3),
          color: t.muted,
        }),
        h('div', { transform: 'rotate(90deg)' }, barcode(ctx, 26, u(52), ink)),
        text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(16), fontWeight: 700, color: t.brand, letterSpacing: u(1) })
      )
    : h(
        'div',
        {
          flexDirection: 'column',
          alignItems: 'center',
          gap: u(20),
          padding: `${u(40)}px ${u(68)}px`,
          flexShrink: 0,
        },
        barcode(ctx, 42, u(64), ink),
        h(
          'div',
          { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
          text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 700, color: t.brand, letterSpacing: u(1.5) }),
          c.page
            ? text(`NO. ${String(c.page.index).padStart(3, '0')}`, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 400, color: t.muted, letterSpacing: u(2) })
            : null
        )
      );

  // horizontal perforation row: punched notches + dashed rule
  const perforation = h(
    'div',
    { alignItems: 'center', width: '100%', height: u(44), flexShrink: 0 },
    h('div', { width: u(22), height: u(44), borderTopRightRadius: 999, borderBottomRightRadius: 999, backgroundColor: t.bg, marginLeft: u(-1) }),
    h('div', { flex: 1, borderTop: `2.5px dashed ${t.surfaceBorder}`, height: 0, margin: `0 ${u(18)}px` }),
    h('div', { width: u(22), height: u(44), borderTopLeftRadius: 999, borderBottomLeftRadius: 999, backgroundColor: t.bg, marginRight: u(-1) })
  );
  void notch;

  return h(
    'div',
    {
      width: w,
      height: hh,
      backgroundColor: t.bg,
      ...(t.bgLayers ? { backgroundImage: t.bgLayers.join(', ') } : {}),
      alignItems: 'center',
      justifyContent: 'center',
      padding: u(56),
    },
    h(
      'div',
      {
        flexDirection: landscape ? 'row' : 'column',
        width: '100%',
        height: '100%',
        backgroundColor: paper,
        borderRadius: u(30),
        border: `1.5px solid ${t.surfaceBorder}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
        position: 'relative',
        overflow: 'hidden',
      },
      mainSection,
      ...(landscape ? [] : [perforation]),
      stubSection
    )
  );
}

export const ticket: TemplateDef = {
  id: 'ticket',
  label: 'Ticket',
  description: '票根卡 — perforated stub, meta rows, deterministic barcode. For events, releases, and pass-style announcements.',
  themes: ['porcelain', 'swiss', 'noir', 'sky'],
  render,
};

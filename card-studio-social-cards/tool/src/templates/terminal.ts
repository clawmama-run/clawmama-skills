import { h, text } from '../h';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { canvas, sansFamily, sceneOf, titleSize } from './shared';

/**
 * Terminal — a macOS-style terminal window. Mono prompts, phosphor accents.
 * Built for dev content: changelogs, tips, CLI features.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, aspect } = ctx;
  const scene = sceneOf(c);
  const landscape = aspect === 'landscape';

  const dot = (color: string) => h('div', { width: u(15), height: u(15), borderRadius: 999, backgroundColor: color });
  const header = h(
    'div',
    {
      alignItems: 'center',
      gap: u(10),
      padding: `${u(20)}px ${u(28)}px`,
      borderBottom: `1px solid ${t.surfaceBorder}`,
      width: '100%',
    },
    dot('#ff5f57'),
    dot('#febc2e'),
    dot('#28c840'),
    h(
      'div',
      { flex: 1, justifyContent: 'center' },
      text(c.footer ?? `${ctx.b.name.toLowerCase()} — zsh`, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 400, color: t.muted })
    ),
    h('div', { width: u(95) })
  );

  const prompt = (cmd: string) =>
    h(
      'div',
      { alignItems: 'center', gap: u(14) },
      text('❯', { fontFamily: t.fontMono, fontSize: u(24), fontWeight: 700, color: t.brand }),
      text(cmd, { fontFamily: t.fontMono, fontSize: u(23), fontWeight: 400, color: t.brand2, letterSpacing: 0 })
    );

  const titleFs = titleSize(ctx, c.title ?? c.quote ?? '', landscape ? 54 : 66);
  const kids: (VNode | null)[] = [
    c.eyebrow ? prompt(ctx.zh ? c.eyebrow : c.eyebrow.toLowerCase().replace(/\s+/g, '-')) : null,
    c.title
      ? text(c.title, {
          fontFamily: sansFamily(ctx),
          fontSize: titleFs,
          fontWeight: ctx.zh ? 900 : 800,
          lineHeight: 1.1,
          letterSpacing: ctx.zh ? 0 : -titleFs * 0.025,
          color: t.text,
          lineClamp: landscape ? 2 : 4,
          marginTop: u(20),
        })
      : null,
    c.subtitle
      ? text(c.subtitle, {
          fontFamily: sansFamily(ctx),
          fontSize: u(27),
          fontWeight: 400,
          lineHeight: 1.55,
          color: t.muted,
          lineClamp: 3,
          marginTop: u(20),
          maxWidth: '94%',
        })
      : null,
  ];

  if (scene === 'list' && c.bullets) {
    const max = { landscape: 4, square: 5, portrait: 6, tall: 7 }[aspect];
    kids.push(
      h(
        'div',
        { flexDirection: 'column', gap: u(16), marginTop: u(30) },
        ...c.bullets.slice(0, max).map((b) =>
          h(
            'div',
            { alignItems: 'flex-start', gap: u(14) },
            text('+', { fontFamily: t.fontMono, fontSize: u(24), fontWeight: 700, color: t.brand, marginTop: u(1) }),
            text(b, {
              fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
              fontSize: u(23),
              fontWeight: ctx.zh ? 500 : 400,
              lineHeight: 1.5,
              color: t.text,
              lineClamp: 2,
              maxWidth: '94%',
            })
          )
        )
      )
    );
  } else if (scene === 'stats' && c.stats) {
    kids.push(
      h(
        'div',
        { gap: u(38), marginTop: u(34), flexWrap: 'wrap' },
        ...c.stats.slice(0, 3).map((sItem) =>
          h(
            'div',
            { flexDirection: 'column', gap: u(4) },
            text(sItem.value, { fontFamily: t.fontMono, fontSize: u(52), fontWeight: 700, color: t.brand }),
            text(sItem.label, { fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono, fontSize: u(20), fontWeight: 400, color: t.muted })
          )
        )
      )
    );
  } else if (scene === 'quote' && c.quote) {
    kids.push(
      h(
        'div',
        { flexDirection: 'column', gap: u(10), marginTop: u(28), borderLeft: `3px solid ${t.brand}`, paddingLeft: u(24) },
        text(c.quote, {
          fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
          fontSize: u(30),
          fontWeight: ctx.zh ? 500 : 400,
          lineHeight: 1.55,
          color: t.text,
          lineClamp: 6,
        }),
        c.attribution ? text(`# ${c.attribution}`, { fontFamily: t.fontMono, fontSize: u(21), color: t.muted, marginTop: u(8) }) : null
      )
    );
  }

  const statusItems: VNode[] = [
    text(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 700, color: t.brand }),
  ];
  if (c.date) statusItems.push(text(c.date, { fontFamily: t.fontMono, fontSize: u(19), color: t.muted }));
  const rightItems: VNode[] = [];
  if (c.badge) rightItems.push(text(c.badge, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 700, color: t.brand2 }));
  if (c.page) rightItems.push(text(`${c.page.index}:${c.page.count}`, { fontFamily: t.fontMono, fontSize: u(19), color: t.muted }));

  return canvas(
    ctx,
    { padding: u(aspect === 'tall' ? 64 : 44), justifyContent: 'center' },
    h(
      'div',
      {
        flexDirection: 'column',
        width: '100%',
        flex: 1,
        backgroundColor: t.surface,
        border: `1.5px solid ${t.surfaceBorder}`,
        borderRadius: u(22),
        overflow: 'hidden',
        boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
      },
      header,
      h(
        'div',
        {
          flexDirection: 'column',
          flex: 1,
          padding: `${u(36)}px ${u(48)}px`,
          justifyContent: landscape ? 'flex-start' : 'center',
        },
        ...kids.filter((x): x is VNode => x != null)
      ),
      h(
        'div',
        {
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${u(16)}px ${u(28)}px`,
          borderTop: `1px solid ${t.surfaceBorder}`,
          backgroundColor: 'rgba(255,255,255,0.03)',
          width: '100%',
        },
        h('div', { alignItems: 'center', gap: u(22) }, ...statusItems),
        h('div', { alignItems: 'center', gap: u(22) }, ...rightItems)
      )
    )
  );
}

export const terminal: TemplateDef = {
  id: 'terminal',
  label: 'Terminal',
  description: 'macOS terminal window — mono prompts, phosphor green. For changelogs, dev tips, CLI features.',
  themes: ['carbon', 'ember'],
  render,
};

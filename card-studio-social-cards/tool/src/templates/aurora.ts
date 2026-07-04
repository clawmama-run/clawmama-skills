import { h, text } from '../h';
import type { TemplateContext, TemplateDef, VNode } from '../types';
import { brandRow, canvas, footerRow, sansFamily, sceneOf, titleSize } from './shared';

/**
 * Aurora — spectral gradient glow with a glass panel and gradient headline.
 * Built for launches, milestones, and quotes that should feel big.
 */
function render(ctx: TemplateContext): VNode {
  const { c, t, u, aspect } = ctx;
  const scene = sceneOf(c);
  const landscape = aspect === 'landscape';
  const pad = u(aspect === 'tall' ? 88 : landscape ? 56 : 72);

  const gradientText = (value: string, fs: number, weight = 800, clamp = 4): VNode =>
    text(value, {
      fontFamily: sansFamily(ctx),
      fontSize: fs,
      fontWeight: ctx.zh ? 900 : weight,
      lineHeight: 1.1,
      letterSpacing: ctx.zh ? 0 : -fs * 0.03,
      backgroundImage: `linear-gradient(135deg, ${t.text} 20%, ${t.brand2} 60%, ${t.brand} 95%)`,
      backgroundClip: 'text',
      color: 'transparent',
      lineClamp: clamp,
    });

  const chips = (items: string[]): VNode =>
    h(
      'div',
      { flexWrap: 'wrap', gap: u(14), marginTop: u(34), maxWidth: landscape ? '80%' : '100%' },
      ...items.slice(0, 6).map((b) =>
        h(
          'div',
          {
            alignItems: 'center',
            gap: u(10),
            border: `1px solid ${t.surfaceBorder}`,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 999,
            padding: `${u(11)}px ${u(20)}px`,
          },
          h('div', { width: u(8), height: u(8), borderRadius: 999, backgroundColor: t.brand2 }),
          text(b, {
            fontFamily: sansFamily(ctx),
            fontSize: u(22),
            fontWeight: 500,
            color: t.text,
            lineClamp: 1,
            maxWidth: u(560),
          })
        )
      )
    );

  let content: (VNode | null)[];
  if (scene === 'quote' && c.quote) {
    const qFs = titleSize(ctx, c.quote, landscape ? 54 : 62);
    content = [
      gradientText(c.quote, qFs, 700, 6),
      c.attribution
        ? h(
            'div',
            { alignItems: 'center', gap: u(14), marginTop: u(36) },
            h('div', { width: u(40), height: 2, backgroundColor: t.brand }),
            text(c.attribution, { fontFamily: sansFamily(ctx), fontSize: u(23), fontWeight: 600, color: t.muted })
          )
        : null,
    ];
  } else {
    const hasExtras = Boolean(c.subtitle && (c.stats?.length || c.bullets?.length));
    const tFs = titleSize(ctx, c.title ?? '', landscape ? (hasExtras ? 54 : 66) : 82);
    content = [
      c.eyebrow
        ? text(ctx.zh ? c.eyebrow : c.eyebrow.toUpperCase(), {
            fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
            fontSize: u(21),
            fontWeight: 700,
            letterSpacing: ctx.zh ? u(5) : u(4),
            color: t.brand2,
            marginBottom: u(24),
          })
        : null,
      gradientText(c.title ?? '', tFs),
      c.subtitle
        ? text(c.subtitle, {
            fontFamily: sansFamily(ctx),
            fontSize: u(29),
            fontWeight: 400,
            lineHeight: 1.55,
            color: t.muted,
            lineClamp: landscape ? 2 : 3,
            marginTop: u(20),
            maxWidth: landscape ? '72%' : '96%',
          })
        : null,
      scene === 'list' && c.bullets ? chips(c.bullets) : null,
      scene === 'stats' && c.stats
        ? h(
            'div',
            { gap: u(16), marginTop: u(28), flexWrap: 'wrap' },
            ...c.stats.slice(0, landscape ? 3 : 4).map((sItem) =>
              h(
                'div',
                {
                  flexDirection: 'column',
                  gap: u(6),
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${t.surfaceBorder}`,
                  borderRadius: u(20),
                  padding: `${u(18)}px ${u(26)}px`,
                },
                text(sItem.value, {
                  fontFamily: t.fontSans,
                  fontSize: u(44),
                  fontWeight: 800,
                  letterSpacing: -1,
                  backgroundImage: `linear-gradient(135deg, ${t.brand2}, ${t.brand})`,
                  backgroundClip: 'text',
                  color: 'transparent',
                }),
                text(sItem.label, { fontFamily: sansFamily(ctx), fontSize: u(19), fontWeight: 500, color: t.muted })
              )
            )
          )
        : null,
    ];
  }

  // Thin gradient keyline at the very top of the glass panel.
  const keyline = h('div', {
    position: 'absolute',
    left: u(36),
    right: u(36),
    top: 0,
    height: 2,
    backgroundImage: `linear-gradient(90deg, transparent, ${t.brand2}cc, ${t.brand}cc, transparent)`,
  });

  return canvas(
    ctx,
    { padding: u(30) },
    h(
      'div',
      {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: t.surface,
        border: `1.5px solid ${t.surfaceBorder}`,
        borderRadius: u(38),
        padding: pad,
        position: 'relative',
        overflow: 'hidden',
      },
      keyline,
      h('div', { marginBottom: u(30) }, brandRow(ctx, { color: t.brand, textColor: t.text })),
      h('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, ...content.filter((x): x is VNode => x != null)),
      h('div', { marginTop: u(24) }, footerRow(ctx, { color: t.brand2 }))
    )
  );
}

export const aurora: TemplateDef = {
  id: 'aurora',
  label: 'Aurora',
  description: 'Spectral gradient glow, glass panel, gradient headline. For launches, milestones, and big quotes.',
  themes: ['aurora', 'ember', 'botanical'],
  render,
};

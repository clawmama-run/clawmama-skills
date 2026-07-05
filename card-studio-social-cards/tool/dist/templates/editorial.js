"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorial = void 0;
const h_1 = require("../h");
const shared_1 = require("./shared");
/**
 * Editorial — literary magazine card. Cream paper, serif display type,
 * hairline rules. Built for 小红书 knowledge cards, quotes, and essays.
 */
function render(ctx) {
    const { c, t, u, aspect, w, h: hh } = ctx;
    const scene = (0, shared_1.sceneOf)(c);
    const pad = u(aspect === 'landscape' ? 60 : 84);
    const rule = (thick = 1, color) => (0, h_1.h)('div', { width: '100%', height: thick, backgroundColor: color ?? t.surfaceBorder });
    const topRow = (0, h_1.h)('div', { justifyContent: 'space-between', alignItems: 'center', width: '100%' }, (0, h_1.text)((c.eyebrow ?? ctx.b.name).toUpperCase(), {
        fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontSans,
        fontSize: u(20),
        fontWeight: 700,
        letterSpacing: ctx.zh ? u(6) : u(4),
        color: t.brand,
    }), c.date
        ? (0, h_1.text)(c.date, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 400, color: t.muted, letterSpacing: u(1) })
        : null);
    let center;
    if (scene === 'quote' && c.quote) {
        const qFs = (0, shared_1.titleSize)(ctx, c.quote, aspect === 'landscape' ? 56 : 64);
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, (0, h_1.text)('“', {
            fontFamily: t.fontDisplay,
            fontSize: u(170),
            fontWeight: 500,
            color: t.brand,
            lineHeight: 0.55,
            marginBottom: u(4),
        }), (0, h_1.text)(c.quote, {
            fontFamily: (0, shared_1.displayFamily)(ctx),
            fontSize: qFs,
            fontWeight: ctx.zh ? 900 : 500,
            lineHeight: 1.34,
            color: t.text,
            lineClamp: 6,
        }), c.attribution
            ? (0, h_1.h)('div', { alignItems: 'center', gap: u(14), marginTop: u(40) }, (0, h_1.h)('div', { width: u(44), height: 1.5, backgroundColor: t.brand }), (0, h_1.text)(c.attribution, { fontFamily: (0, shared_1.sansFamily)(ctx), fontSize: u(23), fontWeight: 600, color: t.muted, letterSpacing: u(1) }))
            : null);
    }
    else if (scene === 'list' && c.bullets) {
        const max = { landscape: 3, square: 4, portrait: 5, tall: 6 }[aspect];
        const tFs = (0, shared_1.titleSize)(ctx, c.title ?? '', aspect === 'landscape' ? 48 : 54);
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center', gap: u(6) }, c.title
            ? (0, h_1.text)(c.title, {
                fontFamily: (0, shared_1.displayFamily)(ctx),
                fontSize: tFs,
                fontWeight: 900,
                lineHeight: 1.18,
                color: t.text,
                lineClamp: 2,
                marginBottom: u(22),
            })
            : null, ...c.bullets.slice(0, max).map((b, i) => (0, h_1.h)('div', {
            alignItems: 'flex-start',
            gap: u(22),
            paddingTop: u(17),
            paddingBottom: u(17),
            borderTop: `1px solid ${t.surfaceBorder}`,
        }, (0, h_1.text)(String(i + 1).padStart(2, '0'), {
            fontFamily: t.fontDisplay,
            fontSize: u(30),
            fontWeight: 700,
            color: t.brand,
            marginTop: u(2),
        }), (0, h_1.text)(b, {
            fontFamily: (0, shared_1.sansFamily)(ctx),
            fontSize: u(25),
            fontWeight: 500,
            lineHeight: 1.48,
            color: t.text,
            lineClamp: 2,
            maxWidth: '88%',
        }))));
    }
    else {
        const tFs = (0, shared_1.titleSize)(ctx, c.title ?? '', aspect === 'landscape' ? 64 : 76);
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, (0, h_1.text)(c.title ?? '', {
            fontFamily: (0, shared_1.displayFamily)(ctx),
            fontSize: tFs,
            fontWeight: 900,
            lineHeight: 1.16,
            letterSpacing: ctx.zh ? 0 : -1,
            color: t.text,
            lineClamp: 4,
        }), c.subtitle
            ? (0, h_1.text)(c.subtitle, {
                fontFamily: (0, shared_1.sansFamily)(ctx),
                fontSize: u(28),
                fontWeight: 400,
                lineHeight: 1.6,
                color: t.muted,
                lineClamp: 4,
                marginTop: u(30),
                maxWidth: '90%',
            })
            : null, c.body && (0, shared_1.weightedLen)(c.body) > 0
            ? (0, h_1.text)(c.body, {
                fontFamily: (0, shared_1.sansFamily)(ctx),
                fontSize: u(24),
                fontWeight: 400,
                lineHeight: 1.7,
                color: t.muted,
                lineClamp: aspect === 'landscape' ? 3 : 6,
                marginTop: u(26),
                maxWidth: '92%',
            })
            : null);
    }
    return (0, h_1.h)('div', {
        width: w,
        height: hh,
        backgroundColor: t.bg,
        ...(t.bgLayers ? { backgroundImage: t.bgLayers.join(', ') } : {}),
        padding: u(26),
        flexDirection: 'column',
    }, (0, h_1.h)('div', {
        flex: 1,
        flexDirection: 'column',
        border: `1.5px solid ${t.surfaceBorder}`,
        padding: pad,
        gap: u(22),
        overflow: 'hidden',
    }, topRow, rule(2, t.text), center, rule(1), (0, shared_1.footerRow)(ctx, { color: t.brand, mutedColor: t.muted })));
}
exports.editorial = {
    id: 'editorial',
    label: 'Editorial',
    description: 'Literary magazine card — serif display, hairline rules, numbered lists. Best for 小红书 knowledge cards and quotes.',
    themes: ['porcelain', 'botanical'],
    render,
};
//# sourceMappingURL=editorial.js.map
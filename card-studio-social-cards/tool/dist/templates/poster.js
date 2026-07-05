"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poster = void 0;
const h_1 = require("../h");
const shared_1 = require("./shared");
/**
 * Poster — Swiss/graphic style. Flat paper, heavy black frame, oversized
 * numerals, signal-red accents. Built for listicles, stats, and loud covers.
 */
function render(ctx) {
    const { c, t, u, aspect, w, h: hh } = ctx;
    const scene = (0, shared_1.sceneOf)(c);
    const pad = u(aspect === 'landscape' ? 56 : 76);
    const frame = Math.max(4, u(9));
    const cross = (x, y) => (0, h_1.h)('div', { position: 'absolute', left: x, top: y, width: u(26), height: u(26), alignItems: 'center', justifyContent: 'center' }, (0, h_1.h)('div', { position: 'absolute', width: u(26), height: 2, backgroundColor: t.muted }), (0, h_1.h)('div', { position: 'absolute', width: 2, height: u(26), backgroundColor: t.muted }));
    const topRow = (0, h_1.h)('div', { justifyContent: 'space-between', alignItems: 'center', width: '100%' }, (0, h_1.h)('div', { alignItems: 'center', gap: u(14) }, (0, h_1.h)('div', { width: u(20), height: u(20), backgroundColor: t.brand }), (0, h_1.text)((c.eyebrow ?? ctx.b.name).toUpperCase(), {
        fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
        fontSize: u(21),
        fontWeight: 700,
        letterSpacing: ctx.zh ? u(5) : u(3),
        color: t.text,
    })), c.date ? (0, h_1.text)(c.date, { fontFamily: t.fontMono, fontSize: u(19), color: t.muted, fontWeight: 400 }) : null);
    let center;
    if (scene === 'list' && c.bullets) {
        const max = { landscape: 3, square: 4, portrait: 5, tall: 6 }[aspect];
        const tFs = (0, shared_1.titleSize)(ctx, c.title ?? '', aspect === 'landscape' ? 50 : 62);
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, c.title
            ? (0, h_1.text)((ctx.zh ? c.title : c.title.toUpperCase()), {
                fontFamily: (0, shared_1.sansFamily)(ctx),
                fontSize: tFs,
                fontWeight: ctx.zh ? 900 : 800,
                lineHeight: 1.05,
                letterSpacing: ctx.zh ? 0 : -1,
                color: t.text,
                lineClamp: 2,
                marginBottom: u(30),
            })
            : null, ...c.bullets.slice(0, max).map((b, i) => (0, h_1.h)('div', {
            alignItems: 'center',
            gap: u(26),
            borderTop: `2px solid ${t.text}`,
            paddingTop: u(22),
            paddingBottom: u(22),
        }, (0, h_1.text)(String(i + 1).padStart(2, '0'), {
            fontFamily: t.fontSans,
            fontSize: u(46),
            fontWeight: 800,
            color: t.brand,
            letterSpacing: -1,
        }), (0, h_1.text)(b, {
            fontFamily: (0, shared_1.sansFamily)(ctx),
            fontSize: u(29),
            fontWeight: 600,
            lineHeight: 1.35,
            color: t.text,
            lineClamp: 2,
            maxWidth: '84%',
        }))));
    }
    else if (scene === 'stats' && c.stats) {
        const cols = aspect === 'landscape';
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, c.title
            ? (0, h_1.text)(ctx.zh ? c.title : c.title.toUpperCase(), {
                fontFamily: (0, shared_1.sansFamily)(ctx),
                fontSize: (0, shared_1.titleSize)(ctx, c.title, 52),
                fontWeight: 800,
                lineHeight: 1.1,
                color: t.text,
                lineClamp: 2,
                marginBottom: u(40),
            })
            : null, (0, h_1.h)('div', { flexDirection: cols ? 'row' : 'column', gap: 0, width: '100%' }, ...c.stats.slice(0, cols ? 3 : 4).map((sItem, i) => (0, h_1.h)('div', {
            flexDirection: 'column',
            flex: 1,
            gap: u(8),
            padding: `${u(26)}px ${cols ? u(30) : 0}px`,
            borderTop: `2px solid ${t.text}`,
            ...(cols && i > 0 ? { borderLeft: `2px solid ${t.text}` } : {}),
        }, (0, h_1.text)(sItem.value, { fontFamily: t.fontSans, fontSize: u(76), fontWeight: 800, color: t.brand, letterSpacing: -2, lineHeight: 1 }), (0, h_1.text)(sItem.label, { fontFamily: (0, shared_1.sansFamily)(ctx), fontSize: u(23), fontWeight: 600, color: t.muted })))));
    }
    else if (scene === 'quote' && c.quote) {
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, (0, h_1.h)('div', { width: u(72), height: u(14), backgroundColor: t.brand, marginBottom: u(26) }), (0, h_1.text)(c.quote, {
            fontFamily: (0, shared_1.sansFamily)(ctx),
            fontSize: (0, shared_1.titleSize)(ctx, c.quote, aspect === 'landscape' ? 54 : 62),
            fontWeight: 800,
            lineHeight: 1.24,
            letterSpacing: ctx.zh ? 0 : -1,
            color: t.text,
            lineClamp: 6,
        }), c.attribution
            ? (0, h_1.text)(`— ${c.attribution}`, { fontFamily: t.fontMono, fontSize: u(23), fontWeight: 400, color: t.muted, marginTop: u(34) })
            : null);
    }
    else {
        const tFs = (0, shared_1.titleSize)(ctx, c.title ?? '', aspect === 'landscape' ? 76 : 88);
        center = (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center' }, (0, h_1.h)('div', { width: u(72), height: u(14), backgroundColor: t.brand, marginBottom: u(26) }), (0, h_1.text)(ctx.zh ? (c.title ?? '') : (c.title ?? '').toUpperCase(), {
            fontFamily: (0, shared_1.sansFamily)(ctx),
            fontSize: tFs,
            fontWeight: ctx.zh ? 900 : 800,
            lineHeight: 1.02,
            letterSpacing: ctx.zh ? 0 : -tFs * 0.02,
            color: t.text,
            lineClamp: 4,
        }), c.subtitle
            ? (0, h_1.text)(c.subtitle, {
                fontFamily: (0, shared_1.sansFamily)(ctx),
                fontSize: u(28),
                fontWeight: 500,
                lineHeight: 1.5,
                color: t.muted,
                lineClamp: 3,
                marginTop: u(30),
                maxWidth: '86%',
            })
            : null);
    }
    const pageGhost = c.page
        ? (0, h_1.text)(String(c.page.index).padStart(2, '0'), {
            position: 'absolute',
            right: u(52),
            top: u(10),
            fontFamily: t.fontSans,
            fontSize: u(190),
            fontWeight: 800,
            letterSpacing: -4,
            color: `${t.brand}2e`,
        })
        : null;
    return (0, h_1.h)('div', {
        width: w,
        height: hh,
        backgroundColor: t.bg,
        padding: u(24),
        flexDirection: 'column',
    }, (0, h_1.h)('div', {
        flex: 1,
        flexDirection: 'column',
        border: `${frame}px solid ${t.text}`,
        backgroundColor: t.surface,
        padding: pad,
        gap: u(20),
        position: 'relative',
        overflow: 'hidden',
    }, pageGhost, cross(u(20), '46%'), topRow, center, (0, h_1.h)('div', { borderTop: `${frame}px solid ${t.text}`, paddingTop: u(24), width: '100%', justifyContent: 'space-between', alignItems: 'center' }, (0, h_1.text)(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(21), fontWeight: 700, color: t.text, letterSpacing: u(1) }), (0, h_1.h)('div', { alignItems: 'center', gap: u(12) }, c.badge
        ? (0, h_1.h)('div', { backgroundColor: t.brand, padding: `${u(6)}px ${u(14)}px` }, (0, h_1.text)(c.badge, { fontFamily: t.fontMono, fontSize: u(19), fontWeight: 700, color: t.surface, letterSpacing: u(1) }))
        : null, c.page
        ? (0, h_1.text)(`${c.page.index}/${c.page.count}`, { fontFamily: t.fontMono, fontSize: u(20), fontWeight: 700, color: t.muted })
        : null))));
}
exports.poster = {
    id: 'poster',
    label: 'Poster',
    description: 'Swiss graphic poster — heavy frame, oversized numerals, signal red. For listicles, stats, and loud covers.',
    themes: ['swiss', 'porcelain'],
    render,
};
//# sourceMappingURL=poster.js.map
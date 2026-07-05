"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billboard = void 0;
const h_1 = require("../h");
const rich_1 = require("../rich");
const shared_1 = require("./shared");
/**
 * Billboard — 大字报封面卡。One flat saturated color, giant type, highlighted
 * ==keywords== flip to the accent color. Built for 抖音/TikTok covers and
 * loud single-statement posts.
 */
function render(ctx) {
    const { c, t, u, aspect } = ctx;
    const pad = u(aspect === 'landscape' ? 80 : 100);
    const family = (0, shared_1.sansFamily)(ctx);
    const main = c.body ?? c.title ?? '';
    const fs = (0, rich_1.fitBodySize)(ctx, main, { widthFrac: 0.82, heightFrac: 0.46, max: 140, min: 40, lineHeight: 1.36 });
    return (0, shared_1.canvas)(ctx, { padding: pad, flexDirection: 'column' }, 
    // oversized outline circle, top right
    (0, h_1.h)('div', {
        position: 'absolute',
        right: u(-160),
        top: u(-160),
        width: u(520),
        height: u(520),
        borderRadius: 999,
        border: `2px solid ${t.mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.2)'}`,
    }), (0, h_1.h)('div', {
        position: 'absolute',
        right: u(120),
        bottom: u(150),
        width: u(18),
        height: u(18),
        borderRadius: 999,
        backgroundColor: t.brand,
    }), c.eyebrow
        ? (0, h_1.h)('div', { alignSelf: 'flex-start', backgroundColor: t.brand, padding: `${u(10)}px ${u(20)}px`, borderRadius: u(10) }, (0, h_1.text)(ctx.zh ? c.eyebrow : c.eyebrow.toUpperCase(), {
            fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontMono,
            fontSize: u(24),
            fontWeight: 800,
            letterSpacing: ctx.zh ? u(3) : u(2.5),
            color: t.bg,
        }))
        : null, (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center', gap: u(34) }, (0, rich_1.richTextBlock)(ctx, main, {
        fontSize: fs,
        fontFamily: family,
        fontWeight: 900,
        color: t.text,
        lineHeight: 1.36,
        highlightStyle: 'accent',
    }), c.subtitle
        ? (0, rich_1.richTextBlock)(ctx, c.subtitle, {
            fontSize: Math.round(fs * 0.42),
            fontFamily: family,
            fontWeight: 500,
            color: t.muted,
            lineHeight: 1.55,
        })
        : null), (0, h_1.h)('div', { justifyContent: 'space-between', alignItems: 'center', width: '100%' }, (0, h_1.text)(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(23), fontWeight: 700, color: t.text, letterSpacing: u(1), opacity: 0.8 }), c.page
        ? (0, h_1.text)(`${c.page.index}/${c.page.count}`, { fontFamily: t.fontMono, fontSize: u(24), fontWeight: 700, color: t.brand })
        : c.badge
            ? (0, h_1.text)(c.badge, { fontFamily: t.fontMono, fontSize: u(22), fontWeight: 700, color: t.brand, letterSpacing: u(2) })
            : null));
}
exports.billboard = {
    id: 'billboard',
    label: 'Billboard',
    description: '大字报封面卡 — flat saturated ground, giant type, accent-colored ==keywords==. For 抖音/TikTok covers and loud statements.',
    themes: ['cobalt', 'ember', 'botanical', 'swiss'],
    render,
};
//# sourceMappingURL=billboard.js.map
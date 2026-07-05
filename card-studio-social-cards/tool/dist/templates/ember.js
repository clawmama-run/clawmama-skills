"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ember = void 0;
const h_1 = require("../h");
const shared_1 = require("./shared");
/**
 * Ember — the ClawMama brand card. Dark panel, orange glow, orbital arcs.
 * Default look for OG images and announcements.
 */
function render(ctx) {
    const { c, t, u, aspect } = ctx;
    const scene = (0, shared_1.sceneOf)(c);
    const pad = u(aspect === 'landscape' ? 54 : aspect === 'tall' ? 84 : 72);
    const landscape = aspect === 'landscape';
    const banner = ctx.w / ctx.h > 2;
    const titleFs = (0, shared_1.titleSize)(ctx, c.title ?? c.quote ?? '', landscape ? 62 : undefined);
    const titleNode = c.title
        ? (0, h_1.text)(c.title, {
            fontFamily: (0, shared_1.displayFamily)(ctx),
            fontSize: titleFs,
            fontWeight: ctx.zh ? 900 : 800,
            lineHeight: 1.08,
            letterSpacing: ctx.zh ? 0 : -titleFs * 0.03,
            color: t.text,
            maxWidth: landscape ? '68%' : '100%',
            lineClamp: landscape ? (c.subtitle ? 2 : 3) : 4,
            marginTop: u(20),
        })
        : null;
    const subtitleNode = c.subtitle
        ? (0, h_1.text)(c.subtitle, {
            fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontSans,
            fontSize: u(aspect === 'landscape' ? 27 : 32),
            fontWeight: 400,
            lineHeight: 1.5,
            color: t.muted,
            maxWidth: landscape ? '60%' : '92%',
            lineClamp: landscape ? 2 : 3,
            marginTop: u(16),
        })
        : null;
    let sceneBlock = null;
    if (scene === 'list' && c.bullets) {
        const max = { landscape: 4, square: 5, portrait: 6, tall: 7 }[aspect];
        sceneBlock = (0, h_1.h)('div', { flexDirection: 'column', gap: u(20), marginTop: u(34), maxWidth: landscape ? '66%' : '100%' }, ...c.bullets.slice(0, max).map((b) => (0, h_1.h)('div', { alignItems: 'flex-start', gap: u(16) }, (0, h_1.h)('div', {
            width: u(12),
            height: u(12),
            borderRadius: 3,
            backgroundColor: t.brand,
            marginTop: u(12),
            transform: 'rotate(45deg)',
        }), (0, h_1.text)(b, {
            fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontSans,
            fontSize: u(29),
            fontWeight: 500,
            lineHeight: 1.45,
            color: t.text,
            lineClamp: 2,
            maxWidth: '94%',
        }))));
    }
    else if (scene === 'stats' && c.stats) {
        sceneBlock = (0, h_1.h)('div', { gap: u(20), marginTop: u(38), flexWrap: 'wrap' }, ...c.stats.slice(0, aspect === 'landscape' ? 3 : 4).map((sItem) => (0, h_1.h)('div', {
            flexDirection: 'column',
            gap: u(6),
            border: `1px solid ${t.surfaceBorder}`,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: u(20),
            padding: `${u(24)}px ${u(30)}px`,
        }, (0, h_1.text)(sItem.value, { fontFamily: t.fontSans, fontSize: u(52), fontWeight: 800, color: t.brand, letterSpacing: -1 }), (0, h_1.text)(sItem.label, { fontFamily: ctx.zh ? 'Noto Sans SC' : t.fontSans, fontSize: u(21), fontWeight: 500, color: t.muted }))));
    }
    else if (scene === 'quote' && c.quote) {
        const qFs = (0, shared_1.titleSize)(ctx, c.quote, aspect === 'landscape' ? 52 : 58);
        sceneBlock = (0, h_1.h)('div', { flexDirection: 'column', marginTop: u(10), maxWidth: landscape ? '78%' : '100%' }, (0, h_1.text)('“', { fontFamily: t.fontDisplay, fontSize: u(140), fontWeight: 800, color: t.brand, lineHeight: 0.6, marginTop: u(40) }), (0, h_1.text)(c.quote, {
            fontFamily: (0, shared_1.displayFamily)(ctx),
            fontSize: qFs,
            fontWeight: ctx.zh ? 700 : 700,
            lineHeight: 1.28,
            letterSpacing: ctx.zh ? 0 : -0.5,
            color: t.text,
            lineClamp: 5,
        }), c.attribution
            ? (0, h_1.text)(`— ${c.attribution}`, { fontFamily: t.fontMono, fontSize: u(24), fontWeight: 400, color: t.brand2, marginTop: u(28) })
            : null);
    }
    // Panel with everything inside; arcs live on the canvas behind it.
    return (0, shared_1.canvas)(ctx, { padding: u(22) }, (0, shared_1.orbitalArcs)(ctx, {
        size: u(aspect === 'landscape' ? 460 : 520),
        top: aspect === 'landscape' ? u(60) : u(-40),
        opacity: 0.9,
    }), (0, h_1.h)('div', {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: `${t.surface}e8`,
        border: `1.5px solid ${t.surfaceBorder}`,
        borderRadius: u(34),
        padding: pad,
        position: 'relative',
        overflow: 'hidden',
    }, (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: landscape && !banner ? 'flex-start' : 'center' }, (0, h_1.h)('div', { marginBottom: u(banner ? 22 : landscape ? 30 : 44) }, (0, shared_1.brandRow)(ctx)), c.eyebrow ? (0, shared_1.eyebrowPill)(ctx, c.eyebrow) : null, titleNode, subtitleNode, sceneBlock), (0, h_1.h)('div', { marginTop: u(22) }, (0, shared_1.footerRow)(ctx, { color: t.brand2 }))));
}
exports.ember = {
    id: 'ember',
    label: 'Ember',
    description: 'ClawMama brand dark card — glow, orbital arcs, mono eyebrow. Default for OG and announcements.',
    themes: ['ember', 'carbon', 'aurora'],
    render,
};
//# sourceMappingURL=ember.js.map
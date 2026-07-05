"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.almanac = void 0;
const h_1 = require("../h");
const rich_1 = require("../rich");
const shared_1 = require("./shared");
const WEEKDAYS_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const WEEKDAYS_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
/**
 * Almanac — 日签卡。Big date numeral, weekday column, a daily line with
 * marker highlights, optional 宜/忌 chips from bullets. The daily-post
 * workhorse for 小红书 and WeChat moments.
 */
function render(ctx) {
    const { c, t, u, aspect } = ctx;
    const pad = u(aspect === 'landscape' ? 72 : 92);
    const serif = (0, shared_1.displayFamily)(ctx);
    const sans = (0, shared_1.sansFamily)(ctx);
    const parsed = c.date ? new Date(c.date) : new Date();
    const valid = !Number.isNaN(parsed.getTime());
    const day = valid ? parsed.getDate() : 1;
    const month = valid ? parsed.getMonth() + 1 : 1;
    const year = valid ? parsed.getFullYear() : 2026;
    const weekday = valid ? (ctx.zh ? WEEKDAYS_ZH[parsed.getDay()] : WEEKDAYS_EN[parsed.getDay()]) : '';
    const main = c.body ?? c.quote ?? c.title ?? '';
    const fs = (0, rich_1.fitBodySize)(ctx, main, { widthFrac: 0.8, heightFrac: 0.26, max: 56, lineHeight: 1.75 });
    const chip = (label, value, solid) => (0, h_1.h)('div', { alignItems: 'center', gap: u(14), maxWidth: '100%' }, (0, h_1.h)('div', {
        width: u(46),
        height: u(46),
        borderRadius: u(10),
        backgroundColor: solid ? t.brand : 'transparent',
        border: `1.5px solid ${t.brand}`,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    }, (0, h_1.text)(label, { fontFamily: 'Noto Sans SC', fontSize: u(24), fontWeight: 700, color: solid ? t.surface : t.brand })), (0, h_1.text)(value, { fontFamily: sans, fontSize: u(23), fontWeight: 500, color: t.text, lineClamp: 1 }));
    return (0, h_1.h)('div', {
        width: ctx.w,
        height: ctx.h,
        backgroundColor: t.bg,
        ...(t.bgLayers ? { backgroundImage: t.bgLayers.join(', ') } : {}),
        flexDirection: 'column',
        padding: pad,
        gap: u(30),
    }, 
    // date block
    (0, h_1.h)('div', { alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }, (0, h_1.h)('div', { alignItems: 'flex-end', gap: u(26) }, (0, h_1.text)(String(day).padStart(2, '0'), {
        fontFamily: t.fontDisplay,
        fontSize: u(190),
        fontWeight: 700,
        lineHeight: 0.82,
        letterSpacing: -u(6),
        color: t.text,
    }), (0, h_1.h)('div', { flexDirection: 'column', gap: u(8), paddingBottom: u(8) }, (0, h_1.text)(ctx.zh ? `${year} 年 ${month} 月` : `${year} · ${String(month).padStart(2, '0')}`, {
        fontFamily: sans,
        fontSize: u(24),
        fontWeight: 600,
        color: t.muted,
    }), (0, h_1.text)(weekday ?? '', { fontFamily: sans, fontSize: u(30), fontWeight: 800, color: t.brand, letterSpacing: ctx.zh ? u(3) : u(2) }), c.eyebrow
        ? (0, h_1.text)(c.eyebrow, { fontFamily: sans, fontSize: u(21), fontWeight: 500, color: t.muted, letterSpacing: u(2) })
        : null)), c.badge
        ? (0, h_1.text)(c.badge, { fontFamily: t.fontMono, fontSize: u(20), fontWeight: 700, color: t.muted, letterSpacing: u(2), paddingBottom: u(10) })
        : null), (0, h_1.h)('div', { width: '100%', height: 1.5, backgroundColor: t.surfaceBorder }), 
    // daily line
    (0, h_1.h)('div', { flexDirection: 'column', flex: 1, justifyContent: 'center', gap: u(30) }, (0, rich_1.richTextBlock)(ctx, main, {
        fontSize: fs,
        fontFamily: serif,
        fontWeight: ctx.zh ? 500 : 500,
        color: t.text,
        lineHeight: 1.8,
        highlightStyle: 'underline',
        maxWidth: '94%',
    }), c.attribution
        ? (0, h_1.h)('div', { alignItems: 'center', gap: u(14) }, (0, h_1.h)('div', { width: u(36), height: 1.5, backgroundColor: t.brand }), (0, h_1.text)(c.attribution, { fontFamily: serif, fontSize: u(23), fontWeight: 500, color: t.muted }))
        : null), 
    // 宜/忌 chips from the first two bullets
    c.bullets && c.bullets.length > 0
        ? (0, h_1.h)('div', { flexDirection: 'column', gap: u(16), width: '100%' }, chip(ctx.zh ? '宜' : 'DO', c.bullets[0], true), c.bullets[1] ? chip(ctx.zh ? '忌' : "DON'T", c.bullets[1], false) : null)
        : null, (0, h_1.h)('div', { justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: `1px solid ${t.surfaceBorder}`, paddingTop: u(20) }, (0, h_1.text)(c.footer ?? ctx.b.domain, { fontFamily: t.fontMono, fontSize: u(20), fontWeight: 700, color: t.brand, letterSpacing: u(1) }), c.page
        ? (0, h_1.text)(`${String(c.page.index).padStart(2, '0')} / ${String(c.page.count).padStart(2, '0')}`, { fontFamily: t.fontMono, fontSize: u(19), color: t.muted, letterSpacing: u(2) })
        : null));
}
exports.almanac = {
    id: 'almanac',
    label: 'Almanac',
    description: '日签卡 — big date numeral, weekday, daily line with ==highlights==, 宜/忌 chips. For daily posts and moments covers.',
    themes: ['porcelain', 'sky', 'botanical', 'blush'],
    render,
};
//# sourceMappingURL=almanac.js.map
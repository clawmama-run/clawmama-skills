"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSvg = renderSvg;
exports.renderCard = renderCard;
const satori_1 = __importDefault(require("satori"));
const resvg_js_1 = require("@resvg/resvg-js");
const fonts_1 = require("./fonts");
const brand_1 = require("./brand");
const sticker_1 = require("./sticker");
const presets_1 = require("./presets");
const themes_1 = require("./themes");
const registry_1 = require("./registry");
const shared_1 = require("./templates/shared");
/** Area-based scale factor, 1.0 at the OG baseline (1200x630). */
function scaleFor(w, h) {
    return Math.sqrt(w * h) / Math.sqrt(1200 * 630);
}
async function renderSvg(opts) {
    const template = (0, registry_1.getTemplate)(opts.template);
    const size = opts.preset ? (0, presets_1.getPreset)(opts.preset) : undefined;
    const width = opts.width ?? size?.width;
    const height = opts.height ?? size?.height;
    if (!width || !height)
        throw new Error('Pass a preset id or explicit width/height.');
    const themeId = opts.theme ?? template.themes[0];
    if (!themeId)
        throw new Error(`Template "${template.id}" declares no themes.`);
    const theme = (0, themes_1.getTheme)(themeId);
    const s = scaleFor(width, height);
    const sticker = await (0, sticker_1.resolveSticker)(opts.content.sticker);
    const ctx = {
        c: opts.content,
        t: theme,
        b: (0, brand_1.resolveBrand)(opts.brand),
        ...(sticker ? { sticker } : {}),
        w: width,
        h: height,
        aspect: (0, presets_1.classifyAspect)(width, height),
        s,
        u: (n) => Math.round(n * s * 100) / 100,
        zh: (0, shared_1.isZh)(opts.content),
    };
    const node = template.render(ctx);
    const svg = await (0, satori_1.default)(node, { width, height, fonts: (0, fonts_1.loadFonts)() });
    return { svg, width, height };
}
async function renderCard(opts) {
    const { svg, width } = await renderSvg(opts);
    if (opts.format === 'svg')
        return Buffer.from(svg, 'utf8');
    const scale = opts.scale ?? 1;
    const resvg = new resvg_js_1.Resvg(svg, {
        fitTo: { mode: 'width', value: Math.round(width * scale) },
        font: { loadSystemFonts: false },
    });
    return Buffer.from(resvg.render().asPng());
}
//# sourceMappingURL=render.js.map
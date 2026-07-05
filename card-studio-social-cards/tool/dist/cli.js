#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const presets_1 = require("./presets");
const themes_1 = require("./themes");
const registry_1 = require("./registry");
const render_1 = require("./render");
function parseArgs(argv) {
    const out = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--')) {
            const key = a.slice(2);
            const next = argv[i + 1];
            if (next && !next.startsWith('--')) {
                out[key] = next;
                i++;
            }
            else {
                out[key] = 'true';
            }
        }
        else if (!out['_']) {
            out['_'] = a;
        }
    }
    return out;
}
const args = parseArgs(process.argv.slice(2));
if (args['_'] === 'list' || args['list']) {
    console.log('Templates:');
    for (const t of registry_1.TEMPLATES)
        console.log(`  ${t.id.padEnd(12)} ${t.description} (themes: ${t.themes.join(', ')})`);
    console.log('\nPresets:');
    for (const p of presets_1.PRESETS)
        console.log(`  ${p.id.padEnd(16)} ${String(p.width).padStart(4)}x${String(p.height).padEnd(5)} ${p.platform} — ${p.use}`);
    console.log('\nThemes:');
    for (const t of themes_1.THEMES)
        console.log(`  ${t.id.padEnd(12)} ${t.label}`);
    process.exit(0);
}
if (args['help'] || (!args['template'] && !args['data'] && !args['_'])) {
    console.log(`card-studio — social card and OG image generator

Usage:
  card-studio list
  card-studio --template ember --preset og --title "..." --out card.png
  card-studio --data card.json --out card.png          # content or full spec
  card-studio --data carousel.json --out-dir out/post  # array of specs (batch)

--data accepts three JSON shapes:
  1. plain CardContent      {"title": "...", "bullets": ["a", "b"]}
  2. a full render spec     {"template": "note", "preset": "xhs-cover",
                             "theme": "sky", "brand": {...}, "content": {...}}
  3. an array of specs      [{"name": "01-cover", "template": "billboard", ...},
                             {"name": "02-note", "template": "note", ...}]
     → renders each to <out-dir>/<name|index>.png (carousels, whole posts)
  Spec fields fall back to the matching CLI flags when omitted.

Options:
  --template <id>     ${registry_1.TEMPLATES.map((t) => t.id).join(', ')}
  --preset <id>       Size preset (or --width/--height)
  --theme <id>        Theme; defaults to the template's first theme
  --data <file.json>  See above
  --out <file>        Output path (default out/card.png)
  --out-dir <dir>     Output directory for batch mode (default out/batch)
  --title/--subtitle/--eyebrow/--body/--quote/--attribution/--footer/--badge/--date/--sticker <text>
  --bullets "a|b|c"   Pipe-separated list items
  --stats "97%:uptime|2min:setup"  value:label pairs
  --page "2/5"        Carousel page marker
  --lang zh|en        Forces CJK typography
  --brand-name/--brand-domain <text>, --brand-mark <file.svg>
  --format png|svg    Default png (single render only)
  --scale <n>         PNG pixel multiplier (default 1)

Text fields support ==keyword== highlighting (note/manuscript/billboard/cinema/neon/almanac).`);
    process.exit(0);
}
function cliBrand() {
    const brand = {};
    if (args['brand-name'])
        brand.name = args['brand-name'];
    if (args['brand-domain'])
        brand.domain = args['brand-domain'];
    if (args['brand-mark'])
        brand.markSvg = (0, node_fs_1.readFileSync)(args['brand-mark'], 'utf8').trim();
    return Object.keys(brand).length ? brand : undefined;
}
function cliContent() {
    const content = {};
    for (const key of ['title', 'subtitle', 'eyebrow', 'body', 'quote', 'attribution', 'footer', 'badge', 'date', 'sticker']) {
        if (args[key])
            content[key] = args[key];
    }
    if (args['lang'] === 'zh' || args['lang'] === 'en')
        content.lang = args['lang'];
    if (args['bullets'])
        content.bullets = args['bullets'].split('|').map((s) => s.trim()).filter(Boolean);
    if (args['stats']) {
        content.stats = args['stats'].split('|').map((pair) => {
            const [value = '', label = ''] = pair.split(':');
            return { value: value.trim(), label: label.trim() };
        });
    }
    if (args['page']) {
        const [index = '1', count = '1'] = args['page'].split('/');
        content.page = { index: Number(index), count: Number(count) };
    }
    return content;
}
async function renderSpec(spec, extraContent) {
    const brand = spec.brand ?? cliBrand();
    return (0, render_1.renderCard)({
        template: spec.template ?? args['template'] ?? 'note',
        content: { ...(spec.content ?? {}), ...extraContent },
        ...(spec.preset ?? args['preset'] ? { preset: (spec.preset ?? args['preset']) } : {}),
        ...(spec.width ?? args['width'] ? { width: Number(spec.width ?? args['width']) } : {}),
        ...(spec.height ?? args['height'] ? { height: Number(spec.height ?? args['height']) } : {}),
        ...(spec.theme ?? args['theme'] ? { theme: (spec.theme ?? args['theme']) } : {}),
        ...(brand ? { brand } : {}),
        ...(args['format'] === 'svg' ? { format: 'svg' } : {}),
        ...(args['scale'] ? { scale: Number(args['scale']) } : {}),
    });
}
async function main() {
    // --data: plain content, a full spec, or an array of specs (batch)
    let specs = null;
    let dataContent = {};
    if (args['data']) {
        const parsed = JSON.parse((0, node_fs_1.readFileSync)(args['data'], 'utf8'));
        if (Array.isArray(parsed))
            specs = parsed;
        else if (parsed && typeof parsed === 'object' && 'content' in parsed)
            specs = [parsed];
        else
            dataContent = parsed;
    }
    const cliFields = cliContent();
    if (specs) {
        const outDir = args['out-dir'] ?? 'out/batch';
        (0, node_fs_1.mkdirSync)(outDir, { recursive: true });
        for (let i = 0; i < specs.length; i++) {
            const spec = specs[i];
            const buf = await renderSpec(spec, cliFields);
            const file = (0, node_path_1.join)(outDir, `${spec.name ?? String(i + 1).padStart(2, '0')}.png`);
            (0, node_fs_1.writeFileSync)(file, buf);
            console.log(`wrote ${file} (${(buf.length / 1024).toFixed(0)} KB)`);
        }
        return;
    }
    const out = args['out'] ?? `out/card.${args['format'] === 'svg' ? 'svg' : 'png'}`;
    const buf = await renderSpec({ content: dataContent }, cliFields);
    (0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(out) || '.', { recursive: true });
    (0, node_fs_1.writeFileSync)(out, buf);
    console.log(`wrote ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map
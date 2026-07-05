"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFonts = loadFonts;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const FONT_DIR = (0, node_path_1.join)(__dirname, '..', 'fonts');
let cache = null;
/** Loads every face listed in fonts/manifest.json (run `npm run fonts` first). */
function loadFonts() {
    if (cache)
        return cache;
    let manifest;
    try {
        manifest = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(FONT_DIR, 'manifest.json'), 'utf8'));
    }
    catch {
        throw new Error('fonts/manifest.json not found — run `npm run fonts` in packages/card-studio first.');
    }
    cache = manifest.map((f) => ({
        name: f.family,
        data: (0, node_fs_1.readFileSync)((0, node_path_1.join)(FONT_DIR, f.file)),
        weight: f.weight,
        style: (f.style === 'italic' ? 'italic' : 'normal'),
    }));
    return cache;
}
//# sourceMappingURL=fonts.js.map
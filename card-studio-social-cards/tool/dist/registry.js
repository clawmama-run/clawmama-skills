"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATES = void 0;
exports.getTemplate = getTemplate;
const ember_1 = require("./templates/ember");
const editorial_1 = require("./templates/editorial");
const poster_1 = require("./templates/poster");
const terminal_1 = require("./templates/terminal");
const aurora_1 = require("./templates/aurora");
const note_1 = require("./templates/note");
const manuscript_1 = require("./templates/manuscript");
const billboard_1 = require("./templates/billboard");
const cinema_1 = require("./templates/cinema");
const neon_1 = require("./templates/neon");
const ticket_1 = require("./templates/ticket");
const receipt_1 = require("./templates/receipt");
const almanac_1 = require("./templates/almanac");
exports.TEMPLATES = [ember_1.ember, editorial_1.editorial, poster_1.poster, terminal_1.terminal, aurora_1.aurora, note_1.note, manuscript_1.manuscript, billboard_1.billboard, cinema_1.cinema, neon_1.neon, ticket_1.ticket, receipt_1.receipt, almanac_1.almanac];
function getTemplate(id) {
    const t = exports.TEMPLATES.find((x) => x.id === id);
    if (!t)
        throw new Error(`Unknown template "${id}". Available: ${exports.TEMPLATES.map((x) => x.id).join(', ')}`);
    return t;
}
//# sourceMappingURL=registry.js.map
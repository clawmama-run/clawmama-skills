"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h = h;
exports.text = text;
/** Hyperscript helper: h('div', { display: 'flex' }, child, child). */
function h(type, style = {}, ...children) {
    const props = { style };
    const kids = children.filter((k) => k !== null && k !== undefined && k !== false);
    if (kids.length > 0)
        props.children = kids.length === 1 ? kids[0] : kids;
    // satori requires explicit display:flex on any div with element children
    if (type === 'div' && style['display'] === undefined)
        style['display'] = 'flex';
    return { type, props };
}
function text(value, style = {}) {
    // flexShrink 0: when a column overflows, yoga would otherwise shrink text
    // boxes below their painted height, making lines overlap the next sibling.
    return { type: 'div', props: { style: { display: 'block', flexShrink: 0, ...style }, children: value.replace(/==([^=]+)==/g, '$1') } };
}
//# sourceMappingURL=h.js.map
import type { VChild, VNode } from './types';
/** Hyperscript helper: h('div', { display: 'flex' }, child, child). */
export declare function h(type: string, style?: Record<string, unknown>, ...children: VChild[]): VNode;
export declare function text(value: string, style?: Record<string, unknown>): VNode;
//# sourceMappingURL=h.d.ts.map
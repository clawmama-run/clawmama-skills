import type { VChild, VNode } from './types';

/** Hyperscript helper: h('div', { display: 'flex' }, child, child). */
export function h(type: string, style: Record<string, unknown> = {}, ...children: VChild[]): VNode {
  const props: VNode['props'] = { style };
  const kids = children.filter((k) => k !== null && k !== undefined && k !== false as unknown);
  if (kids.length > 0) props.children = kids.length === 1 ? kids[0] : kids;
  // satori requires explicit display:flex on any div with element children
  if (type === 'div' && style['display'] === undefined) style['display'] = 'flex';
  return { type, props };
}

export function text(value: string, style: Record<string, unknown> = {}): VNode {
  // flexShrink 0: when a column overflows, yoga would otherwise shrink text
  // boxes below their painted height, making lines overlap the next sibling.
  return { type: 'div', props: { style: { display: 'block', flexShrink: 0, ...style }, children: value.replace(/==([^=]+)==/g, '$1') } };
}

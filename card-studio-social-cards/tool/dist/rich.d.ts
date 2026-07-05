import type { TemplateContext, VNode } from './types';
import { CJK_RE } from './templates/shared';
/** A run of text, either plain or ==highlighted==. */
export type RichSegment = {
    text: string;
    highlight: boolean;
};
/** Splits `看到==销量数据==会惊呆` into plain/highlight segments. */
export declare function parseHighlights(source: string): RichSegment[];
export declare function plainText(source: string): string;
/**
 * Body font size that fills the available box: solves
 * `0.5 * weightedLen * fs^2 * lineHeight = availW * availH` and clamps.
 */
export declare function fitBodySize(ctx: TemplateContext, source: string, opts?: {
    widthFrac?: number;
    heightFrac?: number;
    max?: number;
    min?: number;
    lineHeight?: number;
}): number;
export type HighlightStyle = 'marker' | 'accent' | 'underline';
export type RichTextOptions = {
    fontSize: number;
    fontFamily: string;
    fontWeight?: number;
    color: string;
    lineHeight?: number;
    highlightStyle?: HighlightStyle;
    /** Marker/underline color; defaults to theme.highlight or theme.brand. */
    highlightColor?: string;
    /** Text color inside accent highlights. */
    accentColor?: string;
    maxWidth?: number | string;
    /** Center the wrapped lines (cinema/neon captions). */
    align?: 'start' | 'center';
    /** textShadow applied to every token (e.g. a soft neon glow). */
    textShadow?: string;
    /** textShadow for highlighted tokens (stronger glow). */
    accentShadow?: string;
};
/**
 * Wrapping rich-text block with ==keyword== highlighting. satori has no
 * inline layout for mixed spans, so this renders one span per CJK character /
 * latin word inside a flex-wrap row; contiguous highlighted tokens get caps
 * only at run edges so they read as one continuous marker stroke.
 */
export declare function richTextBlock(ctx: TemplateContext, source: string, opts: RichTextOptions): VNode;
export { CJK_RE };
//# sourceMappingURL=rich.d.ts.map
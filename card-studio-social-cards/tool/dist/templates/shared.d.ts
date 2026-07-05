import type { CardContent, TemplateContext, VNode } from '../types';
export declare const CJK_RE: RegExp;
export declare function isZh(c: CardContent): boolean;
export type Scene = 'quote' | 'stats' | 'list' | 'title';
export declare function sceneOf(c: CardContent): Scene;
/** Approximate visual length: CJK glyphs count double. */
export declare function weightedLen(s: string): number;
/**
 * Title font size that adapts to aspect ratio and shrinks smoothly for long
 * titles so they never collide with the rest of the layout.
 */
export declare function titleSize(ctx: TemplateContext, title: string, base?: number): number;
/** Display font family for the current language. */
export declare function displayFamily(ctx: TemplateContext): string;
export declare function sansFamily(ctx: TemplateContext): string;
/** Small uppercase label pill with a dot, used as the eyebrow. */
export declare function eyebrowPill(ctx: TemplateContext, label: string): VNode;
/** Bottom row: footer text left, badge / page marker right. */
export declare function footerRow(ctx: TemplateContext, opts?: {
    color?: string;
    mutedColor?: string;
}): VNode;
/** Logo mark: the brand's real SVG, tinted by the theme, as an <img>. */
export declare function brandMark(ctx: TemplateContext, size: number, color?: string): VNode | null;
/** Brand mark + wordmark row. */
export declare function brandRow(ctx: TemplateContext, opts?: {
    color?: string;
    textColor?: string;
    size?: number;
}): VNode;
/** Decorative orbital arcs used by the ember template, kept behind text. */
export declare function orbitalArcs(ctx: TemplateContext, opts?: {
    right?: number;
    top?: number;
    size?: number;
    color?: string;
    opacity?: number;
}): VNode;
/** Canvas root with theme background + glow layers. */
export declare function canvas(ctx: TemplateContext, style: Record<string, unknown>, ...children: (VNode | null)[]): VNode;
//# sourceMappingURL=shared.d.ts.map
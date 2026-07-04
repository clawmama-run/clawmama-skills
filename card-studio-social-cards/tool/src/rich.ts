import type { TemplateContext, VNode } from './types';
import { CJK_RE, weightedLen } from './templates/shared';

/** A run of text, either plain or ==highlighted==. */
export type RichSegment = { text: string; highlight: boolean };

/** Splits `看到==销量数据==会惊呆` into plain/highlight segments. */
export function parseHighlights(source: string): RichSegment[] {
  const segments: RichSegment[] = [];
  const re = /==([^=]+)==/g;
  let last = 0;
  for (let m = re.exec(source); m; m = re.exec(source)) {
    if (m.index > last) segments.push({ text: source.slice(last, m.index), highlight: false });
    segments.push({ text: m[1]!, highlight: true });
    last = m.index + m[0].length;
  }
  if (last < source.length) segments.push({ text: source.slice(last), highlight: false });
  return segments;
}

export function plainText(source: string): string {
  return source.replace(/==([^=]+)==/g, '$1');
}

/**
 * Body font size that fills the available box: solves
 * `0.5 * weightedLen * fs^2 * lineHeight = availW * availH` and clamps.
 */
export function fitBodySize(
  ctx: TemplateContext,
  source: string,
  opts: { widthFrac?: number; heightFrac?: number; max?: number; min?: number; lineHeight?: number } = {}
): number {
  const availW = ctx.w * (opts.widthFrac ?? 0.84);
  const availH = ctx.h * (opts.heightFrac ?? 0.55);
  const lh = opts.lineHeight ?? 1.55;
  const len = Math.max(weightedLen(plainText(source)), 6);
  // 0.86: line breaks, punctuation, and highlight padding eat into the ideal
  // packing the formula assumes.
  const fs = 0.86 * Math.sqrt((2 * availW * availH) / (len * lh));
  return Math.round(Math.min(ctx.u(opts.max ?? 96), Math.max(ctx.u(opts.min ?? 30), fs)));
}

type Token = {
  text: string;
  highlight: boolean;
  runStart: boolean;
  runEnd: boolean;
  /** Latin word tokens carry their own trailing space. */
  spaceBefore: boolean;
};

const LATIN_RE = /[A-Za-z0-9@#$%&'’+./:\-]/;
/** Characters that must not start a line — merged into the preceding token. */
const TRAILING_PUNCT_RE = /[，。、；：？！）】》」』”’…%,.;:!?)\]]/;

/** CJK text breaks per character, latin per word — flex-wrap then breaks lines correctly. */
function tokenize(segments: RichSegment[]): Token[] {
  const tokens: Token[] = [];
  let pendingSpace = false;
  for (const seg of segments) {
    let word = '';
    const flushWord = (runEnd: boolean) => {
      if (!word) return;
      tokens.push({ text: word, highlight: seg.highlight, runStart: false, runEnd, spaceBefore: pendingSpace });
      pendingSpace = false;
      word = '';
    };
    const chars = [...seg.text];
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i]!;
      if (/\s/.test(ch)) {
        flushWord(false);
        pendingSpace = true;
      } else if (LATIN_RE.test(ch)) {
        word += ch;
      } else if (TRAILING_PUNCT_RE.test(ch) && !pendingSpace && (word || tokens.length > 0)) {
        // 避头点: attach closing punctuation to the previous token
        if (word) {
          word += ch;
        } else {
          const prev = tokens[tokens.length - 1]!;
          if (prev.highlight === seg.highlight) prev.text += ch;
          else tokens.push({ text: ch, highlight: seg.highlight, runStart: false, runEnd: false, spaceBefore: false });
        }
      } else {
        flushWord(false);
        tokens.push({ text: ch, highlight: seg.highlight, runStart: false, runEnd: false, spaceBefore: pendingSpace });
        pendingSpace = false;
      }
    }
    flushWord(false);
  }
  // mark highlight run boundaries so the marker gets rounded caps
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (!t.highlight) continue;
    t.runStart = !(tokens[i - 1]?.highlight);
    t.runEnd = !(tokens[i + 1]?.highlight);
  }
  return tokens;
}

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
export function richTextBlock(ctx: TemplateContext, source: string, opts: RichTextOptions): VNode {
  const { t } = ctx;
  const fs = opts.fontSize;
  const lh = opts.lineHeight ?? 1.55;
  const style = opts.highlightStyle ?? 'marker';
  const markerColor = opts.highlightColor ?? t.highlight ?? '#F9F871';
  const accent = opts.accentColor ?? t.brand;
  const children: VNode[] = tokenize(parseHighlights(source)).map((tok) => {
    const s: Record<string, unknown> = {
      fontSize: fs,
      fontFamily: opts.fontFamily,
      fontWeight: opts.fontWeight ?? 800,
      lineHeight: lh,
      color: opts.color,
    };
    if (tok.spaceBefore) s['marginLeft'] = fs * 0.26;
    if (opts.textShadow) s['textShadow'] = opts.textShadow;
    if (tok.highlight) {
      if (style === 'marker') {
        s['backgroundColor'] = markerColor;
        s['paddingTop'] = fs * 0.02;
        s['paddingBottom'] = fs * 0.02;
        if (tok.runStart) {
          s['paddingLeft'] = fs * 0.1;
          s['borderTopLeftRadius'] = fs * 0.16;
          s['borderBottomLeftRadius'] = fs * 0.16;
        }
        if (tok.runEnd) {
          s['paddingRight'] = fs * 0.1;
          s['borderTopRightRadius'] = fs * 0.16;
          s['borderBottomRightRadius'] = fs * 0.16;
        }
      } else if (style === 'accent') {
        s['color'] = accent;
        if (opts.accentShadow) s['textShadow'] = opts.accentShadow;
      } else {
        s['borderBottom'] = `${Math.max(2, fs * 0.09)}px solid ${accent}`;
        s['backgroundColor'] = `${markerColor}55`;
      }
    }
    return { type: 'span', props: { style: s, children: tok.text } };
  });
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: opts.align === 'center' ? 'center' : 'flex-start',
        width: '100%',
        ...(opts.maxWidth !== undefined ? { maxWidth: opts.maxWidth } : {}),
      },
      children,
    },
  };
}

export { CJK_RE };

/**
 * Resolves an emoji to a twemoji SVG data URI (fetched once per process).
 * Returns undefined when offline or the emoji has no twemoji asset — callers
 * simply skip the sticker.
 */
export declare function resolveSticker(emoji?: string): Promise<string | undefined>;
//# sourceMappingURL=sticker.d.ts.map
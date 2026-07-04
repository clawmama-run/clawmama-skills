const cache = new Map<string, string | undefined>();

/** Twemoji filename: codepoints joined by '-', VS16 stripped when there is no ZWJ. */
function twemojiCode(emoji: string): string {
  let points = [...emoji].map((ch) => ch.codePointAt(0)!);
  if (!points.includes(0x200d)) points = points.filter((cp) => cp !== 0xfe0f);
  return points.map((cp) => cp.toString(16)).join('-');
}

/**
 * Resolves an emoji to a twemoji SVG data URI (fetched once per process).
 * Returns undefined when offline or the emoji has no twemoji asset — callers
 * simply skip the sticker.
 */
export async function resolveSticker(emoji?: string): Promise<string | undefined> {
  if (!emoji) return undefined;
  if (cache.has(emoji)) return cache.get(emoji);
  let uri: string | undefined;
  try {
    const url = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${twemojiCode(emoji)}.svg`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const svg = await res.text();
      uri = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
    }
  } catch {
    uri = undefined;
  }
  cache.set(emoji, uri);
  return uri;
}

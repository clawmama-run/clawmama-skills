import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type LoadedFont = {
  name: string;
  data: Buffer;
  weight: FontWeight;
  style: 'normal' | 'italic';
};

const FONT_DIR = join(__dirname, '..', 'fonts');

let cache: LoadedFont[] | null = null;

/** Loads every face listed in fonts/manifest.json (run `npm run fonts` first). */
export function loadFonts(): LoadedFont[] {
  if (cache) return cache;
  let manifest: { family: string; weight: number; style: string; file: string }[];
  try {
    manifest = JSON.parse(readFileSync(join(FONT_DIR, 'manifest.json'), 'utf8'));
  } catch {
    throw new Error('fonts/manifest.json not found — run `npm run fonts` in packages/card-studio first.');
  }
  cache = manifest.map((f) => ({
    name: f.family,
    data: readFileSync(join(FONT_DIR, f.file)),
    weight: f.weight as FontWeight,
    style: (f.style === 'italic' ? 'italic' : 'normal') as 'normal' | 'italic',
  }));
  return cache;
}

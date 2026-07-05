export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type LoadedFont = {
    name: string;
    data: Buffer;
    weight: FontWeight;
    style: 'normal' | 'italic';
};
/** Loads every face listed in fonts/manifest.json (run `npm run fonts` first). */
export declare function loadFonts(): LoadedFont[];
//# sourceMappingURL=fonts.d.ts.map
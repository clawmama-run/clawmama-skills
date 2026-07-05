import type { Aspect, Preset } from './types';
/**
 * Size presets. Adding a platform = adding a row here; every template adapts
 * to the aspect ratio automatically.
 */
export declare const PRESETS: Preset[];
export declare function getPreset(id: string): Preset;
export declare function classifyAspect(w: number, h: number): Aspect;
//# sourceMappingURL=presets.d.ts.map
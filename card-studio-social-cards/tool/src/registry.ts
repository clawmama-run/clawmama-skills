import type { TemplateDef } from './types';
import { ember } from './templates/ember';
import { editorial } from './templates/editorial';
import { poster } from './templates/poster';
import { terminal } from './templates/terminal';
import { aurora } from './templates/aurora';
import { note } from './templates/note';
import { manuscript } from './templates/manuscript';
import { billboard } from './templates/billboard';
import { cinema } from './templates/cinema';
import { neon } from './templates/neon';
import { ticket } from './templates/ticket';
import { receipt } from './templates/receipt';
import { almanac } from './templates/almanac';

export const TEMPLATES: TemplateDef[] = [ember, editorial, poster, terminal, aurora, note, manuscript, billboard, cinema, neon, ticket, receipt, almanac];

export function getTemplate(id: string): TemplateDef {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown template "${id}". Available: ${TEMPLATES.map((x) => x.id).join(', ')}`);
  return t;
}

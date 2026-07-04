// Downloads static TTF instances from Google Fonts into fonts/ and writes
// fonts/manifest.json. Requesting css2 without a browser UA makes Google
// return plain TTF urls (instead of unicode-range-split woff2), which is the
// format satori needs.
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'fonts');
mkdirSync(OUT, { recursive: true });

const SPECS = [
  { family: 'Inter', weights: [400, 600, 800] },
  { family: 'Fraunces', weights: [500, 700] },
  { family: 'JetBrains Mono', weights: [400, 700] },
  { family: 'Noto Sans SC', weights: [400, 700, 900] },
  { family: 'Noto Serif SC', weights: [500, 900] },
];

async function fetchCss(family, weights) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${weights.join(';')}&display=swap`;
  const res = await fetch(url, { headers: { 'User-Agent': 'curl/8.0' } });
  if (!res.ok) throw new Error(`css2 ${family}: HTTP ${res.status}`);
  return res.text();
}

function parseFaces(css) {
  const faces = [];
  for (const block of css.split('@font-face').slice(1)) {
    const weight = /font-weight:\s*(\d+)/.exec(block)?.[1];
    const url = /src:\s*url\((https:[^)]+\.(?:ttf|otf))\)/.exec(block)?.[1];
    const style = /font-style:\s*(\w+)/.exec(block)?.[1] ?? 'normal';
    if (weight && url) faces.push({ weight: Number(weight), url, style });
  }
  return faces;
}

const manifest = [];
for (const spec of SPECS) {
  const css = await fetchCss(spec.family, spec.weights);
  const faces = parseFaces(css);
  if (faces.length === 0) throw new Error(`No TTF faces parsed for ${spec.family}`);
  for (const face of faces) {
    const file = `${spec.family.replace(/ /g, '')}-${face.weight}.ttf`;
    const dest = join(OUT, file);
    if (existsSync(dest) && statSync(dest).size > 10000) {
      console.log(`skip   ${file} (exists)`);
    } else {
      const res = await fetch(face.url);
      if (!res.ok) throw new Error(`download ${face.url}: HTTP ${res.status}`);
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      console.log(`fetch  ${file} (${(statSync(dest).size / 1024 / 1024).toFixed(1)} MB)`);
    }
    manifest.push({ family: spec.family, weight: face.weight, style: face.style, file });
  }
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\nWrote fonts/manifest.json with ${manifest.length} faces.`);

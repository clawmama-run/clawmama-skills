# @clawmama/card-studio

Multi-platform social card / OG image generation system built on
[satori](https://github.com/vercel/satori) + resvg (no headless browser).
One content model renders through **templates (visual family) × presets
(platform size) × themes (palette)**, so the same announcement can ship as an
OG image, a 小红书 cover, an Instagram story, and a WeChat 公众号头图 without
re-designing anything.

Renders are fast (15–150 ms per card after fonts are loaded), which makes the
library usable both at build time (static OG images) and at request time
(dynamic OG endpoints on the proxy).

## Setup

```bash
npm install                      # repo root; card-studio is a workspace
cd packages/card-studio
npm run fonts                    # downloads TTFs (~60 MB, one-time) + manifest
```

Fonts are git-ignored; `fonts/manifest.json` is regenerated with them. CI/deploy
images should run `npm run fonts` once during build.

## CLI

```bash
npm run cli -- list              # templates, presets, themes

npm run cli -- --template ember --preset og \
  --eyebrow "Blog" --title "Agent marketplaces need hosted onboarding" \
  --subtitle "If every user installs a local stack first, growth stays developer-heavy." \
  --out out/blog-og.png

npm run cli -- --template editorial --preset xhs-cover --lang zh \
  --eyebrow "效率笔记" --title "让 AI 帮你把事做完的 5 个习惯" \
  --bullets "习惯一|习惯二|习惯三" --page 1/5 --out out/xhs.png

npm run samples                  # renders the full demo matrix to out/samples/
```

## Programmatic API

```ts
import { renderCard } from '@clawmama/card-studio';

const png = await renderCard({
  template: 'ember',
  preset: 'og',                        // or width/height
  theme: 'ember',                      // optional; template default otherwise
  content: {
    eyebrow: 'Agent 精选',
    title: '旅行管家 Agent',
    subtitle: '在你常用的聊天软件里规划行程…',
    bullets: ['微信 / 飞书 / Telegram 直接使用', '记住你的出行偏好'],
    badge: 'NEW',
    footer: 'clawmama.run',
  },
});
```

`renderSvg()` returns the SVG string if you want to cache/transform upstream.

### JSON-driven / batch rendering

Everything a render needs fits in one JSON document, so an agent (or any
pipeline) can produce specs and hand them to the CLI:

```bash
card-studio --data card.json --out card.png       # content or full spec
card-studio --data carousel.json --out-dir out/post   # array of specs
```

`--data` accepts a plain `CardContent`, a full spec
(`{template, preset, theme, brand, content}`), or an **array of specs** —
one file renders a whole 小红书/IG carousel (`name` controls filenames,
`page` renders the position markers). Spec fields fall back to CLI flags.

## Concepts

### Content model (`CardContent`)

One normalized shape for all templates. The **scene** (layout variant) is
picked from which fields are present, in priority order:

| present field | scene | typical use |
| --- | --- | --- |
| `quote` | quote card | 金句卡、用户评价 |
| `stats[]` | stat card | 里程碑、数据汇报 |
| `bullets[]` | list card | 清单、功能点、知识卡 |
| otherwise | title card | OG 图、封面、公告 |

Plus `eyebrow`, `subtitle`, `body`, `badge`, `date`, `footer`,
`page {index,count}` (carousel markers for 小红书/IG 多图), `sticker` (an
emoji rendered as a big twemoji sticker — note template), and `lang`
(forces CJK typography; auto-detected from CJK characters otherwise).

**Keyword highlighting**: wrap keywords as `==关键词==` in `title`/`body`/
`bullets`. The short-content templates render them as marker strokes
(`note`), underlines (`manuscript`), or accent-colored type (`billboard`);
other templates strip the markers. CJK text wraps per character with
punctuation kept off line starts (避头点).

### Templates

| id | look | designed for |
| --- | --- | --- |
| `ember` | ClawMama brand dark, orange glow, orbital arcs | OG images, product announcements |
| `editorial` | cream paper, serif display, hairline rules | 小红书知识卡, quotes, essays |
| `poster` | Swiss graphic, heavy frame, signal red | listicles, stats, YouTube thumbs |
| `terminal` | macOS terminal window, mono prompts | changelogs, dev tips |
| `aurora` | indigo night, spectral glow, gradient headline | launches, milestones |
| `note` | flat pastel, marker highlights, emoji sticker | 短文卡：小红书/抖音/IG 文字帖 |
| `manuscript` | ruled paper, serif, underline emphasis | 短文卡：随笔、书摘、金句 |
| `billboard` | flat saturated ground, giant type, accent keywords | 短文卡：抖音/TikTok 封面、观点卡 |
| `cinema` | letterbox frame, bilingual caption, REC chrome | 电影台词卡、金句 |
| `neon` | glowing tube frame, luminous type | 深夜观点卡、造势 hook |
| `ticket` | perforated stub, meta rows, barcode | 活动/发布"入场券" |
| `receipt` | thermal receipt, itemized rows, TOTAL | 清单复盘、成本核算 |
| `almanac` | big date numeral, weekday, 宜/忌 chips | 日签、朋友圈封面 |

Every template adapts to four aspect classes: `landscape` (≥1.2), `square`,
`portrait` (3:4/4:5), `tall` (9:16). Sizing uses an area-based scale factor
(`u()`), so the same template stays balanced from 900×383 up to 1080×1920.

### Presets

`og`, `github-social`, `linkedin`, `x-post`, `x-header`, `ig-square`,
`ig-portrait`, `ig-story`, `xhs-cover` (3:4), `xhs-square`, `wechat-cover`
(公众号 2.35:1), `wechat-square`, `vertical-video` (抖音/TikTok/视频号),
`youtube-thumb`, `pinterest`, `slide`. See `src/presets.ts`.

### Themes

`ember`, `porcelain`, `botanical`, `aurora`, `swiss`, `carbon` — pure token
sets (`src/themes.ts`). Templates declare which themes they support; the first
is the default.

## Branding

Templates read brand identity from a `Brand` token (default: ClawMama — the
real site-header SVG mark, theme-tinted via `{color}`/`{color2}`/`{color3}`
placeholders):

```ts
await renderCard({
  template: 'ember',
  preset: 'og',
  brand: { name: 'Payin', domain: 'payin.com', markSvg: '<svg …>…</svg>' },
  content: { … },
});
```

CLI: `--brand-name`, `--brand-domain`, `--brand-mark logo.svg`. A renamed
brand without `markSvg` renders wordmark-only (it never inherits the ClawMama
mark).

## Extending

- **New platform size** → add a row to `PRESETS`. Done.
- **New palette** → add a `Theme` to `THEMES`; list its id in the templates
  that should offer it.
- **New template** → create `src/templates/<name>.ts` exporting a
  `TemplateDef`, register it in `src/registry.ts`. Build the element tree with
  the `h()`/`text()` helpers and the shared pieces in `templates/shared.ts`
  (`eyebrowPill`, `footerRow`, `brandRow`, `titleSize`, `canvas`). Use
  `ctx.u(n)` for every px value so the layout scales across presets, and give
  long text a `lineClamp`.
- **Carousel content** (小红书/IG 多图) → render one card per page with
  `page: { index, count }`; templates show the position marker automatically.

## satori constraints worth knowing

- Flexbox only (no CSS grid); `display: block` supported for text.
- Gradients (`linear-gradient`/`radial-gradient`), `border-radius`,
  `box-shadow`, `transform`, `background-clip: text` all work; `filter: blur`
  does not — glows are done with radial-gradient layers.
- Keep `flexShrink: 0` on text blocks (the `text()` helper does this): yoga
  otherwise shrinks them below painted height when a column overflows, which
  makes lines overlap.
- Fonts must be TTF/OTF/WOFF (not woff2). CJK faces are ~10 MB each; for
  serverless deploys subset them (`pyftsubset`) or load lazily.

## Integration points (planned)

- **Proxy dynamic OG endpoint**: `GET /og/agents/:id.png` →
  `renderCard({ template: 'ember', preset: 'og', content: fromBundle(bundle) })`
  with disk/memory cache + ETag; wire the URL into `launch-seo.ts` and switch
  `twitter:card` to `summary_large_image`.
- **website-astro build step**: iterate content frontmatter → write
  `public/og/[slug].png` at build time, replacing the manual
  `generate-og-images.py` flow.

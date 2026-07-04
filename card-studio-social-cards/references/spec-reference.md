# Card Studio — Spec Reference

Render with the CLI in this skill's `tool/` directory:

```bash
node tool/dist/cli.js --data spec.json --out card.png       # single
node tool/dist/cli.js --data specs.json --out-dir out/post  # array = batch
```

## Spec shape

```jsonc
{
  "name": "01-cover",          // batch mode only: output filename
  "template": "note",          // required, see Templates
  "preset": "xhs-cover",       // or explicit "width" + "height"
  "theme": "sky",              // optional; template default otherwise
  "brand": {                   // optional brand override
    "name": "ClawMama",        // wordmark text
    "domain": "clawmama.run",  // default footer
    "markSvg": "<svg …>"       // logo SVG; {color}/{color2}/{color3} theme placeholders
  },
  "content": { … }             // required, see Content model
}
```

## Templates

| id | look | primary scenes |
| --- | --- | --- |
| `ember` | ClawMama brand dark, orange glow, orbital arcs | title, list, stats, quote |
| `editorial` | cream paper, serif display, hairline rules | title, numbered list, quote |
| `poster` | Swiss frame, oversized numerals, signal red | title, list, stats, quote |
| `terminal` | macOS terminal window, mono prompts | title, list, stats, quote |
| `aurora` | indigo night, gradient headline, glass panel | title, chips list, stats, quote |
| `note` | flat pastel, marker ==highlights==, emoji sticker | body, checklist |
| `manuscript` | ruled paper, serif, underline ==emphasis== | body/quote + attribution |
| `billboard` | flat saturated color, giant type, accent ==keywords== | body/title |
| `cinema` | letterbox, centered bilingual caption, REC chrome | body + subtitle(en) + attribution |
| `neon` | night ground, glowing tube frame, luminous type | body + subtitle |
| `ticket` | perforated ticket, meta rows, barcode stub | title + subtitle + date/stats |
| `receipt` | thermal receipt, itemized rows, TOTAL, barcode | title + stats/bullets + badge(total) |
| `almanac` | big date numeral, weekday, 宜/忌 chips | date + body + bullets[宜,忌] |

## Presets

| id | size | use |
| --- | --- | --- |
| `og` | 1200×630 | link previews (Telegram/微信/Discord/飞书) |
| `github-social` | 1280×640 | GitHub repo social image |
| `linkedin` | 1200×627 | LinkedIn |
| `x-post` | 1600×900 | X in-feed image |
| `x-header` | 1500×500 | X profile banner |
| `ig-square` | 1080×1080 | Instagram/Threads 1:1 |
| `ig-portrait` | 1080×1350 | Instagram 4:5 |
| `ig-story` | 1080×1920 | IG Story/Reel |
| `xhs-cover` | 1242×1656 | 小红书 3:4 封面（zh 短内容默认） |
| `xhs-square` | 1242×1242 | 小红书 1:1 内页 |
| `wechat-cover` | 1080×460 | 公众号头条封面 |
| `wechat-square` | 1080×1080 | 公众号次条 |
| `vertical-video` | 1080×1920 | 抖音/TikTok/视频号封面 |
| `youtube-thumb` | 1280×720 | YouTube 缩略图 |
| `pinterest` | 1000×1500 | Pinterest pin |
| `slide` | 1920×1080 | 幻灯片/横幅 |

## Themes

`ember`(品牌深色) `porcelain`(米白文艺) `botanical`(墨绿) `aurora`(靛蓝渐变)
`swiss`(纸白+信号红) `carbon`(石墨终端) `sky`(浅青便签) `lemon`(奶油柠檬)
`blush`(蔷薇粉) `cobalt`(克莱因蓝) `noir`(胶片黑+琥珀) `midnight`(霓虹粉×青)

Each template declares compatible themes (`node tool/dist/cli.js list`);
omit `theme` to use its default.

## Content model

```ts
{
  lang?: "zh" | "en",          // auto-detected from CJK characters if omitted
  eyebrow?: string,            // small label above the content
  title?: string,              // headline
  subtitle?: string,           // sub-headline / cinema English caption
  body?: string,               // main text for short-content templates
  bullets?: string[],          // list items / almanac [宜, 忌]
  stats?: { value: string, label: string }[],
  quote?: string,
  attribution?: string,        // 落款 (— 《饮食男女》)
  footer?: string,             // bottom-left text, default = brand domain
  badge?: string,              // corner tag / receipt TOTAL value
  date?: string,               // shown as text; almanac parses it (ISO best)
  page?: { index: number, count: number },  // carousel marker
  sticker?: string             // one emoji (note template), e.g. "😱"
}
```

`==keyword==` inside `title`/`body`/`bullets` renders highlighted (marker /
underline / accent per template). Templates without highlight support strip
the markers safely.

## Example specs

观点短文（note + 贴纸）:

```json
{ "template": "note", "preset": "xhs-cover", "theme": "sky",
  "content": { "lang": "zh", "eyebrow": "Note", "sticker": "😱",
    "body": "看到某些==汽车公司==6月的==销量数据==，你会惊呆，全靠==出口数据==撑场面" } }
```

日签（almanac）:

```json
{ "template": "almanac", "preset": "xhs-cover",
  "content": { "lang": "zh", "date": "2026-07-05", "eyebrow": "小暑将至",
    "body": "把难的事情==拆小==，把小的事情==做完==。",
    "attribution": "日签 · 效率篇",
    "bullets": ["开始那个拖了很久的小任务", "同时开五个新项目"] } }
```

周复盘小票（receipt；badge 是合计）:

```json
{ "template": "receipt", "preset": "xhs-cover",
  "content": { "lang": "zh", "eyebrow": "本周复盘", "title": "一周时间开销小票",
    "date": "2026-06-29 ~ 07-05", "badge": "47h",
    "stats": [ { "value": "22h", "label": "写代码" }, { "value": "9h", "label": "开会" },
               { "value": "11h", "label": "刷手机" } ] } }
```

电影台词卡（cinema，双语）:

```json
{ "template": "cinema", "preset": "xhs-cover", "theme": "noir",
  "content": { "lang": "zh", "eyebrow": "Scene 07",
    "body": "人生不能像做菜，把所有的料都准备好了==才下锅==",
    "subtitle": "Life is not like cooking.", "attribution": "《饮食男女》" } }
```

四页轮播（一个 JSON 数组 → 一组图）:

```json
[
  { "name": "01-cover", "template": "billboard", "preset": "xhs-cover",
    "content": { "lang": "zh", "eyebrow": "效率专栏",
      "body": "让 AI 帮你==把事做完==的 3 个习惯", "page": { "index": 1, "count": 4 } } },
  { "name": "02-habit", "template": "note", "preset": "xhs-cover", "theme": "sky",
    "content": { "lang": "zh", "eyebrow": "习惯 1", "sticker": "📌",
      "body": "把重复任务写成==固定指令==，让 Agent 记住", "page": { "index": 2, "count": 4 } } },
  { "name": "03-habit", "template": "note", "preset": "xhs-cover", "theme": "lemon",
    "content": { "lang": "zh", "eyebrow": "习惯 2", "sticker": "⏰",
      "body": "让它==主动汇报进度==，而不是等你来问", "page": { "index": 3, "count": 4 } } },
  { "name": "04-end", "template": "almanac", "preset": "xhs-cover",
    "content": { "lang": "zh", "date": "2026-07-05",
      "body": "今天就从==第一个习惯==开始。", "page": { "index": 4, "count": 4 } } }
]
```

## Programmatic API

```ts
import { renderCard } from './tool/dist/index.js';
const png: Buffer = await renderCard({ template: 'ember', preset: 'og', content: { title: '…' } });
```

Renders take 15–150 ms after fonts are loaded — fine for build steps and
on-demand endpoints alike.

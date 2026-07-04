---
name: card-studio-social-cards
description: "Generate polished social-media card images (社交卡片图/OG 分享图) from text with Card Studio. Use when asked to 做图/出图/做卡片/做封面, turn text into an image, make OG/link-preview images, 小红书图文/封面/知识卡, 抖音/TikTok covers, Instagram posts/stories, 公众号头图, 日签, 金句卡, 清单卡, 周复盘小票, 电影台词卡, or multi-image carousels (轮播/组图). Text-to-card typography only — it does not edit photos or generate AI artwork."
license: Apache-2.0
metadata:
  author: clawmama
  version: "2.0.0"
  homepage: "https://github.com/clawmama-run/clawmama-skills"
---

# Card Studio — 社交卡片图生成

Self-contained card renderer (satori + resvg, no headless browser) living in
`tool/` inside this skill. 13 templates × 16 platform sizes × 12 themes,
CJK-aware typography, `==keyword==` highlighting, emoji stickers, JSON-driven
batch rendering for carousels.

## One-time setup

Everything lives in this skill's `tool/` directory — no other repo needed.
Run once if `tool/dist/cli.js` or `tool/fonts/manifest.json` is missing:

```bash
cd <this-skill-dir>/tool
npm install          # satori + resvg (~30s)
npm run build        # tsc → dist/
npm run fonts        # downloads TTFs from Google Fonts (~60 MB, once)
```

Font download and emoji stickers need outbound network; if fonts fail to
download, report it instead of retrying repeatedly.

## Rendering

Primary workflow — write a JSON spec, render, send the PNG back to the user:

```bash
CLI="node <this-skill-dir>/tool/dist/cli.js"
cat > /tmp/card.json << 'EOF'
{
  "template": "note",
  "preset": "xhs-cover",
  "theme": "sky",
  "content": {
    "lang": "zh",
    "eyebrow": "Note",
    "body": "看到某些==汽车公司==6月的==销量数据==，你会惊呆",
    "sticker": "😱"
  }
}
EOF
$CLI --data /tmp/card.json --out /tmp/card.png
```

Carousel (小红书/IG 组图) — one JSON array renders the whole post:

```bash
# [{"name":"01-cover","template":"billboard",...,"content":{...,"page":{"index":1,"count":4}}}, ...]
$CLI --data /tmp/carousel.json --out-dir /tmp/post
```

Quick one-offs can use flags instead (`--template ember --preset og
--title "..." --out x.png`). Run `$CLI list` to see every template, preset,
and theme; `$CLI --help` for all flags.

After rendering, send the PNG file(s) to the user in order, say which
template/size you used, and offer to adjust (模板/配色/文案/尺寸).

## Choosing a template

| 内容类型 | template | 推荐 preset | theme |
| --- | --- | --- | --- |
| 观点/短文（可配 emoji 贴纸） | `note` | `xhs-cover` `ig-portrait` | `sky` `lemon` `blush` |
| 清单/技巧合集 | `note`(bullets) 或 `poster` | `xhs-cover` `ig-portrait` | 默认 |
| 金句/书摘/随笔 | `manuscript` 或 `almanac` | `xhs-cover` | `porcelain` |
| 电影台词/中英双语金句 | `cinema` | `xhs-cover` | `noir` |
| 大声量单句/封面 hook | `billboard` 或 `neon` | `vertical-video` `xhs-cover` | `cobalt` / `midnight` |
| 日签（日期+每日一句+宜忌） | `almanac` | `xhs-cover` | `porcelain` `sky` |
| 周复盘/时间账单小票 | `receipt` | `xhs-cover` | 默认 |
| 活动/发布"入场券" | `ticket` | `ig-portrait` | `porcelain` |
| 数据/里程碑 | `poster`(stats) 或 `aurora` | `x-post` `og` | 默认 |
| 产品公告/OG 分享图 | `ember` | `og` | `ember` |
| 开发者 changelog | `terminal` | `og` | `carbon` |

## Writing content

One shared content model; put the user's words in the right fields:

- `body` — main text for short-content templates (note/manuscript/billboard/
  cinema/neon/almanac). Mark 2–4 key phrases as `==关键词==` (rendered as
  marker stroke / underline / accent color per template). Don't over-mark.
- `title`/`subtitle` — headline templates; `bullets` — lists (almanac uses
  the first two as 宜/忌); `stats` — `[{"value":"22h","label":"写代码"}]`;
  `quote`+`attribution` — quotes and 落款; plus `eyebrow`, `date`, `badge`,
  `footer`, `sticker` (one emoji, note only), `page` (`{"index":1,"count":4}`),
  `lang` (auto-detected from CJK).
- Chinese typography is automatic (per-character wrapping, punctuation never
  starts a line, font size auto-fits). 20–90 字 reads best on short cards.

**Branding**: defaults to ClawMama (logo + clawmama.run footer). For other
projects/brands pass a spec-level override — a renamed brand never inherits
the ClawMama logo:

```json
"brand": { "name": "Payin", "domain": "payin.com", "markSvg": "<svg …>" }
```

Full field/template/preset/theme reference and more example specs:
`references/spec-reference.md`.

## Verification

```bash
file /tmp/card.png        # PNG image data, expected dimensions
```

OG cards should be 1200×630; carousels should have one file per page in order.

## Rules

- Use the user's words; light copyediting and splitting into carousel pages is
  fine — confirm bigger rewrites first. Never invent facts to fill a card.
- Default to 小红书 3:4 (`xhs-cover`) for zh short content when no platform is
  named, and say so.
- Render errors name the bad field and list valid values — fix the spec, don't
  retry blindly.

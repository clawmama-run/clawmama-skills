---
name: card-studio-social-cards
description: "Generate OG, social, 小红书, WeChat, and launch cards with ClawMama Card Studio."
---

# Card Studio social cards

Use when creating Open Graph images, link-preview cards, 小红书 covers, Instagram/Threads images, WeChat article covers, YouTube thumbnails, or other social graphics with ClawMama Card Studio.

## Source and setup

Preferred source repo:

```bash
cd /srv/clawmama/repos/clawmama
```

Card Studio lives at `packages/card-studio` and renders with `satori` + `resvg`; no headless browser.

Before rendering, ensure dependencies and fonts exist:

```bash
npm install
npm run build -w @clawmama/card-studio
npm run fonts -w @clawmama/card-studio
```

Fonts are not committed. If rendering fails with missing fonts, rerun the `fonts` script.

## CLI discovery

```bash
npm run cli -w @clawmama/card-studio -- list
npm run cli -w @clawmama/card-studio -- --help
```

Use `list` before choosing a style if the user has not specified one.

## Render with CLI

Basic OG card:

```bash
npm run cli -w @clawmama/card-studio -- \
  --template ember \
  --preset og \
  --theme ember \
  --eyebrow "ClawMama" \
  --title "Use AI, the way you already know." \
  --subtitle "Ready-to-use AI agents inside chat apps." \
  --footer "clawmama.run" \
  --out /tmp/clawmama-og.png
```

Chinese 小红书 cover:

```bash
npm run cli -w @clawmama/card-studio -- \
  --template editorial \
  --preset xhs-cover \
  --lang zh \
  --eyebrow "效率笔记" \
  --title "让 AI 帮你把事做完的 5 个习惯" \
  --subtitle "不是聊天，而是完成任务" \
  --bullets "选对 Agent|接入常用聊天软件|让它记住你的流程" \
  --page 1/5 \
  --footer "clawmama.run" \
  --out /tmp/xhs-cover.png
```

## Content fields

Useful CLI fields:

- `--title`, `--subtitle`, `--eyebrow`, `--body`
- `--quote`, `--attribution`
- `--footer`, `--badge`, `--date`
- `--bullets "a|b|c"`
- `--stats "97%:uptime|2min:setup"`
- `--page "1/5"`
- `--lang zh|en`
- `--format png|svg`
- `--scale 2`
- `--data content.json` for full `CardContent` JSON

## Choosing template/preset/theme

Templates:

- `ember` — ClawMama dark/orange brand cards; default for OG/product cards.
- `editorial` — paper/editorial style; good for 小红书 knowledge cards and quotes.
- `poster` — Swiss poster style; good for lists, stats, thumbnails.
- `terminal` — terminal window style; good for changelogs and developer tips.
- `aurora` — gradient launch/milestone style.

Common presets:

- `og` — link previews, 1200×630.
- `xhs-cover` — 小红书 3:4 cover.
- `wechat-cover` — 微信公众号头条封面.
- `ig-square`, `ig-portrait`, `ig-story`.
- `x-post`, `x-header`.
- `youtube-thumb`.

Themes include `ember`, `porcelain`, `botanical`, `aurora`, `swiss`, and `carbon`. Use the template default unless the user asks for another mood.

See `references/card-studio-notes.md` for integration details.

## Programmatic API

```ts
import { renderCard } from '@clawmama/card-studio';

const png = await renderCard({
  template: 'ember',
  preset: 'og',
  theme: 'ember',
  content: {
    eyebrow: 'Agent 精选',
    title: '旅行管家 Agent',
    subtitle: '在你常用的聊天软件里规划行程。',
    bullets: ['微信 / 飞书 / Telegram 直接使用', '记住你的出行偏好'],
    footer: 'clawmama.run',
  },
});
```

## Verification

After rendering:

```bash
file /tmp/card.png
identify /tmp/card.png 2>/dev/null || true
```

For OG cards expect `1200 x 630`. For website static OG generation, verify both the hashed image and stable alias when aliases are used.

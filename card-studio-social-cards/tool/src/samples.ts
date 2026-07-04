// Renders a representative sample matrix into out/samples/.
// Run: npm run samples [-- --scale 0.5]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderCard } from './render';
import type { CardContent } from './types';

const OUT = join(__dirname, '..', 'out', 'samples');
mkdirSync(OUT, { recursive: true });
const scaleArg = process.argv.indexOf('--scale');
const scale = scaleArg > -1 ? Number(process.argv[scaleArg + 1]) : 1;

type Sample = { name: string; template: string; preset: string; theme?: string; content: CardContent };

const SAMPLES: Sample[] = [
  {
    name: '01-ember-og-home',
    template: 'ember',
    preset: 'og',
    content: {
      eyebrow: 'Ready-to-use agents',
      title: 'AI agents inside your chat apps',
      subtitle: 'Create, connect, and use agents without running infrastructure.',
      badge: 'NO SETUP',
    },
  },
  {
    name: '02-ember-og-blogpost',
    template: 'ember',
    preset: 'og',
    content: {
      eyebrow: 'Blog',
      title: 'Agent marketplaces need hosted onboarding',
      subtitle: 'If every user installs a local stack first, growth stays developer-heavy.',
      date: 'Jul 2026',
    },
  },
  {
    name: '03-ember-xhs-agent-zh',
    template: 'ember',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      eyebrow: 'Agent 精选',
      title: '旅行管家 Agent',
      subtitle: '在你常用的聊天软件里规划行程、记住偏好、临时翻译，并协助处理预订。',
      bullets: ['微信 / 飞书 / Telegram 直接使用', '记住你的出行偏好', '航班酒店比价与提醒', '24 小时在线，无需部署'],
      badge: 'NEW',
    },
  },
  {
    name: '04-editorial-xhs-knowledge-zh',
    template: 'editorial',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      eyebrow: '效率笔记',
      title: '让 AI 帮你把事做完的 5 个习惯',
      bullets: [
        '把重复任务写成固定指令，让 Agent 记住',
        '用聊天软件而不是新 App，降低使用门槛',
        '给 Agent 装上领域 Skill，而不是泛泛提问',
        '让它主动汇报进度，而不是等你来问',
        '把结果沉淀成模板，下次直接复用',
      ],
      date: '2026 · 07',
      page: { index: 1, count: 5 },
    },
  },
  {
    name: '05-editorial-ig-quote',
    template: 'editorial',
    preset: 'ig-square',
    theme: 'botanical',
    content: {
      quote: 'The best interface for AI is the one people already open twenty times a day.',
      attribution: 'ClawMama Journal',
      eyebrow: 'On distribution',
      date: 'No. 12',
    },
  },
  {
    name: '06-poster-ig-listicle-zh',
    template: 'poster',
    preset: 'ig-portrait',
    content: {
      lang: 'zh',
      eyebrow: '本周清单',
      title: '3 个值得装进微信的 Agent',
      bullets: ['旅行管家：行程、比价、翻译一站式', '销售助手：客户跟进和话术建议', '股票分析：盘前盘后自动简报'],
      badge: '第 08 期',
      page: { index: 2, count: 6 },
    },
  },
  {
    name: '07-poster-x-stats',
    template: 'poster',
    preset: 'x-post',
    content: {
      eyebrow: 'ClawMama in numbers',
      title: 'Hosted agents, real usage',
      stats: [
        { value: '2 min', label: 'from click to running agent' },
        { value: '5+', label: 'chat platforms supported' },
        { value: '24/7', label: 'always-on hosted runtime' },
      ],
      date: '2026 Q2',
    },
  },
  {
    name: '08-terminal-og-changelog',
    template: 'terminal',
    preset: 'og',
    content: {
      eyebrow: 'changelog v0.18',
      title: 'Hermes 0.18 is the new default runtime',
      bullets: ['Faster cold starts on new instances', 'Skill install links for WeChat & Feishu', 'Web terminal reconnect hardening'],
      footer: 'clawmama — release notes',
      badge: 'v0.18',
      date: '2026-07-04',
    },
  },
  {
    name: '09-aurora-story-launch',
    template: 'aurora',
    preset: 'ig-story',
    content: {
      eyebrow: 'Launch week',
      title: 'Your agent. Every chat app.',
      subtitle: 'One hosted agent that follows you across WeChat, Telegram, Discord, and more.',
      bullets: ['No servers', 'No setup', '2-minute onboarding'],
      badge: 'DAY 3',
    },
  },
  {
    name: '10-aurora-og-milestone-zh',
    template: 'aurora',
    preset: 'og',
    content: {
      lang: 'zh',
      eyebrow: '里程碑',
      title: 'Skills 市场正式上线',
      subtitle: '一条链接，把可复用能力装进你的 AI 助手。',
      stats: [
        { value: '120+', label: '可安装 Skills' },
        { value: '2 分钟', label: '创建到可用' },
      ],
    },
  },
  {
    name: '11-ember-wechat-cover-zh',
    template: 'ember',
    preset: 'wechat-cover',
    content: {
      lang: 'zh',
      eyebrow: '产品更新',
      title: '在微信里指挥你的 AI Agent',
      subtitle: '开箱即用，不需要部署。',
    },
  },
  {
    name: '12-poster-youtube-thumb',
    template: 'poster',
    preset: 'youtube-thumb',
    theme: 'swiss',
    content: {
      eyebrow: 'Tutorial',
      title: 'Build a WeChat AI agent in 2 minutes',
      badge: 'EP 04',
    },
  },
  {
    name: '13-note-xhs-shortpost-zh',
    template: 'note',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      eyebrow: 'Note',
      body: '看到某些==汽车公司==6月的==销量数据==，你会惊呆，国内销量越来越低，全靠==出口数据==撑场面，动不动出口将近20万台，你自己相信吗',
      sticker: '😱',
    },
  },
  {
    name: '14-note-lemon-checklist-zh',
    template: 'note',
    preset: 'ig-portrait',
    theme: 'lemon',
    content: {
      lang: 'zh',
      eyebrow: 'Checklist',
      title: '换掉这 3 个习惯',
      bullets: ['用==固定指令==替代重复打字', '让 Agent ==主动汇报==而不是等你问', '把结果沉淀成==模板==直接复用'],
      page: { index: 2, count: 5 },
    },
  },
  {
    name: '15-manuscript-xhs-essay-zh',
    template: 'manuscript',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      eyebrow: '夜读',
      date: '二〇二六 · 七月',
      body: '真正的效率不是把每一分钟都填满，而是把值得的事情做到==不可替代==。工具可以加速执行，但只有你能决定==方向==。',
      attribution: '《慢工作》',
    },
  },
  {
    name: '16-billboard-douyin-cover-zh',
    template: 'billboard',
    preset: 'vertical-video',
    content: {
      lang: 'zh',
      eyebrow: 'AI 观察',
      body: '会用 AI 的人，不是在==省时间==，而是在==重新定价==自己的时间',
      page: { index: 1, count: 4 },
    },
  },
  {
    name: '17-cinema-xhs-quote-zh',
    template: 'cinema',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      eyebrow: 'Scene 07',
      body: '人生不能像做菜，把所有的料都准备好了==才下锅==',
      subtitle: "Life is not like cooking. You can't wait until everything is ready.",
      attribution: '《饮食男女》',
    },
  },
  {
    name: '18-neon-ig-hook-zh',
    template: 'neon',
    preset: 'ig-portrait',
    content: {
      lang: 'zh',
      eyebrow: 'Late Night Club',
      body: '白天搬砖，==深夜造梦==',
      subtitle: 'Day job pays the bills. Night builds the dream.',
      page: { index: 3, count: 6 },
    },
  },
  {
    name: '19-ticket-ig-pass-zh',
    template: 'ticket',
    preset: 'ig-portrait',
    content: {
      lang: 'zh',
      eyebrow: 'Admit One',
      title: 'ClawMama 创作者内测',
      subtitle: '一张票，把你的 AI Agent 带进微信群。',
      date: '2026.07.15',
      badge: 'VIP',
      page: { index: 7, count: 99 },
    },
  },
  {
    name: '20-receipt-xhs-recap-zh',
    template: 'receipt',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      eyebrow: '本周复盘',
      title: '一周时间开销小票',
      stats: [
        { value: '22h', label: '写代码' },
        { value: '9h', label: '开会' },
        { value: '11h', label: '刷手机' },
        { value: '3h', label: '健身' },
        { value: '2h', label: '发呆' },
      ],
      badge: '47h',
      date: '2026-06-29 ~ 07-05',
    },
  },
  {
    name: '21-almanac-xhs-daily-zh',
    template: 'almanac',
    preset: 'xhs-cover',
    content: {
      lang: 'zh',
      date: '2026-07-05',
      eyebrow: '小暑将至',
      body: '把难的事情==拆小==，把小的事情==做完==。',
      attribution: '日签 · 效率篇',
      bullets: ['开始那个拖了很久的小任务', '同时开五个新项目'],
      page: { index: 5, count: 31 },
    },
  },
];

async function main(): Promise<void> {
for (const s of SAMPLES) {
  const t0 = Date.now();
  const buf = await renderCard({
    template: s.template,
    preset: s.preset,
    content: s.content,
    scale,
    ...(s.theme ? { theme: s.theme } : {}),
  });
  const file = join(OUT, `${s.name}.png`);
  writeFileSync(file, buf);
  console.log(`${s.name}.png  ${(buf.length / 1024).toFixed(0)} KB  ${Date.now() - t0}ms`);
}
console.log(`\nDone → ${OUT}`);
}

main().catch((err) => { console.error(err); process.exit(1); });

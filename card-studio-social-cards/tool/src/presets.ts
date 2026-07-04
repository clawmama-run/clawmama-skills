import type { Aspect, Preset } from './types';

/**
 * Size presets. Adding a platform = adding a row here; every template adapts
 * to the aspect ratio automatically.
 */
export const PRESETS: Preset[] = [
  // Link previews / OG
  { id: 'og', platform: 'Open Graph', use: 'Link preview (Telegram, WhatsApp, Facebook, Discord, Slack, iMessage, Feishu)', width: 1200, height: 630 },
  { id: 'github-social', platform: 'GitHub', use: 'Repository social preview', width: 1280, height: 640 },
  { id: 'linkedin', platform: 'LinkedIn', use: 'Link preview / post image', width: 1200, height: 627 },

  // X (Twitter)
  { id: 'x-post', platform: 'X', use: 'In-feed post image (16:9)', width: 1600, height: 900 },
  { id: 'x-header', platform: 'X', use: 'Profile header banner', width: 1500, height: 500 },

  // Instagram / Threads
  { id: 'ig-square', platform: 'Instagram / Threads', use: 'Feed post (1:1)', width: 1080, height: 1080 },
  { id: 'ig-portrait', platform: 'Instagram / Threads', use: 'Feed post (4:5, most screen area)', width: 1080, height: 1350 },
  { id: 'ig-story', platform: 'Instagram', use: 'Story / Reel cover (9:16)', width: 1080, height: 1920 },

  // 小红书
  { id: 'xhs-cover', platform: '小红书', use: '图文封面 (3:4 竖版，推荐)', width: 1242, height: 1656 },
  { id: 'xhs-square', platform: '小红书', use: '图文内页 (1:1)', width: 1242, height: 1242 },

  // 微信
  { id: 'wechat-cover', platform: '微信公众号', use: '头条封面 (2.35:1)', width: 1080, height: 460 },
  { id: 'wechat-square', platform: '微信公众号', use: '次条封面 (1:1)', width: 1080, height: 1080 },

  // Short video covers
  { id: 'vertical-video', platform: '抖音 / TikTok / 视频号', use: '视频封面 (9:16)', width: 1080, height: 1920 },
  { id: 'youtube-thumb', platform: 'YouTube', use: 'Video thumbnail (16:9)', width: 1280, height: 720 },

  // Other
  { id: 'pinterest', platform: 'Pinterest', use: 'Pin (2:3)', width: 1000, height: 1500 },
  { id: 'slide', platform: 'Generic', use: 'Presentation slide / banner (16:9 HD)', width: 1920, height: 1080 },
];

export function getPreset(id: string): Preset {
  const p = PRESETS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown preset "${id}". Available: ${PRESETS.map((x) => x.id).join(', ')}`);
  return p;
}

export function classifyAspect(w: number, h: number): Aspect {
  const r = w / h;
  if (r >= 1.2) return 'landscape';
  if (r >= 0.85) return 'square';
  if (r >= 0.62) return 'portrait';
  return 'tall';
}

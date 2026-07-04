# Card Studio notes

## ClawMama integration points

Static website OG generation:

- generator: `/srv/clawmama/repos/clawmama/packages/website-astro/scripts/generate-og.mjs`
- manifest: `/srv/clawmama/repos/clawmama/packages/website-astro/src/og-manifest.json`
- source public assets: `/srv/clawmama/repos/clawmama/packages/website-astro/public/og/`
- built static output: `/srv/clawmama/repos/clawmama/packages/website/og/`

Dynamic Web proxy OG endpoints:

- renderer: `/srv/clawmama/repos/clawmama/packages/proxy/src/og-image.ts`
- agent cards: `/og/agents/:code.png`
- skill cards: `/og/skills/:code.png`
- generic page cards: `/og/pages/:page.png`

## Build and deploy cautions

- `packages/card-studio/fonts/*.ttf` and `*.otf` are gitignored. Run `npm run fonts -w @clawmama/card-studio` before rendering or building deploy images.
- Docker builds for ClawMama should fetch fonts so dynamic OG endpoints work in production.
- Rebuilding the Astro site can clear `packages/website/console/`; rebuild web-console assets afterward when working in the main ClawMama repo.
- If direct stable OG URLs matter, keep stable aliases such as `/og/ecosystem.png` in sync with hashed cache-busted files such as `/og/ecosystem.<hash>.png`.

## Website deploy command

When authorized Cloudflare credentials exist on the host:

```bash
cd /srv/clawmama/repos/clawmama
set -a
. /root/.openclaw/secrets/cloudflare.env
set +a
npx wrangler pages deploy packages/website --project-name clawmama --branch main
```

Do not print or commit Cloudflare tokens.

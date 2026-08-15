# GrowPilot AI

GrowPilot AI is a Next.js SaaS foundation for an AI-powered Instagram content manager. It is designed around the loop:

**Analyze → Plan → Create → Optimize → Schedule → Publish → Measure → Learn**

## What is included

- Email/password authentication with HTTP-only sessions
- PostgreSQL + Prisma data model
- Brand profile memory for AI generation
- AI Content Studio with demo fallback
- AI hook, caption, CTA, hashtags, SEO keywords and visual direction
- Content quality score
- Content scheduling API
- Instagram Business Login OAuth scaffold using current `instagram_business_*` permissions
- Server-side encrypted Instagram tokens
- Instagram profile sync
- Instagram Insights endpoint
- Image publishing through the official Instagram API flow
- Automation Center with Manual / Assisted / Autopilot modes
- Approval-rule settings
- Automation simulation/test mode
- Idempotent scheduled publishing records
- Retry handling for publishing jobs
- Token refresh attempt before expiry
- Audit log
- Vercel-compatible cron endpoint
- Responsive dark SaaS UI

## Important production limits

This repository is a working foundation, not a claim that every Instagram capability is available without Meta configuration. Real publishing requires an eligible Instagram Professional account, a correctly configured Meta app, OAuth permissions, public media URLs and any required Meta review/access.

The current automatic publisher intentionally supports **image posts**. Add other media types only after verifying the current Meta API requirements.

Vercel Hobby currently limits native Cron Jobs to once per day, so the included `vercel.json` uses a daily cron. For frequent publishing times, use an external scheduler/queue or a paid plan.

## Quick start

```bash
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run dev
```

## Environment

See `.env.example`.

Never commit `.env.local` or real API credentials.

## Deployment

See `docs/DEPLOYMENT.md`.

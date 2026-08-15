# GrowPilot AI — Deployment Guide

## 1. Local setup

Requirements: Node.js 20+ and PostgreSQL.

```bash
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## 2. GitHub

```bash
git init
git add .
git commit -m "feat: GrowPilot AI autopilot foundation"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 3. Vercel

Import the GitHub repository into Vercel and add the production environment variables from `.env.example`.

Vercel can host the Next.js application and serverless API routes. The free Hobby plan is intended for personal/non-commercial use under Vercel's current terms. Do not assume the free plan provides unlimited automation. citeturn3search5

## 4. Database

Use a managed PostgreSQL provider and set `DATABASE_URL` in Vercel. Run Prisma schema deployment from a trusted environment before first production use.

## 5. AI

Set `ANTHROPIC_API_KEY` server-side. Never prefix it with `NEXT_PUBLIC_`.

If the key is absent, GrowPilot uses a clearly labeled demo generation path rather than pretending the result came from a live AI provider.

## 6. Instagram / Meta

This project uses the modern Instagram API with Instagram Login architecture. Current Meta documentation uses permissions such as `instagram_business_basic` and `instagram_business_content_publish`; Insights uses `instagram_business_manage_insights`. The older scope names were deprecated, so do not copy old tutorials into production. citeturn1search0turn1search4

The flow is:

Instagram OAuth → short-lived token → long-lived token → encrypted server-side storage → Graph API calls.

Content publishing requires media to be publicly reachable when Meta fetches it, and publishing is performed through a media container followed by `media_publish`. citeturn1search12turn1search8

The application never asks for an Instagram password.

## 7. Media storage

The current schema stores `mediaUrls`, but a production upload service still needs to be configured. Media used for publishing must be reachable by Meta over the public internet at publish time. citeturn1search12

## 8. Automation and scheduling

The application includes `/api/cron/process` for scheduled publishing and uses idempotent `ScheduledPost.jobId` records plus retry handling.

Vercel's official cron examples support calling Next.js functions from scheduled jobs. citeturn0search8

Important for the free plan: current Vercel Hobby guidance limits native Cron Jobs to once per day. The included `vercel.json` therefore uses a daily cron so a Hobby deployment does not fail validation. citeturn3search0turn3search1

For near-real-time scheduled publishing (for example every 5 minutes), use a separate scheduler/queue service or upgrade the hosting plan. Do not change the Hobby cron expression to `*/5 * * * *` and assume it remains free.

The publish endpoint is protected by `CRON_SECRET` when configured.

## 9. Production checklist

- Set a strong `AUTH_SECRET`.
- Generate a real 32-byte base64 `ENCRYPTION_KEY`.
- Configure `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI`.
- Configure Meta OAuth redirect URI exactly.
- Add only the permissions your app actually needs.
- Complete Meta app review/advanced access requirements when serving users outside your own/test accounts.
- Configure a public media storage provider.
- Configure PostgreSQL.
- Configure `CRON_SECRET`.
- Test OAuth with an eligible Instagram Professional account.
- Test publishing with a non-sensitive test post.
- Verify Analytics access before showing real Insights.
- Never commit `.env.local` or real credentials.

# GrowPilot AI — Roadmap

## Built in this version

- Authentication and protected dashboard
- Brand profile
- AI content generation with demo fallback
- SEO keyword generation
- Content quality score
- Content draft storage
- Scheduling API with duplicate protection
- Instagram OAuth using the modern Instagram Login permission names
- Long-lived token exchange and refresh
- Encrypted token storage
- Instagram profile sync
- Instagram Insights endpoint
- Official image publishing helper
- Automation Center
- Autopilot / Assisted / Manual modes
- Approval settings
- Automation simulation
- Scheduled publishing worker
- Retry handling
- Audit log
- Vercel deployment configuration

## Still requires external configuration

- PostgreSQL production database
- Anthropic API key for live AI
- Meta app credentials and redirect URI
- Meta app permissions/review where required
- Public media storage
- Production scheduler if more frequent than Vercel Hobby's daily cron is required

## Next implementation stages

1. Media upload abstraction using a public object-storage provider.
2. Carousel publishing after validating the current Meta API flow.
3. Reel/video publishing after validating media processing and API requirements.
4. Full Insights synchronization into `AnalyticsSnapshot`.
5. AI performance-learning loop based on real stored analytics.
6. AI-generated 30-day content plans.
7. Multi-account management and account switching.
8. Comment/DM automation only through approved official Meta APIs and permissions.
9. Subscription billing after the core product is validated.

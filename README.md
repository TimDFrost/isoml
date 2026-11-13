# Oh Ya Inc. — Yables × isoML

Monorepo for two complementary products:

| App | Domain | Role |
| --- | --- | --- |
| `@ohya/yables` | yables.com | Free personality discovery (12 sessions, Dr. Yables, free profile export) |
| `@ohya/isoml` | isoml.com | Commercial twin activation, commerce, Reachy Mini × You |

Shared packages: `@ohya/shared`, `@ohya/identity-schema`, `@ohya/billing`, `@ohya/ai`.

## Quick start

```bash
npm install
npm run build -w @ohya/shared -w @ohya/identity-schema -w @ohya/billing -w @ohya/ai
npm run dev:isoml   # http://localhost:3000
npm run dev:yables  # http://localhost:3001
```

## Business rules

- Yables is free through Session 12, including profile download.
- isoML monetizes twin activation / hosted import / hardware services.
- Stripe webhook entitlements gate commercial import — never client redirects.
- Explicit consent required after payment before profile transfer.

## Env

Copy:

- `apps/isoml/.env.example`
- `apps/yables/.env.example`

## Dr. Yables

Architecture: [`docs/dr-yables-architecture.md`](docs/dr-yables-architecture.md)  
Reachy Mini adapter notes: [`docs/reachy-mini-adapter.md`](docs/reachy-mini-adapter.md)

Interview route: `/interview/[1-12]`. Without `HF_TOKEN` or `OPENAI_API_KEY`, the API uses a local demonstration reply.

## Tests

```bash
npm test
```

Paywall/transfer token tests live in `@ohya/billing`. Avatar/conversation/journey tests live in `@ohya/ai` and `@ohya/yables`.

## Deploy notes

Point Vercel (or similar) project roots at `apps/isoml` and `apps/yables` separately for yables.com / isoml.com. Configure DNS at GoDaddy to each deployment.

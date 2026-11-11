# isoML — in search of Machine Learning

Premium website and private studio for **Reachy Mini × You** at [isoml.com](https://isoml.com).

Customers collect stories, writing, preferences, and selected files into an evolving AI twin, review what the system learns, test it in conversation, and eventually connect an approved personality to Reachy Mini.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (available) + CSS motion with reduced-motion support
- Radix / shadcn-style UI primitives

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/demo` | Free demo (no account) |
| `/studio/*` | Private studio foundation |
| `/schedule` | Booking link or honest unavailable |
| `/early-access` | Request early access |
| `/privacy`, `/terms` | Policy pages |

## Environment

See `.env.example`. Without LLM keys, chat/demo use labeled synthetic fallbacks. Without `REACHY_MINI_ENDPOINT`, Reachy stays unavailable/disconnected — never faked as connected. Without `NEXT_PUBLIC_BOOKING_URL`, scheduling shows unavailable.

## Product notes

- Footer exact: `isoML, a subsidiary of Oh Ya Inc, est. 2024`
- Hardware purchase links to Pollen Robotics; no reseller/partnership implication
- Studio drafts persist in `localStorage` until a backend is configured
- Demo session memory uses `sessionStorage` with clear reset

## Deploy

Configured for Vercel (`vercel.json`). Set env vars in the host dashboard, then deploy the production branch to isoml.com.

## License

© Oh Ya Inc. All rights reserved.

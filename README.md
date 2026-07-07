# ISOML — In Search of Modern Law

A production-ready marketing website for **ISOML**, a legal intelligence platform by Oh Ya Inc.

**Live site:** [isoml.com](https://isoml.com)

## Overview

ISOML is a justice data engine that helps legal professionals organize discovery, map evidence to statutory elements, research precedent, and analyze sentencing fairness — with human judgment always at the center.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **shadcn/ui** (Radix primitives)
- **Stripe Checkout**
- **Vercel** deployment ready

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (replace placeholder) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_BASE_URL` | Site URL for checkout redirects |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |

## Deploy to Vercel

```bash
vercel --prod
```

Set environment variables in the Vercel dashboard. The site is configured for automatic Next.js deployment.

## Features

- Dark mode by default with navy/olive brand palette
- Animated knowledge graph hero visualization
- Interactive demo simulation
- Justice Data Engine dashboard mockups
- Founding Design Partner program with Stripe Checkout
- Pitch deck preview
- SEO metadata & Open Graph images
- Accessibility-compliant markup
- Responsive design

## License

© Oh Ya Inc. All rights reserved.

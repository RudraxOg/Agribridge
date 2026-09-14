# AgriBridge

AgriBridge is a high-fidelity, installable Next.js PWA prototype for trusted bulk trade between Farmer Producer Organizations (FPOs) and verified buyers. It joins assisted farmer registration, crop planning, stock evidence, marketplace discovery, orders, logistics, mock provider payments, milestone releases and explainable demand signals in one codebase.

The prototype starts in `INTEGRATION_MODE=mock`. Mock biometrics, grading, payments, video, GPS and forecasts are visibly labelled and must not be presented as production services.

## What works

- Responsive FPO and buyer workspaces with desktop sidebar and mobile bottom navigation
- English and Hindi product experiences, ten locale routes and English fallback
- Controlled demo-role cookie rather than URL-only authorization
- Offline farmer/stock drafts, service worker fallback, sync visibility and installable manifest
- Exact integer-paise fee distribution and audited order/settlement state machines
- Searchable farmer registry, assisted registration, crop calendar and stock publishing
- Buyer filtering, comparison, quality-source separation, checkout and mock payment outcomes
- Six logistics quote types, MapLibre shipment map and deterministic mock GPS movement
- Data.gov.in, LiveKit, Razorpay, BHASHINI, identity, grading and logistics provider seams
- 31-table Supabase schema, private storage buckets, seed data, RLS and SQL policy tests

## Requirements

- Node.js 20.9 or newer
- pnpm 10 or newer
- Docker-compatible container runtime for local Supabase

## Run the interface

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Choose a demo role. No external credentials are needed in mock mode.

## Run with local Supabase

```bash
pnpm db:start
pnpm db:reset
pnpm db:types
pnpm dev
```

Supabase Studio is normally at <http://127.0.0.1:54323>. The checked-in `.env.local` contains non-secret local placeholders only; replace them with values printed by `pnpm db:start`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm test:e2e
pnpm build
```

The combined static/unit/build check is:

```bash
pnpm verify
```

## Main routes

- `/{locale}` — public landing page
- `/{locale}/demo-role` and `/{locale}/login` — controlled demo and auth-ready entry
- `/{locale}/fpo/overview`, `/farmers`, `/crop-calendar`, `/stock`, `/orders`, `/logistics`, `/forecast`, `/payments`
- `/{locale}/buyer/marketplace`, `/products/{lotId}`, `/compare`, `/checkout/{orderId}`, `/orders`, `/payments`
- `/{locale}/calls/{callId}`, `/shipments/{shipmentId}`, `/settlements/{orderId}`, `/notifications`, `/settings`, `/help`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DATABASE.md](docs/DATABASE.md) and [update.md](update.md) for implementation and production-readiness details.

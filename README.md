# AgriBridge

AgriBridge is a high-fidelity, installable Next.js PWA prototype for trusted bulk trade between Farmer Producer Organizations (FPOs) and verified buyers. It joins FPO inventory, stock evidence, marketplace discovery, orders, logistics, mock provider payments, milestone releases and explainable demand signals in one codebase.

The prototype starts in `INTEGRATION_MODE=mock`. Mock grading, payments, video, GPS and forecasts are visibly labelled and must not be presented as production services.

## What works

- Responsive FPO and buyer workspaces with desktop sidebar and mobile bottom navigation
- English and Hindi product experiences, ten locale routes and English fallback
- Supabase SSR Auth screens, verified callbacks, permission-based RBAC, organization switcher, one-time hashed invitations and TOTP readiness
- Offline stock drafts, resumable media queue, service worker fallback, sync visibility and installable manifest
- Exact integer-paise fee distribution and audited order/settlement state machines
- Collection-centre stock creation, quality evidence and marketplace publishing
- Buyer filtering, comparison, quality-source separation, checkout and mock payment outcomes
- Six logistics quote types, MapLibre shipment map and deterministic mock GPS movement
- Data.gov.in, LiveKit, Razorpay, BHASHINI, grading and logistics provider seams
- 44-table Supabase/PostGIS schema, six current storage buckets, normalized media provenance, immutable price snapshots, durable security jobs, seed data, granular RLS and SQL policy tests

## Requirements

- Node.js 20.9 or newer
- pnpm 10 or newer
- Docker-compatible container runtime for local Supabase

## Run the interface

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open <http://localhost:3000>. Choose a demo role. No external credentials are needed in mock mode.

Check the local setup before running tests:

```bash
pnpm check:local
pnpm verify
```

For browser tests, install Chromium once with `pnpm exec playwright install chromium`, then run `pnpm test:e2e`.

If `pnpm` is not available, do not run `npm i` in this pnpm workspace. Use a temporary pnpm runner:

```bash
npx --yes pnpm@10.17.1 install --frozen-lockfile
npx --yes pnpm@10.17.1 check:local
npx --yes pnpm@10.17.1 dev
```

After dependencies are installed, `npm run dev` also works because the scripts use the local Next.js binary.

## Run with local Supabase

```bash
supabase start
supabase db reset
pnpm db:types
pnpm demo:users
pnpm assets:generate
pnpm assets:process
pnpm assets:upload -- --dry-run
pnpm assets:upload
pnpm assets:seed
pnpm dev
```

## Generate and upload demo assets

The checked-in app never depends on a remote image. Generate the synthetic inventory, strip public derivative metadata, preview upload paths, then optionally upload and bind it:

```bash
pnpm assets:generate
pnpm assets:validate
pnpm assets:process
pnpm assets:upload -- --dry-run
pnpm assets:upload
pnpm assets:seed
```

Searching Wikimedia adds review candidates without downloading them:

```bash
pnpm assets:search -- "tomato crates agricultural market India"
pnpm assets:validate
pnpm assets:fetch
```

Change a candidate to `approved` only after checking its source page, author, license and attribution. Unknown, NC and ND licenses are rejected; CC BY-SA 4.0 requires an explicit share-alike review. See [storage and media](docs/storage-and-media.md) and the in-app `/{locale}/credits` page.

Supabase Studio is normally at <http://127.0.0.1:54323>. The checked-in `.env.local` contains non-secret local placeholders only; replace them with values printed by `pnpm db:start`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

The combined static/unit/build check is:

```bash
pnpm verify
```

## Main routes

- `/{locale}` and `/{locale}/credits` — public landing page and asset provenance
- `/{locale}/sign-in`, `/sign-up`, `/verify-email`, `/forgot-password`, `/reset-password`, `/onboarding`, `/invite/accept` — Auth and onboarding
- `/{locale}/demo-role` — controlled FPO, buyer, logistics, driver and platform demos
- `/{locale}/organizations`, `/settings/security`, `/access-denied` — membership selection and security states
- `/{locale}/fpo/overview`, `/stock`, `/orders`, `/logistics`, `/forecast`, `/payments`
- `/{locale}/buyer/marketplace`, `/products/{lotId}`, `/compare`, `/checkout/{orderId}`, `/orders`, `/payments`
- `/{locale}/calls/{callId}`, `/shipments/{shipmentId}`, `/settlements/{orderId}`, `/notifications`, `/settings`, `/help`

Demo access uses role cards rather than shared credentials; see [demo accounts](docs/demo-accounts.md). See [architecture](docs/ARCHITECTURE.md), [authentication and authorization](docs/auth-and-authorization.md), [database](docs/DATABASE.md), [storage and media](docs/storage-and-media.md), [threat model](docs/threat-model.md), [incident response](docs/incident-response.md), and [update.md](update.md) for implementation and production-readiness details.

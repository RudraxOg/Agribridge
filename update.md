# AgriBridge implementation update

Updated: 22 September 2026

## Remaining in-repository implementation completed

- Completed the second organization-route convergence pass. FPO farmer, crop, stock, order, logistics and forecast workflows, plus buyer product, comparison, checkout and order workflows, now have organization-scoped routes with server-enforced permissions and scoped internal links.
- Corrected canonical homes for `fpo_finance` and `buyer_finance`. Finance users now land on settlements/payments instead of dashboards whose lot permissions they intentionally do not hold, and organization shells build navigation from the active permission set.
- Split platform-admin, compliance-auditor and support-agent homes so each role lands on a surface guarded by its own least-privilege permission; no support or audit role inherits platform configuration access.
- Converted the legacy FPO overview into a redirect-only compatibility route. The canonical dashboard now uses the tenant-scoped dashboard resolver, active organization name, signed-in display name and permission-filtered quick actions.
- Completed runtime listing-image derivative processing. Upload completion queues the existing `image_derivatives` job only for listing images; the worker enforces MIME and checksum verification, waits for a clean malware scan, creates a bounded metadata-free WebP derivative, stores it separately from the private original and binds it to the correct tenant-owned lot.
- Hardened processing failure behavior so rejected or failed prerequisites cannot later mark an asset ready. Deferred dependency jobs do not consume retry attempts, and scanner rejection quarantines remaining work for that asset.
- Added unit coverage for finance-safe role homes and metadata-free derivative generation.

Verification for this completion pass: `npm run check` reports 14 files and 37 tests passing; `npm run build` passes; production-backed Playwright runs pass 10/10 desktop and 10/10 mobile. Supabase reset was attempted normally and with elevated execution, but this host still denies Docker socket access.

## Guided demo and first-time onboarding completion

Implemented the reusable, role-aware onboarding and guided-demo feature on 18 September 2026. It builds on the existing Auth, RBAC, Supabase clients, organization routes, mock-mode guardrails and UI primitives; no Android or APK work was added.

- Added post-login entry to `/${locale}/onboarding/welcome`, plus profile, organization, checklist and demo-complete routes. The welcome screen is role-aware, uses the existing logo and language switcher, and offers guided demo, workspace setup and defer actions.
- Added reusable `OnboardingShell` and `CompletionCelebration`, and refined the existing welcome, checklist, restart and launcher components with mobile-first 44px controls, reduced-motion support and synthetic-demo messaging.
- Completed guided-demo permission filtering and hooks, improved the overlay with a dark-green spotlight, bottom-sheet/mobile layout, keyboard controls, a contained focus loop, progress, missing-target recovery and offline retry feedback.
- Persisted live progress through `onboarding_progress`; start/restart creates a `guided_demo_runs` record and an append-only, privacy-safe `guided_demo_events` entry. Mock mode remains visibly simulated and stores only navigation progress in the existing HTTP-only cookie.
- Extended `0016_onboarding_guided_demo.sql` with explicit deny-delete RLS policies. Tenant membership and owner-only policies continue to prevent cross-organization reads/writes and platform-role implicit access.
- Added `supabase/tests/guided_demo_authorization.sql` for onboarding/demo table and policy assertions, driver-finance separation, buyer document denial, anonymous denial and metadata protections.
- Added unit coverage for permission-filtered tour eligibility. The full Vitest suite now reports 12 files and 33 tests passing.

### Verification status

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed (12 files, 33 tests).
- `npm run build` — passed. Next now uses its compiler-API TypeScript checker because the Next CLI wrapper intermittently parsed a truncated `tsc --showConfig` stream on this host; direct `tsc` verification remains part of the normal check script.
- Supabase database reset/pgTAP runtime execution and Playwright require the local Docker/Supabase environment, which is not available in this workspace. The migration and pgTAP coverage are included but not claimed as executed.

## Local compilation optimization

- Narrowed `tsconfig.json` from a repository-wide `**/*.ts` graph to the Next runtime (`src`, `proxy.ts`, `next.config.ts`, and generated `.next` types), avoiding tests, scripts and tooling during local route compilation.
- Lazy-loaded the guided-demo runtime and role tour definitions so public and ordinary workspace routes do not eagerly compile the interactive tour UI. Dev filesystem caching is disabled because this repository is on a mounted filesystem where Turbopack cache compaction stalled navigation for 10–15 seconds; production build caching remains unaffected.
- Moved `initialAuthState` and `AuthActionState` into `src/features/auth/action-state.ts`; `actions.ts` now exports only server functions, preventing Turbopack’s `use server` evaluation error and unnecessary Fast Refresh reloads.

## Repository map

```text
agribridge/
├── assets/{manifest,originals,generated,processed,attribution}
├── docs/{ARCHITECTURE,DATABASE,DESIGN_SYSTEM,INTEGRATIONS,PRIVACY_AND_COMPLIANCE,USER_FLOWS}.md
├── docs/{auth-and-authorization,demo-accounts,incident-response,storage-and-media,threat-model}.md
├── messages/{en,hi,mr,pa,bn,gu,te,ta,kn,or}.json
├── public/{generated,icons,offline.html,sw.js}
├── scripts/{create-demo-users,check-local}.ts|mjs
├── scripts/assets/{common,magic,search-wikimedia,validate-licenses,fetch-assets,generate-demo-assets,process-assets,upload-assets,seed-media}.ts
├── src/app/[locale]/{(auth),(public),(protected),(fpo),(buyer),(shared)}
├── src/app/api/{uploads,files,payments,logistics,market-data,video,cron,demo-session}
├── src/components/{accessibility,auth,features,shared,shell,ui}
├── src/{domain,features,integrations,lib,modules,types}
├── supabase/{migrations,functions,seed.sql,tests}
├── tests/{unit,integration,e2e}
├── .env.example
├── .nvmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## Implemented application

- Next.js 16.3.5 App Router PWA with React 19.2.8, strict TypeScript, Tailwind CSS 4, next-intl, responsive shells, offline fallback, install manifest and hydration-stable reduced-motion page transitions.
- Navigable FPO, assisted-farmer, buyer, logistics dispatcher, assigned-driver and restricted platform-admin demo workspaces.
- Farmer registry/crop calendar, stock wizard with recoverable upload queue, marketplace filters and quality inspection, 12-frame viewers, orders, quotes, GPS simulation, settlement timeline and deterministic forecasts.
- Integer-paise order calculator and validated order/settlement machines with exact 4% FPO share, 1% AgriBridge share and balance-preserving 50/50 releases.
- English/Hindi key entry flows plus localized navigation and native language switching for Marathi, Punjabi, Bengali, Gujarati, Telugu, Tamil, Kannada and Odia. English deep fallback remains for untranslated workflow copy.
- Security headers include CSP, frame denial, MIME sniff prevention, referrer policy and constrained camera/microphone/geolocation permissions.

## Authentication and authorization added

- Supabase SSR browser/server clients, cookie refresh Proxy and server-verified user lookup. Protected data never relies on `getSession()`, React visibility or a URL role.
- Email/password sign-in/sign-up, visibility toggle, generic errors, verification/resend, callback exchange with same-origin redirect validation, recovery/reset, onboarding, access-denied and security pages.
- Reusable organization/platform roles, dot-separated permissions and role-permission mappings. Organization memberships are revocable and platform assignments remain separate.
- Typed `getAccessContext()`, `requireUser`, `requireOrganizationMember`, `requirePermission`, platform permission/MFA guards, `PermissionGate`, `RoleHomeRedirect`, `OrganizationSwitcher`, `InviteMemberDialog`, `MembershipTable`, `AccessDeniedState` and `SensitiveActionConfirm`.
- Organization creation plus owner membership is transactional and requires verified email. Invitations use a one-way SHA-256 token hash, exact confirmed email, expiry and one-time acceptance. Ordinary member management cannot transfer ownership or grant platform roles.
- TOTP enrollment readiness with AAL2 enforcement for high-risk live actions; mock mode clearly states that no factor is created.
- Four Edge Function entry points for organization creation, invite acceptance, member management and upload-token issuance.
- `pnpm demo:users` refuses non-local Supabase URLs, rotates random temporary credentials and prints them only to the local terminal.

## Database and RLS

Seventeen ordered migrations now define 62 tables. The later security and onboarding migrations are:

- `0011_permission_rbac_and_auth.sql` — roles, permissions, role mappings, revocable memberships, platform assignments, hashed invitations, auth/security events, safe signup trigger, permission helpers, onboarding/invite/member RPCs and MFA/email checks.
- `0012_security_operations.sql` — quarantine fields, shipment driver assignments and PostGIS positions, processing jobs, durable webhook claims, rate-limit counters, sensitive-access events, retention policy, field-protection columns and service-only job/retention functions.
- `0013_granular_rls_and_marketplace.sql` — replaces principal legacy enum policies with target-organization permission checks, adds a security-invoker sanitized marketplace view and tightens Storage policies.
- `0014_remove_farmer_subsystem.sql` and forward-only `0015_restore_farmer_subsystem.sql` — preserve migration history while converging existing databases on the restored farmer, crop, contributor and payout surfaces.
- `0016_onboarding_guided_demo.sql` — adds tenant-scoped onboarding progress, guided-demo runs/events and deterministic demo bindings.
- `0017_signup_intent_and_organization_onboarding.sql` — adds non-authoritative signup intent plus organization-type onboarding profiles and service areas.

RLS intent now covers suspended/revoked membership, finance separation, assigned-driver writes, support-role denial, owner/platform escalation prevention and private-file auditing. `supabase/tests/rbac_authorization.sql` verifies the role matrix and required security objects; `rls_policies.sql` asserts the explicit policy names.

## Storage, processing and assets

- Current buckets: `public-brand-assets`; policy-gated `public-listing-media`; private `private-stock-originals`, `farmer-documents`, `grading-certificates`, `delivery-proofs`, and `dispute-evidence`. Legacy `stock-media` remains for migration compatibility only.
- Direct upload token checks use verified identity and granular permission RPCs. Delivery proof paths resolve the order and shipment. Upload completion verifies Storage existence before inserting metadata.
- TUS resume remains for files at or above 6 MiB; small files use one-use signed upload tokens. Both paths finalize into durable validation jobs.
- The worker recalculates SHA-256, checks magic-byte MIME, calls a scanner adapter and quarantines rejects. Live mode fails closed without a configured scanner. Sensitive downloads use two-minute, non-cacheable signed URLs plus allowed/denied audit events.
- Retention automation deletes only expired Storage objects without legal hold, preserves disposition metadata, expires rate counters and minimizes old auth network/device hints.
- The field-protection boundary provides synthetic-only demo protection, AES-256-GCM for controlled local development and a fail-closed KMS placeholder. An approved production KMS is not invented.
- Deterministic inventory: wordmark/mark, four state illustrations, 24 crop views, four vehicles, twelve initials-only avatars, two 12-frame sequences and four visibly watermarked synthetic PDFs.
- `sharp` now produces 144 metadata-free AVIF/WebP/JPEG derivatives. Media seeding creates 74 stable source/file rows and 32 deterministic lot/sequence bindings when Supabase credentials are configured.
- No third-party photos are in use, so no current manual license review is outstanding. Future Wikimedia candidates remain blocked until approved with complete attribution.

## Commands actually run

## Signed-in routing, onboarding, and guided-demo follow-up

- Added a central, server-side signed-in entry resolver. It uses `getAccessContext()` and persisted onboarding state to order email verification, profile completion, organization selection, organization setup, guided demo, and canonical role home.
- Canonical driver home is now `/[locale]/logistics/[organizationSlug]/my-trips`; the older `/trips` route remains available as a compatibility adapter. Added organization-scoped FPO settlements and buyer payments adapters.
- Legacy FPO overview now resolves the active organization and redirects to the canonical dashboard instead of being a competing home route.
- Replaced the static onboarding checklist state with an authorized, database-derived resolver. Mock workspaces display visibly simulated completion; live workspaces derive counts from tenant data and do not expose actions without permission.
- Guided-demo startup no longer invokes synthetic record creation for a live organization. Live users receive preview-only tours until an explicit separate demo workspace exists; mock mode retains the synthetic interactive demo.
- Fixed a Next.js 16 build defect by moving MapLibre's `ssr: false` dynamic import into a Client Component loader. This keeps the map lazy without using a forbidden Server Component dynamic boundary.
- Verification: `npm run lint`, `npm run typecheck`, `npm run test` (13 files / 35 tests), and `npm run build` passed. `npm run test:e2e` started its web server but could not run because Playwright Chromium is not installed in this environment. Supabase/Docker tests were not run.

## Guided demo runtime and device performance follow-up

- Fixed the `Failed to fetch` runtime crash from background guided-demo progress writes. Saves now use a short abort timeout, degrade gracefully when the local API/Supabase is unavailable, and never reject into the React effect tree.
- Added defensive persistence handling in the tour overlay and de-duplicated step progress writes so route transitions do not create repeated requests.
- Guided-demo progress is no longer fetched on unrelated public routes, reducing background network work and client overhead on lower-powered devices.
- Verification after this fix: `npm run typecheck`, `npm run lint`, and the guided-demo unit test passed.

- `pnpm assets:generate` — passed; 74 deterministic assets.
- `pnpm assets:process` — passed; 144 AVIF/WebP/JPEG derivatives. The first sandboxed attempt hit a local `tsx` IPC restriction; the approved rerun passed.
- `pnpm assets:seed` — passed; 74 stable rows and credits prepared. Database upsert was correctly skipped because credentials are blank.
- `pnpm lint` — passed with zero warnings.
- `pnpm typecheck` — passed.
- `pnpm test` — passed; 10 files, 24 tests.
- `pnpm build` — passed; 346 route variants and all new auth/security endpoints compiled.
- `pnpm test:e2e` — passed; 18/18 Chromium desktop/mobile flows, including auth UI, driver-only routing, platform view, language persistence and hydration monitoring.
- `pnpm db:reset` — attempted twice. The elevated attempt reached the Docker check but failed because this host denies access to `/var/run/docker.sock`. No migration result is claimed.

## Demo access

Credential-free mock mode: open `/en/demo-role` and choose FPO Operator, Bulk Buyer, Assisted Farmer, Dispatcher, Driver or Platform Admin. The HTTP-only same-site cookie is a navigation demo, not production authorization.

## Android distribution foundation

- Added the public Android release metadata endpoint and a server-side download resolver. The resolver exposes only the latest published stable release, rate-limits requests, records a privacy-safe aggregate event, and redirects only to a configured immutable HTTPS artifact URL.
- Added `0019_mobile_app_releases.sql`: published stable metadata is the only public RLS surface; platform configuration permission is required for release management. APK artifacts are deliberately separate from farmer and evidence storage.
- Added the reusable official Android download control, installation guide, and `/[locale]/download` share page. The interface explains that Android requires the user to explicitly allow installation from their browser and never claims automatic installation.
- Capacitor package installation and native Android generation are pending because the mounted pnpm store did not complete dependency installation. No APK, AAB, signing, Play publication, or device installation is claimed by this update.

Local Auth fixture emails are created only by `pnpm demo:users`: `fpo.owner@demo.invalid`, `fpo.operator@demo.invalid`, `fpo.finance@demo.invalid`, `buyer.owner@demo.invalid`, `buyer.procurement@demo.invalid`, `logistics.dispatch@demo.invalid`, `logistics.driver@demo.invalid`, and `platform.admin@demo.invalid`. Passwords are random, rotated per run and never committed.

## Integration status

| Capability | Status |
| --- | --- |
| Local images/documents and derivatives | Real deterministic local pipeline |
| Wikimedia discovery | Real candidate-only API script; no candidate auto-approved |
| Supabase Auth/schema/Storage/Realtime | Code and migrations implemented; runtime verification blocked by Docker/blank credentials |
| Email delivery | Supabase adapter path; requires production SMTP/configuration |
| TOTP MFA | Supabase implementation path; requires live Auth configuration |
| Upload queue/finalization/jobs | Implemented; UI transfer remains simulated without credentials |
| Malware scan | Deterministic demo adapter; live adapter requires approved endpoint/token |
| Field encryption | Local AES-GCM implemented; production KMS selection/credentials pending |
| Payments/protected funds | Mock only; regulated provider and legal review required |
| Webhook idempotency | Durable database claim in live mode; in-memory mock adapter only in mock mode |
| Logistics/GPS | Deterministic simulation; constrained Realtime-ready position table |
| Forecast/market data | Deterministic estimate; Data.gov.in adapter needs credentials |
| Video | Simulated provider; LiveKit needs deployment/credentials |
| Voice | Browser provider with failure states; BHASHINI needs onboarding |
| Identity/biometric presence | Provider-reference simulation only; no raw biometric material |

## Remaining external or environment work

- Run `supabase db reset`, pgTAP tests and `pnpm db:types` on a host with Docker access; then exercise real Auth memberships, invite email delivery, Storage policies and signed downloads.
- Connect and validate an approved malware scanner and production KMS/HSM, including key rotation and recovery drills. Runtime public derivative creation is implemented; deployment must schedule the authenticated processing worker.
- Complete professional translation and screen-reader review for deep workflow copy beyond English/Hindi, plus real-device speech and map-alternative testing.
- Configure production SMTP, CAPTCHA/provider Auth limits, monitoring, backup/restore exercises and scheduled worker authentication.
- Complete legal/provider review for DPDP notices, retention/erasure, grievance and incident duties, regulated payments, protected-funds terminology and identity workflows. No legal compliance certification is claimed.

The frontend design work retained the established organic/utilitarian direction while making permission context, simulated status, touch targets, focus, reduced motion and driver/platform separation explicit.

## Playwright Chromium installation and E2E completion

- Installed the Playwright-managed Chromium browser with `pnpm exec playwright install chromium`.
- Fixed the language switch test to use the native Playwright select interaction, exercising the application’s real locale-navigation handler.
- Fixed the mobile checkout test to keyboard-activate the accessible `Open order` link after mock payment confirmation, covering the small-viewport overlap case.
- The fixed local-only demo sign-in identity no longer consumes the shared mock development rate-limit bucket. Invalid mock sign-ins and every live sign-in remain rate limited.
- Verified the complete E2E suite in separate projects to capture full terminal output:
  - `pnpm exec playwright test --project=chromium` — **10/10 passed**.
  - `pnpm exec playwright test --project=mobile` — **10/10 passed**.
  - Total: **20/20 passed**.

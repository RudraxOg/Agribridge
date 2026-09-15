# AgriBridge implementation update

Updated: 15 September 2026

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
- Navigable FPO, buyer, logistics dispatcher, assigned-driver and restricted platform-admin demo workspaces.
- Collection-centre stock wizard with recoverable upload queue, marketplace filters and quality inspection, 12-frame viewers, orders, quotes, GPS simulation, settlement timeline and deterministic forecasts.
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

Fourteen ordered migrations now define 44 tables. The current migrations include:

- `0011_permission_rbac_and_auth.sql` — roles, permissions, role mappings, revocable memberships, platform assignments, hashed invitations, auth/security events, safe signup trigger, permission helpers, onboarding/invite/member RPCs and MFA/email checks.
- `0012_security_operations.sql` — quarantine fields, shipment driver assignments and PostGIS positions, processing jobs, durable webhook claims, rate-limit counters, sensitive-access events, retention policy, field-protection columns and service-only job/retention functions.
- `0013_granular_rls_and_marketplace.sql` — replaces principal legacy enum policies with target-organization permission checks, adds a security-invoker sanitized marketplace view and tightens Storage policies.
- `0014_remove_farmer_subsystem.sql` — forward-only retirement of the registry, land/crop contributor records, payout records, private registry-document bucket and related permissions; retained order snapshot columns are renamed to supplier/FPO terminology.

RLS intent now covers suspended/revoked membership, finance separation, assigned-driver writes, support-role denial, owner/platform escalation prevention and private-file auditing. `supabase/tests/rbac_authorization.sql` verifies the role matrix and required security objects; `rls_policies.sql` asserts the explicit policy names.

## Storage, processing and assets

- Current buckets: `public-brand-assets`; policy-gated `public-listing-media`; private `private-stock-originals`, `grading-certificates`, `delivery-proofs`, and `dispute-evidence`. Legacy `stock-media` remains for migration compatibility only.
- Direct upload token checks use verified identity and granular permission RPCs. Delivery proof paths resolve the order and shipment. Upload completion verifies Storage existence before inserting metadata.
- TUS resume remains for files at or above 6 MiB; small files use one-use signed upload tokens. Both paths finalize into durable validation jobs.
- The worker recalculates SHA-256, checks magic-byte MIME, calls a scanner adapter and quarantines rejects. Live mode fails closed without a configured scanner. Sensitive downloads use two-minute, non-cacheable signed URLs plus allowed/denied audit events.
- Retention automation deletes only expired Storage objects without legal hold, preserves disposition metadata, expires rate counters and minimizes old auth network/device hints.
- The field-protection boundary provides synthetic-only demo protection, AES-256-GCM for controlled local development and a fail-closed KMS placeholder. An approved production KMS is not invented.
- Deterministic inventory: wordmark/mark, four state illustrations, 24 crop views, six generated crop photographs, four vehicles, two 12-frame sequences and three visibly watermarked synthetic PDFs.
- The six crop photographs in `public/stocks` are mapped by crop across landing, FPO stock and buyer marketplace/detail views and fall back to generated WebP artwork on load failure. The onboarding stock cards do not show an AI badge.
- The asset pipeline now registers 67 deterministic source assets. Derivative and binding counts are refreshed whenever `pnpm assets:process` and `pnpm assets:seed` run.
- No third-party photos are in use, so no current manual license review is outstanding. Future Wikimedia candidates remain blocked until approved with complete attribution.

## Commands actually run

- `pnpm assets:generate` — passed; 67 registered deterministic/generated assets, including six generated crop photographs.
- `pnpm assets:process` — passed; 144 AVIF/WebP/JPEG derivatives. The first sandboxed attempt hit a local `tsx` IPC restriction; the approved rerun passed.
- `pnpm assets:seed` — passed; 67 stable rows and credits prepared. Database upsert was correctly skipped because credentials are blank.
- `pnpm lint` — passed with zero warnings.
- `pnpm typecheck` — passed.
- `pnpm test` — passed; 11 files, 31 tests.
- `pnpm build` — passed; 316 route variants compiled, with the retired registry and crop-calendar routes absent.
- `pnpm test:e2e` — passed; 18/18 Chromium desktop/mobile flows, including stock publishing, explicit registry-route retirement, auth UI, driver-only routing, platform view, language persistence and hydration monitoring.
- `pnpm db:reset` — attempted after migration 0014 was added. It reached the Docker check but failed because this host denies access to `/var/run/docker.sock`. No migration result is claimed.

## Demo access

Credential-free mock mode: open `/en/demo-role` and choose FPO Operator, Bulk Buyer, Dispatcher, Driver or Platform Admin. The HTTP-only same-site cookie is a navigation demo, not production authorization.

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

## Remaining external or environment work

- Run `supabase db reset`, pgTAP tests and `pnpm db:types` on a host with Docker access; then exercise real Auth memberships, invite email delivery, Storage policies and signed downloads.
- Connect and validate an approved malware scanner and production KMS/HSM, including key rotation and recovery drills. Runtime public derivative creation still needs a deployed image worker; local/seed derivatives are complete.
- Complete professional translation and screen-reader review for deep workflow copy beyond English/Hindi, plus real-device speech and map-alternative testing.
- Configure production SMTP, CAPTCHA/provider Auth limits, monitoring, backup/restore exercises and scheduled worker authentication.
- Complete legal/provider review for DPDP notices, retention/erasure, grievance and incident duties, regulated payments and protected-funds terminology. No legal compliance certification is claimed.

The frontend design work retained the established organic/utilitarian direction while making permission context, simulated status, touch targets, focus, reduced motion and driver/platform separation explicit.

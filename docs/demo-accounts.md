# Demo access

Mock sign-in is available for local/demo mode with username `test.username` and password `test.password`. These values are accepted only when `INTEGRATION_MODE=mock`; live mode delegates to Supabase Auth.

Open `/{locale}/demo-role` and choose one of these controlled demonstrations:

- **FPO Operator** — farmer registry, crop calendar, stock listing, orders, logistics and settlements.
- **Bulk Buyer** — marketplace, quality evidence, multi-angle viewer, logistics quotes, checkout and orders.
- **Assisted Farmer** — large-control, operator-assisted farmer registration.
- **Dispatcher** — logistics assignment and shipment state workspace.
- **Driver** — assigned-trip-only view with constrained position/proof actions.
- **Platform Admin** — restricted, MFA-labelled operations view.

The choice is stored in an HTTP-only, same-site cookie for eight hours. It is a navigation aid, not production authentication or authorization.

For local RLS testing, run `pnpm demo:users` after `supabase db reset`. The command refuses non-local URLs, generates and rotates random temporary passwords, and prints them only to the local terminal. No static password is committed.

To deliberately seed only these three synthetic accounts into a configured remote Supabase project, use `REMOTE_DEMO_SEED_CONFIRMATION=<exact Supabase host> pnpm exec tsx scripts/create-demo-users.ts --remote-demo`. The exact-host confirmation prevents an accidental remote write.

The three ready-to-test workspace owners are:

- `fpo.owner@demo.invalid` — Anita Singh, Awadh Pragati FPC; crop, farmer-count and settlement-preference form data is complete.
- `buyer.owner@demo.invalid` — Rohan Mehta, Lucknow Fresh Mart; buyer type, monthly volume and procurement-preference data is complete.
- `logistics.dispatch@demo.invalid` — Kavita Sharma, Gati Demo Logistics; fleet, cold-storage, operating-hours and service-area data is complete.

Each receives an active organization membership and completed onboarding record, so it opens directly in its role workspace. All names, locations and operating data are synthetic local test data.

# Demo access

No password, OTP, bank credential or payment credential is required in mock mode.

Open `/{locale}/demo-role` and choose one of these controlled demonstrations:

- **FPO Operator** — farmer registry, crop calendar, stock listing, orders, logistics and settlements.
- **Bulk Buyer** — marketplace, quality evidence, multi-angle viewer, logistics quotes, checkout and orders.
- **Assisted Farmer** — large-control, operator-assisted farmer registration.
- **Dispatcher** — logistics assignment and shipment state workspace.
- **Driver** — assigned-trip-only view with constrained position/proof actions.
- **Platform Admin** — restricted, MFA-labelled operations view.

The choice is stored in an HTTP-only, same-site cookie for eight hours. It is a navigation aid, not production authentication or authorization.

For local RLS testing, run `pnpm demo:users` after `supabase db reset`. The command refuses non-local URLs, generates and rotates random temporary passwords, and prints them only to the local terminal. No static password is committed.

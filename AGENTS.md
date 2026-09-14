<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AgriBridge project rules

- Keep `INTEGRATION_MODE=mock` as the default and label simulations visibly.
- Use integer paise and the domain calculators for every money operation.
- Never add raw biometric material, complete Aadhaar values, card data, CVV, bank credentials, provider secrets, signed URLs, or auth tokens to logs, browser storage, fixtures, or analytics.
- Tenant-owned database changes require RLS, an organization key, safe foreign keys, and tests.
- Order and settlement states may change only through validated domain transitions and append-only audit events.
- Minimum interactive target is 44×44px; preserve keyboard focus and reduced-motion behavior.
- Server-only integrations belong in `src/integrations`; UI must call route handlers or server actions.

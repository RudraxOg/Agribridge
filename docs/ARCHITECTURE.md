# Architecture

AgriBridge is a modular monolith built with Next.js App Router. Server Components render data-first pages; Client Components are isolated to search, local drafts, mock provider controls, maps, speech and motion. Internal authenticated changes are shaped as Server Actions while external callbacks use Route Handlers.

## Boundaries

1. `src/app` owns routing, layouts and HTTP entry points.
2. `src/components` owns reusable presentation and interactive feature views.
3. `src/modules` owns use-case schemas, actions and queries.
4. `src/domain` owns deterministic money and state transitions without framework dependencies.
5. `src/integrations` owns provider interfaces plus mock/live adapters.
6. `src/lib/supabase` owns browser, server and service-role clients.
7. `supabase` owns schema, policies, storage and deterministic seed data.

The browser never receives provider API secrets or the Supabase service-role key. Provider webhooks verify their raw body signature and claim an idempotency key before processing. Production persistence must replace the prototype in-memory webhook claim after database reset verification.

## Authorization

The demo role endpoint writes an HTTP-only cookie. It demonstrates that role selection is not granted by a URL parameter. Production authorization comes from Supabase Auth plus `organization_members`; RLS remains the final data boundary. Proxy is limited to locale routing/session refresh and is not treated as authorization.

## Offline boundary

Farmer and stock drafts may be stored locally. Identity documents, payment pages, sensitive API payloads, signed URLs and auth tokens are excluded from the service-worker cache. Drafts contain only operational fields; production must encrypt any sensitive offline field or omit it.

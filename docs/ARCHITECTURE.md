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

The browser never receives provider API secrets or the Supabase service-role key. Live provider webhooks verify their raw body signature and persist the provider event ID plus exact payload SHA-256 before processing. The in-memory claim exists only in the visibly mocked provider.

## Authorization

The demo role endpoint writes an HTTP-only cookie. It demonstrates that role selection is not granted by a URL parameter. Production authorization comes from Supabase Auth, reusable role-permission mappings, revocable organization memberships and separate platform assignments; RLS remains the final data boundary. Proxy is limited to locale routing/session refresh and is not treated as authorization. See [authentication and authorization](auth-and-authorization.md).

## Offline boundary

Stock drafts may be stored locally. Payment pages, sensitive API payloads, signed URLs and auth tokens are excluded from the service-worker cache. Drafts contain only operational lot fields; production must encrypt any newly introduced sensitive offline field or omit it.

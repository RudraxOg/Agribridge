# Authentication and authorization

Supabase Auth is the identity provider in live mode. Next.js Proxy refreshes cookies only; it is not an authorization boundary. Protected Server Components, Server Actions and Route Handlers call `getUser()` or `getClaims()` and then resolve the active membership. PostgreSQL RLS makes the final decision through target-organization permission checks.

`roles`, `permissions` and `role_permissions` are reusable catalogs. `organization_members` is the authoritative revocable tenant membership; platform assignments are held separately. An account can have several memberships and must select a workspace when more than one is active. Drivers route only to assigned trips. Owner transfer and platform-role assignment are intentionally excluded from ordinary member-management workflows.

Sign-up metadata controls onboarding copy only. The `auth.users` trigger copies a bounded display name and never reads a role, permission, ownership or verification flag from user metadata. Creating an organization and its owner membership happens in one verified-email database function. Invitations store a SHA-256 token hash, expire after seven days, require the exact confirmed email and are one-time use.

High-risk roles and settlement requests require AAL2. The security page supports Supabase TOTP enrollment when live Auth is configured. Mock mode visibly reports that no factor is created.

## Supabase dashboard checklist

- Site URL: the production HTTPS origin.
- Redirect allowlist: exact production origin plus `/auth/callback`, `/reset-password`, `/invite/accept`; keep localhost entries development-only.
- Email confirmation: enabled before organization creation, invitations and stock publishing.
- Email templates: avoid sensitive tenant data and use short-lived links.
- SMTP: configure a production sender with SPF, DKIM and DMARC.
- Rate limits: retain Supabase Auth limits in addition to the database-backed application limiter.
- CAPTCHA: enable for public sign-up/resend flows when abuse risk warrants it.
- MFA: enable TOTP challenge and verification. Privileged UI alone does not enforce MFA; database helpers check AAL2.

`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and appears only in server integrations, scheduled workers and local demo-user creation. Run `pnpm demo:users` only against localhost. It rotates random temporary passwords and prints them once to the local console; none are committed.

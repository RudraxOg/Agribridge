# Threat model

The protected assets are private stock and delivery evidence, organization membership, order price snapshots, payment events, settlement milestones, provider credentials, and audit history.

Primary threats include cross-tenant reads, insecure direct object references, poisoned uploads, metadata/GPS leakage, public original-media exposure, replayed provider webhooks, client-forged state transitions, signed-URL leakage, offline-device loss, and accidental sensitive logging.

Controls in the prototype include permission-based target-organization RLS, separate platform assignments, scoped Storage policies, server-only service credentials, Zod validation, MIME signature checks, upload limits, unique paths, derivative metadata stripping, short-lived signed upload/download authorization, integer-paise domain calculators, validated transition functions, append-only event permissions, masked test identifiers, durable webhook claims, database rate limits, sensitive-read audit events, quarantine jobs and visibly simulated integrations.

The worker lifecycle is implemented, but live deployments must connect and validate an approved malware engine; live mode refuses to mark files clean without it. The field-protection interface includes local AES-GCM for controlled development and a fail-closed KMS placeholder; an approved KMS/HSM and rotation process remain deployment work. Residual work also includes real-device offline retention testing, backup/restore drills, incident exercises, provider security review, professional translation review and a completed DPIA. Deployments must define DPDP notice, consent withdrawal, retention, erasure, grievance and breach-response procedures with counsel.

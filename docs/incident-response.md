# Incident response runbook

This is an operational template, not a compliance certification.

1. Triage and contain: identify the affected organization and resource types, disable the compromised account, revoke memberships or platform assignments, invalidate sessions, pause upload/payment workers and place relevant assets under legal hold.
2. Preserve evidence: retain append-only auth, security, sensitive-access, webhook and settlement events. Do not copy raw credentials, signed URLs, biometric data or full identity references into tickets.
3. Assess scope: use tenant IDs, event timestamps and provider references to determine affected records. Separate confidentiality, integrity and availability impact.
4. Eradicate and recover: rotate server/provider keys, patch the entry point, verify RLS and Storage policies, restore from a tested backup when required, and monitor replay/idempotency controls.
5. Notify and support: involve the designated privacy, security, legal and provider contacts. Determine DPDP, contractual and sector notification duties with counsel; the application does not claim a fixed statutory conclusion.
6. Learn: document cause, detection gap, timeline and corrective owner. Exercise this runbook and backup restoration at least annually before production use.

Never delete evidence under an active legal hold. The retention worker deletes only expired Storage objects with `legal_hold=false` and keeps the database disposition record.

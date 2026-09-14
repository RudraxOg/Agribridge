# Database

Eight ordered migrations create 31 UUID-keyed domain tables, supporting enums, triggers, indexes, RLS and private storage policies. Tenant records carry `organization_id`; order, shipment and dispute records carry both FPO and buyer organizations.

## Table groups

- Identity and tenancy: `organizations`, `profiles`, `organization_members`, `consent_records`, `identity_verifications`, `bank_account_references`
- Production: `farmers`, `land_parcels`, `crop_cycles`
- Stock and quality: `stock_lots`, `lot_contributors`, `lot_media`, `grading_reports`, `grading_parameters`, `certificates`
- Trade: `buyer_requests`, `video_calls`, `orders`, `order_items`
- Movement: `logistics_quotes`, `shipments`, `tracking_events`
- Money: `payment_transactions`, `fee_rules`, `order_charges`, `settlements`, `escrow_milestones`, `farmer_payouts`
- Operations: `forecasts`, `notifications`, `disputes`, `audit_logs`, `push_subscriptions`

Money uses `bigint` paise. Quantity uses `numeric` plus a `quantity_unit` enum. Payment transactions, milestone events and audit logs are append-only. Browser roles have no policy for provider payment updates, direct fund releases or audit insertion.

Storage buckets are private: `stock-media`, `grading-certificates`, `farmer-documents`, `delivery-proofs`, and `dispute-evidence`. Object paths begin with the organization UUID. Applications issue short-lived signed URLs only after an authorization check.

The SQL policy test file asserts explicit policies for farmer access, buyer published-lot access, order/shipment participant access, immutable payment state and controlled audit insertion.

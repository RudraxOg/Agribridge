# Database

Thirteen ordered migrations define 54 UUID-keyed domain/security tables, supporting PostGIS, enums, triggers, indexes, RLS and private/public storage policies. Tenant records carry `organization_id`; orders and shipments resolve each participating organization explicitly.

## Table groups

- Identity and tenancy: `organizations`, `profiles`, `roles`, `permissions`, `role_permissions`, `organization_members`, `platform_role_assignments`, `organization_invites`, `auth_events`, `security_events`, `consent_records`, `identity_verifications`, `bank_account_references`
- Production: `farmers`, `land_parcels`, `land_documents`, `farmer_auth_methods`, `crop_catalog`, `crop_cycles`, `collection_centres`
- Stock and quality: `stock_lots`, `lot_contributors`, `lot_media`, `grading_reports`, `grading_parameters`, `certificates`, `asset_sources`, `file_assets`, `stock_lot_assets`
- Trade: `buyer_requests`, `video_calls`, `orders`, `order_items`, `order_price_snapshots`
- Movement: `logistics_quotes`, `shipments`, `tracking_events`, `shipment_positions`
- Money: `payment_transactions`, `fee_rules`, `order_charges`, `settlements`, `escrow_milestones`, `farmer_payouts`
- Operations: `forecasts`, `notifications`, `disputes`, `audit_logs`, `push_subscriptions`, `processing_jobs`, `webhook_events`, `rate_limit_counters`, `sensitive_access_events`, `data_retention_policies`

Money uses `bigint` paise. Quantity uses `numeric` plus a `quantity_unit` enum. Payment transactions, milestone events and audit logs are append-only. Browser roles have no policy for provider payment updates, direct fund releases or audit insertion.

Storage separates `public-brand-assets` and public stripped derivatives in `public-listing-media` from private originals in `private-stock-originals`, `farmer-documents`, `grading-certificates`, `delivery-proofs`, and `dispute-evidence`. Tenant object paths begin with the organization UUID. Applications issue short-lived signed URLs only after authorization.

The SQL policy test file asserts explicit policies for farmer access, buyer published-lot access, order/shipment participant access, immutable payment state and controlled audit insertion.

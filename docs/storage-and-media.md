# Storage and media

AgriBridge separates public derivatives from private originals. PostgreSQL stores metadata and associations only; binary content belongs in Supabase Storage or the checked-in local demo fallback.

## Buckets

| Bucket | Access | Purpose |
| --- | --- | --- |
| `public-brand-assets` | public | wordmark, compact mark, PWA and generated illustrations |
| `public-listing-media` | policy-gated anonymous read | accepted derivatives attached to a currently published lot |
| `private-stock-originals` | tenant roles | original photos and short video |
| `farmer-documents` | authorized FPO roles | consented land records; seed files are synthetic |
| `grading-certificates` | scoped signed URL | quality certificates |
| `delivery-proofs` | order participants | loading and delivery evidence |
| `dispute-evidence` | case participants | dispute evidence |

Migration `0009_asset_catalog_and_storage.sql` adds `asset_sources`, `file_assets`, and ordered `stock_lot_assets`; migrations `0012` and `0013` add quarantine state, processing jobs and permission-based policies. Checksums are unique per bucket, and object paths reject obvious sensitive terms. The listing bucket is not a blanket public bucket: anonymous reads require a clean, ready asset associated with a currently published lot. Private originals and farmer documents require explicit permissions.

## Runtime uploads

The listing wizard checks claimed and detected MIME types, file size and count before saving the Blob to IndexedDB. Images may be compressed in a Web Worker. Small configured uploads request a one-use signed upload token from `/api/uploads/token`; files at or above 6 MiB use TUS with resume fingerprints and retry delays. After transfer, `/api/uploads/complete` verifies that the object exists and creates pending metadata plus MIME, scan and metadata jobs. A cron worker atomically claims jobs, recalculates the checksum and refuses live scanning when no approved scanner is configured. The local demo scanner is deterministic and clearly non-production.

Private downloads use a two-minute signed URL only after permission/order checks and append an allowed or denied sensitive-access event. A retention worker removes only expired objects without legal hold, anonymizes old network/device audit hints and retains the disposition metadata.

Paths use UUIDs, dates, and non-personal document types. Names, phone numbers, Aadhaar values, bank references, signed URLs and tokens must never enter object paths, logs, fixtures, browser analytics or the service-worker cache.

## Reproducible asset pipeline

`assets/manifest/assets.json` is the source of truth. Wikimedia search only appends candidates. A candidate must receive human approval and complete attribution before fetch. License validation allows CC0, public domain and CC BY 4.0; CC BY-SA 4.0 requires an explicit handled flag. Unknown, NC and ND terms fail validation.

The generator creates deterministic SVG artwork, twelve initials-only avatars, two twelve-frame sequences and four visibly watermarked synthetic PDF records. `sharp` normalizes orientation and writes metadata-free WebP, AVIF and JPEG derivatives. Upload supports dry-run and skips existing object paths. Media seeding derives stable UUIDs and uses upserts for all visible lots and sequence frames, so reruns do not duplicate rows.

This is an engineering guardrail, not legal advice. Each remote candidate still requires review of its source page at the time it is approved.

# Integrations

Every external capability sits behind an interface and has a credential-free mock.

| Capability | Default | Production seam |
| --- | --- | --- |
| Mandi data | deterministic seeded prices | server-only Data.gov.in resource adapter with cached fallback |
| Grading | lot-ID deterministic estimate | reviewed model/provider adapter with model version and override audit |
| Video | visibly disconnected call room | LiveKit token issued server-side |
| Payment | success/pending/failure/refund simulator | RBI-authorized provider; Razorpay order adapter is scaffolded |
| Logistics | six deterministic quote classes and GPS route | approved carrier/aggregator adapter |
| Identity | masked provider reference | approved identity/offline verification provider |
| Biometrics | presence result only | provider reference; raw fingerprint/face templates prohibited |
| Voice | browser synthesis and graceful unsupported state | BHASHINI adapter |
| Forecast | moving-average baseline with seeded factors | replaceable `ForecastProvider`, potentially a future Python service |

Razorpay Route is not described as escrow. A production protected-payment or escrow claim requires a compliant arrangement confirmed by provider and legal review.

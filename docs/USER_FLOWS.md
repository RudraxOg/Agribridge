# User flows

## FPO operator

Choose the FPO demo role → review urgent actions → register a farmer in assisted mode → record masked identity/bank references, land, crop and consent → save or resume the local draft → create a stock lot → allocate contributors → attach quality evidence → publish → review incoming order → select logistics → validate loading proof → review releases and farmer payouts.

## Bulk buyer

Choose the buyer demo role → filter marketplace lots → compare evidence → inspect separate AI, FPO and lab grades → request a mock grading call → add lot to order → review buyer-only charges → choose logistics → complete mock UPI → track deterministic shipment → confirm delivery → review second release and final distribution.

## Exceptional path

A participant raises a dispute with evidence → the server transitions settlement to `HELD_FOR_DISPUTE` → release controls remain unavailable to the browser → a reviewed resolution advances to refund, partial refund or completion → every state change appends an audit event.

import { env } from "@/lib/config/env";import { DataGovMarketDataProvider } from "./data-gov-provider";import { MockMarketDataProvider } from "./mock-market-data-provider";import type { MarketDataProvider } from "./market-data-provider";
export function marketDataProvider():MarketDataProvider{return env.INTEGRATION_MODE==="live"?new DataGovMarketDataProvider():new MockMarketDataProvider()}

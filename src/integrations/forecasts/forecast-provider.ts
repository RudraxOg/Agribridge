import type { MarketPrice } from "@/integrations/market-data/market-data-provider";
export type Forecast={commodity:string;days:15|30;expectedMin:number;expectedMax:number;confidence:number;direction:"rising"|"stable"|"falling";drivers:string[];sourceTimestamp:string};
export interface ForecastProvider{forecast(prices:MarketPrice[],days:15|30):Forecast}

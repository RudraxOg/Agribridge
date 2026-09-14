export type MarketPrice = { state:string; district:string; market:string; commodity:string; variety:string; minPrice:number; maxPrice:number; modalPrice:number; sourceDate:string; syncedAt:string };
export type MarketPriceFilters = { state?:string; district?:string; market?:string; commodity?:string; limit?:number };
export interface MarketDataProvider { getPrices(filters:MarketPriceFilters):Promise<MarketPrice[]>; }

export type TourEventType="started"|"viewed"|"next"|"back"|"skipped"|"exited"|"completed"|"fallback";
export function safeTourMetadata(value:Record<string,unknown>={}){const blocked=["aadhaar","bank_account","payment_credentials","private_gps","signed_url"];return Object.fromEntries(Object.entries(value).filter(([key])=>!blocked.includes(key)));}

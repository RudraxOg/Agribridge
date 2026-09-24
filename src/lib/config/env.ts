import { z } from "zod";

const serverSchema = z.object({
  INTEGRATION_MODE: z.enum(["mock", "live"]).default("mock"),
  AUTH_MODE: z.enum(["mock", "supabase"]).default("mock"),
  PAYMENT_PROVIDER: z.enum(["mock", "razorpay"]).default("mock"),
  DATA_GOV_IN_API_KEY: z.string().optional(),
  DATA_GOV_IN_RESOURCE_ID: z.string().default("9ef84268-d588-465a-a308-a864a43d0070"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  LIVEKIT_URL: z.string().default("ws://127.0.0.1:7880"),
  LIVEKIT_API_KEY: z.string().optional(),
  LIVEKIT_API_SECRET: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  BHASHINI_USER_ID: z.string().optional(),
  BHASHINI_API_KEY: z.string().optional(),
  BHASHINI_PIPELINE_ID: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  FIELD_ENCRYPTION_PROVIDER: z.enum(["demo", "local-aes", "kms"]).default("demo"),
  FIELD_ENCRYPTION_KEY_BASE64: z.string().optional(),
  MALWARE_SCANNER_URL: z.string().url().optional(),
  MALWARE_SCANNER_TOKEN: z.string().optional(),
});

export const env = serverSchema.parse(process.env);

const optionalUrl = z.preprocess((value) => value === "" ? undefined : value, z.string().url().optional());
const optionalString = z.preprocess((value) => value === "" ? undefined : value, z.string().optional());

export const publicEnv = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalString,
  NEXT_PUBLIC_MAP_STYLE_URL: z.string().url().default("https://demotiles.maplibre.org/style.json"),
}).parse(process.env);

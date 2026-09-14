import { z } from "zod";
export const signInSchema=z.object({email:z.email(),password:z.string().min(8)});export const phoneOtpSchema=z.object({phone:z.string().regex(/^\+91\d{10}$/),otp:z.string().length(6).optional()});

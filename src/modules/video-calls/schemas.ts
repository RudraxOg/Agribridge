import { z } from "zod";export const callRequestSchema=z.object({stockLotId:z.uuid(),requestedAt:z.iso.datetime(),notes:z.string().max(500).optional()});

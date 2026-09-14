import type { GradingReport } from "@/domain/grading/grading.types";export interface GradingProvider{analyze(lotId:string):Promise<GradingReport>}

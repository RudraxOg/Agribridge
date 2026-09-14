import { MockGradingProvider } from "@/integrations/grading/mock-grading-provider";export async function getMockGrade(lotId:string){return new MockGradingProvider().analyze(lotId)}

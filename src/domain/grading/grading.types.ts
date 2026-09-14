export type GradeSource = "AI_ESTIMATE" | "FPO_DECLARED" | "LAB_VERIFIED";
export type GradingReport = {
  source: GradeSource;
  suggestedGrade: "A" | "B" | "C";
  confidence: number;
  moisture: number;
  sizeMm: number;
  colour: string;
  defectPercent: number;
  foreignMatterPercent: number;
  damagePercent: number;
  packaging: string;
  certificationStatus: string;
  warnings: string[];
  humanOverride?: string;
  modelVersion: string;
  analyzedAt: string;
};

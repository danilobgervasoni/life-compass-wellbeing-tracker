
export interface DiaryEntry {
  id: string;
  pillarId: string;
  date: string;
  currentReflection: string;
  actionPlan: string;
  isFavorite: boolean;
}

export interface DiaryPillar {
  id: string;
  name: string;
  icon: string;
  color: string;
  accentColor: string;
  description: string;
  reflectionPlaceholder: string;
  actionPlanPlaceholder: string;
}

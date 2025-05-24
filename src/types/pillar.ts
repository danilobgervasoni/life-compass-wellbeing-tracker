
export interface DailyEntry {
  date: string;
  score: number;
  notes: string;
}

export interface Pillar {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  currentScore: number;
  trend: 'up' | 'down' | 'stable';
  entries: DailyEntry[];
}

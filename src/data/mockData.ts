
import { Pillar } from "@/types/pillar";

const generateMockEntries = (days: number = 30) => {
  const entries = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    entries.push({
      date: date.toISOString().split('T')[0],
      score: Math.floor(Math.random() * 6) + 5, // 5-10 range for demo
      notes: i === 0 ? "Feeling good about today's progress!" : 
             i === 1 ? "Had some challenges but pushed through" :
             i === 2 ? "Great day, very productive" : ""
    });
  }
  
  return entries;
};

export const mockPillars: Pillar[] = [
  {
    id: "health",
    name: "Health & Fitness",
    icon: "💪",
    color: "from-emerald-400 to-teal-500",
    description: "Physical wellness, exercise, and nutrition",
    currentScore: 8,
    trend: "up",
    entries: generateMockEntries()
  },
  {
    id: "finance",
    name: "Financial Wellness",
    icon: "💰",
    color: "from-yellow-400 to-orange-500",
    description: "Money management, savings, and investments",
    currentScore: 7,
    trend: "stable",
    entries: generateMockEntries()
  },
  {
    id: "relationships",
    name: "Relationships",
    icon: "❤️",
    color: "from-pink-400 to-rose-500",
    description: "Family, friends, and meaningful connections",
    currentScore: 9,
    trend: "up",
    entries: generateMockEntries()
  },
  {
    id: "career",
    name: "Career & Growth",
    icon: "🚀",
    color: "from-blue-400 to-indigo-500",
    description: "Professional development and goals",
    currentScore: 6,
    trend: "down",
    entries: generateMockEntries()
  },
  {
    id: "spirituality",
    name: "Spirituality",
    icon: "🧘",
    color: "from-purple-400 to-violet-500",
    description: "Inner peace, meditation, and mindfulness",
    currentScore: 8,
    trend: "stable",
    entries: generateMockEntries()
  },
  {
    id: "learning",
    name: "Learning & Skills",
    icon: "📚",
    color: "from-cyan-400 to-blue-500",
    description: "Education, creativity, and personal development",
    currentScore: 7,
    trend: "up",
    entries: generateMockEntries()
  }
];

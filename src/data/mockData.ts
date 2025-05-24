
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
      notes: i === 0 ? "Sentindo-me bem com o progresso de hoje!" : 
             i === 1 ? "Tive alguns desafios mas consegui superar" :
             i === 2 ? "Dia excelente, muito produtivo" : ""
    });
  }
  
  return entries;
};

export const mockPillars: Pillar[] = [
  {
    id: "dinheiro",
    name: "Dinheiro",
    icon: "💰",
    color: "from-emerald-400 to-teal-500",
    description: "Gestão financeira, poupanças e investimentos",
    currentScore: 8,
    trend: "up",
    entries: generateMockEntries()
  },
  {
    id: "espiritualidade",
    name: "Espiritualidade",
    icon: "🕊️",
    color: "from-purple-400 to-violet-500",
    description: "Paz interior, meditação e mindfulness",
    currentScore: 7,
    trend: "stable",
    entries: generateMockEntries()
  },
  {
    id: "tempo",
    name: "Tempo",
    icon: "⏰",
    color: "from-blue-400 to-indigo-500",
    description: "Gestão de tempo e produtividade",
    currentScore: 6,
    trend: "down",
    entries: generateMockEntries()
  },
  {
    id: "relacionamento",
    name: "Relacionamento",
    icon: "❤️",
    color: "from-pink-400 to-rose-500",
    description: "Família, amigos e conexões significativas",
    currentScore: 9,
    trend: "up",
    entries: generateMockEntries()
  },
  {
    id: "conhecimento",
    name: "Conhecimento",
    icon: "📚",
    color: "from-cyan-400 to-blue-500",
    description: "Educação, criatividade e desenvolvimento pessoal",
    currentScore: 8,
    trend: "up",
    entries: generateMockEntries()
  },
  {
    id: "saude",
    name: "Saúde",
    icon: "💪",
    color: "from-red-400 to-pink-500",
    description: "Bem-estar físico, exercício e nutrição",
    currentScore: 7,
    trend: "stable",
    entries: generateMockEntries()
  },
  {
    id: "social",
    name: "Social",
    icon: "👥",
    color: "from-yellow-400 to-orange-500",
    description: "Vida social, comunidade e networking",
    currentScore: 8,
    trend: "up",
    entries: generateMockEntries()
  }
];

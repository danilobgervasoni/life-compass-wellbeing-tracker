
import { DiaryEntry, DiaryPillar } from "@/types/diary";

export const diaryPillars: DiaryPillar[] = [
  {
    id: "dinheiro",
    name: "Dinheiro",
    icon: "DollarSign",
    color: "emerald",
    accentColor: "bg-emerald-500",
    description: "Gestão financeira e prosperidade",
    reflectionPlaceholder: "Como você se sente atualmente em relação ao seu dinheiro e finanças?",
    actionPlanPlaceholder: "O que você pode fazer para melhorar sua situação financeira nos próximos dias?"
  },
  {
    id: "espiritualidade",
    name: "Espiritualidade",
    icon: "Heart",
    color: "purple",
    accentColor: "bg-purple-500",
    description: "Conexão espiritual e propósito",
    reflectionPlaceholder: "Como você se sente atualmente em relação à sua espiritualidade?",
    actionPlanPlaceholder: "O que você pode fazer para fortalecer sua conexão espiritual nos próximos dias?"
  },
  {
    id: "tempo",
    name: "Tempo",
    icon: "Clock",
    color: "blue",
    accentColor: "bg-blue-500",
    description: "Gestão do tempo e produtividade",
    reflectionPlaceholder: "Como você se sente atualmente em relação ao seu tempo e produtividade?",
    actionPlanPlaceholder: "O que você pode fazer para gerenciar melhor seu tempo nos próximos dias?"
  },
  {
    id: "relacionamento",
    name: "Relacionamento",
    icon: "Users",
    color: "pink",
    accentColor: "bg-pink-500",
    description: "Relacionamentos pessoais e sociais",
    reflectionPlaceholder: "Como você se sente atualmente em relação aos seus relacionamentos?",
    actionPlanPlaceholder: "O que você pode fazer para melhorar seus relacionamentos nos próximos dias?"
  },
  {
    id: "conhecimento",
    name: "Conhecimento",
    icon: "BookOpen",
    color: "indigo",
    accentColor: "bg-indigo-500",
    description: "Aprendizado e desenvolvimento pessoal",
    reflectionPlaceholder: "Como você se sente atualmente em relação ao seu conhecimento e aprendizado?",
    actionPlanPlaceholder: "O que você pode fazer para expandir seu conhecimento nos próximos dias?"
  },
  {
    id: "saude",
    name: "Saúde",
    icon: "Activity",
    color: "green",
    accentColor: "bg-green-500",
    description: "Bem-estar físico e mental",
    reflectionPlaceholder: "Como você se sente atualmente em relação à sua saúde física e mental?",
    actionPlanPlaceholder: "O que você pode fazer para melhorar sua saúde nos próximos dias?"
  },
  {
    id: "social",
    name: "Social",
    icon: "Coffee",
    color: "orange",
    accentColor: "bg-orange-500",
    description: "Vida social e networking",
    reflectionPlaceholder: "Como você se sente atualmente em relação à sua vida social?",
    actionPlanPlaceholder: "O que você pode fazer para enriquecer sua vida social nos próximos dias?"
  }
];

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "1",
    pillarId: "dinheiro",
    date: "2024-01-15",
    currentReflection: "Tenho me sentido mais organizado financeiramente após começar a usar um app de controle de gastos. Consigo ver para onde meu dinheiro está indo.",
    actionPlan: "Vou continuar registrando todos os gastos diariamente e estabelecer uma meta de economia mensal de 20% da minha renda.",
    isFavorite: true
  },
  {
    id: "2",
    pillarId: "saude",
    date: "2024-01-14",
    currentReflection: "Minha energia tem estado baixa nos últimos dias. Percebi que não estou dormindo o suficiente e minha alimentação está desregulada.",
    actionPlan: "Vou estabelecer um horário fixo para dormir (22h) e preparar refeições mais saudáveis no domingo para a semana toda.",
    isFavorite: false
  },
  {
    id: "3",
    pillarId: "relacionamento",
    date: "2024-01-13",
    currentReflection: "Sinto que preciso investir mais tempo de qualidade com minha família. Tenho estado muito focado no trabalho.",
    actionPlan: "Vou organizar um jantar familiar este fim de semana e estabelecer pelo menos uma noite por semana sem dispositivos eletrônicos.",
    isFavorite: true
  }
];


import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { DollarSign, Heart, Clock, Users, BookOpen, Activity, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCards } from "@/hooks/useCards";

const Diary = () => {
  const navigate = useNavigate();
  const { cards, loading, error } = useCards();

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case '💰':
        return <DollarSign className="h-8 w-8 text-white" />;
      case '❤️':
        return <Heart className="h-8 w-8 text-white" />;
      case '⏰':
        return <Clock className="h-8 w-8 text-white" />;
      case '👥':
        return <Users className="h-8 w-8 text-white" />;
      case '📚':
        return <BookOpen className="h-8 w-8 text-white" />;
      case '💪':
        return <Activity className="h-8 w-8 text-white" />;
      case '🕊️':
        return <Coffee className="h-8 w-8 text-white" />;
      default:
        return <Heart className="h-8 w-8 text-white" />;
    }
  };

  const getGradientClass = (color: string) => {
    if (color.includes('emerald')) return "bg-gradient-to-br from-sage-500 to-sage-600";
    if (color.includes('purple')) return "bg-gradient-to-br from-purple-500 to-purple-600";
    if (color.includes('blue')) return "bg-gradient-to-br from-petroleum-500 to-petroleum-600";
    if (color.includes('pink')) return "bg-gradient-to-br from-terracotta-500 to-terracotta-600";
    if (color.includes('indigo')) return "bg-gradient-to-br from-indigo-500 to-indigo-600";
    if (color.includes('green')) return "bg-gradient-to-br from-sage-500 to-sage-600";
    return "bg-gradient-to-br from-sage-500 to-sage-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-warmGray-600">Carregando diário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-warmGray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmGray-50">
      <Header />
      
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-warmGray-900 mb-4">
              Diário Estratégico
            </h1>
            <p className="text-lg text-warmGray-600 max-w-2xl mx-auto">
              Um espaço dedicado para reflexões profundas e planejamento de ações sobre cada pilar da sua vida
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((pillar) => (
              <Card 
                key={pillar.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-soft hover:scale-105 bg-white border-0 shadow-soft overflow-hidden"
                onClick={() => navigate(`/diary/${pillar.id}`)}
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${getGradientClass(pillar.color)} flex items-center justify-center shadow-soft mb-4 group-hover:shadow-md transition-all duration-300`}>
                    {getPillarIcon(pillar.icon)}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-warmGray-900 mb-2 group-hover:text-warmGray-800 transition-colors">
                    {pillar.name}
                  </h3>
                  <p className="text-sm text-warmGray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diary;

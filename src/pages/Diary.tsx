
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { diaryPillars } from "@/data/diaryMockData";
import { DollarSign, Heart, Clock, Users, BookOpen, Activity, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Diary = () => {
  const navigate = useNavigate();

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return <DollarSign className="h-8 w-8 text-white" />;
      case 'Heart':
        return <Heart className="h-8 w-8 text-white" />;
      case 'Clock':
        return <Clock className="h-8 w-8 text-white" />;
      case 'Users':
        return <Users className="h-8 w-8 text-white" />;
      case 'BookOpen':
        return <BookOpen className="h-8 w-8 text-white" />;
      case 'Activity':
        return <Activity className="h-8 w-8 text-white" />;
      case 'Coffee':
        return <Coffee className="h-8 w-8 text-white" />;
      default:
        return <Heart className="h-8 w-8 text-white" />;
    }
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return "bg-gradient-to-br from-emerald-500 to-emerald-600";
      case 'purple':
        return "bg-gradient-to-br from-purple-500 to-purple-600";
      case 'blue':
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case 'pink':
        return "bg-gradient-to-br from-pink-500 to-pink-600";
      case 'indigo':
        return "bg-gradient-to-br from-indigo-500 to-indigo-600";
      case 'green':
        return "bg-gradient-to-br from-green-500 to-green-600";
      case 'orange':
        return "bg-gradient-to-br from-orange-500 to-orange-600";
      default:
        return "bg-gradient-to-br from-emerald-500 to-emerald-600";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Diário Estratégico
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Um espaço dedicado para reflexões profundas e planejamento de ações sobre cada pilar da sua vida
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {diaryPillars.map((pillar) => (
              <Card 
                key={pillar.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border-0 shadow-sm overflow-hidden"
                onClick={() => navigate(`/diary/${pillar.id}`)}
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${getGradientClass(pillar.color)} flex items-center justify-center shadow-sm mb-4 group-hover:shadow-md transition-all duration-300`}>
                    {getPillarIcon(pillar.icon)}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-800 transition-colors">
                    {pillar.name}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
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

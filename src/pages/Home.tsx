
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Heart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToCards = () => {
    navigate("/cards");
  };

  const handleNavigateToReflections = () => {
    navigate("/reflections");
  };

  const handleNavigateToCalendar = () => {
    // For now, navigate to cards - calendar can be implemented later
    navigate("/cards");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <Header 
        onNavigateToReflections={handleNavigateToReflections}
        onNavigateToCards={handleNavigateToCards}
      />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-slate-800 bg-clip-text text-transparent">
                Algoritmo de Governo
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-700 mb-8 font-light">
              Monitore o seu progresso interior. Um dia de cada vez.
            </p>
            <div className="max-w-3xl mx-auto">
              <p className="text-slate-600 text-lg leading-relaxed">
                Acompanhe e reflita sobre os principais pilares da sua vida: dinheiro, espiritualidade, 
                tempo, relacionamento, conhecimento, saúde e social.
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={handleNavigateToCards}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                  Ver meus Cards
                </h3>
                <p className="text-sm text-slate-600">
                  Acesse seus pilares e monitore seu progresso diário
                </p>
              </div>
            </Card>

            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={handleNavigateToReflections}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                  Acessar Reflexões
                </h3>
                <p className="text-sm text-slate-600">
                  Visualize todas as suas reflexões em um mural organizado
                </p>
              </div>
            </Card>

            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={handleNavigateToCalendar}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                  Calendário de Sentimentos
                </h3>
                <p className="text-sm text-slate-600">
                  Visualize seu histórico em formato de calendário
                </p>
              </div>
            </Card>
          </div>

          {/* Motivational Quote */}
          <div className="text-center">
            <Card className="p-6 bg-emerald-50/50 backdrop-blur-sm border-emerald-200 shadow-lg">
              <p className="text-slate-700 text-lg italic mb-2">
                "A vida é aquilo que acontece enquanto você está ocupado fazendo outros planos."
              </p>
              <p className="text-slate-500 text-sm">— John Lennon</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

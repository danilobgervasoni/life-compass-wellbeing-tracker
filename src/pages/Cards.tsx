
import { useState } from "react";
import { Header } from "@/components/Header";
import { PillarCard } from "@/components/PillarCard";
import { PillarDetail } from "@/components/PillarDetail";
import { Pillar } from "@/types/pillar";
import { useNavigate } from "react-router-dom";
import { useCards } from "@/hooks/useCards";
import { useScoreUpdate } from "@/hooks/useScoreUpdate";

const Cards = () => {
  const navigate = useNavigate();
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const { cards, loading, error, refetch } = useCards();
  const { updateScore } = useScoreUpdate();

  const handleSelectPillar = (pillar: Pillar) => {
    setSelectedPillar(pillar);
  };

  const handleBackToCards = () => {
    setSelectedPillar(null);
  };

  const handleNavigateToReflections = () => {
    navigate("/reflections");
  };

  const handleNavigateToCards = () => {
    navigate("/cards");
  };

  const handleNavigateToCalendar = () => {
    navigate("/calendar");
  };

  const handleScoreUpdate = async (pillarId: string, newScore: number, notes?: string, specificDate?: string) => {
    try {
      await updateScore(pillarId, newScore, notes, specificDate);
      await refetch();
    } catch (error) {
      console.error('Erro ao atualizar pontuação:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-warmGray-600">Carregando pilares...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-warmGray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
          <button 
            onClick={refetch}
            className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (selectedPillar) {
    const updatedPillar = cards.find(p => p.id === selectedPillar.id) || selectedPillar;
    return (
      <PillarDetail 
        pillar={updatedPillar} 
        onBack={handleBackToCards}
        onScoreUpdate={handleScoreUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-warmGray-50">
      <Header 
        onNavigateToReflections={handleNavigateToReflections}
        onNavigateToCards={handleNavigateToCards}
        onNavigateToCalendar={handleNavigateToCalendar}
      />
      
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-sage-600 via-sage-700 to-warmGray-800 bg-clip-text text-transparent">
                Seus Pilares
              </span>
            </h1>
            <p className="text-warmGray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Monitore e desenvolva os aspectos fundamentais da sua vida
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                onClick={() => handleSelectPillar(pillar)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;

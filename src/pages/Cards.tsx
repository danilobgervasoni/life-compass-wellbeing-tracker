
import { useState } from "react";
import { Header } from "@/components/Header";
import { PillarCard } from "@/components/PillarCard";
import { PillarDetail } from "@/components/PillarDetail";
import { mockPillars } from "@/data/mockData";
import { Pillar } from "@/types/pillar";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const navigate = useNavigate();
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [pillars, setPillars] = useState(mockPillars);

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

  const handleScoreUpdate = (pillarId: string, newScore: number, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setPillars(prevPillars => 
      prevPillars.map(pillar => {
        if (pillar.id === pillarId) {
          const updatedEntries = [...pillar.entries];
          const todayEntryIndex = updatedEntries.findIndex(entry => entry.date === today);
          
          if (todayEntryIndex >= 0) {
            updatedEntries[todayEntryIndex] = { ...updatedEntries[todayEntryIndex], score: newScore, notes: notes || '' };
          } else {
            updatedEntries.push({ date: today, score: newScore, notes: notes || '' });
          }
          
          return {
            ...pillar,
            currentScore: newScore,
            entries: updatedEntries
          };
        }
        return pillar;
      })
    );
  };

  if (selectedPillar) {
    const updatedPillar = pillars.find(p => p.id === selectedPillar.id) || selectedPillar;
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
            {pillars.map((pillar) => (
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

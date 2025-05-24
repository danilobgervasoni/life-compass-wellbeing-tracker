
import { useState } from "react";
import { PillarCard } from "@/components/PillarCard";
import { PillarDetail } from "@/components/PillarDetail";
import { Header } from "@/components/Header";
import { mockPillars } from "@/data/mockData";
import { Pillar } from "@/types/pillar";

const Index = () => {
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  if (selectedPillar) {
    return (
      <div className="pt-20">
        <Header 
          showBackButton={true}
          onBackToHome={() => setSelectedPillar(null)}
        />
        <PillarDetail 
          pillar={selectedPillar} 
          onBack={() => setSelectedPillar(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <Header onBackToHome={() => setSelectedPillar(null)} />
      
      <div className="container mx-auto px-4 py-8 pt-28">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-light mb-4">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent font-bold">
                Algoritmo
              </span>
              <span className="text-slate-800 font-light"> de </span>
              <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent font-bold">
                Governo
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 mx-auto rounded-full shadow-lg"></div>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Acompanhe seu progresso diário nas áreas essenciais da sua vida. 
            Construa hábitos, reflita sobre o crescimento e mantenha o equilíbrio.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {mockPillars.map((pillar) => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              onClick={() => setSelectedPillar(pillar)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-500">
          <p className="text-sm">
            Comece cada dia com intenção. Termine cada dia com reflexão.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

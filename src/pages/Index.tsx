
import { useState } from "react";
import { PillarCard } from "@/components/PillarCard";
import { PillarDetail } from "@/components/PillarDetail";
import { mockPillars } from "@/data/mockData";
import { Pillar } from "@/types/pillar";

const Index = () => {
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  if (selectedPillar) {
    return (
      <PillarDetail 
        pillar={selectedPillar} 
        onBack={() => setSelectedPillar(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
            Algoritmo de Governo
          </h1>
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

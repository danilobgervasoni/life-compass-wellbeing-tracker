
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Reflection {
  id: string;
  date: string;
  pillarId: string;
  pillarName: string;
  pillarIcon: string;
  content: string;
  isFavorite: boolean;
}

// Mock data for reflections
const mockReflections: Reflection[] = [
  {
    id: "1",
    date: "2025-05-25",
    pillarId: "dinheiro",
    pillarName: "Dinheiro",
    pillarIcon: "💰",
    content: "Consegui economizar mais hoje do que esperava. Estou me sentindo mais confiante sobre meus objetivos financeiros.",
    isFavorite: true
  },
  {
    id: "2",
    date: "2025-05-25",
    pillarId: "saude",
    pillarName: "Saúde",
    pillarIcon: "💪",
    content: "Fiz exercícios pela manhã e me senti energizado o dia todo. Preciso manter essa rotina.",
    isFavorite: false
  },
  {
    id: "3",
    date: "2025-05-24",
    pillarId: "espiritualidade",
    pillarName: "Espiritualidade",
    pillarIcon: "🕊️",
    content: "Meditei por 20 minutos hoje. A sensação de paz interior foi transformadora.",
    isFavorite: true
  },
  {
    id: "4",
    date: "2025-05-24",
    pillarId: "relacionamento",
    pillarName: "Relacionamento",
    pillarIcon: "❤️",
    content: "Tive uma conversa importante com minha família. Nos sentimos mais conectados.",
    isFavorite: false
  },
  {
    id: "5",
    date: "2025-05-23",
    pillarId: "conhecimento",
    pillarName: "Conhecimento",
    pillarIcon: "📚",
    content: "Li um capítulo interessante sobre produtividade. Vou aplicar as técnicas amanhã.",
    isFavorite: false
  }
];

const Reflections = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [reflections, setReflections] = useState(mockReflections);

  const handleBackToHome = () => {
    navigate("/");
  };

  const toggleFavorite = (reflectionId: string) => {
    setReflections(prev => 
      prev.map(reflection => 
        reflection.id === reflectionId 
          ? { ...reflection, isFavorite: !reflection.isFavorite }
          : reflection
      )
    );
  };

  // Filter reflections based on search term
  const filteredReflections = reflections.filter(reflection =>
    reflection.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reflection.pillarName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group reflections by date
  const groupedReflections = filteredReflections.reduce((groups, reflection) => {
    const date = reflection.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reflection);
    return groups;
  }, {} as Record<string, Reflection[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedReflections).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <Header 
        onBackToHome={handleBackToHome}
        showBackButton={true}
      />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-slate-800 bg-clip-text text-transparent mb-2">
              Mural de Reflexões
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Suas reflexões diárias organizadas por data
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar por pilar ou palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Reflections Content */}
          {sortedDates.length === 0 ? (
            <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Você ainda não escreveu nenhuma reflexão
              </h3>
              <p className="text-slate-500 text-sm">
                Comece avaliando seus pilares e adicionando suas reflexões diárias.
              </p>
              <Button 
                onClick={handleBackToHome}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                Ir para Cards
              </Button>
            </Card>
          ) : (
            <div className="space-y-8">
              {sortedDates.map(date => (
                <div key={date} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center space-x-3">
                    <div className="h-px bg-emerald-200 flex-1"></div>
                    <h2 className="text-lg font-semibold text-slate-700 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200">
                      {formatDate(date)}
                    </h2>
                    <div className="h-px bg-emerald-200 flex-1"></div>
                  </div>

                  {/* Reflections for this date */}
                  <div className="grid gap-4">
                    {groupedReflections[date].map(reflection => (
                      <Card key={reflection.id} className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{reflection.pillarIcon}</span>
                            <h3 className="font-semibold text-slate-800">{reflection.pillarName}</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(reflection.id)}
                            className={`hover:bg-emerald-50 ${reflection.isFavorite ? 'text-yellow-500' : 'text-slate-400'}`}
                          >
                            <Star className={`h-5 w-5 ${reflection.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {reflection.content}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reflections;

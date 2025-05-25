
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, MessageSquare, Filter, Calendar as CalendarIcon } from "lucide-react";
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
    content: "Consegui economizar mais hoje do que esperava. Estou me sentindo mais confiante sobre meus objetivos financeiros. A disciplina está começando a dar frutos.",
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
  },
  {
    id: "6",
    date: "2025-05-22",
    pillarId: "tempo",
    pillarName: "Tempo",
    pillarIcon: "⏰",
    content: "Organizei melhor minha agenda hoje. Consegui ter mais tempo de qualidade.",
    isFavorite: false
  },
  {
    id: "7",
    date: "2025-05-21",
    pillarId: "social",
    pillarName: "Social",
    pillarIcon: "👥",
    content: "Encontrei amigos após muito tempo. Foi revigorante para minha energia social.",
    isFavorite: true
  }
];

const pillarOptions = [
  { id: "dinheiro", name: "Dinheiro", icon: "💰" },
  { id: "espiritualidade", name: "Espiritualidade", icon: "🕊️" },
  { id: "tempo", name: "Tempo", icon: "⏰" },
  { id: "relacionamento", name: "Relacionamento", icon: "❤️" },
  { id: "conhecimento", name: "Conhecimento", icon: "📚" },
  { id: "saude", name: "Saúde", icon: "💪" },
  { id: "social", name: "Social", icon: "👥" }
];

const Reflections = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [reflections, setReflections] = useState(mockReflections);
  const [expandedReflection, setExpandedReflection] = useState<string | null>(null);

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

  // Filter reflections based on all criteria
  const filteredReflections = reflections.filter(reflection => {
    const matchesSearch = reflection.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reflection.pillarName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPillar = !selectedPillar || reflection.pillarId === selectedPillar;
    const matchesDate = !selectedDate || reflection.date === selectedDate;
    
    return matchesSearch && matchesPillar && matchesDate;
  });

  // Get latest reflection for each pillar
  const getLatestReflectionsByPillar = () => {
    const latestByPillar: Record<string, Reflection> = {};
    
    reflections.forEach(reflection => {
      if (!latestByPillar[reflection.pillarId] || 
          new Date(reflection.date) > new Date(latestByPillar[reflection.pillarId].date)) {
        latestByPillar[reflection.pillarId] = reflection;
      }
    });
    
    return pillarOptions.map(pillar => ({
      pillar,
      reflection: latestByPillar[pillar.id] || null
    }));
  };

  const latestReflections = getLatestReflectionsByPillar();

  // Group filtered reflections by date
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

  const clearFilters = () => {
    setSelectedPillar("");
    setSelectedDate("");
    setSearchTerm("");
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

          {/* Filters */}
          <Card className="p-4 sm:p-6 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-800">Filtros</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Buscar por palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-emerald-200 focus:border-emerald-400"
                />
              </div>
              
              {/* Pillar Filter */}
              <Select value={selectedPillar} onValueChange={setSelectedPillar}>
                <SelectTrigger className="bg-white border-emerald-200 focus:border-emerald-400">
                  <SelectValue placeholder="Filtrar por pilar" />
                </SelectTrigger>
                <SelectContent>
                  {pillarOptions.map(pillar => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      <div className="flex items-center space-x-2">
                        <span>{pillar.icon}</span>
                        <span>{pillar.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Date Filter */}
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 bg-white border-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>
            
            {(selectedPillar || selectedDate || searchTerm) && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </Card>

          {/* Latest Reflections */}
          <Card className="p-4 sm:p-6 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-medium text-slate-800 mb-4">
              Últimas anotações de cada pilar
            </h3>
            <div className="grid gap-3">
              {latestReflections.map(({ pillar, reflection }) => (
                <div
                  key={pillar.id}
                  className={`
                    p-3 rounded-lg border transition-colors cursor-pointer
                    ${reflection ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 border-slate-200'}
                  `}
                  onClick={() => reflection && setExpandedReflection(
                    expandedReflection === reflection.id ? null : reflection.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{pillar.icon}</span>
                      <div>
                        <span className="font-medium text-slate-800">{pillar.name}</span>
                        {reflection && (
                          <p className="text-xs text-slate-500">
                            {formatDate(reflection.date)}
                          </p>
                        )}
                      </div>
                    </div>
                    {reflection ? (
                      <div className="text-emerald-600 text-sm">Ver</div>
                    ) : (
                      <span className="text-slate-400 text-sm">Sem anotações</span>
                    )}
                  </div>
                  
                  {reflection && expandedReflection === reflection.id && (
                    <div className="mt-3 pt-3 border-t border-emerald-200">
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {reflection.content}
                      </p>
                    </div>
                  )}
                  
                  {reflection && expandedReflection !== reflection.id && (
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                      {reflection.content.substring(0, 80)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Filtered Reflections Content */}
          {sortedDates.length === 0 ? (
            <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {selectedPillar || selectedDate || searchTerm 
                  ? "Nenhuma reflexão encontrada com os filtros aplicados"
                  : "Você ainda não escreveu nenhuma reflexão"
                }
              </h3>
              <p className="text-slate-500 text-sm">
                {selectedPillar || selectedDate || searchTerm
                  ? "Tente ajustar os filtros ou limpar a busca."
                  : "Comece avaliando seus pilares e adicionando suas reflexões diárias."
                }
              </p>
              {!selectedPillar && !selectedDate && !searchTerm && (
                <Button 
                  onClick={handleBackToHome}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                >
                  Ir para Cards
                </Button>
              )}
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

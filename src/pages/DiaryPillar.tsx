
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Heart, Clock, Users, BookOpen, Activity, Coffee, Edit, Star, ChevronDown, ChevronUp, Save, Calendar } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCards } from "@/hooks/useCards";
import { useDiary } from "@/hooks/useDiary";

const DiaryPillar = () => {
  const { pillarId } = useParams();
  const navigate = useNavigate();
  const [currentReflection, setCurrentReflection] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { cards, loading: cardsLoading } = useCards();
  const { entries, loading: diaryLoading, saveEntry } = useDiary(pillarId);

  const pillar = cards.find(p => p.id === pillarId);

  useEffect(() => {
    if (!pillar && !cardsLoading) {
      navigate("/diary");
    }
  }, [pillar, cardsLoading, navigate]);

  if (cardsLoading || diaryLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Carregando diário...</p>
        </div>
      </div>
    );
  }

  if (!pillar) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Pilar não encontrado</p>
          <Button onClick={() => navigate("/diary")}>Voltar ao Diário</Button>
        </div>
      </div>
    );
  }

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case '💰':
        return <DollarSign className="h-6 w-6 text-white" />;
      case '❤️':
        return <Heart className="h-6 w-6 text-white" />;
      case '⏰':
        return <Clock className="h-6 w-6 text-white" />;
      case '👥':
        return <Users className="h-6 w-6 text-white" />;
      case '📚':
        return <BookOpen className="h-6 w-6 text-white" />;
      case '💪':
        return <Activity className="h-6 w-6 text-white" />;
      case '🕊️':
        return <Coffee className="h-6 w-6 text-white" />;
      default:
        return <Heart className="h-6 w-6 text-white" />;
    }
  };

  const getGradientClass = (color: string) => {
    if (color.includes('emerald')) return "bg-gradient-to-br from-emerald-500 to-emerald-600";
    if (color.includes('purple')) return "bg-gradient-to-br from-purple-500 to-purple-600";
    if (color.includes('blue')) return "bg-gradient-to-br from-blue-500 to-blue-600";
    if (color.includes('pink')) return "bg-gradient-to-br from-pink-500 to-pink-600";
    if (color.includes('indigo')) return "bg-gradient-to-br from-indigo-500 to-indigo-600";
    if (color.includes('green')) return "bg-gradient-to-br from-green-500 to-green-600";
    return "bg-gradient-to-br from-emerald-500 to-emerald-600";
  };

  const handleSave = async () => {
    if (!pillarId || (!currentReflection.trim() && !actionPlan.trim())) return;

    try {
      setSaving(true);
      await saveEntry(pillarId, currentReflection, actionPlan);
      setCurrentReflection("");
      setActionPlan("");
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const toggleFavorite = (entryId: string) => {
    console.log("Toggling favorite for entry:", entryId);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header showBackButton onBackToHome={() => navigate("/diary")} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center mb-8">
            <div className={`w-12 h-12 rounded-xl ${getGradientClass(pillar.color)} flex items-center justify-center shadow-sm mr-4`}>
              {getPillarIcon(pillar.icon)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Diário - {pillar.name}
              </h1>
              <p className="text-neutral-600 mt-1">{pillar.description}</p>
            </div>
          </div>

          {/* New Entry Form */}
          <Card className="mb-8 bg-white border-0 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Nova Reflexão</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Reflexão Atual
                  </label>
                  <Textarea
                    placeholder="Como está este pilar da sua vida atualmente? O que você tem observado?"
                    value={currentReflection}
                    onChange={(e) => setCurrentReflection(e.target.value)}
                    className="min-h-[120px] resize-none border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Plano de Ação
                  </label>
                  <Textarea
                    placeholder="Quais ações você vai tomar para melhorar este pilar?"
                    value={actionPlan}
                    onChange={(e) => setActionPlan(e.target.value)}
                    className="min-h-[120px] resize-none border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                  />
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={(!currentReflection.trim() && !actionPlan.trim()) || saving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Reflexão'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Saved Entries */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Reflexões Anteriores ({entries.length})
            </h2>

            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="bg-white border-0 shadow-sm">
                  <div className="p-6">
                    {/* Entry Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-600">
                          {formatDate(entry.data)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(entry.id)}
                          className="text-neutral-500 hover:text-yellow-500 p-1"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-500 hover:text-neutral-700 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                          className="text-neutral-500 hover:text-neutral-700 p-1"
                        >
                          {expandedEntry === entry.id ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>

                    {/* Entry Preview */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-700 mb-1">Reflexão:</h4>
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {entry.reflexao_geral}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-neutral-700 mb-1">Plano de Ação:</h4>
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {entry.plano_acao}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedEntry === entry.id && (
                      <div className="mt-6 pt-6 border-t border-neutral-100 space-y-4 animate-fade-in">
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-800 mb-2">Reflexão Completa:</h4>
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {entry.reflexao_geral}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-800 mb-2">Plano de Ação Completo:</h4>
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {entry.plano_acao}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {entries.length === 0 && (
                <Card className="bg-white border-0 shadow-sm">
                  <div className="p-8 text-center">
                    <div className="text-neutral-400 mb-2">
                      <BookOpen className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="text-neutral-600">
                      Você ainda não possui reflexões para este pilar. Comece escrevendo sua primeira reflexão!
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryPillar;

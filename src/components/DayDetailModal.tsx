
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Pillar } from "@/types/pillar";
import { supabase } from "@/integrations/supabase/client";

interface DayDetailModalProps {
  date: string;
  pillars: Pillar[];
  onClose: () => void;
}

interface PillarNote {
  pillar: Pillar;
  entry: { score: number; notes: string } | null;
  reflection: string | null;
}

export const DayDetailModal = ({ date, pillars, onClose }: DayDetailModalProps) => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [pillarNotes, setPillarNotes] = useState<PillarNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        setLoading(true);
        
        // Fetch reflections for this date
        const { data: reflections, error: reflectionsError } = await supabase
          .from('reflexoes')
          .select('*')
          .eq('data', date);

        if (reflectionsError) {
          console.error('Error fetching reflections:', reflectionsError);
        }

        // Process each pillar
        const processedData: PillarNote[] = pillars.map(pillar => {
          const entry = pillar.entries.find(e => e.date === date);
          const reflection = reflections?.find(r => r.card_id === pillar.id);
          
          return {
            pillar,
            entry: entry ? { score: entry.score, notes: entry.notes } : null,
            reflection: reflection?.texto || null
          };
        });

        setPillarNotes(processedData);
      } catch (error) {
        console.error('Error fetching day data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [date, pillars]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Ensure local timezone
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const hasAnyEntries = pillarNotes.some(item => item.entry !== null || item.reflection !== null);

  const handlePillarClick = (pillarId: string, hasContent: boolean) => {
    if (hasContent) {
      setExpandedPillar(expandedPillar === pillarId ? null : pillarId);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl p-6 bg-white">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-sage-600" />
              <h2 className="text-xl font-semibold text-warmGray-800">
                {formatDate(date)}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-warmGray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          {!hasAnyEntries ? (
            <div className="text-center py-8">
              <div className="text-warmGray-400 mb-2 text-4xl">📅</div>
              <p className="text-warmGray-600">
                Nenhum registro feito neste dia.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pillars with scores */}
              <div>
                <h3 className="text-lg font-medium text-warmGray-800 mb-4">
                  Registros dos Pilares
                </h3>
                <div className="grid gap-3">
                  {pillarNotes.map(({ pillar, entry, reflection }) => {
                    const hasContent = entry || reflection;
                    const isExpanded = expandedPillar === pillar.id;
                    const isClickable = hasContent;

                    return (
                      <div key={pillar.id} className="space-y-2">
                        <div
                          className={`
                            flex items-center justify-between p-3 rounded-lg border
                            ${hasContent ? 'bg-sage-50 border-sage-200' : 'bg-warmGray-50 border-warmGray-200'}
                            ${isClickable ? 'cursor-pointer hover:bg-sage-100' : ''}
                            transition-colors duration-200
                          `}
                          onClick={() => handlePillarClick(pillar.id, !!hasContent)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{pillar.icon}</span>
                            <span className="font-medium text-warmGray-800">
                              {pillar.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {entry ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-sage-700">
                                  {entry.score}
                                </span>
                                <span className="text-sm text-warmGray-500">/10</span>
                                {hasContent && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-6 w-6"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4 text-sage-600" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-sage-600" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            ) : reflection ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-sage-600">Reflexão</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-6 w-6"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-sage-600" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-sage-600" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm text-warmGray-400">
                                Sem registro
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && hasContent && (
                          <div className="ml-6 p-4 bg-white border border-sage-200 rounded-lg shadow-sm space-y-3">
                            <h4 className="text-sm font-medium text-warmGray-800">
                              {pillar.name} - {formatDate(date)}
                            </h4>
                            
                            {entry?.notes && (
                              <div>
                                <p className="text-xs font-medium text-warmGray-600 mb-1">Anotação da pontuação:</p>
                                <p className="text-warmGray-700 text-sm leading-relaxed">
                                  {entry.notes}
                                </p>
                              </div>
                            )}
                            
                            {reflection && (
                              <div>
                                <p className="text-xs font-medium text-warmGray-600 mb-1">Reflexão:</p>
                                <p className="text-warmGray-700 text-sm leading-relaxed">
                                  {reflection}
                                </p>
                              </div>
                            )}
                            
                            {!entry?.notes && !reflection && (
                              <p className="text-warmGray-500 text-sm italic">
                                Nenhuma anotação registrada para este pilar neste dia.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary section */}
              {hasAnyEntries && (
                <div className="mt-6 p-4 bg-warmGray-50 rounded-lg border border-warmGray-200">
                  <p className="text-warmGray-600 text-sm text-center">
                    💡 Clique em um pilar com registro para expandir os detalhes
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

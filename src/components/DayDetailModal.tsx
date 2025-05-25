
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Pillar } from "@/types/pillar";

interface DayDetailModalProps {
  date: string;
  pillars: Pillar[];
  onClose: () => void;
}

export const DayDetailModal = ({ date, pillars, onClose }: DayDetailModalProps) => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Get entries for the selected date across all pillars
  const getDayEntries = () => {
    const dayEntries: Array<{ pillar: Pillar; entry: { score: number; notes: string } | null }> = [];
    
    pillars.forEach(pillar => {
      const entry = pillar.entries.find(e => e.date === date);
      dayEntries.push({
        pillar,
        entry: entry ? { score: entry.score, notes: entry.notes } : null
      });
    });
    
    return dayEntries;
  };

  const dayEntries = getDayEntries();
  const hasAnyEntries = dayEntries.some(item => item.entry !== null);

  const handlePillarClick = (pillarId: string, hasEntry: boolean, hasNotes: boolean) => {
    if (hasEntry && hasNotes) {
      setExpandedPillar(expandedPillar === pillarId ? null : pillarId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                {formatDate(date)}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          {!hasAnyEntries ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-2">📅</div>
              <p className="text-slate-600">
                Nenhum registro feito neste dia.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pillars with scores */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Notas dos Pilares
                </h3>
                <div className="grid gap-3">
                  {dayEntries.map(({ pillar, entry }) => {
                    const hasNotes = entry && entry.notes.trim() !== '';
                    const isExpanded = expandedPillar === pillar.id;
                    const isClickable = entry && hasNotes;

                    return (
                      <div key={pillar.id} className="space-y-2">
                        <div
                          className={`
                            flex items-center justify-between p-3 rounded-lg border
                            ${entry ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}
                            ${isClickable ? 'cursor-pointer hover:bg-emerald-100' : ''}
                            transition-colors duration-200
                          `}
                          onClick={() => handlePillarClick(pillar.id, !!entry, !!hasNotes)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{pillar.icon}</span>
                            <span className="font-medium text-slate-800">
                              {pillar.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {entry ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-emerald-700">
                                  {entry.score}
                                </span>
                                <span className="text-sm text-slate-500">/10</span>
                                {hasNotes && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-6 w-6"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-emerald-600" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-slate-400">
                                Sem registro
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expanded annotation */}
                        {isExpanded && hasNotes && (
                          <div className="ml-6 p-4 bg-white border border-emerald-200 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-slate-800 mb-2">
                              Anotação do dia {new Date(date).getDate()} – {pillar.name}
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {entry?.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary section for notes */}
              {dayEntries.some(({ entry }) => entry && entry.notes.trim() !== '') && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-600 text-sm text-center">
                    💡 Clique em um pilar com anotação para expandir os detalhes
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

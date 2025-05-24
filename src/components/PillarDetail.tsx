
import { useState } from "react";
import { ArrowLeft, Calendar, Edit3, Save } from "lucide-react";
import { Pillar } from "@/types/pillar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillarChart } from "@/components/PillarChart";

interface PillarDetailProps {
  pillar: Pillar;
  onBack: () => void;
}

export const PillarDetail = ({ pillar, onBack }: PillarDetailProps) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(pillar.entries[pillar.entries.length - 1]?.notes || "");
  const [todayScore, setTodayScore] = useState(pillar.currentScore);

  const filteredEntries = pillar.entries.slice(
    timeframe === 'week' ? -7 : -30
  );

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 10) {
      setTodayScore(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Painel</span>
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant={timeframe === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeframe('week')}
              size="sm"
            >
              Semana
            </Button>
            <Button
              variant={timeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeframe('month')}
              size="sm"
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Pillar Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-4xl shadow-xl mx-auto mb-4`}>
            {pillar.icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 mb-2">
            {pillar.name}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {pillar.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Progresso ao Longo do Tempo
                </h2>
              </div>
              <PillarChart entries={filteredEntries} color={pillar.color} />
            </Card>
          </div>

          {/* Score Input & Stats */}
          <div className="space-y-6">
            {/* Today's Score Input */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Pontuação de Hoje</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="score">Insira sua pontuação (0-10)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="10"
                    value={todayScore}
                    onChange={handleScoreChange}
                    className="text-center text-2xl font-bold"
                  />
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>
                    {todayScore}
                  </div>
                  <div className="text-slate-500">de 10</div>
                  <div className={`w-full h-3 bg-slate-200 rounded-full mt-4 overflow-hidden`}>
                    <div 
                      className={`h-full bg-gradient-to-r ${pillar.color} transition-all duration-700`}
                      style={{ width: `${(todayScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Notas de Hoje</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingNotes(!editingNotes)}
                >
                  {editingNotes ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                </Button>
              </div>
              
              {editingNotes ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione seus pensamentos para hoje..."
                  className="min-h-[100px] resize-none"
                />
              ) : (
                <div className="min-h-[100px] p-3 bg-slate-50 rounded-lg">
                  {notes || (
                    <span className="text-slate-400 italic">
                      Ainda não há notas. Clique em editar para adicionar seus pensamentos.
                    </span>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

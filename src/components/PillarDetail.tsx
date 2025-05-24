
import { useState, useMemo } from "react";
import { Calendar, Edit3, Save, Edit } from "lucide-react";
import { Pillar, DailyEntry } from "@/types/pillar";
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
  const [todayScore, setTodayScore] = useState<number | string>("");
  const [pillarEntries, setPillarEntries] = useState<DailyEntry[]>(pillar.entries);
  const [isEditingScore, setIsEditingScore] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Check if today's score already exists
  const todayEntry = pillarEntries.find(entry => entry.date === today);
  const displayScore = todayEntry ? todayEntry.score : todayScore;

  // Filter entries for current month only
  const currentMonthEntries = useMemo(() => {
    return pillarEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
  }, [pillarEntries, currentMonth, currentYear]);

  // Calculate monthly average
  const monthlyAverage = currentMonthEntries.length > 0 
    ? currentMonthEntries.reduce((sum, entry) => sum + entry.score, 0) / currentMonthEntries.length
    : 0;

  const filteredEntries = currentMonthEntries.slice(
    timeframe === 'week' ? -7 : -30
  );

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 10)) {
      setTodayScore(value);
    }
  };

  const handleSaveScore = () => {
    if (todayScore !== "" && !isNaN(Number(todayScore))) {
      const scoreValue = Number(todayScore);
      const newEntry: DailyEntry = {
        date: today,
        score: scoreValue,
        notes: notes
      };

      // Update entries - either add new or update existing
      const updatedEntries = pillarEntries.filter(entry => entry.date !== today);
      updatedEntries.push(newEntry);
      updatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setPillarEntries(updatedEntries);
      setIsEditingScore(false);
      console.log(`Pontuação salva para ${pillar.name}: ${scoreValue}`);
    }
  };

  const handleEditScore = () => {
    if (todayEntry) {
      setTodayScore(todayEntry.score);
      setIsEditingScore(true);
    }
  };

  // Format today's date in Portuguese
  const formatTodayDate = () => {
    const today = new Date();
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${today.getDate()}, ${months[today.getMonth()]} de ${today.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            <Button
              variant={timeframe === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeframe('week')}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Semana
            </Button>
            <Button
              variant={timeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeframe('month')}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Pillar Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-3xl sm:text-4xl shadow-xl mx-auto mb-4`}>
            {pillar.icon}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-800 mb-2">
            {pillar.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            {pillar.description}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {formatTodayDate()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Progresso ao Longo do Tempo
                  </h2>
                </div>
                <div className="text-emerald-700 font-semibold text-sm sm:text-base">
                  Média do mês: {monthlyAverage.toFixed(1)}
                </div>
              </div>
              <PillarChart entries={filteredEntries} color={pillar.color} />
            </Card>
          </div>

          {/* Score Input & Stats */}
          <div className="space-y-6">
            {/* Today's Score Input */}
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Pontuação de Hoje</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="score" className="text-sm">Insira sua pontuação (0-10)</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="10"
                      value={isEditingScore ? todayScore : (displayScore || "")}
                      onChange={handleScoreChange}
                      placeholder={`de 0 a 10, informe como se sente hoje quanto a '${pillar.name}'`}
                      className="text-center text-xl sm:text-2xl font-bold text-sm"
                      disabled={todayEntry && !isEditingScore}
                    />
                    {!todayEntry && todayScore !== "" && !isEditingScore && (
                      <Button onClick={handleSaveScore} size="sm" className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                        Salvar
                      </Button>
                    )}
                    {isEditingScore && (
                      <Button onClick={handleSaveScore} size="sm" className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                        Salvar
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>
                      {displayScore || "—"}
                    </div>
                    {todayEntry && !isEditingScore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditScore}
                        className="text-slate-500 hover:text-emerald-700"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-1 text-xs">Editar</span>
                      </Button>
                    )}
                  </div>
                  <div className="text-slate-500">de 10</div>
                  <div className={`w-full h-3 bg-slate-200 rounded-full mt-4 overflow-hidden`}>
                    <div 
                      className={`h-full bg-gradient-to-r ${pillar.color} transition-all duration-700`}
                      style={{ width: `${displayScore ? (Number(displayScore) / 10) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                  className="min-h-[100px] resize-none text-sm"
                />
              ) : (
                <div className="min-h-[100px] p-3 bg-slate-50 rounded-lg text-sm">
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

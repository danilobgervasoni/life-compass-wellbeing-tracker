import { useState, useMemo } from "react";
import { Calendar, Edit3, Save, Edit, BarChart3, CalendarDays, ArrowLeft } from "lucide-react";
import { Pillar, DailyEntry } from "@/types/pillar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillarChart } from "@/components/PillarChart";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import { Header } from "@/components/Header";
import { DollarSign, Heart, Clock, Users, BookOpen, Activity, Coffee } from "lucide-react";
import { useReflections } from "@/hooks/useReflections";

interface PillarDetailProps {
  pillar: Pillar;
  onBack: () => void;
  onScoreUpdate?: (pillarId: string, newScore: number, notes?: string) => void;
}

export const PillarDetail = ({ pillar, onBack, onScoreUpdate }: PillarDetailProps) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [todayScore, setTodayScore] = useState<number | string>("");
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [saving, setSaving] = useState(false);
  const { saveReflection } = useReflections();

  // Use local timezone for today
  const today = new Date();
  const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Check if today's score already exists
  const todayEntry = pillar.entries.find(entry => entry.date === localToday);
  
  // Initialize states based on today's entry
  useState(() => {
    if (todayEntry) {
      setNotes(todayEntry.notes || "");
      setTodayScore(todayEntry.score);
    }
  });

  const displayScore = todayEntry ? todayEntry.score : todayScore;

  // Filter entries for current month only
  const currentMonthEntries = useMemo(() => {
    return pillar.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
  }, [pillar.entries, currentMonth, currentYear]);

  // Calculate monthly average
  const monthlyAverage = currentMonthEntries.length > 0 
    ? currentMonthEntries.reduce((sum, entry) => sum + entry.score, 0) / currentMonthEntries.length
    : 0;

  // Include today's data in the filtered entries for chart
  const filteredEntries = useMemo(() => {
    let entries = currentMonthEntries.slice(timeframe === 'week' ? -7 : -30);
    
    // Ensure today's entry is included if it exists
    if (todayEntry && !entries.find(e => e.date === localToday)) {
      entries = [...entries, todayEntry].sort((a, b) => a.date.localeCompare(b.date));
    }
    
    return entries;
  }, [currentMonthEntries, timeframe, todayEntry, localToday]);

  const getPillarIcon = () => {
    switch (pillar.icon) {
      case '💰':
        return <DollarSign className="h-8 w-8 text-white" />;
      case '❤️':
        return <Heart className="h-8 w-8 text-white" />;
      case '⏰':
        return <Clock className="h-8 w-8 text-white" />;
      case '👥':
        return <Users className="h-8 w-8 text-white" />;
      case '📚':
        return <BookOpen className="h-8 w-8 text-white" />;
      case '💪':
        return <Activity className="h-8 w-8 text-white" />;
      case '🕊️':
        return <Coffee className="h-8 w-8 text-white" />;
      default:
        return <Heart className="h-8 w-8 text-white" />;
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 10)) {
      setTodayScore(value);
    }
  };

  const handleSaveScore = async () => {
    if (todayScore !== "" && !isNaN(Number(todayScore)) && onScoreUpdate) {
      try {
        setSaving(true);
        const scoreValue = Number(todayScore);
        await onScoreUpdate(pillar.id, scoreValue, notes);
        
        // Also save as reflection if there are notes - fix: use only 2 arguments
        if (notes.trim()) {
          await saveReflection(pillar.id, notes);
        }
        
        setIsEditingScore(false);
        console.log(`Pontuação salva para ${pillar.name}: ${scoreValue}`);
      } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleEditScore = () => {
    if (todayEntry) {
      setTodayScore(todayEntry.score);
      setNotes(todayEntry.notes || "");
      setIsEditingScore(true);
    }
  };

  const handleStartNewEntry = () => {
    setTodayScore("");
    setNotes("");
    setIsEditingScore(true);
  };

  const handleSaveNotes = async () => {
    if (notes.trim() && todayEntry) {
      try {
        setSaving(true);
        await saveReflection(pillar.id, notes);
        setEditingNotes(false);
        console.log(`Anotação salva para ${pillar.name}`);
      } catch (error) {
        console.error('Erro ao salvar anotação:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  // Handler for calendar date updates - ensuring dates are saved correctly
  const handleCalendarScoreUpdate = async (date: string, score: number, notes?: string) => {
    if (onScoreUpdate) {
      // Check if the date is in the future
      if (date > localToday) {
        console.warn('Não é possível inserir dados em datas futuras');
        return;
      }

      // Create a temporary entry for the specific date
      const tempEntry = { date, score, notes: notes || '' };
      
      // Call the parent's score update function with the date-specific data
      try {
        // For past dates, we need to call the backend directly with the correct date
        await onScoreUpdate(pillar.id, score, notes, date);
        
        // Also save as reflection if there are notes - fix: use the date parameter
        if (notes && notes.trim()) {
          await saveReflection(pillar.id, notes, date);
        }
        
        console.log('Calendar update saved for date:', date, 'score:', score, 'notes:', notes);
      } catch (error) {
        console.error('Error saving calendar update:', error);
      }
    }
  };

  const formatTodayDate = () => {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${today.getDate()}, ${months[today.getMonth()]} de ${today.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-warmGray-50">
      <Header 
        showBackButton={true}
        onBackToHome={onBack}
      />
      
      <div className="container mx-auto px-4 py-8 pt-28">
        {/* Pillar Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r ${pillar.color} flex items-center justify-center shadow-soft mx-auto mb-4`}>
            {getPillarIcon()}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-warmGray-900 mb-2">
            {pillar.name}
          </h1>
          <p className="text-base sm:text-lg text-warmGray-600 max-w-2xl mx-auto px-4">
            {pillar.description}
          </p>
          <p className="text-sm text-warmGray-500 mt-2">
            {formatTodayDate()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Chart and Calendar Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="chart" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Gráfico</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Calendário</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart">
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-soft">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-warmGray-600" />
                      <h2 className="text-lg sm:text-xl font-semibold text-warmGray-800">
                        Progresso ao Longo do Tempo
                      </h2>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={timeframe === 'week' ? 'default' : 'outline'}
                        onClick={() => setTimeframe('week')}
                        size="sm"
                        className={`transition-all ${
                          timeframe === 'week' 
                            ? 'bg-sage-600 hover:bg-sage-700 text-white' 
                            : 'bg-warmGray-200 hover:bg-warmGray-300 text-black border-warmGray-300'
                        }`}
                      >
                        Semanal
                      </Button>
                      <Button
                        variant={timeframe === 'month' ? 'default' : 'outline'}
                        onClick={() => setTimeframe('month')}
                        size="sm"
                        className={`transition-all ${
                          timeframe === 'month' 
                            ? 'bg-sage-600 hover:bg-sage-700 text-white' 
                            : 'bg-warmGray-200 hover:bg-warmGray-300 text-black border-warmGray-300'
                        }`}
                      >
                        Mensal
                      </Button>
                    </div>
                  </div>
                  <PillarChart entries={filteredEntries} color={pillar.color} />
                  <div className="text-sage-700 font-semibold text-sm sm:text-base mt-4 text-center">
                    Média do mês: {monthlyAverage.toFixed(1)}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar">
                <MonthlyCalendar 
                  entries={pillar.entries} 
                  pillarName={pillar.name}
                  pillarColor={pillar.color}
                  onScoreUpdate={handleCalendarScoreUpdate}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Score Input & Stats */}
          <div className="space-y-6">
            {/* Today's Score Input */}
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-soft">
              {!todayEntry && !isEditingScore ? (
                // No entry exists and not editing - show placeholder
                <div>
                  <h3 className="text-lg font-semibold text-warmGray-800 mb-4">Pontuação de Hoje</h3>
                  <Label htmlFor="score" className="text-sm">Insira sua pontuação (0-10)</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="Insira um valor entre 0 e 10"
                      className="text-center text-xl sm:text-2xl font-bold"
                      onClick={handleStartNewEntry}
                      readOnly
                    />
                  </div>
                </div>
              ) : !isEditingScore ? (
                // Entry exists and not editing - show score with edit button
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-warmGray-800">Pontuação de hoje</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditScore}
                      className="text-xs px-2 py-1 h-auto text-warmGray-500 hover:text-sage-700 border border-warmGray-300 hover:border-sage-300 rounded"
                    >
                      Editar
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>
                      {displayScore}
                    </div>
                    <div className="text-warmGray-500 text-sm">de 10</div>
                  </div>
                </div>
              ) : (
                // Editing mode - show input field
                <div>
                  <h3 className="text-lg font-semibold text-warmGray-800 mb-4">Pontuação de Hoje</h3>
                  <Label htmlFor="score" className="text-sm">Insira sua pontuação (0-10)</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="10"
                      value={todayScore}
                      onChange={handleScoreChange}
                      placeholder="Insira um valor entre 0 e 10"
                      className="text-center text-xl sm:text-2xl font-bold"
                    />
                    <Button 
                      onClick={handleSaveScore} 
                      size="sm" 
                      className="bg-sage-600 hover:bg-sage-700 shrink-0"
                      disabled={saving || todayScore === ""}
                    >
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className={`w-full h-3 bg-warmGray-200 rounded-full mt-4 overflow-hidden`}>
                      <div 
                        className={`h-full bg-gradient-to-r ${pillar.color} transition-all duration-700`}
                        style={{ width: `${todayScore ? (Number(todayScore) / 10) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Notes */}
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-soft">
              {!editingNotes && (!notes || notes.trim() === '') ? (
                // No notes and not editing
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-warmGray-800">Notas de Hoje</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNotes(true)}
                      className="text-xs px-2 py-1 h-auto text-warmGray-500 hover:text-sage-700 border border-warmGray-300 hover:border-sage-300 rounded"
                    >
                      Editar
                    </Button>
                  </div>
                  <div className="min-h-[100px] p-3 bg-warmGray-50 rounded-lg text-sm">
                    <span className="text-warmGray-400 italic">
                      Ainda não há notas. Clique em editar para adicionar seus pensamentos.
                    </span>
                  </div>
                </div>
              ) : !editingNotes ? (
                // Has notes and not editing
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-warmGray-800">Notas de hoje</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNotes(true)}
                      className="text-xs px-2 py-1 h-auto text-warmGray-500 hover:text-sage-700 border border-warmGray-300 hover:border-sage-300 rounded"
                    >
                      Editar
                    </Button>
                  </div>
                  <div className="p-3 bg-warmGray-50 rounded-lg text-sm text-warmGray-700 leading-relaxed">
                    {notes}
                  </div>
                </div>
              ) : (
                // Editing mode
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-warmGray-800">Notas de Hoje</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={saving}
                      className="text-xs px-2 py-1 h-auto text-warmGray-500 hover:text-sage-700 border border-warmGray-300 hover:border-sage-300 rounded"
                    >
                      Salvar
                    </Button>
                  </div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Adicione seus pensamentos para hoje..."
                    className="min-h-[100px] resize-none text-sm"
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

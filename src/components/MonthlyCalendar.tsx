
import { useMemo, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DailyEntry } from "@/types/pillar";

interface MonthlyCalendarProps {
  entries: DailyEntry[];
  pillarName: string;
  pillarColor: string;
  onScoreUpdate?: (date: string, score: number, notes?: string) => void;
}

export const MonthlyCalendar = ({ entries, pillarName, pillarColor, onScoreUpdate }: MonthlyCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingScore, setEditingScore] = useState<string>("");
  const [editingNotes, setEditingNotes] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get local today for comparison
  const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Create a map of dates to scores for quick lookup
  const scoresMap = useMemo(() => {
    const map = new Map<string, DailyEntry>();
    entries.forEach(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00'); // Ensure local timezone
      if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
        map.set(entry.date, entry);
      }
    });
    return map;
  }, [entries, currentMonth, currentYear]);

  // Get color based on score
  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return "bg-warmGray-50 text-warmGray-400 border border-warmGray-100 hover:bg-warmGray-100";
    if (score <= 3) return "bg-terracotta-400 text-white shadow-soft";
    if (score <= 6) return "bg-petroleum-400 text-white shadow-soft";
    return "bg-sage-500 text-white shadow-soft";
  };

  // Check if a day is in the future
  const isFutureDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString > localToday;
  };

  // Format month name in Portuguese
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDayClick = (day: number) => {
    // Prevent clicking on future dates
    if (isFutureDate(day)) {
      return;
    }

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = scoresMap.get(dateString);
    
    setSelectedDay(day);
    setIsEditing(true);
    setEditingScore(entry?.score?.toString() || "");
    setEditingNotes(entry?.notes || "");
  };

  const handleSave = async () => {
    if (!selectedDay || !onScoreUpdate) return;
    
    const score = parseInt(editingScore);
    if (isNaN(score) || score < 0 || score > 10) {
      alert("Por favor, insira uma pontuação válida entre 0 e 10");
      return;
    }

    try {
      setSaving(true);
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      await onScoreUpdate(dateString, score, editingNotes);
      setIsEditing(false);
      setSelectedDay(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar a pontuação. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedDay(null);
    setEditingScore("");
    setEditingNotes("");
  };

  const getSelectedDayEntry = () => {
    if (!selectedDay) return null;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    return scoresMap.get(dateString);
  };

  const selectedEntry = getSelectedDayEntry();

  return (
    <Card className="p-6 bg-white border-0 shadow-soft">
      <div className="flex items-center space-x-3 mb-6">
        <CalendarIcon className="h-6 w-6 text-sage-600" />
        <h2 className="text-xl font-semibold text-warmGray-800">
          Calendário - {pillarName}
        </h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-warmGray-700 text-center">
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-terracotta-400 rounded-lg shadow-soft"></div>
          <span className="text-warmGray-600 font-medium">0-3</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-petroleum-400 rounded-lg shadow-soft"></div>
          <span className="text-warmGray-600 font-medium">4-6</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-sage-500 rounded-lg shadow-soft"></div>
          <span className="text-warmGray-600 font-medium">7-10</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-warmGray-50 border border-warmGray-200 rounded-lg"></div>
          <span className="text-warmGray-600 font-medium">Sem pontuação</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-warmGray-600 py-3">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = scoresMap.get(dateString);
          const score = entry?.score;
          const isFuture = isFutureDate(day);
          
          // Use local timezone for today comparison
          const localTodayDate = new Date();
          const isToday = day === localTodayDate.getDate() && currentMonth === localTodayDate.getMonth() && currentYear === localTodayDate.getFullYear();
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={isFuture}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                transition-all duration-200 
                ${isFuture 
                  ? 'bg-warmGray-100 text-warmGray-300 cursor-not-allowed opacity-50' 
                  : 'hover:scale-105 cursor-pointer ' + getScoreColor(score)
                }
                ${isToday && !isFuture ? 'ring-2 ring-sage-400 ring-offset-2' : ''}
                ${isSelected ? 'ring-2 ring-petroleum-400 ring-offset-2' : ''}
              `}
            >
              <div className="text-center">
                <div className="text-xs opacity-80">{day}</div>
                {score !== undefined && (
                  <div className="text-xs font-bold mt-0.5">{score}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Editing Modal */}
      {isEditing && selectedDay && (
        <div className="mt-6 p-5 bg-sage-50 rounded-xl border border-sage-100">
          <h4 className="text-lg font-semibold text-warmGray-800 mb-4">
            {selectedEntry ? 'Editar' : 'Adicionar'} registro do dia {selectedDay}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-2">
                Pontuação (0-10)
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                value={editingScore}
                onChange={(e) => setEditingScore(e.target.value)}
                placeholder="Digite uma pontuação de 0 a 10"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-2">
                Anotação (opcional)
              </label>
              <Textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Adicione suas observações para este dia..."
                className="w-full min-h-[100px]"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                disabled={saving || !editingScore}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Day Annotation (quando não está editando) */}
      {selectedDay && !isEditing && selectedEntry?.notes && (
        <div className="mt-6 p-5 bg-sage-50 rounded-xl border border-sage-100 animate-fade-in">
          <h4 className="text-lg font-semibold text-warmGray-800 mb-3">
            Anotação do dia {selectedDay}
          </h4>
          <p className="text-warmGray-700 leading-relaxed">
            {selectedEntry.notes}
          </p>
        </div>
      )}
    </Card>
  );
};


import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCards } from "@/hooks/useCards";
import { DayDetailModal } from "@/components/DayDetailModal";

const Calendar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { cards, loading } = useCards();

  const today = new Date();
  const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Create a map of dates with any entries across all pillars
  const getDaysWithEntries = () => {
    const datesWithEntries = new Set<string>();
    cards.forEach(pillar => {
      pillar.entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
          datesWithEntries.add(entry.date);
        }
      });
    });
    return datesWithEntries;
  };

  const daysWithEntries = getDaysWithEntries();

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
    // Only allow clicking on dates with entries or today/past dates
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (isFutureDate(day)) {
      return;
    }

    if (daysWithEntries.has(dateString)) {
      setSelectedDate(dateString);
    }
  };

  const handleNavigateToReflections = () => {
    navigate("/reflections");
  };

  const handleNavigateToCards = () => {
    navigate("/cards");
  };

  const handleNavigateToCalendar = () => {
    navigate("/calendar");
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-warmGray-600">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmGray-50">
      <Header 
        onNavigateToReflections={handleNavigateToReflections}
        onNavigateToCards={handleNavigateToCards}
        onNavigateToCalendar={handleNavigateToCalendar}
      />
      
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sage-600 via-sage-700 to-warmGray-800 bg-clip-text text-transparent mb-2">
              Calendário de Sentimentos
            </h1>
            <p className="text-warmGray-600 text-sm sm:text-base">
              Visualize todos os seus registros organizados por data
            </p>
          </div>

          {/* Calendar */}
          <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="hover:bg-sage-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-warmGray-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-warmGray-800">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="hover:bg-sage-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="flex justify-center mb-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-sage-500 rounded-full"></div>
                <span className="text-warmGray-600">Dias com registros</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-warmGray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEntries = daysWithEntries.has(dateString);
                const isFuture = isFutureDate(day);
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    disabled={isFuture || !hasEntries}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium
                      transition-all duration-200 border border-warmGray-200
                      ${isFuture 
                        ? 'bg-warmGray-100 text-warmGray-300 cursor-not-allowed opacity-50' 
                        : hasEntries 
                          ? 'bg-warmGray-50 hover:scale-105 hover:bg-sage-50 hover:border-sage-300 cursor-pointer' 
                          : 'bg-white text-warmGray-400'
                      }
                      ${isToday && !isFuture ? 'ring-2 ring-sage-600 ring-offset-1' : ''}
                    `}
                  >
                    <span className="text-warmGray-700">{day}</span>
                    {hasEntries && (
                      <div className="w-2 h-2 bg-sage-500 rounded-full mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* No data message */}
            {cards.length > 0 && daysWithEntries.size === 0 && (
              <div className="text-center mt-8 p-6">
                <p className="text-warmGray-500 text-sm">
                  Nenhum registro encontrado para {monthNames[currentMonth]} de {currentYear}.
                </p>
                <p className="text-warmGray-400 text-xs mt-2">
                  Comece avaliando seus pilares para ver os registros aqui.
                </p>
              </div>
            )}
          </Card>

          {/* Day Detail Modal */}
          {selectedDate && (
            <DayDetailModal
              date={selectedDate}
              pillars={cards}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

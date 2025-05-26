
import { Pillar } from "@/types/pillar";
import { TrendingUp, TrendingDown, Minus, DollarSign, Heart, Clock, Users, BookOpen, Activity, Coffee } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PillarCardProps {
  pillar: Pillar;
  onClick: () => void;
}

export const PillarCard = ({ pillar, onClick }: PillarCardProps) => {
  const getTrendIcon = () => {
    switch (pillar.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-sage-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-terracotta-500" />;
      default:
        return <Minus className="h-4 w-4 text-warmGray-400" />;
    }
  };

  const getPillarIcon = (pillarName: string) => {
    switch (pillarName.toLowerCase()) {
      case 'dinheiro':
        return <DollarSign className="h-6 w-6 text-white" />;
      case 'espiritualidade':
        return <Heart className="h-6 w-6 text-white" />;
      case 'tempo':
        return <Clock className="h-6 w-6 text-white" />;
      case 'relacionamento':
        return <Users className="h-6 w-6 text-white" />;
      case 'conhecimento':
        return <BookOpen className="h-6 w-6 text-white" />;
      case 'saúde':
        return <Activity className="h-6 w-6 text-white" />;
      case 'social':
        return <Coffee className="h-6 w-6 text-white" />;
      default:
        return <Heart className="h-6 w-6 text-white" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-sage-600";
    if (score >= 6) return "text-petroleum-500";
    if (score > 0) return "text-terracotta-500";
    return "text-warmGray-400";
  };

  const getGradientClass = (pillarName: string) => {
    switch (pillarName.toLowerCase()) {
      case 'dinheiro':
        return "gradient-brand";
      case 'espiritualidade':
        return "gradient-terracotta";
      case 'tempo':
        return "gradient-petroleum";
      case 'relacionamento':
        return "gradient-brand";
      case 'conhecimento':
        return "gradient-terracotta";
      case 'saúde':
        return "gradient-petroleum";
      case 'social':
        return "gradient-brand";
      default:
        return "gradient-brand";
    }
  };

  // Calculate monthly average
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthEntries = pillar.entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  });

  const monthlyAverage = currentMonthEntries.length > 0 
    ? currentMonthEntries.reduce((sum, entry) => sum + entry.score, 0) / currentMonthEntries.length
    : 0;

  const displayScore = Number(monthlyAverage.toFixed(1));

  return (
    <Card 
      className="group cursor-pointer card-hover bg-white border-0 shadow-soft overflow-hidden"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-xl ${getGradientClass(pillar.name)} flex items-center justify-center shadow-soft`}>
            {getPillarIcon(pillar.name)}
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold text-warmGray-800 mb-3 group-hover:text-warmGray-900 transition-colors">
          {pillar.name}
        </h3>
        <p className="text-sm text-warmGray-600 mb-6 line-clamp-2 leading-relaxed">
          {pillar.description}
        </p>

        {/* Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-warmGray-500 font-medium">Média do Mês:</span>
            <span className={`text-2xl font-semibold ${getScoreColor(displayScore)}`}>
              {displayScore > 0 ? displayScore : "—"}
            </span>
            <span className="text-sm text-warmGray-400">/10</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-20 h-3 bg-warmGray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full ${getGradientClass(pillar.name)} transition-all duration-700 ease-out rounded-full`}
              style={{ width: `${displayScore > 0 ? (displayScore / 10) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

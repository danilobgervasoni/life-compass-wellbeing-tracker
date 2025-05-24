
import { Pillar } from "@/types/pillar";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PillarCardProps {
  pillar: Pillar;
  onClick: () => void;
}

export const PillarCard = ({ pillar, onClick }: PillarCardProps) => {
  const getTrendIcon = () => {
    switch (pillar.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-2xl shadow-lg`}>
            {pillar.icon}
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
          {pillar.name}
        </h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {pillar.description}
        </p>

        {/* Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Today's Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(pillar.currentScore)}`}>
              {pillar.currentScore}
            </span>
            <span className="text-sm text-slate-400">/10</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${pillar.color} transition-all duration-500`}
              style={{ width: `${(pillar.currentScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

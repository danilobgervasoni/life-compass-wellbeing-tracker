
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onBackToHome?: () => void;
  showBackButton?: boolean;
}

export const Header = ({ onBackToHome, showBackButton = false }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Be Rock logo or back button */}
          <div className="flex items-center">
            {showBackButton ? (
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-slate-600 hover:text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
            ) : (
              <div 
                className="flex items-center cursor-pointer group"
                onClick={onBackToHome}
              >
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  Be Rock
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
              Cards
            </button>
            <button className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
              Anotações
            </button>
          </nav>

          {/* Right side - Profile icon */}
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
            <span className="text-white font-semibold text-sm">👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};

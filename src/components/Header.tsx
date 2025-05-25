
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  onBackToHome?: () => void;
  showBackButton?: boolean;
  onNavigateToReflections?: () => void;
}

export const Header = ({ onBackToHome, showBackButton = false, onNavigateToReflections }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            ) : (
              <div 
                className="flex items-center cursor-pointer group"
                onClick={onBackToHome}
              >
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg font-bold text-base sm:text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  Be Rock
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            <button className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
              Cards
            </button>
            <button 
              className="text-slate-700 hover:text-emerald-700 font-medium transition-colors"
              onClick={onNavigateToReflections}
            >
              Reflexões
            </button>
          </nav>

          {/* Right side - Profile icon and mobile menu toggle */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Profile icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
              <span className="text-white font-semibold text-xs sm:text-sm">👤</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-emerald-200">
            <nav className="flex flex-col space-y-3 pt-4">
              <button 
                className="text-slate-700 hover:text-emerald-700 font-medium transition-colors text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cards
              </button>
              <button 
                className="text-slate-700 hover:text-emerald-700 font-medium transition-colors text-left"
                onClick={() => {
                  onNavigateToReflections?.();
                  setIsMobileMenuOpen(false);
                }}
              >
                Reflexões
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

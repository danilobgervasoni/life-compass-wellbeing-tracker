
import { ArrowLeft, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onBackToHome?: () => void;
  showBackButton?: boolean;
  onNavigateToReflections?: () => void;
  onNavigateToCards?: () => void;
  onNavigateToDiary?: () => void;
}

export const Header = ({ onBackToHome, showBackButton = false, onNavigateToReflections, onNavigateToCards, onNavigateToDiary }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate("/");
    }
  };

  const handleCardsClick = () => {
    if (onNavigateToCards) {
      onNavigateToCards();
    } else {
      navigate("/cards");
    }
  };

  const handleReflectionsClick = () => {
    if (onNavigateToReflections) {
      onNavigateToReflections();
    } else {
      navigate("/reflections");
    }
  };

  const handleDiaryClick = () => {
    if (onNavigateToDiary) {
      onNavigateToDiary();
    } else {
      navigate("/diary");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Be Rock logo or back button */}
          <div className="flex items-center">
            {showBackButton ? (
              <Button 
                variant="ghost" 
                onClick={handleHomeClick}
                className="flex items-center space-x-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl px-3 py-2 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Voltar</span>
              </Button>
            ) : (
              <div 
                className="flex items-center cursor-pointer group"
                onClick={handleHomeClick}
              >
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-lg sm:text-xl shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105">
                  Algoritmo de Governo
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-xl ${
                location.pathname === '/cards' 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={handleCardsClick}
            >
              Cards
            </button>
            <button 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-xl ${
                location.pathname === '/reflections' 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={handleReflectionsClick}
            >
              Reflexões
            </button>
            <button 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-xl ${
                location.pathname === '/diary' || location.pathname.startsWith('/diary/')
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={handleDiaryClick}
            >
              Diário
            </button>
          </nav>

          {/* Right side - Profile icon and mobile menu toggle */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Profile icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-neutral-100 animate-fade-in">
            <nav className="flex flex-col space-y-2 pt-4">
              <button 
                className={`font-medium transition-all duration-200 text-left px-4 py-2 rounded-xl ${
                  location.pathname === '/cards' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => {
                  handleCardsClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Cards
              </button>
              <button 
                className={`font-medium transition-all duration-200 text-left px-4 py-2 rounded-xl ${
                  location.pathname === '/reflections' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => {
                  handleReflectionsClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Reflexões
              </button>
              <button 
                className={`font-medium transition-all duration-200 text-left px-4 py-2 rounded-xl ${
                  location.pathname === '/diary' || location.pathname.startsWith('/diary/')
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => {
                  handleDiaryClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Diário
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

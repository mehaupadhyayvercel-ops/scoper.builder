import { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Stepper } from './components/Stepper';
import { WelcomeScreen } from './screens/Welcome';
import { BusinessInfoScreen } from './screens/BusinessInfo';
import { ProjectDetailsScreen } from './screens/ProjectDetails';
import { PreferencesScreen } from './screens/Preferences';
import { ProcessingScreen } from './screens/Processing';
import { SummaryScreen } from './screens/Summary';
import { AnimatePresence } from 'motion/react';
import { Search, Menu, X } from 'lucide-react';

const NAV_LINKS = ['Services', 'Platforms', 'Industry', 'Our Work', 'About', 'Excellence'];

function AppContent() {
  const { currentStep } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-outline-variant/20 flex items-center px-6 lg:px-12 bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_12px_rgba(209,205,199,0.3)]">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-serif font-bold text-xl leading-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.2)] clay-title">
              O
            </div>
            <span className="font-serif font-semibold text-xl tracking-tight text-on-surface hidden sm:block clay-title">OpenXcell</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6 mr-4">
              {NAV_LINKS.map(link => (
                <a key={link} href="#" className="text-sm font-semibold text-on-surface hover:text-primary transition-colors clay-text">
                  {link}
                </a>
              ))}
            </nav>
            
            {/* CTAs strictly ordered as per UX brief */}
            <div className="flex items-center gap-3">
              <button className="clay-btn-secondary px-5 py-2.5 text-sm font-bold">
                Start Project Assessment
              </button>
              <button className="clay-btn px-5 py-2.5 text-sm font-bold">
                Let's Connect
              </button>
              <button className="ml-2 p-2 text-on-surface hover:text-primary transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
             <button className="p-2 text-on-surface hover:text-primary transition-colors">
               <Search size={20} />
             </button>
             <button 
               className="p-2 text-on-surface hover:text-primary transition-colors"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant/20 shadow-lg z-40 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {/* Mobile CTAs strictly ordered as per UX brief */}
            <button className="clay-btn-secondary w-full py-3 text-sm font-bold">
              Start Project Assessment
            </button>
            <button className="clay-btn w-full py-3 text-sm font-bold">
              Let's Connect
            </button>
          </div>
          <nav className="flex flex-col gap-4 border-t border-outline-variant/10 pt-4">
            {NAV_LINKS.map(link => (
              <a key={link} href="#" className="text-base font-semibold text-on-surface hover:text-primary transition-colors clay-text">
                {link}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full px-4 lg:px-6 py-4 lg:py-5 relative z-10">
        <Stepper currentStep={currentStep} />
        
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && <div className="max-w-4xl mx-auto"><WelcomeScreen key="welcome" /></div>}
          {currentStep === 'business' && <div className="max-w-2xl mx-auto"><BusinessInfoScreen key="business" /></div>}
          {currentStep === 'project' && <div className="max-w-3xl mx-auto"><ProjectDetailsScreen key="project" /></div>}
          {currentStep === 'preferences' && <div className="max-w-3xl mx-auto"><PreferencesScreen key="preferences" /></div>}
          {currentStep === 'processing' && <div className="max-w-xl mx-auto"><ProcessingScreen key="processing" /></div>}
          {currentStep === 'summary' && <SummaryScreen key="summary" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

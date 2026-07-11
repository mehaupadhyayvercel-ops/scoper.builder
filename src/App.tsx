import { AppProvider, useAppContext } from './context/AppContext';
import { Stepper } from './components/Stepper';
import { WelcomeScreen } from './screens/Welcome';
import { BusinessInfoScreen } from './screens/BusinessInfo';
import { ProjectDetailsScreen } from './screens/ProjectDetails';
import { PreferencesScreen } from './screens/Preferences';
import { ProcessingScreen } from './screens/Processing';
import { SummaryScreen } from './screens/Summary';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  const { currentStep } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-outline-variant/20 flex items-center px-6 lg:px-12 bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_12px_rgba(209,205,199,0.3)]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-serif font-bold text-xl leading-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.2)] clay-title">
              O
            </div>
            <span className="font-serif font-semibold text-xl tracking-tight text-on-surface hidden sm:block clay-title">OpenXcell</span>
          </div>
          {currentStep !== 'welcome' && (
            <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full clay-text shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]">
              Project Assessment
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 lg:px-6 py-4 lg:py-5">
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

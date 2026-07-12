import { AppProvider, useAppContext } from './context/AppContext';
import { Stepper } from './components/Stepper';
import { WelcomeScreen } from './screens/Welcome';
import { BusinessInfoScreen } from './screens/BusinessInfo';
import { ProjectDetailsScreen } from './screens/ProjectDetails';
import { PreferencesScreen } from './screens/Preferences';
import { ProcessingScreen } from './screens/Processing';
import { SummaryScreen } from './screens/Summary';
import { AnimatePresence } from 'motion/react';
import CardNav from './components/CardNav';

function AppContent() {
  const { currentStep } = useAppContext();

  const navItems = [
    {
      label: "Services",
      bgColor: "#111827", 
      textColor: "#fff",
      links: [
        { label: "Custom Software", href: "https://www.openxcell.com/services/", ariaLabel: "Custom Software" },
        { label: "Mobile Apps", href: "https://www.openxcell.com/mobile-app-development/", ariaLabel: "Mobile Apps" },
        { label: "Web Apps", href: "https://www.openxcell.com/web-development/", ariaLabel: "Web Apps" }
      ]
    },
    {
      label: "Company", 
      bgColor: "#1f2937", 
      textColor: "#fff",
      links: [
        { label: "About Us", href: "https://www.openxcell.com/about-us/", ariaLabel: "About Us" },
        { label: "Our Work", href: "https://www.openxcell.com/work/", ariaLabel: "Our Work" },
        { label: "Excellence", href: "https://www.openxcell.com/engagement-models/", ariaLabel: "Excellence" }
      ]
    },
    {
      label: "Platforms",
      bgColor: "#374151", 
      textColor: "#fff",
      links: [
        { label: "AI & ML", href: "https://www.openxcell.com/artificial-intelligence/", ariaLabel: "AI & ML" },
        { label: "Cloud", href: "https://www.openxcell.com/cloud-computing/", ariaLabel: "Cloud" },
        { label: "Industries", href: "https://www.openxcell.com/industries/", ariaLabel: "Industries" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col pt-24">
      {/* Animated Card Navigation Header */}
      <CardNav 
        logo=""
        items={navItems}
        baseColor="#ffffff"
        menuColor="#111827"
        buttonBgColor="#111827"
        buttonTextColor="#ffffff"
      />

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

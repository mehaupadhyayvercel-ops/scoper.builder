import { AssessmentData, Step } from '../types';
import { createContext, useContext, useState, ReactNode } from 'react';
import { INITIAL_DATA } from '../types';

interface AppContextType {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  goNext: (step: Step) => void;
  goBack: (step: Step) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AssessmentData>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');

  const updateData = (updates: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const goNext = (step: Step) => setCurrentStep(step);
  const goBack = (step: Step) => setCurrentStep(step);

  return (
    <AppContext.Provider value={{ data, updateData, currentStep, setCurrentStep, goNext, goBack }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

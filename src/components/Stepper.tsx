import { Step } from '../types';

const steps: { id: Step; label: string }[] = [
  { id: 'business', label: 'Business' },
  { id: 'project', label: 'Project' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'summary', label: 'Summary' },
];

export function Stepper({ currentStep }: { currentStep: Step }) {
  if (currentStep === 'welcome') return null;

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const isSummary = step.id === 'summary';
        // Processing shows up before summary, so if current is processing, preferences is past
        const isProcessing = currentStep === 'processing';
        
        const effectiveIndex = isProcessing ? 3 : currentIndex;
        const effectivePast = index < effectiveIndex;
        const effectiveActive = isProcessing && step.id === 'summary' ? false : index === effectiveIndex;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 clay-text ${
                effectiveActive
                  ? 'bg-primary text-white shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.1),4px_4px_8px_rgba(139,75,45,0.3),-4px_-4px_8px_rgba(255,255,255,0.8)]'
                  : effectivePast
                  ? 'bg-surface text-primary shadow-[4px_4px_8px_rgba(209,205,199,0.4),-4px_-4px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(255,255,255,0.8)]'
                  : 'bg-surface-container text-secondary/50 shadow-[inset_2px_2px_4px_rgba(209,205,199,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]'
              }`}
            >
              {effectivePast ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-px ${effectivePast ? 'bg-primary/50' : 'bg-outline-variant/50'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

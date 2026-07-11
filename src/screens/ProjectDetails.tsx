import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

const INSPIRATION_CARDS = [
  'Healthcare platform', 'Multi-vendor Marketplace', 'E-commerce store', 
  'Customer Portal', 'Internal Tool', 'AI Automation', 'CRM System', 'Learning Management'
];

export function ProjectDetailsScreen() {
  const { data, updateData, goNext, goBack } = useAppContext();
  const [error, setError] = useState('');

  const handleInspirationClick = (text: string) => {
    const current = data.projectDescription;
    const prefix = `I want to build a ${text.toLowerCase()} where `;
    updateData({ projectDescription: current ? `${prefix}${current}` : prefix });
    setError('');
  };

  const validateAndContinue = () => {
    if (!data.projectDescription.trim()) {
      setError('Tell us a little about your business idea so we can prepare a better assessment.');
      return;
    }
    goNext('preferences');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3 text-on-surface clay-title">Project Details</h2>
        <p className="text-secondary text-lg clay-text">Describe your business intent in your own words.</p>
      </div>

      <div className="clay-card p-5 sm:p-6">
        <div className="mb-8">
          <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3 block clay-text">What are you trying to build?</label>
          <textarea 
            className={`clay-input w-full p-4 text-base min-h-[160px] resize-y ${error ? 'border-error' : ''}`}
            placeholder="e.g. I want to build a healthcare platform where patients can book appointments online and consult doctors remotely."
            value={data.projectDescription}
            onChange={(e) => {
              updateData({ projectDescription: e.target.value });
              if (error) setError('');
            }}
          />
          {error && <p className="text-error text-sm mt-2">{error}</p>}
          
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 clay-text">
              <Lightbulb size={16} /> Helper Questions
            </h4>
            <ul className="text-sm text-secondary space-y-1 ml-6 list-disc clay-text">
              <li>Who will use your product?</li>
              <li>What problem are you solving?</li>
              <li>What is your main goal?</li>
              <li>What should users be able to do?</li>
            </ul>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3 block clay-text">Need inspiration?</label>
          <div className="flex flex-wrap gap-3">
            {INSPIRATION_CARDS.map((card) => (
              <button
                key={card}
                onClick={() => handleInspirationClick(card)}
                className="px-4 py-2 rounded-full border border-outline-variant/40 bg-surface text-sm text-secondary hover:bg-surface-container-high hover:text-on-surface transition-colors clay-text shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]"
              >
                {card}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/30 flex items-center justify-between">
          <button 
            onClick={() => goBack('business')}
            className="text-secondary hover:text-on-surface font-medium transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={validateAndContinue}
            className="clay-btn px-8 py-3 text-base font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}

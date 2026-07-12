import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Target, FileText, Clock, BarChart3, Users } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export function WelcomeScreen() {
  const { goNext } = useAppContext();
  const { click } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center min-h-[80vh] text-center"
    >
      <div className="mb-8 w-24 h-24 rounded-3xl clay-card flex items-center justify-center text-primary bg-primary/5">
        <Target size={48} strokeWidth={1.5} />
      </div>
      
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 text-on-surface tracking-tight clay-title">
        Plan Your Software Project <br className="hidden sm:block"/> with Confidence
      </h1>
      
      <p className="text-lg text-secondary max-w-2xl mb-4 leading-relaxed clay-text">
        Why spend the next 3-5 minutes here? Because before you talk to a single salesperson, you deserve clarity on what you need, how long it will take, and what it might cost.
      </p>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-sm font-medium text-secondary mb-12 clay-text">
        <Clock size={16} />
        Estimated completion time: 3–5 minutes
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-10">
        {[
          { icon: Target, label: "Understand the right solution" },
          { icon: BarChart3, label: "Get an estimated timeline & investment range" },
          { icon: FileText, label: "Receive a personalized project summary" },
        ].map((item, i) => (
          <div key={i} className="clay-card p-5 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <item.icon size={24} />
            </div>
            <span className="text-sm font-medium text-on-surface clay-text leading-snug">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-full mb-12">
        <p className="text-sm text-secondary clay-text font-medium flex items-center gap-2 flex-wrap justify-center">
          <span className="uppercase tracking-wider text-[10px] text-primary">What happens next:</span>
          Business Info <span className="text-outline-variant">→</span> Project Details <span className="text-outline-variant">→</span> Preferences <span className="text-outline-variant">→</span> Your Summary
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={() => { click(); goNext('business'); }}
          className="clay-btn px-8 py-3.5 text-base font-semibold w-full sm:w-auto"
        >
          Start Assessment
        </button>
        <button 
          onClick={click}
          className="clay-btn-secondary px-8 py-3.5 text-base font-medium w-full sm:w-auto"
        >
          Return to Website
        </button>
      </div>
    </motion.div>
  );
}

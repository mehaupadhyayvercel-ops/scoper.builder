import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Target, FileText, Clock, BarChart3, Users } from 'lucide-react';

export function WelcomeScreen() {
  const { goNext } = useAppContext();

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
        Answer a few questions about your business and project. We'll prepare a personalized project summary before you connect with our solution experts.
      </p>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-sm font-medium text-secondary mb-12 clay-text">
        <Clock size={16} />
        Estimated completion time: Approximately 3 minutes
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
        {[
          { icon: Target, label: "Recommended Solution" },
          { icon: FileText, label: "Suggested Features" },
          { icon: Clock, label: "Estimated Timeline" },
          { icon: BarChart3, label: "Investment Range" },
        ].map((item, i) => (
          <div key={i} className="clay-card p-4 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <item.icon size={20} />
            </div>
            <span className="text-sm font-medium text-on-surface clay-text">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={() => goNext('business')}
          className="clay-btn px-8 py-3.5 text-base font-semibold w-full sm:w-auto"
        >
          Start Assessment
        </button>
        <button 
          className="clay-btn-secondary px-8 py-3.5 text-base font-medium w-full sm:w-auto"
        >
          Return to Website
        </button>
      </div>
    </motion.div>
  );
}

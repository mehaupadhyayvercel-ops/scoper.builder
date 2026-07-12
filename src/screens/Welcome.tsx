import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Target, FileText, Clock, BarChart3, Building2, ClipboardList, Sliders, Sparkles } from 'lucide-react';
import { useSound } from '../hooks/useSound';

const JOURNEY_STEPS = [
  { icon: Building2, step: '01', label: 'Business Info', desc: 'Tell us who you are' },
  { icon: ClipboardList, step: '02', label: 'Project Details', desc: 'Describe what you need' },
  { icon: Sliders, step: '03', label: 'Preferences', desc: 'Your timeline & budget' },
  { icon: Sparkles, step: '04', label: 'Your Summary', desc: 'Receive your consulting brief' },
];

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
      {/* Hero icon */}
      <div className="mb-8 w-20 h-20 rounded-3xl clay-card flex items-center justify-center text-primary bg-primary/5">
        <Target size={40} strokeWidth={1.5} />
      </div>

      {/* Hero headline */}
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold mb-4 text-on-surface tracking-tight clay-title leading-tight">
        Understand Your Project<br className="hidden sm:block" /> Before You Speak to Anyone
      </h1>

      {/* Sub-headline */}
      <p className="text-lg text-secondary max-w-2xl mb-3 leading-relaxed clay-text">
        Before you talk to a single salesperson, you deserve clarity on what you need,
        how long it will take, and what it might cost.
      </p>

      {/* Trust copy */}
      <p className="text-sm text-secondary/70 max-w-xl mb-4 clay-text italic">
        No technical knowledge required. This is a preliminary assessment designed to prepare you for a consultation — not a commitment.
      </p>

      {/* Completion time badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-sm font-medium text-secondary mb-10 clay-text">
        <Clock size={15} />
        Estimated completion time: 3–5 minutes
      </div>

      {/* 3 Benefit cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto mb-10">
        {[
          { icon: Target, label: 'Understand the right solution', desc: 'Get clarity on what type of software fits your needs.' },
          { icon: BarChart3, label: 'Estimated timeline & investment', desc: 'Receive indicative ranges before any conversation.' },
          { icon: FileText, label: 'Personalized project summary', desc: 'A consulting brief prepared just for your project.' },
        ].map((item, i) => (
          <div key={i} className="clay-card p-5 flex flex-col items-center text-center gap-2">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <item.icon size={22} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold text-on-surface clay-text leading-snug">{item.label}</span>
            <span className="text-xs text-secondary clay-text leading-relaxed">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* What Happens Next — visual 4-step journey */}
      <div className="w-full max-w-3xl mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 clay-text">What Happens Next</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {JOURNEY_STEPS.map(({ icon: Icon, step, label, desc }, i) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < JOURNEY_STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-outline-variant/30" />
              )}
              <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-center text-primary mb-2 relative z-10 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(180,190,220,0.3)]">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-primary mb-0.5">{step}</span>
              <span className="text-xs font-semibold text-on-surface clay-text">{label}</span>
              <span className="text-[10px] text-secondary clay-text mt-0.5 leading-tight">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
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

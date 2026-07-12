import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Download, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export function SummaryScreen() {
  const { summaryData, click } = useAppContext();
  const { success } = useSound();

  // Play success chime once on mount since data is already ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const summary = summaryData as {
    recommendedSolution: string;
    whyThisRecommendation: string;
    features: string[];
    complexity: { level: string; meaning: string };
    timeline: string;
    investmentRange: string;
    team: { role: string; reason: string }[];
  } | null;

  if (!summary) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-4"
      >
        <div className="w-12 h-12 rounded-full border-4 border-outline-variant/30 border-t-primary animate-spin" />
        <p className="text-secondary clay-text text-sm">Preparing your summary...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-on-surface clay-title leading-tight mb-2">
            Project Summary Brief
          </h2>
          <p className="text-secondary text-sm clay-text">
            Based on your inputs, here is a personalized consulting brief for your project.
          </p>
        </div>
        <button onClick={click} className="clay-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shrink-0 w-max">
          <Download size={14} /> Download PDF
        </button>
      </div>

      <div className="clay-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 p-6 sm:p-8 space-y-8 bg-surface">
            
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 clay-text">Recommended Solution</h3>
              <p className="text-base text-on-surface leading-relaxed clay-text">{summary.recommendedSolution}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 clay-text">Why This Recommendation</h3>
              <p className="text-base text-secondary leading-relaxed clay-text">{summary.whyThisRecommendation}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 clay-text">Suggested Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface clay-text leading-snug">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 clay-text">Suggested Delivery Team</h3>
              <div className="space-y-4">
                {summary.team.map((member, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-semibold text-sm text-on-surface min-w-[140px] clay-text">{member.role}</span>
                    <span className="text-sm text-secondary clay-text leading-snug">— {member.reason}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar / Metrics Column */}
          <div className="p-6 sm:p-8 bg-surface-container/30 space-y-8 flex flex-col justify-between">
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-1 clay-text flex items-center gap-1.5">
                  Estimated Timeline <Info size={12} className="opacity-50" />
                </h3>
                <p className="text-2xl font-serif font-bold text-on-surface clay-title">{summary.timeline}</p>
                <p className="text-[10px] text-secondary mt-1 clay-text italic">Explicitly an estimate, subject to discovery phase.</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-1 clay-text flex items-center gap-1.5">
                  Estimated Investment <Info size={12} className="opacity-50" />
                </h3>
                <p className="text-2xl font-serif font-bold text-on-surface clay-title">{summary.investmentRange}</p>
                <p className="text-[10px] text-secondary mt-1 clay-text italic">This is an estimated range, not a final quotation.</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-1 clay-text">Project Complexity</h3>
                <p className="text-lg font-semibold text-on-surface clay-text mb-1">{summary.complexity.level}</p>
                <p className="text-xs text-secondary leading-relaxed clay-text">{summary.complexity.meaning}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/30">
              <h3 className="text-sm font-bold text-on-surface mb-3 clay-text">Next Steps</h3>
              <ol className="space-y-3 relative pl-4 border-l border-primary/20">
                <li className="text-xs text-secondary clay-text relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary/20 border-2 border-surface" />
                  <strong>Review this summary</strong> to ensure it aligns with your vision.
                </li>
                <li className="text-xs text-secondary clay-text relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                  <strong className="text-on-surface">Schedule a consultation</strong> with our experts.
                </li>
                <li className="text-xs text-secondary clay-text relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant border-2 border-surface" />
                  <strong>During the consultation</strong>, we'll dive deep into your architecture and finalize the scope.
                </li>
              </ol>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <p className="text-sm text-secondary mb-4 clay-text max-w-lg">
          Your Project Summary will help our solution consultants understand your goals before your consultation.
        </p>
        <button onClick={click} className="clay-btn px-8 py-3.5 text-base font-semibold flex items-center gap-2">
          Continue to Let's Connect
          <ArrowRight size={16} />
        </button>
      </div>

    </motion.div>
  );
}

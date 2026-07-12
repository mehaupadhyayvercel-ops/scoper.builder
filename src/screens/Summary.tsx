import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Download, ArrowRight, CheckCircle2, Info, Clock, Banknote, Gauge } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export function SummaryScreen() {
  const { summaryData, click } = useAppContext();
  const { success } = useSound();

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
      {/* Header */}
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

      {/* Single full-width card — no sidebar, no empty space */}
      <div className="clay-card overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">

          {/* Recommended Solution */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 clay-text">Recommended Solution</h3>
            <p className="text-base text-on-surface leading-relaxed clay-text">{summary.recommendedSolution}</p>
          </section>

          {/* Why This Recommendation */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 clay-text">Why This Recommendation</h3>
            <p className="text-base text-secondary leading-relaxed clay-text">{summary.whyThisRecommendation}</p>
          </section>

          {/* 3 Metric boxes in a row — timeline, investment, complexity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container/50 rounded-2xl p-4 border border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-secondary mb-2">
                <Clock size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider clay-text">Estimated Timeline</span>
                <Info size={11} className="opacity-40" />
              </div>
              <p className="text-xl font-serif font-bold text-on-surface clay-title">{summary.timeline}</p>
              <p className="text-[10px] text-secondary mt-1 clay-text italic">Subject to discovery phase.</p>
            </div>

            <div className="bg-surface-container/50 rounded-2xl p-4 border border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-secondary mb-2">
                <Banknote size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider clay-text">Estimated Investment</span>
                <Info size={11} className="opacity-40" />
              </div>
              <p className="text-xl font-serif font-bold text-on-surface clay-title">{summary.investmentRange}</p>
              <p className="text-[10px] text-secondary mt-1 clay-text italic">Not a final quotation.</p>
            </div>

            <div className="bg-surface-container/50 rounded-2xl p-4 border border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-secondary mb-2">
                <Gauge size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider clay-text">Project Complexity</span>
              </div>
              <p className="text-xl font-serif font-bold text-on-surface clay-title">{summary.complexity.level}</p>
              <p className="text-[10px] text-secondary mt-1 clay-text leading-relaxed">{summary.complexity.meaning}</p>
            </div>
          </div>

          {/* Suggested Features */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 clay-text">Suggested Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {summary.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface clay-text leading-snug">
                  <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Suggested Delivery Team */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 clay-text">Suggested Delivery Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {summary.team.map((member, i) => (
                <div key={i} className="bg-surface-container/30 rounded-xl p-3.5 border border-outline-variant/15">
                  <p className="font-semibold text-sm text-on-surface clay-text mb-1">{member.role}</p>
                  <p className="text-xs text-secondary clay-text leading-relaxed">{member.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Next Steps — 3 column inline */}
          <section className="border-t border-outline-variant/30 pt-6">
            <h3 className="text-sm font-bold text-on-surface mb-4 clay-text">Recommended Next Steps</h3>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Review this summary", desc: "Ensure it aligns with your vision and project goals." },
                { step: "02", title: "Schedule a consultation", desc: "Talk to an OpenXcell Solution Consultant at your convenience." },
                { step: "03", title: "Receive a tailored proposal", desc: "After the consultation, we'll finalize the scope and cost." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <span className="text-xl font-serif font-bold text-primary/25 clay-title shrink-0">{step}</span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface clay-text mb-1">{title}</p>
                    <p className="text-xs text-secondary clay-text leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </ol>
          </section>

        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-center text-center">
        <p className="text-sm text-secondary mb-4 clay-text max-w-lg">
          Your Project Summary will help our solution consultants understand your goals before your consultation.
        </p>
        <button onClick={() => { success(); click(); }} className="clay-btn px-8 py-3.5 text-base font-semibold flex items-center gap-2">
          Continue to Let's Connect
          <ArrowRight size={16} />
        </button>
      </div>

    </motion.div>
  );
}

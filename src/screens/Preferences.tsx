import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useSound } from '../hooks/useSound';

const PLATFORMS = ['Web', 'Android', 'iOS', 'Desktop'];
const CAPABILITIES = ['Authentication', 'Dashboard', 'Reports', 'Notifications', 'Payments', 'Analytics', 'Admin Panel', 'Chat', 'AI Features'];
const TIMELINES = ['ASAP', '1–3 Months', '3–6 Months', 'Flexible'];
const BUDGETS = ['Under ₹10L', '₹10–25L', '₹25–50L', '₹50L+'];

export function PreferencesScreen() {
  const { data, updateData, goNext, goBack } = useAppContext();
  const { click } = useSound();

  const togglePlatform = (platform: string) => {
    click();
    const current = data.preferences.platforms;
    const next = current.includes(platform) ? current.filter(p => p !== platform) : [...current, platform];
    updateData({ preferences: { ...data.preferences, platforms: next } });
  };

  const toggleCapability = (cap: string) => {
    click();
    const current = data.preferences.capabilities;
    const next = current.includes(cap) ? current.filter(c => c !== cap) : [...current, cap];
    updateData({ preferences: { ...data.preferences, capabilities: next } });
  };

  const setTimeline = (timeline: string) => {
    click();
    updateData({ preferences: { ...data.preferences, timeline } });
  };

  const setBudget = (budget: string) => {
    click();
    updateData({ preferences: { ...data.preferences, budget } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-3xl mx-auto pb-12"
    >
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3 text-on-surface clay-title">Project Preferences</h2>
        <p className="text-secondary text-lg clay-text">Help us tailor the recommendations to your constraints.</p>
      </div>

      <div className="space-y-6">
        <div className="clay-card p-5 sm:p-6">
          <h3 className="font-serif text-xl font-semibold mb-4 text-on-surface clay-title">Target Platforms</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`p-4 rounded-xl text-sm font-medium border transition-all clay-text ${
                  data.preferences.platforms.includes(p)
                    ? 'border-primary bg-primary/5 text-primary shadow-[inset_0_0_0_1px_rgba(139,75,45,1),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                    : 'border-outline-variant/40 bg-surface text-secondary hover:bg-surface-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="clay-card p-5 sm:p-6">
          <h3 className="font-serif text-xl font-semibold mb-4 text-on-surface clay-title">Core Capabilities</h3>
          <div className="flex flex-wrap gap-3">
            {CAPABILITIES.map(c => (
              <button
                key={c}
                onClick={() => toggleCapability(c)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all clay-text ${
                  data.preferences.capabilities.includes(c)
                    ? 'border-primary bg-primary/5 text-primary shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                    : 'border-outline-variant/40 bg-surface text-secondary hover:bg-surface-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="clay-card p-5 sm:p-6">
          <h3 className="font-serif text-xl font-semibold mb-4 text-on-surface clay-title">Expected Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TIMELINES.map(t => (
              <button
                key={t}
                onClick={() => setTimeline(t)}
                className={`p-4 rounded-xl text-sm font-medium border transition-all clay-text ${
                  data.preferences.timeline === t
                    ? 'border-primary bg-primary/5 text-primary shadow-[inset_0_0_0_1px_rgba(139,75,45,1),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                    : 'border-outline-variant/40 bg-surface text-secondary hover:bg-surface-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="clay-card p-5 sm:p-6">
          <h3 className="font-serif text-xl font-semibold mb-1 text-on-surface clay-title">Budget Range <span className="text-secondary text-sm font-normal clay-text">(Optional)</span></h3>
          <p className="text-sm text-secondary mb-4 clay-text">This helps us recommend the right team composition.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BUDGETS.map(b => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`p-4 rounded-xl text-sm font-medium border transition-all clay-text ${
                  data.preferences.budget === b
                    ? 'border-primary bg-primary/5 text-primary shadow-[inset_0_0_0_1px_rgba(139,75,45,1),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                    : 'border-outline-variant/40 bg-surface text-secondary hover:bg-surface-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between">
          <button 
            onClick={() => { click(); goBack('project'); }}
            className="text-secondary hover:text-on-surface font-medium transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={() => { click(); goNext('processing'); }}
            className="clay-btn px-8 py-3 text-base font-semibold"
          >
            Generate Project Summary
          </button>
        </div>
      </div>
    </motion.div>
  );
}

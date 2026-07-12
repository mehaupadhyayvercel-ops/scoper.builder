import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { Sparkles } from 'lucide-react';

const PROJECT_TYPES = [
  'New Product', 
  'Existing Product Enhancement', 
  'Internal Business Tool', 
  'Customer Portal', 
  'Not Sure Yet'
];

const END_USERS = [
  'Customers', 'Employees', 'Vendors', 'Students', 'Patients', 'Administrators', 'Other'
];

const STARTER_SENTENCES: Record<string, string> = {
  'Marketplace': "I'm building a marketplace platform where buyers and sellers can connect, list products, and transact securely online. The goal is to reduce friction between supply and demand in our industry.",
  'Healthcare': "I'm building a healthcare platform where patients can book appointments, consult doctors remotely, and access their medical history in one place. The goal is to reduce administrative burden for clinics.",
  'E-commerce': "I'm building an e-commerce store where customers can browse products, place orders, and track deliveries. The goal is to increase sales by providing a seamless online shopping experience.",
  'Internal Tool': "I'm building an internal tool to help my team manage workflows, track progress, and reduce manual data entry. The goal is to improve operational efficiency across departments.",
  'Customer Portal': "I'm building a customer portal where our clients can log in, view their account details, submit requests, and track the status of ongoing work. The goal is to reduce support overhead.",
  'Learning Platform': "I'm building a learning platform where students can access course content, complete assignments, and track their progress. The goal is to make education more accessible and engaging.",
  'CRM / Sales Tool': "I'm building a CRM tool to help our sales team manage leads, track follow-ups, and forecast revenue. The goal is to give our team a single source of truth for customer relationships.",
  'Field Service App': "I'm building a field service application where technicians can receive job assignments, update job status, and capture signatures on-site. The goal is to eliminate paper-based processes.",
};

export function ProjectDetailsScreen() {
  const { data, updateData, goNext, goBack } = useAppContext();
  const { click } = useSound();
  const [error, setError] = useState('');

  const toggleProjectType = (type: string) => {
    click();
    const current = data.projectTypes;
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    updateData({ projectTypes: next });
  };

  const toggleEndUser = (userType: string) => {
    click();
    const current = data.endUsers;
    const next = current.includes(userType) ? current.filter(u => u !== userType) : [...current, userType];
    updateData({ endUsers: next });
  };

  const validateAndContinue = () => {
    if (!data.projectDescription.trim()) {
      setError('Tell us a little about your business idea so we can prepare a better assessment.');
      return;
    }
    click();
    goNext('preferences');
  };

  const applyStarterSentence = (label: string) => {
    click();
    const sentence = STARTER_SENTENCES[label];
    if (sentence) {
      updateData({ projectDescription: sentence });
      setError('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-3xl mx-auto pb-12"
    >
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3 text-on-surface clay-title">Project Details</h2>
        <p className="text-secondary text-lg clay-text">Help us understand what you want to build and who it's for.</p>
      </div>

      <div className="clay-card p-5 sm:p-6 space-y-8">
        
        {/* Project Types */}
        <div>
          <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block clay-text">What type of project is this? <span className="text-[10px] font-normal normal-case italic">(Optional)</span></label>
          <div className="flex flex-wrap gap-3 mt-3">
            {PROJECT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleProjectType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all clay-text ${
                  data.projectTypes.includes(type)
                    ? 'border-primary bg-primary/5 text-primary shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                    : 'border-outline-variant/40 bg-surface text-secondary hover:bg-surface-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* End Users */}
        <div>
          <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block clay-text">Who will use this? <span className="text-[10px] font-normal normal-case italic">(Optional)</span></label>
          <div className="flex flex-wrap gap-3 mt-3">
            {END_USERS.map((user) => (
              <button
                key={user}
                onClick={() => toggleEndUser(user)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all clay-text ${
                  data.endUsers.includes(user)
                    ? 'border-primary bg-primary/5 text-primary shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                    : 'border-outline-variant/40 bg-surface text-secondary hover:bg-surface-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]'
                }`}
              >
                {user}
              </button>
            ))}
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2 block clay-text">What are you trying to build? *</label>
          
          <div className="mb-3 text-[11px] text-secondary clay-text bg-surface-container-high/50 p-3 rounded-xl border border-outline-variant/20">
            <strong className="text-on-surface">Not sure what to write? Try answering these:</strong>
            <ul className="list-disc ml-5 mt-1 space-y-0.5">
              <li>What problem are you solving?</li>
              <li>Who experiences it?</li>
              <li>What outcome are you hoping for?</li>
              <li>What should users be able to do?</li>
            </ul>
          </div>

          <textarea 
            className={`clay-input w-full p-4 text-base min-h-[160px] resize-y ${error ? 'border-error' : ''}`}
            placeholder="Describe what you want to build in plain English — there are no wrong answers here."
            value={data.projectDescription}
            onChange={(e) => {
              updateData({ projectDescription: e.target.value });
              if (error) setError('');
            }}
          />
          {error && <p className="text-error text-sm mt-2">{error}</p>}

          {/* Starter sentence inspiration cards */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 clay-text flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />
              Need a starting point? Click a card to get started:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STARTER_SENTENCES).map((label) => (
                <button
                  key={label}
                  onClick={() => applyStarterSentence(label)}
                  className="px-3 py-1.5 rounded-full border border-outline-variant/40 bg-surface text-xs text-secondary hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors clay-text shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(209,205,199,0.3)]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/30 flex items-center justify-between">
          <button 
            onClick={() => { click(); goBack('business'); }}
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

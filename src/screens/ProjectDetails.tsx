import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import { useSound } from '../hooks/useSound';

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
            placeholder="e.g. We want to build an internal tool that helps our operations team automatically track..."
            value={data.projectDescription}
            onChange={(e) => {
              updateData({ projectDescription: e.target.value });
              if (error) setError('');
            }}
          />
          {error && <p className="text-error text-sm mt-2">{error}</p>}
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

import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import { useSound } from '../hooks/useSound';

export function BusinessInfoScreen() {
  const { data, updateData, goNext, goBack } = useAppContext();
  const { click } = useSound();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    updateData({
      business: { ...data.business, [field]: value }
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateAndContinue = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.business.fullName) newErrors.fullName = 'Please tell us your name';
    if (!data.business.email) newErrors.email = 'Please provide an email address';
    else if (!emailRegex.test(data.business.email)) newErrors.email = 'Invalid email format';
    if (!data.business.companyName) newErrors.companyName = 'Company name is required';
    if (!data.business.country) newErrors.country = 'Please select a country';
    if (!data.business.industry) newErrors.industry = 'Please select an industry';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // In a real app, we might focus the first invalid field here
      return;
    }

    click();
    goNext('project');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3 text-on-surface clay-title">Business Information</h2>
        <p className="text-secondary text-lg clay-text">Let's start by getting to know your organization.</p>
      </div>

      <div className="clay-card p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider clay-text">Full Name *</label>
            <input 
              type="text" 
              className={`clay-input w-full p-3.5 text-base ${errors.fullName ? 'border-error' : ''}`}
              placeholder="e.g. Alex Rivera"
              value={data.business.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
            {errors.fullName && <p className="text-error text-xs">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider clay-text">Business Email *</label>
            <input 
              type="email" 
              className={`clay-input w-full p-3.5 text-base ${errors.email ? 'border-error' : ''}`}
              placeholder="alex@company.com"
              value={data.business.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="text-error text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider clay-text">Company Name *</label>
            <input 
              type="text" 
              className={`clay-input w-full p-3.5 text-base ${errors.companyName ? 'border-error' : ''}`}
              placeholder="Your Company Inc."
              value={data.business.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
            {errors.companyName && <p className="text-error text-xs">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider clay-text">Country *</label>
            <select 
              className={`clay-input w-full p-3.5 text-base appearance-none ${errors.country ? 'border-error' : ''}`}
              value={data.business.country}
              onChange={(e) => handleChange('country', e.target.value)}
            >
              <option value="" disabled>Select country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && <p className="text-error text-xs">{errors.country}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider clay-text">Industry *</label>
            <select 
              className={`clay-input w-full p-3.5 text-base appearance-none ${errors.industry ? 'border-error' : ''}`}
              value={data.business.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
            >
              <option value="" disabled>Select industry</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Retail">Retail & E-commerce</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology / SaaS</option>
              <option value="Logistics">Logistics</option>
              <option value="Other">Other</option>
            </select>
            {errors.industry && <p className="text-error text-xs">{errors.industry}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider clay-text">Company Size (Optional)</label>
            <select 
              className="clay-input w-full p-3.5 text-base appearance-none"
              value={data.business.companySize}
              onChange={(e) => handleChange('companySize', e.target.value)}
            >
              <option value="" disabled>Select number of employees</option>
              <option value="1-10">1 - 10</option>
              <option value="11-50">11 - 50</option>
              <option value="51-200">51 - 200</option>
              <option value="201-500">201 - 500</option>
              <option value="500+">500+</option>
            </select>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/30 flex items-center justify-between">
          <button 
            onClick={() => { click(); goBack('welcome'); }}
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

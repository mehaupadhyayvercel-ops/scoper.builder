import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState, useRef } from 'react';
import { Building2, ClipboardList, Search, Lightbulb, Rocket } from 'lucide-react';

const STEPS = [
  { label: "Understanding your business...", Icon: Building2 },
  { label: "Organizing your requirements...", Icon: ClipboardList },
  { label: "Reviewing your project scope...", Icon: Search },
  { label: "Preparing your recommendations...", Icon: Lightbulb },
  { label: "Almost ready...", Icon: Rocket },
];

const FALLBACK_SUMMARY = {
  recommendedSolution: "A custom web platform tailored to your business needs with modern architecture and scalable infrastructure.",
  whyThisRecommendation: "This approach provides the most flexibility for your unique requirements while ensuring long-term scalability and security.",
  features: [
    "User Authentication & Role Management",
    "Admin Dashboard & Analytics",
    "Real-time Notifications",
    "Payment Gateway Integration",
    "REST API & Third-party Integrations",
  ],
  complexity: {
    level: "Medium",
    meaning: "This means your project involves standard integrations and multiple user roles, requiring a balanced approach to architecture and testing."
  },
  timeline: "14-18 weeks",
  investmentRange: "₹20-35L",
  team: [
    { role: "Project Manager", reason: "To ensure smooth communication and delivery." },
    { role: "UI/UX Designer", reason: "To create an intuitive and engaging user experience." },
    { role: "Full-Stack Developer", reason: "To build both the frontend interfaces and backend logic." },
    { role: "QA Engineer", reason: "To thoroughly test the application for bugs and usability." },
  ]
};

export function ProcessingScreen() {
  const { data, goNext, setSummaryData } = useAppContext();
  const [stepIndex, setStepIndex] = useState(0);
  const hasFetched = useRef(false);

  // Cycle through step messages every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Fire the API call once
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchSummary() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000);
      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('API error');
        const result = await response.json();
        setSummaryData(result);
      } catch {
        setSummaryData(FALLBACK_SUMMARY);
      } finally {
        clearTimeout(timeoutId);
        goNext('summary');
      }
    }
    fetchSummary();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center justify-center min-h-[70vh] text-center px-6"
    >
      {/* Animated step icon */}
      <motion.div
        key={stepIndex}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-8 text-primary shadow-[inset_2px_2px_6px_rgba(255,255,255,0.8),inset_-2px_-2px_6px_rgba(209,205,199,0.3)]"
      >
        {(() => { const { Icon } = STEPS[stepIndex]; return <Icon size={36} strokeWidth={1.5} />; })()}
      </motion.div>

      {/* Spinning ring */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-surface-container-high" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Step label */}
      <div className="h-8 relative w-full max-w-sm overflow-hidden mb-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 font-serif text-xl text-on-surface clay-title"
          >
            {STEPS[stepIndex].label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <p className="text-xs text-secondary clay-text">
        This usually takes 15–30 seconds
      </p>
    </motion.div>
  );
}


import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  "Understanding your requirements...",
  "Identifying possible solutions...",
  "Estimating implementation effort...",
  "Preparing your project summary..."
];

export function ProcessingScreen() {
  const { goNext } = useAppContext();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      goNext('summary');
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [goNext]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-surface-container-high"></div>
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <Loader2 size={32} className="animate-pulse" />
        </div>
      </div>
      
      <div className="h-12 relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 font-serif text-2xl text-on-surface clay-title"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

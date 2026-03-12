import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target: string;
  action: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to FinMate!',
    description: 'Let\'s take a quick tour of your new financial dashboard',
    target: 'hero-metric',
    action: 'View your spending overview'
  },
  {
    id: 2,
    title: 'Scan Your First Receipt',
    description: 'Use AI to automatically extract transaction details from receipts',
    target: 'receipt-scanner',
    action: 'Try scanning a receipt'
  },
  {
    id: 3,
    title: 'Set Your First Goal',
    description: 'Create savings goals and track your progress',
    target: 'budget-goals',
    action: 'Create a goal'
  },
  {
    id: 4,
    title: 'Chat with FinMate',
    description: 'Get personalized financial advice from your AI assistant',
    target: 'chat-interface',
    action: 'Start chatting'
  }
];

interface InteractiveTutorialProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function InteractiveTutorial({ isVisible, onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    handleNext();
  };

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const step = tutorialSteps[currentStep];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Tutorial Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-8 rounded-2xl border border-white/10 max-w-md w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-cyan-400">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            />
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-gray-400 mb-6">{step.description}</p>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStepComplete(step.id)}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow flex items-center justify-center gap-2"
            >
              {step.action}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Skip Button */}
          <button
            onClick={onSkip}
            className="w-full mt-4 text-sm text-gray-400 hover:text-white transition"
          >
            Skip tutorial
          </button>
        </motion.div>

        {/* Highlight Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* This would highlight the target element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 border-2 border-cyan-500 rounded-lg opacity-50"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
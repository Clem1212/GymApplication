import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Dumbbell, Camera, Target, TrendingUp, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalStorage, setLocalStorage } from '@/components/hooks/useLocalStorage';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import TutorialOverlay from '@/components/onboarding/TutorialOverlay';

const navItems = [
  { icon: Home, label: 'Home', page: 'Home' },
  { icon: ListChecks, label: 'Plans', page: 'Plans' },
  { icon: Dumbbell, label: 'Analyze', page: 'WorkoutAnalysis' },
  { icon: Camera, label: 'Food', page: 'FoodScanner' },
  { icon: TrendingUp, label: 'Progress', page: 'Progress' },
];

export default function Layout({ children, currentPageName }) {
  const [onboardingDone, setOnboardingDone] = useState(null); // null = loading
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const done = getLocalStorage('gymiq_onboarding_done', false);
    const tutorialDone = getLocalStorage('gymiq_tutorial_done', false);
    setOnboardingDone(done);
    if (done && !tutorialDone) {
      setShowTutorial(true);
    }
  }, []);

  const handleOnboardingComplete = (profile) => {
    setOnboardingDone(true);
    setShowTutorial(true);
  };

  // Still checking localStorage
  if (onboardingDone === null) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <style>{`
        body { background: #0A0A0F; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Onboarding — blocks everything until done */}
      {!onboardingDone && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* Tutorial — shown after onboarding, once */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialOverlay onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>

      <main>{children}</main>

      {/* Bottom Navigation */}
      {onboardingDone && (
        <nav className="fixed bottom-0 left-0 right-0 z-40">
          <div className="mx-3 mb-4">
            <div
              className="flex justify-around items-center px-2 py-3 rounded-2xl"
              style={{ background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="relative flex flex-col items-center gap-1 px-3 py-1 min-w-0"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 rounded-xl bg-blue-500/15"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <motion.div
                      animate={isActive ? { y: -2 } : { y: 0 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="relative z-10"
                    >
                      <item.icon
                        className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-600'}`}
                        strokeWidth={isActive ? 2.5 : 1.8}
                      />
                    </motion.div>
                    <span className={`text-[10px] relative z-10 transition-colors font-medium ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-blue-400"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
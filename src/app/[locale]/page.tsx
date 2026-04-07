'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export default function SplashPage() {
  const t = useTranslations('splash');
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateToStudio = () => {
    if (isExiting) return;
    setIsExiting(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => {
      router.push('/studio');
    }, 400);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigateToStudio();
    }, 2500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isExiting ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={navigateToStudio}
          className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        >
          {/* Grain texture overlay */}
          <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />

          {/* Logo */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-arabic-display text-6xl font-bold text-gold gold-shimmer relative z-10"
          >
            تفصيل
          </motion.span>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="text-cream text-xl font-arabic-body mt-3 relative z-10"
          >
            {t('tagline')}
          </motion.p>

          {/* Gold accent line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            className="h-px bg-gold mt-6 relative z-10"
          />

          {/* Start prompt */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5] }}
            transition={{
              delay: 1.4,
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute bottom-12 text-cream/50 text-sm font-arabic-body z-10"
          >
            {t('start')}
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="splash-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-navy"
        />
      )}
    </AnimatePresence>
  );
}

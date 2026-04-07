'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';

function generateConfetti() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1,
    size: 6 + Math.random() * 8,
    isCircle: Math.random() > 0.5,
    rotation: Math.random() * 360,
  }));
}

function ConfirmationContent() {
  const t = useTranslations('order');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || 'TFS-XXXXXX';
  const confetti = generateConfetti();

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDate = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(deliveryDate);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(ref);
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute pointer-events-none"
            style={{
              left: `${c.left}%`,
              top: -20,
              width: c.size,
              height: c.size,
              backgroundColor: '#C9A84C',
              borderRadius: c.isCircle ? '50%' : '2px',
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: 800,
              rotate: c.rotation + 720,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: 'easeIn',
            }}
          />
        ))}

        <motion.div
          className="flex flex-col items-center gap-6 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <circle cx="40" cy="40" r="38" stroke="#C9A84C" strokeWidth="3" fill="#C9A84C" fillOpacity="0.1" />
            <motion.path
              d="M24 42l10 10 22-22"
              stroke="#C9A84C"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
            />
          </motion.svg>

          <motion.h1
            className="text-3xl font-arabic-display font-bold text-navy text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {t('orderConfirmed')}
          </motion.h1>

          <motion.div
            className="bg-cream rounded-lg p-4 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <span className="font-mono text-xl text-navy font-bold">{ref}</span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="p-2 hover:bg-cream-dark rounded-lg transition-colors cursor-pointer"
              aria-label={t('copyReference')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="8" y="8" width="12" height="12" rx="2" stroke="#1A1A2E" strokeWidth="1.5" />
                <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="#1A1A2E" strokeWidth="1.5" />
              </svg>
            </button>
          </motion.div>

          <motion.p
            className="text-navy/60 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {t('estimatedDelivery')}: {formattedDate}
          </motion.p>

          <motion.div
            className="flex flex-col gap-3 w-full max-w-xs mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <Button
              onClick={() => router.push('/')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {t('trackOrder')}
            </Button>
            <button
              type="button"
              onClick={() => router.push('/studio')}
              className="text-gold text-sm font-medium underline text-center cursor-pointer"
            >
              {t('backToStudio')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-navy/40">...</div>
    </div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

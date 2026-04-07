'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const instructions = [
  { step: 1, key: 'sendThobeInstructions1' },
  { step: 2, key: 'sendThobeInstructions2' },
  { step: 3, key: 'sendThobeInstructions3' },
] as const;

export default function SendThobeMeasurementPage() {
  const t = useTranslations('measurement');
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelGenerated, setLabelGenerated] = useState(false);

  const handleGenerateLabel = () => {
    const measurementData = {
      method: 'send-thobe' as const,
      labelGenerated: true,
      status: 'waiting_for_thobe',
    };

    try {
      localStorage.setItem('tafsil_measurement', JSON.stringify(measurementData));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    setShowLabelModal(true);
    setLabelGenerated(true);
  };

  return (
    <PageTransition>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-arabic-display font-bold text-navy text-center mb-6">
          {t('sendThobeTitle')}
        </h1>

        <div className="flex flex-col gap-4 mb-6">
          {instructions.map(({ step, key }) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step * 0.15, duration: 0.3 }}
            >
              <Card className="p-4 bg-white border border-cream-dark flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg">
                  {step}
                </div>
                <p className="text-navy font-medium pt-2">
                  {t(key)}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-navy/5 rounded-lg p-4 flex items-center gap-3 mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" stroke="#1A1A2E" strokeWidth="1.5" />
            <path d="M12 6v6l4 2" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-navy text-sm">
            {t('extraDaysNotice')}
          </p>
        </div>

        {!labelGenerated ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerateLabel}
            className="w-full"
          >
            {t('generateLabel')}
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-cream flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
              <p className="text-navy font-medium">
                {t('waitingForThobe')}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Label generated modal */}
        {showLabelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-card shadow-lg mx-6 max-w-sm w-full"
            >
              <div className="flex flex-col items-center gap-4 p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#4A7C59"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-arabic-display font-bold text-navy">
                  {t('labelGenerated')}
                </h3>
                <button
                  className="text-gold underline font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  {t('downloadLabel')}
                </button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowLabelModal(false)}
                  className="w-full mt-2"
                >
                  {t('done')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

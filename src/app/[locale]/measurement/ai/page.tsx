'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { BodyTypeSelector, type BodyType } from '@/components/measurement/body-type-selector';
import { MeasurementResults } from '@/components/measurement/measurement-results';
import {
  calculateFromAI,
  type MeasurementResult,
  type BodyType as CalculatorBodyType,
} from '@/lib/utils/measurement-calculator';
import { cn } from '@/lib/utils/cn';

const aiFormSchema = z.object({
  height: z.number().min(140).max(210),
  weight: z.number().min(40).max(150),
  bodyType: z.enum(['slim', 'regular', 'broad']),
});

type AIFormData = z.infer<typeof aiFormSchema>;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function AIMeasurementPage() {
  const t = useTranslations('measurement');
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState(1);
  const [results, setResults] = useState<MeasurementResult | null>(null);
  const [editableResults, setEditableResults] = useState<MeasurementResult | null>(null);

  const {
    control,
    watch,
    trigger,
    getValues,
  } = useForm<AIFormData>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      height: 170,
      weight: 75,
      bodyType: 'regular',
    },
  });

  const currentHeight = watch('height');
  const currentWeight = watch('weight');

  const goNext = useCallback(async () => {
    if (step === 1) {
      const valid = await trigger('height');
      if (!valid) return;
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      const valid = await trigger('weight');
      if (!valid) return;
      setDirection(1);
      setStep(3);
    } else if (step === 3) {
      const valid = await trigger('bodyType');
      if (!valid) return;
      const values = getValues();
      const computed = calculateFromAI(
        values.height,
        values.weight,
        values.bodyType as CalculatorBodyType
      );
      setResults(computed);
      setEditableResults(computed);
      setDirection(1);
      setStep(4);
    }
  }, [step, trigger, getValues]);

  const goPrev = useCallback(() => {
    if (step === 1) return;
    setDirection(-1);
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  }, [step]);

  const handleSave = useCallback(() => {
    if (!editableResults) return;

    const values = getValues();
    const measurementData = {
      method: 'ai' as const,
      height_cm: values.height,
      weight_kg: values.weight,
      body_type: values.bodyType,
      ...editableResults,
    };

    try {
      localStorage.setItem('tafsil_measurement', JSON.stringify(measurementData));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    router.push('/order/summary');
  }, [editableResults, getValues, router]);

  const updateResult = useCallback(
    (key: keyof MeasurementResult, value: number) => {
      if (!editableResults) return;
      setEditableResults({ ...editableResults, [key]: value });
    },
    [editableResults]
  );

  return (
    <PageTransition>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-arabic-display font-bold text-navy text-center mb-2">
          {t('aiTitle')}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                s === step ? 'bg-gold w-6' : s < step ? 'bg-gold w-2' : 'bg-cream-dark w-2'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center">
                <label className="font-arabic-body text-lg text-navy/70 mb-4">
                  {t('height')}
                </label>

                <div className="text-6xl font-arabic-display font-bold text-navy mb-2">
                  {currentHeight}
                </div>
                <span className="text-sm text-navy/50 font-arabic-body mb-8">
                  {t('cm')}
                </span>

                <Controller
                  name="height"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      min={140}
                      max={210}
                      step={1}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center">
                <label className="font-arabic-body text-lg text-navy/70 mb-4">
                  {t('weight')}
                </label>

                <div className="text-6xl font-arabic-display font-bold text-navy mb-2">
                  {currentWeight}
                </div>
                <span className="text-sm text-navy/50 font-arabic-body mb-8">
                  {t('kg')}
                </span>

                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      min={40}
                      max={150}
                      step={1}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center">
                <label className="font-arabic-body text-lg text-navy/70 mb-6">
                  {t('bodyType')}
                </label>

                <Controller
                  name="bodyType"
                  control={control}
                  render={({ field }) => (
                    <BodyTypeSelector
                      value={field.value as BodyType}
                      onChange={field.onChange}
                      labels={{
                        slim: t('slim'),
                        regular: t('regular'),
                        broad: t('broad'),
                      }}
                    />
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 4 && editableResults && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <MeasurementResults
                results={editableResults}
                onUpdate={updateResult}
                onSave={handleSave}
                labels={{
                  resultsTitle: t('resultsTitle'),
                  shoulder: t('shoulder'),
                  chest: t('chest'),
                  waist: t('waist'),
                  sleeveLength: t('sleeveLength'),
                  thobeLength: t('thobeLength'),
                  neck: t('neck'),
                  cm: t('cm'),
                  save: t('saveMeasurements'),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-10 max-w-md mx-auto">
          {step > 1 ? (
            <Button variant="secondary" size="sm" onClick={goPrev}>
              {t('previous')}
            </Button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <Button variant="primary" size="md" onClick={goNext}>
              {t('next')}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

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
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MeasurementResults } from '@/components/measurement/measurement-results';
import {
  calculateFromStandard,
  type MeasurementResult,
  type StandardSize,
} from '@/lib/utils/measurement-calculator';
import { cn } from '@/lib/utils/cn';

const standardSchema = z.object({
  height: z.number().min(140).max(210),
  size: z.enum(['S', 'M', 'L', 'XL']),
  alterations: z.object({
    longerSleeves: z.boolean(),
    widerChest: z.boolean(),
    shorterLength: z.boolean(),
    biggerWaist: z.boolean(),
  }),
});

type StandardFormData = z.infer<typeof standardSchema>;

const sizes: StandardSize[] = ['S', 'M', 'L', 'XL'];

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

export default function StandardMeasurementPage() {
  const t = useTranslations('measurement');
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
  const [editableResults, setEditableResults] = useState<MeasurementResult | null>(null);

  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<StandardFormData>({
    resolver: zodResolver(standardSchema),
    defaultValues: {
      height: 170,
      size: 'M',
      alterations: {
        longerSleeves: false,
        widerChest: false,
        shorterLength: false,
        biggerWaist: false,
      },
    },
  });

  const height = watch('height');
  const size = watch('size');
  const alterations = watch('alterations');

  const baseMeasurements = calculateFromStandard(height, size as StandardSize);

  const applyAlterations = useCallback(
    (base: MeasurementResult): MeasurementResult => ({
      shoulder: base.shoulder,
      chest: Math.round((base.chest + (alterations.widerChest ? 2 : 0)) * 10) / 10,
      waist: Math.round((base.waist + (alterations.biggerWaist ? 2 : 0)) * 10) / 10,
      sleeve_length: Math.round((base.sleeve_length + (alterations.longerSleeves ? 2 : 0)) * 10) / 10,
      thobe_length: Math.round((base.thobe_length + (alterations.shorterLength ? -2 : 0)) * 10) / 10,
      neck: base.neck,
    }),
    [alterations]
  );

  const finalMeasurements = applyAlterations(baseMeasurements);

  const goToStep2 = useCallback(() => {
    const adjusted = applyAlterations(baseMeasurements);
    setEditableResults(adjusted);
    setDirection(1);
    setStep(2);
  }, [baseMeasurements, applyAlterations]);

  const goToStep3 = useCallback(() => {
    setDirection(1);
    setStep(3);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep((s) => (s - 1) as 1 | 2 | 3);
  }, []);

  const updateResult = useCallback(
    (key: keyof MeasurementResult, value: number) => {
      if (!editableResults) return;
      setEditableResults({ ...editableResults, [key]: value });
    },
    [editableResults]
  );

  const handleSave = useCallback(() => {
    const resultsToSave = editableResults ?? finalMeasurements;
    const values = getValues();
    const measurementData = {
      method: 'standard' as const,
      height_cm: values.height,
      size: values.size,
      alterations: values.alterations,
      ...resultsToSave,
    };

    try {
      localStorage.setItem('tafsil_measurement', JSON.stringify(measurementData));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    router.push('/order/summary');
  }, [editableResults, finalMeasurements, getValues, router]);

  const alterationToggles: Array<{ key: keyof StandardFormData['alterations']; label: string }> = [
    { key: 'longerSleeves', label: t('longerSleeves') },
    { key: 'widerChest', label: t('widerChest') },
    { key: 'shorterLength', label: t('shorterLength') },
    { key: 'biggerWaist', label: t('biggerWaist') },
  ];

  return (
    <PageTransition>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-arabic-display font-bold text-navy text-center mb-2">
          {t('standard')}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
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
          {/* Step 1: Height + Size */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-xl font-arabic-display font-bold text-navy">
                {t('enterHeight')}
              </h2>

              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col items-center gap-2">
                    <Input
                      type="number"
                      min={140}
                      max={210}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="text-center text-4xl font-bold w-32 h-20"
                    />
                    <span className="text-navy/60 text-sm">{t('cm')}</span>
                    {errors.height && (
                      <span className="text-error text-sm">{t('heightError')}</span>
                    )}
                  </div>
                )}
              />

              <h3 className="text-xl font-arabic-display font-bold text-navy mt-4">
                {t('selectSize')}
              </h3>

              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row gap-3 justify-center">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => field.onChange(s)}
                        className={cn(
                          'w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold transition-colors',
                          field.value === s
                            ? 'bg-gold text-navy'
                            : 'bg-cream text-navy border border-cream-dark'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              />

              <Button variant="primary" size="lg" onClick={goToStep2} className="w-full mt-6">
                {t('next')}
              </Button>
            </motion.div>
          )}

          {/* Step 2: Generated measurements + alterations */}
          {step === 2 && editableResults && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-xl font-arabic-display font-bold text-navy">
                {t('generatedMeasurements')}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'shoulder' as const, label: t('shoulder') },
                  { key: 'chest' as const, label: t('chest') },
                  { key: 'waist' as const, label: t('waist') },
                  { key: 'sleeve_length' as const, label: t('sleeveLength') },
                  { key: 'thobe_length' as const, label: t('thobeLength') },
                  { key: 'neck' as const, label: t('neck') },
                ]).map(({ key, label }) => (
                  <Card key={key} className="p-4 bg-cream flex flex-col items-center">
                    <span className="text-navy/60 text-sm">{label}</span>
                    <span className="text-2xl font-bold text-navy">
                      {editableResults[key]}
                    </span>
                    <span className="text-navy/40 text-xs">{t('cm')}</span>
                  </Card>
                ))}
              </div>

              <h3 className="text-xl font-arabic-display font-bold text-navy mt-4">
                {t('alterations')}
              </h3>

              <div className="flex flex-col gap-4">
                {alterationToggles.map(({ key, label }) => (
                  <Controller
                    key={key}
                    name={`alterations.${key}`}
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-navy font-medium">{label}</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={field.value as boolean}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                              // Recalculate with new alterations after state update
                              const newAlterations = {
                                ...alterations,
                                [key]: e.target.checked,
                              };
                              const newBase = calculateFromStandard(height, size as StandardSize);
                              setEditableResults({
                                shoulder: newBase.shoulder,
                                chest: Math.round((newBase.chest + (newAlterations.widerChest ? 2 : 0)) * 10) / 10,
                                waist: Math.round((newBase.waist + (newAlterations.biggerWaist ? 2 : 0)) * 10) / 10,
                                sleeve_length: Math.round((newBase.sleeve_length + (newAlterations.longerSleeves ? 2 : 0)) * 10) / 10,
                                thobe_length: Math.round((newBase.thobe_length + (newAlterations.shorterLength ? -2 : 0)) * 10) / 10,
                                neck: newBase.neck,
                              });
                            }}
                            className="sr-only"
                          />
                          <div
                            className={cn(
                              'w-12 h-6 rounded-full transition-colors',
                              field.value ? 'bg-gold' : 'bg-cream-dark'
                            )}
                          >
                            <div
                              className={cn(
                                'w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5',
                                field.value
                                  ? 'ltr:translate-x-6 rtl:-translate-x-6'
                                  : 'ltr:translate-x-0.5 rtl:-translate-x-0.5'
                              )}
                            />
                          </div>
                        </div>
                      </label>
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" size="md" onClick={goPrev} className="flex-1">
                  {t('previous')}
                </Button>
                <Button variant="primary" size="md" onClick={goToStep3} className="flex-1">
                  {t('next')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm & Save */}
          {step === 3 && editableResults && (
            <motion.div
              key="step3"
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
                  resultsTitle: t('confirmMeasurements'),
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

              <div className="flex justify-start mt-6 max-w-md mx-auto">
                <Button variant="secondary" size="sm" onClick={goPrev}>
                  {t('previous')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

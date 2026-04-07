'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

const homeVisitSchema = z.object({
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  addressLine: z.string().min(5),
  city: z.string().min(1),
  district: z.string().min(1),
});

type HomeVisitFormData = z.infer<typeof homeVisitSchema>;

const dayNamesAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const timeSlots = [
  '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00',
];

function formatTimeSlot(slot: string): string {
  const hour = parseInt(slot.split(':')[0], 10);
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return `${hour} PM`;
  return `${hour - 12} PM`;
}

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

export default function HomeVisitMeasurementPage() {
  const t = useTranslations('measurement');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<HomeVisitFormData>({
    resolver: zodResolver(homeVisitSchema),
    defaultValues: {
      date: '',
      timeSlot: '',
      addressLine: '',
      city: '',
      district: '',
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('timeSlot');
  const addressLine = watch('addressLine');
  const city = watch('city');
  const district = watch('district');

  const next7Days = useMemo(() => {
    const days: Array<{ dateStr: string; dayNameAr: string; dayNameEn: string; dayNum: number }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayNameAr: dayNamesAr[d.getDay()],
        dayNameEn: dayNamesEn[d.getDay()],
        dayNum: d.getDate(),
      });
    }
    return days;
  }, []);

  const onConfirm = handleSubmit(() => {
    const bookingData = {
      method: 'home-visit' as const,
      date: selectedDate,
      timeSlot: selectedTime,
      address: {
        addressLine,
        district,
        city,
      },
      saveToProfile,
    };

    try {
      localStorage.setItem('tafsil_measurement', JSON.stringify(bookingData));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    setShowSuccess(true);
  });

  const selectedDay = next7Days.find((d) => d.dateStr === selectedDate);

  return (
    <PageTransition>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-arabic-display font-bold text-navy text-center mb-2">
          {t('homeVisit')}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
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

        {/* Fee notice */}
        <div className="bg-gold/10 border border-gold rounded-lg p-4 mb-6">
          <p className="text-navy text-sm font-medium text-center">
            {t('homeVisitFeeNotice')}
          </p>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Date & Time */}
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
                {t('selectDate')}
              </h2>

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
                    {next7Days.map((day) => (
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => field.onChange(day.dateStr)}
                        className={cn(
                          'flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-colors',
                          field.value === day.dateStr
                            ? 'bg-gold text-navy'
                            : 'bg-cream text-navy border border-cream-dark'
                        )}
                      >
                        <span className="text-xs font-medium">{day.dayNameAr}</span>
                        <span className="text-2xl font-bold">{day.dayNum}</span>
                      </button>
                    ))}
                  </div>
                )}
              />

              {errors.date && (
                <span className="text-error text-sm">{t('selectDateError')}</span>
              )}

              <h3 className="text-xl font-arabic-display font-bold text-navy">
                {t('selectTime')}
              </h3>

              <Controller
                name="timeSlot"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => field.onChange(slot)}
                        className={cn(
                          'py-3 rounded-lg text-center font-medium transition-colors',
                          field.value === slot
                            ? 'bg-gold text-navy'
                            : 'bg-cream text-navy border border-cream-dark'
                        )}
                      >
                        {formatTimeSlot(slot)}
                      </button>
                    ))}
                  </div>
                )}
              />

              {errors.timeSlot && (
                <span className="text-error text-sm">{t('selectTimeError')}</span>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (selectedDate && selectedTime) {
                    setDirection(1);
                    setStep(2);
                  }
                }}
                disabled={!selectedDate || !selectedTime}
                className="w-full mt-4"
              >
                {t('next')}
              </Button>
            </motion.div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-xl font-arabic-display font-bold text-navy">
                {t('enterAddress')}
              </h2>

              <Controller
                name="addressLine"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={t('addressLine')}
                    placeholder={t('addressLinePlaceholder')}
                    error={errors.addressLine ? t('addressLineError') : undefined}
                  />
                )}
              />

              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={t('district')}
                    placeholder={t('districtPlaceholder')}
                    error={errors.district ? t('districtError') : undefined}
                  />
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={t('city')}
                    placeholder={t('cityPlaceholder')}
                  />
                )}
              />

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="w-5 h-5 rounded border-cream-dark text-gold focus:ring-gold"
                />
                <span className="text-navy text-sm">{t('saveAddressToProfile')}</span>
              </label>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setDirection(-1);
                    setStep(1);
                  }}
                  className="flex-1"
                >
                  {t('previous')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setDirection(1);
                    setStep(3);
                  }}
                  className="flex-1"
                >
                  {t('next')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm booking */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-xl font-arabic-display font-bold text-navy">
                {t('confirmBooking')}
              </h2>

              <Card className="p-6 bg-cream flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-navy/60">{t('date')}</span>
                  <span className="font-bold text-navy">
                    {selectedDay?.dayNameAr} {selectedDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/60">{t('time')}</span>
                  <span className="font-bold text-navy">
                    {formatTimeSlot(selectedTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/60">{t('address')}</span>
                  <span className="font-bold text-navy text-end">
                    {addressLine}, {district}, {city}
                  </span>
                </div>
                <div className="border-t border-cream-dark my-2" />
                <div className="flex justify-between">
                  <span className="text-navy/60">{t('fee')}</span>
                  <span className="font-bold text-navy">20 SAR</span>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setDirection(-1);
                    setStep(2);
                  }}
                  className="flex-1"
                >
                  {t('previous')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onConfirm}
                  className="flex-1"
                >
                  {t('confirmBookingBtn')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        {showSuccess && (
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
                  {t('bookingConfirmed')}
                </h3>
                <p className="text-navy/60 text-center">
                  {selectedDay?.dayNameAr} {selectedDate} - {formatTimeSlot(selectedTime)}
                </p>
                <p className="text-navy/60 text-center text-sm">
                  {addressLine}, {district}, {city}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowSuccess(false)}
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

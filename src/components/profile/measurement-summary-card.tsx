'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';

interface Measurement {
  method: string;
  heightCm: number;
  shoulder: number;
  chest: number;
  waist: number;
  sleeveLength: number;
  thobeLength: number;
  neck: number;
}

interface MeasurementSummaryCardProps {
  measurement: Measurement | null;
}

const methodLabels: Record<string, string> = {
  ai: '\u062A\u0642\u062F\u064A\u0631 \u0630\u0643\u064A',
  standard: '\u0645\u0642\u0627\u0633 \u0642\u064A\u0627\u0633\u064A',
  home_visit: '\u0632\u064A\u0627\u0631\u0629 \u0645\u0646\u0632\u0644\u064A\u0629',
  send_thobe: '\u0623\u0631\u0633\u0644 \u062B\u0648\u0628\u0643',
};

export function MeasurementSummaryCard({ measurement }: MeasurementSummaryCardProps) {
  const t = useTranslations('profile');

  if (!measurement) {
    return (
      <Card className="p-6 bg-cream rounded-lg flex flex-col items-center gap-3">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-30">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="#1A1A2E" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 12v10" stroke="#1A1A2E" strokeWidth="1.5" />
          <path d="M2 7l10 5 10-5" stroke="#1A1A2E" strokeWidth="1.5" />
        </svg>
        <p className="text-navy/60 text-sm">{t('noMeasurementsSaved')}</p>
        <Link
          href="/measurement"
          className="bg-gold text-navy font-bold px-6 py-2 rounded-lg text-sm"
        >
          {t('addMeasurements')}
        </Link>
      </Card>
    );
  }

  const values: Array<{ key: keyof Omit<Measurement, 'method' | 'heightCm'>; label: string }> = [
    { key: 'shoulder', label: t('shoulders') },
    { key: 'chest', label: t('chest') },
    { key: 'waist', label: t('waist') },
    { key: 'thobeLength', label: t('thobeLength') },
    { key: 'sleeveLength', label: t('sleeveLength') },
    { key: 'neck', label: t('neck') },
  ];

  return (
    <Card className="p-4 bg-cream rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="bg-gold/20 text-navy text-xs font-bold px-3 py-1 rounded-full">
          {methodLabels[measurement.method] || measurement.method}
        </span>
        <Link href="/measurement" className="text-gold text-sm font-medium underline">
          {t('edit')}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {values.map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <span className="text-navy/60 text-xs">{label}</span>
            <span className="text-navy font-bold">
              {measurement[key]} {t('cm')}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

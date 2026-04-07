'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { MeasurementResult } from '@/lib/utils/measurement-calculator';

interface MeasurementResultsProps {
  results: MeasurementResult;
  onUpdate: (key: keyof MeasurementResult, value: number) => void;
  onSave: () => void;
  labels: {
    resultsTitle: string;
    shoulder: string;
    chest: string;
    waist: string;
    sleeveLength: string;
    thobeLength: string;
    neck: string;
    cm: string;
    save: string;
  };
}

const measurementKeys: { key: keyof MeasurementResult; labelKey: keyof MeasurementResultsProps['labels'] }[] = [
  { key: 'shoulder', labelKey: 'shoulder' },
  { key: 'chest', labelKey: 'chest' },
  { key: 'waist', labelKey: 'waist' },
  { key: 'sleeve_length', labelKey: 'sleeveLength' },
  { key: 'thobe_length', labelKey: 'thobeLength' },
  { key: 'neck', labelKey: 'neck' },
];

export function MeasurementResults({ results, onUpdate, onSave, labels }: MeasurementResultsProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-arabic-display text-xl font-bold text-navy mb-6">
        {labels.resultsTitle}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {measurementKeys.map(({ key, labelKey }) => (
          <div key={key} className="flex flex-col">
            <label className="text-xs text-navy/50 font-arabic-body mb-1">
              {labels[labelKey]}
            </label>
            <div className="relative">
              <Input
                type="number"
                value={results[key]}
                onChange={(e) =>
                  onUpdate(key, parseFloat(e.target.value) || 0)
                }
                className="pe-10"
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-navy/40 font-arabic-body pointer-events-none">
                {labels.cm}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onSave}
        className="w-full max-w-md mt-8"
      >
        {labels.save}
      </Button>
    </div>
  );
}

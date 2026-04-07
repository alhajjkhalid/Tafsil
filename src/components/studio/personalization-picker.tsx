'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import { useStudioStore } from '@/lib/store/studio-store';
import { formatPrice } from '@/lib/utils/price';

export interface Personalization {
  id: string;
  level: 'standard' | 'enhanced' | 'full_custom';
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  features: { key: string; label_ar: string; label_en: string }[];
  is_active: boolean;
}

interface PersonalizationPickerProps {
  personalizations: Personalization[];
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="8" fill="#4A7C59" />
      <path
        d="M5 8l2 2 4-4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="8" fill="#C9A84C" />
      <path
        d="M8 5v6M5 8h6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const levelOrder: Array<'standard' | 'enhanced' | 'full_custom'> = [
  'standard',
  'enhanced',
  'full_custom',
];

export function PersonalizationPicker({
  personalizations,
}: PersonalizationPickerProps) {
  const t = useTranslations('studio');
  const locale = useLocale() as 'ar' | 'en';
  const { selectedPersonalizationId, setPersonalization } = useStudioStore();

  const sorted = levelOrder
    .map((level) => personalizations.find((p) => p.level === level))
    .filter(Boolean) as Personalization[];

  const previousFeatureKeys = new Map<string, Set<string>>();
  let accumulatedKeys = new Set<string>();
  for (const item of sorted) {
    previousFeatureKeys.set(item.level, new Set(accumulatedKeys));
    for (const feature of item.features) {
      accumulatedKeys.add(feature.key);
    }
  }

  return (
    <section className="px-6 py-8">
      <h2 className="font-arabic-display text-2xl font-bold text-navy mb-6">
        {t('choosePersonalization')}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {sorted.map((personalization, index) => {
          const isSelected =
            selectedPersonalizationId === personalization.id;
          const prevKeys = previousFeatureKeys.get(personalization.level)!;

          return (
            <motion.div
              key={personalization.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              <Card
                selected={isSelected}
                onClick={() =>
                  setPersonalization(personalization.id, personalization.price, personalization.level)
                }
                className="cursor-pointer p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-arabic-display font-semibold text-lg text-navy">
                    {locale === 'ar'
                      ? personalization.name_ar
                      : personalization.name_en}
                  </h3>
                  <span className="font-arabic-display font-bold text-navy">
                    {personalization.price === 0
                      ? t('free')
                      : formatPrice(personalization.price, locale)}
                  </span>
                </div>

                <p className="text-sm text-navy/60 font-arabic-body mb-4">
                  {locale === 'ar'
                    ? personalization.description_ar
                    : personalization.description_en}
                </p>

                <ul className="space-y-2">
                  {personalization.features.map((feature) => {
                    const isNew = prevKeys.size > 0 && !prevKeys.has(feature.key);
                    return (
                      <li
                        key={feature.key}
                        className="flex items-center gap-2 text-sm font-arabic-body text-navy/80"
                      >
                        {isNew ? <PlusIcon /> : <CheckIcon />}
                        <span>
                          {locale === 'ar' ? feature.label_ar : feature.label_en}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

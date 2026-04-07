'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Toggle } from '@/components/ui/toggle';
import { useStudioStore } from '@/lib/store/studio-store';

export function TierToggle() {
  const t = useTranslations('order');
  const tier = useStudioStore((s) => s.selectedTier);
  const setTier = useStudioStore((s) => s.setTier);

  const options = [
    { value: 'regular', label: t('regular') },
    { value: 'vip', label: t('vip') },
  ];

  return (
    <div className="flex flex-col gap-2 items-center">
      <Toggle
        options={options}
        value={tier}
        onChange={(val) => setTier(val as 'regular' | 'vip')}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={tier}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="text-navy/60 text-sm text-center"
        >
          {tier === 'regular' ? t('deliveryRegular') : t('deliveryVip')}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

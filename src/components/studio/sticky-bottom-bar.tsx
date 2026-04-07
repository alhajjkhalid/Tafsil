'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useStudioStore } from '@/lib/store/studio-store';
import { formatPrice } from '@/lib/utils/price';
import { cn } from '@/lib/utils/cn';

export function StickyBottomBar() {
  const t = useTranslations('studio');
  const locale = useLocale() as 'ar' | 'en';
  const router = useRouter();
  const { totalPrice, selectedFabricId, selectedPersonalizationId } =
    useStudioStore();

  const isComplete =
    selectedFabricId !== null && selectedPersonalizationId !== null;
  const isDisabled = !isComplete;

  const handleNext = () => {
    if (isComplete) {
      router.push('/measurement');
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-20 left-0 right-0 z-40',
        'bg-white border-t border-cream-dark shadow-lg',
        'px-6 py-4',
        'flex justify-between items-center'
      )}
    >
      <div className="flex flex-col">
        <span className="text-xs text-navy/50 font-arabic-body">
          {t('total')}
        </span>
        <span className="text-2xl font-arabic-display font-bold text-navy">
          {formatPrice(totalPrice, locale)}
        </span>
      </div>

      <Button
        variant="primary"
        size="md"
        disabled={isDisabled}
        onClick={handleNext}
        className={cn(isComplete && 'gold-pulse')}
      >
        {t('next')}
      </Button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion } from '@/components/ui/accordion';
import { useOrderStore } from '@/lib/store/order-store';
import { useStudioStore } from '@/lib/store/studio-store';

const VALID_CODES: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  TAFSIL10: { type: 'percent', value: 10 },
  FIRST: { type: 'fixed', value: 2000 },
};

export function PromoCodeInput() {
  const t = useTranslations('order');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [appliedCode, setAppliedCode] = useState('');
  const setPromo = useOrderStore((s) => s.setPromo);
  const studioStore = useStudioStore();
  const subtotal = studioStore.selectedFabricPrice + studioStore.selectedPersonalizationPrice;

  const handleApply = () => {
    const upperCode = code.trim().toUpperCase();
    const promo = VALID_CODES[upperCode];

    if (promo) {
      const discount =
        promo.type === 'percent'
          ? Math.round(subtotal * (promo.value / 100))
          : promo.value;
      setPromo(upperCode, discount);
      setAppliedCode(upperCode);
      setStatus('success');
    } else {
      setPromo(null, 0);
      setAppliedCode('');
      setStatus('error');
    }
  };

  return (
    <Accordion title={t('promoCode')}>
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setStatus('idle');
            }}
            placeholder={t('enterPromoCode')}
          />
          <Button
            onClick={handleApply}
            variant="primary"
            size="sm"
          >
            {t('apply')}
          </Button>
        </div>

        {status === 'success' && (
          <div className="bg-green-50 text-green-700 rounded-lg px-3 py-2 text-sm font-medium">
            {t('promoApplied')} ({appliedCode})
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 text-red-600 rounded-lg px-3 py-2 text-sm font-medium">
            {t('promoInvalid')}
          </div>
        )}
      </div>
    </Accordion>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils/price';

interface PriceBreakdownProps {
  fabricName: string;
  fabricPrice: number;
  personalizationName: string;
  personalizationPrice: number;
  tier: 'regular' | 'vip';
  homeVisitFee: number;
  promoDiscount: number;
  locale: 'ar' | 'en';
}

export function PriceBreakdown({
  fabricName,
  fabricPrice,
  personalizationName,
  personalizationPrice,
  tier,
  homeVisitFee,
  promoDiscount,
  locale,
}: PriceBreakdownProps) {
  const t = useTranslations('order');

  const vipFee = tier === 'vip' ? 10000 : 0;
  const subtotal = fabricPrice + personalizationPrice + homeVisitFee + vipFee;
  const total = subtotal - promoDiscount;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-navy/60">{t('fabric')}: {fabricName}</span>
        <span className="text-navy font-medium">{formatPrice(fabricPrice, locale)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-navy/60">{t('personalization')}: {personalizationName}</span>
        <span className="text-navy font-medium">{formatPrice(personalizationPrice, locale)}</span>
      </div>

      {homeVisitFee > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-navy/60">{t('homeVisitFee')}</span>
          <span className="text-navy font-medium">{formatPrice(homeVisitFee, locale)}</span>
        </div>
      )}

      {tier === 'vip' && (
        <div className="flex justify-between items-center">
          <span className="text-navy/60">{t('vipFee')}</span>
          <span className="text-navy font-medium">{formatPrice(vipFee, locale)}</span>
        </div>
      )}

      {promoDiscount > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-navy/60">{t('discount')}</span>
          <span className="text-green-600 font-medium">-{formatPrice(promoDiscount, locale)}</span>
        </div>
      )}

      <div className="border-t border-cream-dark my-1" />

      <div className="flex justify-between items-center">
        <span className="text-navy font-bold text-lg">{t('total')}</span>
        <span className="text-navy font-bold text-2xl">{formatPrice(total, locale)}</span>
      </div>
    </div>
  );
}

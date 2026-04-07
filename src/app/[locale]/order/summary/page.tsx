'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { TierToggle } from '@/components/order/tier-toggle';
import { PriceBreakdown } from '@/components/order/price-breakdown';
import { PromoCodeInput } from '@/components/order/promo-code-input';
import { ThobePreview } from '@/components/studio/thobe-preview';
import { useStudioStore } from '@/lib/store/studio-store';
import { useOrderStore } from '@/lib/store/order-store';
import { PageTransition } from '@/components/ui/page-transition';

// Mock measurement data since there's no measurement store yet
const mockMeasurement = {
  heightCm: 175,
  chest: 100,
  waist: 85,
  shoulder: 46,
  thobeLength: 145,
  neck: 39,
};

export default function OrderSummaryPage() {
  const t = useTranslations('order');
  const locale = useLocale() as 'ar' | 'en';
  const router = useRouter();

  const studioStore = useStudioStore();
  const tier = studioStore.selectedTier;
  const fabricPrice = studioStore.selectedFabricPrice;
  const personalizationPrice = studioStore.selectedPersonalizationPrice;
  const discount = useOrderStore((s) => s.discount);

  // Mock names based on selections
  const fabricName = studioStore.selectedFabricId
    ? (studioStore.selectedFabricTier === 'premium' ? (locale === 'ar' ? '\u0642\u0645\u0627\u0634 \u0641\u0627\u062E\u0631' : 'Premium Fabric') :
       studioStore.selectedFabricTier === 'mid' ? (locale === 'ar' ? '\u0642\u0645\u0627\u0634 \u0645\u062A\u0648\u0633\u0637' : 'Mid-Range Fabric') :
       (locale === 'ar' ? '\u0642\u0645\u0627\u0634 \u0627\u0642\u062A\u0635\u0627\u062F\u064A' : 'Economy Fabric'))
    : t('noFabricSelected');

  const personalizationName = studioStore.selectedPersonalizationId
    ? (studioStore.selectedPersonalizationLevel === 'full_custom' ? (locale === 'ar' ? '\u062A\u0641\u0635\u064A\u0644 \u0643\u0627\u0645\u0644' : 'Full Custom') :
       studioStore.selectedPersonalizationLevel === 'enhanced' ? (locale === 'ar' ? '\u0645\u064F\u062D\u0633\u064E\u0651\u0646' : 'Enhanced') :
       (locale === 'ar' ? '\u0623\u0633\u0627\u0633\u064A' : 'Standard'))
    : t('noPersonalizationSelected');

  const deliveryEstimate = tier === 'regular' ? t('deliveryRegular') : t('deliveryVip');
  const measurement = mockMeasurement;

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white px-4 pb-24 pt-6 gap-6">
        <h1 className="text-2xl font-arabic-display font-bold text-navy">
          {t('orderSummary')}
        </h1>

        <TierToggle />

        <ThobePreview />

        <div className="bg-cream rounded-lg p-4">
          <PriceBreakdown
            fabricName={fabricName}
            fabricPrice={fabricPrice}
            personalizationName={personalizationName}
            personalizationPrice={personalizationPrice}
            tier={tier}
            homeVisitFee={0}
            promoDiscount={discount}
            locale={locale}
          />
        </div>

        <Accordion title={t('measurementSummary')}>
          {measurement ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col">
                <span className="text-navy/60 text-sm">{t('height')}</span>
                <span className="text-navy font-medium">{measurement.heightCm} {t('cm')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-navy/60 text-sm">{t('chest')}</span>
                <span className="text-navy font-medium">{measurement.chest} {t('cm')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-navy/60 text-sm">{t('waist')}</span>
                <span className="text-navy font-medium">{measurement.waist} {t('cm')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-navy/60 text-sm">{t('shoulders')}</span>
                <span className="text-navy font-medium">{measurement.shoulder} {t('cm')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-navy/60 text-sm">{t('thobeLength')}</span>
                <span className="text-navy font-medium">{measurement.thobeLength} {t('cm')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-navy/60 text-sm">{t('neck')}</span>
                <span className="text-navy font-medium">{measurement.neck} {t('cm')}</span>
              </div>
            </div>
          ) : (
            <p className="text-navy/60 text-sm pt-2">{t('noMeasurements')}</p>
          )}
        </Accordion>

        <p className="text-navy/60 text-sm text-center">{deliveryEstimate}</p>

        <PromoCodeInput />

        <Button
          onClick={() => router.push('/order/checkout')}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {t('proceedToCheckout')}
        </Button>
      </div>
    </PageTransition>
  );
}

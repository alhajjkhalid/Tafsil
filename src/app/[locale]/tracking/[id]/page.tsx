'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Accordion } from '@/components/ui/accordion';
import { OrderTimeline } from '@/components/tracking/order-timeline';
import { VipBadge } from '@/components/tracking/vip-badge';
import { PageTransition } from '@/components/ui/page-transition';

interface MockOrder {
  referenceNumber: string;
  tier: 'regular' | 'vip';
  status: string;
  fabricName: string;
  personalizationLevel: string;
  totalPrice: number;
  trackingUrl: string | null;
  measurements: {
    shoulder: number;
    chest: number;
    waist: number;
    sleeveLength: number;
    thobeLength: number;
    neck: number;
  };
}

interface MockEvent {
  status: string;
  note: string | null;
  createdAt: string;
}

function formatPrice(halalas: number): string {
  const riyals = halalas / 100;
  return `${riyals.toLocaleString('ar-SA')} ر.س`;
}

export default function TrackingPage() {
  const t = useTranslations('tracking');
  const params = useParams();
  const orderId = params.id as string;

  const mockOrder: MockOrder = useMemo(
    () => ({
      referenceNumber: orderId || 'TFS-ABC123',
      tier: 'vip',
      status: 'in_production',
      fabricName: 'قماش ياباني فاخر',
      personalizationLevel: 'تفصيل متقدم',
      totalPrice: 85000,
      trackingUrl: null,
      measurements: {
        shoulder: 46,
        chest: 106,
        waist: 94,
        sleeveLength: 60,
        thobeLength: 143,
        neck: 40,
      },
    }),
    [orderId]
  );

  const mockEvents: MockEvent[] = useMemo(() => {
    const now = new Date();
    return [
      {
        status: 'confirmed',
        note: null,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        status: 'in_production',
        note: null,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }, []);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white px-4 pb-24 pt-6 gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-arabic-display font-bold text-navy">
            {t('orderNumber')} {mockOrder.referenceNumber}
          </h1>
          {mockOrder.tier === 'vip' && <VipBadge />}
        </div>

        <OrderTimeline
          currentStatus={mockOrder.status}
          events={mockEvents}
          trackingUrl={mockOrder.trackingUrl}
        />

        <Accordion title={t('orderDetails')}>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex justify-between">
              <span className="text-navy/60">{t('fabric')}</span>
              <span className="text-navy font-medium">{mockOrder.fabricName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">{t('personalization')}</span>
              <span className="text-navy font-medium">{mockOrder.personalizationLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">{t('shoulder')}</span>
              <span className="text-navy font-medium">{mockOrder.measurements.shoulder} {t('cm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">{t('chest')}</span>
              <span className="text-navy font-medium">{mockOrder.measurements.chest} {t('cm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">{t('waist')}</span>
              <span className="text-navy font-medium">{mockOrder.measurements.waist} {t('cm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">{t('thobeLength')}</span>
              <span className="text-navy font-medium">{mockOrder.measurements.thobeLength} {t('cm')}</span>
            </div>
            <div className="border-t border-cream-dark my-1" />
            <div className="flex justify-between">
              <span className="text-navy font-bold">{t('total')}</span>
              <span className="text-navy font-bold">{formatPrice(mockOrder.totalPrice)}</span>
            </div>
          </div>
        </Accordion>

        <Link
          href="/profile/orders"
          className="text-gold text-sm font-medium underline text-center"
        >
          {t('backToOrders')}
        </Link>
      </div>
    </PageTransition>
  );
}

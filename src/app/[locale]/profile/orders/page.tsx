'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/page-transition';

interface MockOrder {
  id: string;
  referenceNumber: string;
  fabricName: string;
  tier: 'regular' | 'vip';
  status: string;
  totalPrice: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-gold/20 text-gold-dark',
  in_production: 'bg-blue-100 text-blue-700',
  quality_checked: 'bg-green-100 text-green-700',
  out_for_delivery: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  confirmed: '\u062A\u0645 \u0627\u0644\u062A\u0623\u0643\u064A\u062F',
  in_production: '\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630',
  quality_checked: '\u062A\u0645 \u0641\u062D\u0635 \u0627\u0644\u062C\u0648\u062F\u0629',
  out_for_delivery: '\u0641\u064A \u0627\u0644\u0637\u0631\u064A\u0642 \u0625\u0644\u064A\u0643',
  delivered: '\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644',
};

function formatPrice(halalas: number): string {
  const riyals = halalas / 100;
  return `${riyals.toLocaleString('ar-SA')} \u0631.\u0633`;
}

export default function OrdersPage() {
  const t = useTranslations('orders');
  const router = useRouter();

  const mockOrders: MockOrder[] = useMemo(
    () => [
      {
        id: 'ord-1',
        referenceNumber: 'TFS-A1B2C3',
        fabricName: '\u0642\u0645\u0627\u0634 \u064A\u0627\u0628\u0627\u0646\u064A \u0641\u0627\u062E\u0631',
        tier: 'vip',
        status: 'in_production',
        totalPrice: 85000,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord-2',
        referenceNumber: 'TFS-D4E5F6',
        fabricName: '\u0642\u0645\u0627\u0634 \u0625\u0646\u062C\u0644\u064A\u0632\u064A',
        tier: 'regular',
        status: 'delivered',
        totalPrice: 45000,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    []
  );

  if (mockOrders.length === 0) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-white items-center justify-center px-4 gap-4">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="opacity-20">
            <rect x="3" y="7" width="18" height="14" rx="2" stroke="#1A1A2E" strokeWidth="1.5" />
            <path d="M16 7V5a4 4 0 00-8 0v2" stroke="#1A1A2E" strokeWidth="1.5" />
          </svg>
          <p className="text-navy/60 text-lg">{t('noOrders')}</p>
          <Button
            onClick={() => router.push('/studio')}
            className="bg-gold text-navy font-bold px-8 py-3 rounded-lg"
          >
            {t('startFirstOrder')}
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white px-4 pb-24 pt-6 gap-4">
        <h1 className="text-2xl font-arabic-display font-bold text-navy">
          {t('myOrders')}
        </h1>

        {mockOrders.map((order, index) => {
          const formattedDate = new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(order.createdAt));

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card
                className={`rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-s-4 ${
                  order.tier === 'vip' ? 'border-gold' : 'border-navy/20'
                }`}
                onClick={() => router.push(`/tracking/${order.referenceNumber}`)}
              >
                <div className="flex">
                  <div className="flex flex-col gap-2 p-4 flex-1">
                    <div className="flex items-center gap-2">
                      {order.tier === 'vip' && (
                        <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      )}
                      <span className="text-navy font-bold">{order.fabricName}</span>
                    </div>

                    <span className="text-navy/50 text-sm">{formattedDate}</span>

                    <div className="flex items-center justify-between">
                      <span className="text-navy font-bold">
                        {formatPrice(order.totalPrice)}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          statusColors[order.status] || 'bg-cream text-navy'
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/studio');
                      }}
                      variant="secondary"
                      size="sm"
                      className="w-fit text-sm px-4 py-1.5 rounded-lg mt-1"
                    >
                      {t('reorder')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
}

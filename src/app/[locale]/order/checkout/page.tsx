'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { PhoneAuth } from '@/components/order/phone-auth';
import { AddressSelector } from '@/components/order/address-selector';
import { PaymentMethods } from '@/components/order/payment-methods';
import { useAuthStore } from '@/lib/store/auth-store';
import { useOrderStore } from '@/lib/store/order-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageTransition } from '@/components/ui/page-transition';

function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TFS-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CheckoutPage() {
  const t = useTranslations('order');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const deliveryAddressId = useOrderStore((s) => s.deliveryAddressId);
  const paymentMethod = useOrderStore((s) => s.paymentMethod);
  const [loading, setLoading] = useState(false);

  const canConfirm = isAuthenticated && !!deliveryAddressId && !!paymentMethod;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setLoading(true);
    try {
      // Simulated order placement
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const ref = generateReference();
      router.push(`/order/confirmation?ref=${ref}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white px-4 pb-24 pt-6 gap-6">
        <h1 className="text-2xl font-arabic-display font-bold text-navy">
          {t('checkout')}
        </h1>

        <PhoneAuth />

        {isAuthenticated && (
          <>
            <AddressSelector />
            <PaymentMethods />
          </>
        )}

        <Button
          onClick={handleConfirm}
          disabled={!canConfirm || loading}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {loading ? <LoadingSpinner size="sm" /> : t('confirmOrder')}
        </Button>
      </div>
    </PageTransition>
  );
}

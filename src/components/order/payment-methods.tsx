'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { useOrderStore } from '@/lib/store/order-store';

type PaymentMethod = 'apple_pay' | 'stc_pay' | 'credit_card';

export function PaymentMethods() {
  const t = useTranslations('order');
  const paymentMethod = useOrderStore((s) => s.paymentMethod);
  const setPayment = useOrderStore((s) => s.setPayment);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSelect = (method: PaymentMethod) => {
    setPayment(method);
  };

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-arabic-display font-bold text-navy">
        {t('paymentMethod')}
      </h3>

      <button
        type="button"
        onClick={() => handleSelect('apple_pay')}
        className={`h-14 w-full rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
          paymentMethod === 'apple_pay'
            ? 'ring-2 ring-gold bg-white border-navy/20'
            : 'bg-white border-navy/20'
        }`}
      >
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
          <path
            d="M15.5 1C13.8 1 12.3 2.1 11.5 2.1C10.6 2.1 9.3 1.1 7.8 1.1C5.2 1.1 2 3.5 2 8.3C2 11.3 3.2 14.5 4.8 16.7C6.1 18.5 7.2 20 8.8 20C10.3 20 10.9 19 12.7 19C14.5 19 15 20 16.6 20C18.2 20 19.3 18.3 20.5 16.7C20.9 16.1 21.2 15.5 21.5 14.9C18.5 13.6 17.5 9.2 20.5 7.3C19.3 5.7 17.5 4.8 15.8 4.8C14.2 4.8 13.1 5.7 11.9 5.7C10.6 5.7 9.3 4.8 7.9 4.8"
            stroke="#000"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <span className="font-bold text-black">Apple Pay</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('stc_pay')}
        className={`h-14 w-full rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
          paymentMethod === 'stc_pay'
            ? 'ring-2 ring-gold bg-[#4F008C]'
            : 'bg-[#4F008C]'
        }`}
      >
        <span className="font-bold text-white text-lg">STC Pay</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('credit_card')}
        className={`w-full rounded-lg border transition-all overflow-hidden cursor-pointer ${
          paymentMethod === 'credit_card'
            ? 'ring-2 ring-gold border-cream-dark'
            : 'border-cream-dark'
        }`}
      >
        <div className="h-14 flex items-center justify-center gap-2 px-4">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <rect x="1" y="1" width="22" height="16" rx="2" stroke="#1A1A2E" strokeWidth="1.5" />
            <line x1="1" y1="6" x2="23" y2="6" stroke="#1A1A2E" strokeWidth="1.5" />
            <rect x="4" y="10" width="6" height="2" rx="0.5" fill="#1A1A2E" opacity="0.3" />
          </svg>
          <span className="font-bold text-navy">{t('creditCard')}</span>
        </div>
      </button>

      {paymentMethod === 'credit_card' && (
        <div className="flex flex-col gap-3 bg-cream rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <label className="text-navy/60 text-sm">{t('cardNumber')}</label>
            <Input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              dir="ltr"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-navy/60 text-sm">{t('expiry')}</label>
              <Input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-navy/60 text-sm">{t('cvv')}</label>
              <Input
                type="text"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength={3}
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface Address {
  id: string;
  label: string;
  addressLine: string;
  district: string;
  city: string;
}

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  const t = useTranslations('profile');
  const [showConfirm, setShowConfirm] = useState(false);

  const labelMap: Record<string, string> = {
    home: t('home'),
    work: t('work'),
  };

  return (
    <>
      <Card className="p-4 bg-cream rounded-lg flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="bg-navy/10 text-navy text-xs font-medium px-2 py-0.5 rounded-full w-fit">
            {labelMap[address.label] || address.label}
          </span>
          <span className="text-navy font-medium">{address.addressLine}</span>
          <span className="text-navy/60 text-sm">{address.district}, {address.city}</span>
        </div>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-red-400 hover:text-red-600 p-2 transition-colors"
          aria-label={t('deleteAddress')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </Card>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        <div className="flex flex-col items-center gap-4 p-6">
          <h3 className="text-lg font-arabic-display font-bold text-navy">
            {t('confirmDeleteAddress')}
          </h3>
          <p className="text-navy/60 text-sm text-center">
            {t('deleteAddressWarning')}
          </p>
          <div className="flex gap-3 w-full">
            <Button
              onClick={() => setShowConfirm(false)}
              variant="secondary"
              className="flex-1 py-3 rounded-lg"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={() => {
                onDelete(address.id);
                setShowConfirm(false);
              }}
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg"
            >
              {t('delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

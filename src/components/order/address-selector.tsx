'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOrderStore } from '@/lib/store/order-store';
import { useAuthStore } from '@/lib/store/auth-store';

interface Address {
  id: string;
  label: string;
  addressLine: string;
  district: string;
  city: string;
}

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'home',
    addressLine: '\u0634\u0627\u0631\u0639 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F\u060C \u062D\u064A \u0627\u0644\u0639\u0644\u064A\u0627',
    district: '\u0627\u0644\u0639\u0644\u064A\u0627',
    city: '\u0627\u0644\u0631\u064A\u0627\u0636',
  },
];

export function AddressSelector() {
  const t = useTranslations('order');
  const setAddress = useOrderStore((s) => s.setAddress);
  const selectedAddressId = useOrderStore((s) => s.deliveryAddressId);
  const { isAuthenticated } = useAuthStore();

  const [addresses] = useState<Address[]>(mockAddresses);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    district: '',
    city: '\u0627\u0644\u0631\u064A\u0627\u0636',
  });

  if (!isAuthenticated) return null;

  const handleSelect = (id: string) => {
    setAddress(id);
  };

  const handleAddNew = () => {
    const id = `addr-${Date.now()}`;
    setAddress(id);
    setShowForm(false);
  };

  const labelMap: Record<string, string> = {
    home: t('home'),
    work: t('work'),
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-arabic-display font-bold text-navy">
        {t('deliveryAddress')}
      </h3>

      {addresses.map((addr) => (
        <Card
          key={addr.id}
          selected={selectedAddressId === addr.id}
          onClick={() => handleSelect(addr.id)}
          className="p-4 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                selectedAddressId === addr.id
                  ? 'border-gold'
                  : 'border-cream-dark'
              }`}
            >
              {selectedAddressId === addr.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="bg-navy/10 text-navy text-xs font-medium px-2 py-0.5 rounded-full w-fit">
                {labelMap[addr.label] || addr.label}
              </span>
              <span className="text-navy font-medium">{addr.addressLine}</span>
              <span className="text-navy/60 text-sm">{addr.district}, {addr.city}</span>
            </div>
          </div>
        </Card>
      ))}

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-gold text-sm font-medium underline text-center mt-1 cursor-pointer"
        >
          {t('addNewAddress')}
        </button>
      ) : (
        <Card className="p-4 flex flex-col gap-3">
          <Input
            value={newAddress.addressLine}
            onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
            placeholder={t('addressLinePlaceholder')}
          />
          <Input
            value={newAddress.district}
            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
            placeholder={t('districtPlaceholder')}
          />
          <Input
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            placeholder={t('cityPlaceholder')}
          />
          <Button
            onClick={handleAddNew}
            disabled={!newAddress.addressLine || !newAddress.district}
            variant="primary"
            size="md"
          >
            {t('saveAddress')}
          </Button>
        </Card>
      )}
    </div>
  );
}

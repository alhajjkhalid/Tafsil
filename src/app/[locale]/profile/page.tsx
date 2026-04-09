'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MeasurementSummaryCard } from '@/components/profile/measurement-summary-card';
import { AddressCard } from '@/components/profile/address-card';
import { LanguageToggle } from '@/components/layout/language-toggle';
import { PageTransition } from '@/components/ui/page-transition';

interface Address {
  id: string;
  label: string;
  addressLine: string;
  district: string;
  city: string;
}

// Mock measurement data for demo
const mockMeasurement = {
  method: 'ai' as const,
  heightCm: 175,
  shoulder: 46,
  chest: 106,
  waist: 94,
  sleeveLength: 60,
  thobeLength: 143,
  neck: 40,
};

export default function ProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();

  // Mock profile data for demo (works without auth)
  const [profileName, setProfileName] = useState('\u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0627\u0644\u0639\u0645\u0631\u064A');
  const mockPhone = '+966 5XX XXX XXX';

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profileName);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ addressLine: '', district: '', city: '\u0627\u0644\u0631\u064A\u0627\u0636' });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-1',
      label: 'home',
      addressLine: '\u0634\u0627\u0631\u0639 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F\u060C \u062D\u064A \u0627\u0644\u0639\u0644\u064A\u0627',
      district: '\u0627\u0644\u0639\u0644\u064A\u0627',
      city: '\u0627\u0644\u0631\u064A\u0627\u0636',
    },
  ]);

  const handleSaveName = () => {
    setProfileName(nameValue);
    setEditingName(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAddress = () => {
    const addr: Address = {
      id: `addr-${Date.now()}`,
      label: 'home',
      ...newAddress,
    };
    setAddresses((prev) => [...prev, addr]);
    setNewAddress({ addressLine: '', district: '', city: '\u0627\u0644\u0631\u064A\u0627\u0636' });
    setShowAddressForm(false);
  };

  const handleLogout = () => {
    router.push('/studio');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white px-4 pb-24 pt-6 gap-6">
        <h1 className="text-2xl font-arabic-display font-bold text-navy">
          {t('myProfile')}
        </h1>

        {/* Name & Phone */}
        <div className="bg-cream rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {editingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="flex-1 rounded-lg border border-cream-dark p-2 text-navy"
                />
                <Button
                  onClick={handleSaveName}
                  size="sm"
                  className="bg-gold text-navy font-bold px-4 py-2 rounded-lg text-sm"
                >
                  {t('save')}
                </Button>
              </div>
            ) : (
              <>
                <span className="text-navy font-bold text-lg">{profileName}</span>
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="text-gold text-sm font-medium underline"
                >
                  {t('edit')}
                </button>
              </>
            )}
          </div>
          <span className="text-navy/60 text-sm" dir="ltr">{mockPhone}</span>
        </div>

        {/* Measurements Summary */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('measurements')}
          </h2>
          <MeasurementSummaryCard measurement={mockMeasurement} />
        </div>

        {/* Addresses */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('addresses')}
          </h2>
          {addresses.map((addr) => (
            <AddressCard key={addr.id} address={addr} onDelete={handleDeleteAddress} />
          ))}
          {!showAddressForm ? (
            <Button
              onClick={() => setShowAddressForm(true)}
              variant="secondary"
              className="w-full py-3 rounded-lg text-sm"
            >
              {t('addAddress')}
            </Button>
          ) : (
            <div className="bg-cream rounded-lg p-4 flex flex-col gap-3">
              <Input
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                placeholder={t('addressLinePlaceholder')}
                className="rounded-lg border border-cream-dark p-3 text-navy"
              />
              <Input
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                placeholder={t('districtPlaceholder')}
                className="rounded-lg border border-cream-dark p-3 text-navy"
              />
              <Input
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder={t('cityPlaceholder')}
                className="rounded-lg border border-cream-dark p-3 text-navy"
              />
              <Button
                onClick={handleAddAddress}
                disabled={!newAddress.addressLine || !newAddress.district}
                className="w-full bg-gold text-navy font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {t('saveAddress')}
              </Button>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('language')}
          </h2>
          <LanguageToggle className="w-fit" />
        </div>

        {/* Order History Link */}
        <Link
          href="/profile/orders"
          className="bg-cream rounded-lg p-4 flex items-center justify-between"
        >
          <span className="text-navy font-bold">{t('orderHistory')}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-navy/50 rtl:rotate-180">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* WhatsApp Support */}
        <a
          href="https://wa.me/966500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-navy text-white font-bold rounded-lg px-6 py-3 text-center flex items-center justify-center gap-2 hover:bg-navy-light transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t('support')}
        </a>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="secondary"
          className="w-full py-3 rounded-lg text-red-500 border-red-200"
        >
          {t('logout')}
        </Button>
      </div>
    </PageTransition>
  );
}

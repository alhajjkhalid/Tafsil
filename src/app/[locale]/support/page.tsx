'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Modal } from '@/components/ui/modal';
import { PageTransition } from '@/components/ui/page-transition';

const faqKeys = [
  { q: 'faqMeasurementsQ', a: 'faqMeasurementsA' },
  { q: 'faqDeliveryQ', a: 'faqDeliveryA' },
  { q: 'faqAlterationsQ', a: 'faqAlterationsA' },
  { q: 'faqPaymentQ', a: 'faqPaymentA' },
  { q: 'faqVipQ', a: 'faqVipA' },
  { q: 'faqContactQ', a: 'faqContactA' },
] as const;

export default function SupportPage() {
  const t = useTranslations('support');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [alterationDesc, setAlterationDesc] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mockOrders = [
    { id: 'ord-1', label: 'TFS-A1B2C3 \u2014 \u0642\u0645\u0627\u0634 \u064A\u0627\u0628\u0627\u0646\u064A \u0641\u0627\u062E\u0631' },
    { id: 'ord-2', label: 'TFS-D4E5F6 \u2014 \u0642\u0645\u0627\u0634 \u0625\u0646\u062C\u0644\u064A\u0632\u064A' },
  ];

  const handleSubmitAlteration = () => {
    if (!selectedOrder || !alterationDesc.trim()) return;
    setShowSuccess(true);
    setSelectedOrder('');
    setAlterationDesc('');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white px-4 pb-24 pt-6 gap-8">
        <h1 className="text-2xl font-arabic-display font-bold text-navy">
          {t('supportTitle')}
        </h1>

        {/* FAQ */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('faq')}
          </h2>
          {faqKeys.map(({ q, a }) => (
            <Accordion key={q} title={t(q)}>
              <p className="text-navy/70 text-sm pt-2 leading-relaxed">{t(a)}</p>
            </Accordion>
          ))}
        </section>

        {/* Contact */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('contactUs')}
          </h2>
          <a
            href="https://wa.me/966500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy text-white font-bold rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-navy-light transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t('whatsappContact')}
          </a>
        </section>

        {/* Alteration Request */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('alterationRequest')}
          </h2>

          <div className="flex flex-col gap-3 bg-cream rounded-lg p-4">
            <div className="flex flex-col gap-1">
              <label className="text-navy/60 text-sm">{t('selectOrder')}</label>
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full rounded-lg border border-cream-dark p-3 text-navy bg-white appearance-none"
              >
                <option value="">{t('selectOrderPlaceholder')}</option>
                {mockOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-navy/60 text-sm">{t('description')}</label>
              <textarea
                value={alterationDesc}
                onChange={(e) => setAlterationDesc(e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                rows={4}
                className="w-full rounded-lg border border-cream-dark p-3 text-navy resize-none"
              />
            </div>

            <Button
              onClick={handleSubmitAlteration}
              disabled={!selectedOrder || !alterationDesc.trim()}
              className="w-full bg-gold text-navy font-bold py-3 rounded-lg disabled:opacity-50"
            >
              {t('submit')}
            </Button>
          </div>
        </section>

        {/* About */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-arabic-display font-bold text-navy">
            {t('aboutTafsil')}
          </h2>
          <p className="text-navy/70 text-sm leading-relaxed">
            {t('aboutDescription')}
          </p>
        </section>

        {/* Success Modal */}
        <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#4A7C59"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-arabic-display font-bold text-navy">
              {t('alterationSubmitted')}
            </h3>
            <p className="text-navy/60 text-sm text-center">
              {t('alterationSubmittedDesc')}
            </p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-gold text-navy font-bold py-3 rounded-lg"
            >
              {t('done')}
            </Button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations('common');

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        {/* Error icon */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          className="mb-6"
        >
          <circle cx="12" cy="12" r="10" stroke="#C45B4A" strokeWidth="1.5" />
          <path
            d="M12 8v4"
            stroke="#C45B4A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="#C45B4A" />
        </svg>

        {/* Decorative gold line */}
        <div className="w-16 h-px bg-gold mb-6" />

        {/* Title */}
        <h1 className="text-2xl font-arabic-display font-bold text-navy mb-3">
          {t('errorTitle')}
        </h1>

        {/* Message */}
        <p className="text-text-secondary font-arabic-body mb-8 max-w-xs">
          {t('errorMessage')}
        </p>

        {/* Retry button */}
        <Button variant="primary" size="lg" onClick={reset}>
          {t('retry')}
        </Button>
      </div>
    </PageTransition>
  );
}

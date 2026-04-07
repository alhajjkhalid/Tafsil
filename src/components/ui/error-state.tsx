'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const t = useTranslations('common');

  return (
    <Card className="p-8 bg-cream rounded-card flex flex-col items-center gap-4 mx-4">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#C45B4A" strokeWidth="1.5" />
        <path
          d="M12 8v4"
          stroke="#C45B4A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="#C45B4A" />
      </svg>
      <p className="text-navy text-center font-arabic-body font-medium">
        {message || t('error')}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="md">
          {t('retry')}
        </Button>
      )}
    </Card>
  );
}

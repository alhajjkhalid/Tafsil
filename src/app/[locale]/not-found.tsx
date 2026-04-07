'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';

export default function NotFoundPage() {
  const t = useTranslations('common');
  const router = useRouter();

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        {/* Large 404 */}
        <span className="text-8xl font-arabic-display font-bold text-gold opacity-30 select-none">
          404
        </span>

        {/* Decorative gold line */}
        <div className="w-16 h-px bg-gold my-6" />

        {/* Title */}
        <h1 className="text-2xl font-arabic-display font-bold text-navy mb-3">
          {t('notFoundTitle')}
        </h1>

        {/* Message */}
        <p className="text-text-secondary font-arabic-body mb-8 max-w-xs">
          {t('notFoundMessage')}
        </p>

        {/* Back to home button */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push('/studio')}
        >
          {t('backToHome')}
        </Button>
      </div>
    </PageTransition>
  );
}

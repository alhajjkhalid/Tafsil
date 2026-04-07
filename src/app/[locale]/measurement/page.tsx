'use client';

import { useTranslations } from 'next-intl';
import { PageTransition } from '@/components/ui/page-transition';
import { MethodCard } from '@/components/measurement/method-card';

function SparkleIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 4l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" />
      <circle cx="38" cy="10" r="2" fill="#C9A84C" />
      <circle cx="10" cy="10" r="1.5" fill="#C9A84C" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="6" width="12" height="36" rx="2" />
      <line x1="8" y1="12" x2="14" y2="12" />
      <line x1="8" y1="18" x2="16" y2="18" />
      <line x1="8" y1="24" x2="14" y2="24" />
      <line x1="8" y1="30" x2="16" y2="30" />
      <line x1="8" y1="36" x2="14" y2="36" />
      <path d="M28 14l6-6 6 6" />
      <line x1="34" y1="8" x2="34" y2="40" />
      <path d="M28 34l6 6 6-6" />
    </svg>
  );
}

function HomeVisitIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22l18-14 18 14" />
      <path d="M10 20v18h28V20" />
      <rect x="18" y="28" width="12" height="10" />
      <circle cx="36" cy="14" r="4" />
      <line x1="36" y1="18" x2="36" y2="26" />
      <line x1="32" y1="22" x2="40" y2="22" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M42 32V16a2 2 0 00-1-1.73l-16-8a2 2 0 00-2 0l-16 8A2 2 0 006 16v16a2 2 0 001 1.73l16 8a2 2 0 002 0l16-8A2 2 0 0042 32z" />
      <polyline points="6.5 13.96 24 24.01 41.5 13.96" />
      <line x1="24" y1="44.08" x2="24" y2="24" />
    </svg>
  );
}

export default function MeasurementPage() {
  const t = useTranslations('measurement');

  return (
    <PageTransition>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-arabic-display font-bold text-navy text-center mb-8">
          {t('title')}
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <MethodCard
            icon={<SparkleIcon />}
            label={t('ai')}
            subtitle={t('aiSubtitle')}
            badge={t('aiBadge')}
            badgeVariant="gold"
            href="/measurement/ai"
            index={0}
          />

          <MethodCard
            icon={<RulerIcon />}
            label={t('standard')}
            subtitle={t('standardSubtitle')}
            badge={t('standardBadge')}
            badgeVariant="gold"
            href="/measurement/standard"
            index={1}
          />

          <MethodCard
            icon={<HomeVisitIcon />}
            label={t('homeVisit')}
            subtitle={t('homeVisitSubtitle')}
            badge={t('homeVisitBadge')}
            badgeVariant="success"
            href="/measurement/home-visit"
            index={2}
          />

          <MethodCard
            icon={<PackageIcon />}
            label={t('sendThobe')}
            subtitle={t('sendThobeSubtitle')}
            badge={t('sendThobeBadge')}
            badgeVariant="info"
            href="/measurement/send-thobe"
            index={3}
          />
        </div>
      </div>
    </PageTransition>
  );
}

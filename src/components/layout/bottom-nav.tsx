'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils/cn';

interface NavTab {
  key: string;
  href: string;
  icon: React.ReactNode;
}

function StudioIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9A84C' : '#6B6B80'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9A84C' : '#6B6B80'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9A84C' : '#6B6B80'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MoreIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9A84C' : '#6B6B80'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

export function BottomNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const tabs: NavTab[] = [
    {
      key: 'studio',
      href: `/${locale}/studio`,
      icon: <StudioIcon active={pathname.includes('/studio')} />,
    },
    {
      key: 'orders',
      href: `/${locale}/profile/orders`,
      icon: <OrdersIcon active={pathname.includes('/profile/orders')} />,
    },
    {
      key: 'profile',
      href: `/${locale}/profile`,
      icon: (
        <ProfileIcon
          active={
            pathname.endsWith('/profile') ||
            (pathname.includes('/profile') && !pathname.includes('/orders'))
          }
        />
      ),
    },
    {
      key: 'more',
      href: `/${locale}/support`,
      icon: <MoreIcon active={pathname.includes('/support')} />,
    },
  ];

  function isActive(tab: NavTab): boolean {
    if (tab.key === 'studio') return pathname.includes('/studio');
    if (tab.key === 'orders') return pathname.includes('/profile/orders');
    if (tab.key === 'profile')
      return (
        pathname.endsWith('/profile') ||
        (pathname.includes('/profile') &&
          !pathname.includes('/orders'))
      );
    if (tab.key === 'more') return pathname.includes('/support');
    return false;
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/80 backdrop-blur-xl',
        'border-t border-cream-dark',
        'pb-safe'
      )}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'transition-colors duration-200',
                active ? 'text-gold' : 'text-navy/40'
              )}
            >
              {tab.icon}
              <span
                className={cn(
                  'text-[11px] font-arabic-body',
                  active ? 'text-gold font-medium' : 'text-navy/40'
                )}
              >
                {t(tab.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

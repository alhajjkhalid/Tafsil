import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { AuthProvider } from '@/components/auth/auth-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تفصيل | فُصِّل لك',
  description:
    'تفصيل — منصة تفصيل الثوب الرجالي حسب الطلب في المملكة العربية السعودية. اختر القماش، حدد المقاسات، واستلم ثوبك مفصلاً بأعلى جودة.',
  openGraph: {
    title: 'تفصيل | فُصِّل لك',
    description:
      'منصة تفصيل الثوب الرجالي حسب الطلب — اختر، فصّل، استلم.',
    locale: 'ar_SA',
    type: 'website',
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} lang={locale} className="min-h-screen">
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <Header />
          <main className="pt-16 pb-20 min-h-screen">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </NextIntlClientProvider>
    </div>
  );
}

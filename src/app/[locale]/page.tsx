import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlaceholderContent />;
}

function PlaceholderContent() {
  const t = useTranslations("splash");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white">
      <h1 className="font-arabic-display text-4xl font-bold text-navy">
        {t("tagline")}
      </h1>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudioStore } from '@/lib/store/studio-store';
import { formatPrice } from '@/lib/utils/price';
import { cn } from '@/lib/utils/cn';

export interface Fabric {
  id: string;
  tier: 'economy' | 'mid' | 'premium';
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  swatch_url: string | null;
  is_active: boolean;
  sort_order: number;
}

interface FabricSelectorProps {
  fabrics: Fabric[];
}

const tierGradients: Record<string, string> = {
  economy: 'bg-gradient-to-br from-cream to-cream-dark',
  mid: 'bg-gradient-to-br from-navy/10 to-navy/30',
  premium: 'bg-gradient-to-br from-gold-light to-gold-dark',
};

const tierBadgeVariants: Record<string, 'neutral' | 'gold' | 'info'> = {
  economy: 'neutral',
  mid: 'info',
  premium: 'gold',
};

export function FabricSelector({ fabrics }: FabricSelectorProps) {
  const t = useTranslations('studio');
  const locale = useLocale() as 'ar' | 'en';
  const { selectedFabricId, setFabric } = useStudioStore();

  const tierOrder: Array<'economy' | 'mid' | 'premium'> = [
    'economy',
    'mid',
    'premium',
  ];

  const tierLabels: Record<string, string> = {
    economy: t('tierEconomy'),
    mid: t('tierMid'),
    premium: t('tierPremium'),
  };

  const groupedFabrics = tierOrder.map((tier) => ({
    tier,
    label: tierLabels[tier],
    items: fabrics
      .filter((f) => f.tier === tier && f.is_active)
      .sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <section className="px-6 py-8">
      <h2 className="font-arabic-display text-2xl font-bold text-navy mb-6">
        {t('chooseFabric')}
      </h2>

      {groupedFabrics.map((group) => (
        <div key={group.tier} className="mb-8">
          <h3 className="font-arabic-body text-sm font-medium text-navy/50 mb-3 uppercase tracking-wide">
            {group.label}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {group.items.map((fabric, index) => {
              const isSelected = selectedFabricId === fabric.id;
              return (
                <motion.div
                  key={fabric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
                >
                  <Card
                    selected={isSelected}
                    onClick={() => setFabric(fabric.id, fabric.price, fabric.tier)}
                    className="overflow-hidden cursor-pointer"
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          'h-48 w-full rounded-t-lg',
                          tierGradients[fabric.tier]
                        )}
                      />
                      <div className="absolute top-3 end-3">
                        <Badge variant={tierBadgeVariants[fabric.tier]}>
                          {group.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-arabic-display text-lg font-semibold text-navy">
                        {locale === 'ar' ? fabric.name_ar : fabric.name_en}
                      </h4>
                      <p className="text-sm text-navy/60 mt-1 font-arabic-body">
                        {locale === 'ar'
                          ? fabric.description_ar
                          : fabric.description_en}
                      </p>
                      <p className="text-lg font-bold text-navy mt-3 font-arabic-display">
                        {formatPrice(fabric.price, locale)}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

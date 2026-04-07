'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

interface MethodCardProps {
  icon: ReactNode;
  label: string;
  subtitle: string;
  badge: string;
  badgeVariant?: BadgeVariant;
  href: string;
  onClick?: () => void;
  index?: number;
}

export function MethodCard({
  icon,
  label,
  subtitle,
  badge,
  badgeVariant = 'gold',
  href,
  onClick,
  index = 0,
}: MethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
    >
      <Link href={href} onClick={onClick} className="block">
        <Card
          className={cn(
            'relative p-5 flex flex-col items-center text-center cursor-pointer',
            'transition-transform duration-200 hover:scale-[1.02]'
          )}
        >
          <div className="absolute top-3 end-3">
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>

          <div className="w-12 h-12 flex items-center justify-center text-gold mb-3 mt-2">
            {icon}
          </div>

          <h3 className="font-arabic-display font-semibold text-lg text-navy">
            {label}
          </h3>

          <p className="text-sm text-navy/60 font-arabic-body mt-1">
            {subtitle}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}

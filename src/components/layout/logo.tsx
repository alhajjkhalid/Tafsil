'use client';

import { cn } from '@/lib/utils/cn';

type LogoSize = 'sm' | 'md' | 'lg';
type LogoVariant = 'gold' | 'navy' | 'white';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  showSubtitle?: boolean;
  shimmer?: boolean;
  className?: string;
}

const sizeMap: Record<LogoSize, { arabic: string; english: string }> = {
  sm: { arabic: 'text-2xl', english: 'text-xs' },
  md: { arabic: 'text-4xl', english: 'text-sm' },
  lg: { arabic: 'text-6xl', english: 'text-base' },
};

const variantMap: Record<LogoVariant, string> = {
  gold: 'text-gold',
  navy: 'text-navy',
  white: 'text-white',
};

export function Logo({
  size = 'md',
  variant = 'gold',
  showSubtitle = false,
  shimmer = false,
  className,
}: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <span
        className={cn(
          'font-arabic-display font-bold leading-tight',
          sizeMap[size].arabic,
          variantMap[variant],
          shimmer && 'shimmer-gold'
        )}
      >
        تفصيل
      </span>
      {showSubtitle && (
        <span
          className={cn(
            'font-english-display font-semibold tracking-widest uppercase',
            sizeMap[size].english,
            variantMap[variant],
            'opacity-70'
          )}
        >
          TAFSIL
        </span>
      )}
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils/cn';
import { Logo } from './logo';
import { LanguageToggle } from './language-toggle';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16 px-6',
        'flex items-center justify-between',
        'bg-white/80 backdrop-blur-xl',
        'border-b border-cream-dark',
        className
      )}
    >
      <LanguageToggle />
      <Logo size="sm" variant="gold" />
    </header>
  );
}

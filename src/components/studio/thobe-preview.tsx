'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useStudioStore } from '@/lib/store/studio-store';

const fabricFills: Record<string, string> = {
  economy: '#F5F0E8',
  mid: '#E8E0D0',
  premium: '#D4BA6A',
};

interface ThobePreviewProps {
  fabricTier?: 'economy' | 'mid' | 'premium' | null;
  personalizationLevel?: 'standard' | 'enhanced' | 'full_custom' | null;
}

export function ThobePreview({
  fabricTier: propTier,
  personalizationLevel: propLevel,
}: ThobePreviewProps = {}) {
  const t = useTranslations('studio');
  const store = useStudioStore();

  const tier = propTier ?? store.selectedFabricTier;
  const level = propLevel ?? store.selectedPersonalizationLevel;

  const fill = tier ? fabricFills[tier] : '#F5F0E8';
  const showCollarAccent = level === 'enhanced' || level === 'full_custom';
  const showCuffAccents = level === 'enhanced' || level === 'full_custom';
  const showEmbroidery = level === 'full_custom';

  return (
    <div className="sticky top-16 z-10 bg-gradient-to-b from-cream to-white flex items-center justify-center py-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${tier}-${level}`}
          initial={{ scale: 0.98, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative"
        >
          <svg
            width="120"
            height="192"
            viewBox="0 0 200 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background radial gradient */}
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F5F0E8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5F0E8" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="160" rx="90" ry="140" fill="url(#bgGrad)" />

            {/* Thobe body silhouette */}
            <path
              d="M70 60 L60 65 L40 120 L35 280 L55 310 L80 310 L85 300 L100 305 L115 300 L120 310 L145 310 L165 280 L160 120 L140 65 L130 60 L120 50 Q100 35 80 50 Z"
              fill={fill}
              stroke="#1A1A2E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Collar / neckline */}
            <path
              d="M80 50 Q90 42 100 40 Q110 42 120 50"
              fill="none"
              stroke={showCollarAccent ? '#C9A84C' : '#E8E0D0'}
              strokeWidth={showCollarAccent ? 2.5 : 1.5}
              strokeLinecap="round"
            />

            {/* Center seam */}
            <line
              x1="100"
              y1="50"
              x2="100"
              y2="280"
              stroke="#1A1A2E"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />

            {/* Left sleeve */}
            <path
              d="M60 65 L30 90 L25 130 L40 120"
              fill={fill}
              stroke="#1A1A2E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Right sleeve */}
            <path
              d="M140 65 L170 90 L175 130 L160 120"
              fill={fill}
              stroke="#1A1A2E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Cuff accents */}
            {showCuffAccents && (
              <>
                <circle cx="27" cy="130" r="3" fill="#C9A84C" />
                <circle cx="173" cy="130" r="3" fill="#C9A84C" />
              </>
            )}

            {/* Embroidery dots (full_custom only) */}
            {showEmbroidery && (
              <>
                <circle cx="90" cy="70" r="1.5" fill="#C9A84C" />
                <circle cx="95" cy="75" r="1.5" fill="#C9A84C" />
                <circle cx="100" cy="70" r="1.5" fill="#C9A84C" />
                <circle cx="105" cy="75" r="1.5" fill="#C9A84C" />
                <circle cx="110" cy="70" r="1.5" fill="#C9A84C" />
                <circle cx="100" cy="80" r="1.5" fill="#C9A84C" />
                <circle cx="90" cy="85" r="1" fill="#C9A84C" opacity="0.6" />
                <circle cx="110" cy="85" r="1" fill="#C9A84C" opacity="0.6" />
              </>
            )}
          </svg>

          <p className="text-center text-xs text-navy/40 font-arabic-body mt-2">
            {t('preview')}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

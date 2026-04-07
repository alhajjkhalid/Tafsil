'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface OrderEvent {
  status: string;
  note: string | null;
  createdAt: string;
}

interface OrderTimelineProps {
  currentStatus: string;
  events: OrderEvent[];
  trackingUrl: string | null;
}

const milestones = [
  { key: 'confirmed', label: 'تم التأكيد' },
  { key: 'in_production', label: 'قيد التنفيذ' },
  { key: 'quality_checked', label: 'تم فحص الجودة' },
  { key: 'out_for_delivery', label: 'في الطريق إليك' },
  { key: 'delivered', label: 'تم التوصيل' },
];

export function OrderTimeline({ currentStatus, events, trackingUrl }: OrderTimelineProps) {
  const t = useTranslations('tracking');

  const currentIndex = useMemo(
    () => milestones.findIndex((m) => m.key === currentStatus),
    [currentStatus]
  );

  const getEventTimestamp = (milestoneKey: string): string | null => {
    const event = events.find((e) => e.status === milestoneKey);
    if (!event) return null;
    return new Intl.DateTimeFormat('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(event.createdAt));
  };

  const totalHeight = (milestones.length - 1) * 80;
  const progressHeight =
    currentIndex >= 0 ? (currentIndex / (milestones.length - 1)) * totalHeight : 0;

  return (
    <div className="relative py-4" style={{ minHeight: totalHeight + 40 }}>
      <div
        className="absolute w-0.5 bg-cream-dark"
        style={{
          right: 8,
          top: 20,
          height: totalHeight,
        }}
      />

      <motion.div
        className="absolute w-0.5 bg-gold"
        style={{ right: 8, top: 20 }}
        initial={{ height: 0 }}
        animate={{ height: progressHeight }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="flex flex-col" style={{ gap: 64 }}>
        {milestones.map((milestone, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;
          const timestamp = getEventTimestamp(milestone.key);

          return (
            <motion.div
              key={milestone.key}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full ${
                    isCompleted
                      ? 'bg-gold'
                      : isActive
                      ? 'bg-gold ring-4 ring-gold/30'
                      : 'bg-cream-dark border-2 border-cream-dark'
                  }`}
                />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 w-4 h-4 rounded-full bg-gold/30"
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              <div className="flex flex-col gap-0.5 -mt-1">
                <span
                  className={`font-medium ${
                    isUpcoming ? 'text-navy/40' : 'text-navy'
                  }`}
                >
                  {milestone.label}
                </span>
                {timestamp && (
                  <span className="text-navy/50 text-xs">{timestamp}</span>
                )}
                {milestone.key === 'out_for_delivery' && trackingUrl && isActive && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold underline text-sm font-medium mt-1"
                  >
                    {t('trackShipment')}
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

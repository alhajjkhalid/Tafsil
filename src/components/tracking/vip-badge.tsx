'use client';

import { motion } from 'framer-motion';

export function VipBadge() {
  return (
    <motion.span
      className="inline-block bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      VIP
    </motion.span>
  );
}

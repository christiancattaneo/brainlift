'use client';

import { motion } from 'framer-motion';

interface ThinkingIndicatorProps {
  message?: string;
}

export function ThinkingIndicator({ message = 'Analyzing...' }: ThinkingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--alpha-blue)]"
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="text-sm text-[var(--foreground-muted)]">{message}</span>
    </motion.div>
  );
}

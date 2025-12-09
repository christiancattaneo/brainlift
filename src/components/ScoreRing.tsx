'use client';

import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  maxScore: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  passed?: boolean;
}

export function ScoreRing({
  score,
  maxScore,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  passed,
}: ScoreRingProps) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on score
  const getColor = () => {
    if (passed !== undefined) {
      return passed ? '#00FFA3' : '#FF4F00';
    }
    if (percentage >= 80) return '#00FFA3'; // Volt Mint
    if (percentage >= 60) return '#00E0FF'; // Electric Cyan
    if (percentage >= 40) return '#FF4F00'; // International Orange
    return '#FF4F00';
  };
  
  const color = getColor();
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {showPercentage ? `${percentage}%` : `${score}/${maxScore}`}
        </motion.span>
      </div>
    </div>
  );
}


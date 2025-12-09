'use client';

import { motion } from 'framer-motion';
import { MilestoneBonus } from '@/types';

interface ConcentricRingsProps {
  baseScore: number;
  baseMaxScore: number;
  bonusScore: number;
  milestones: MilestoneBonus[];
  passed: boolean;
  size?: number;
}

export function ConcentricRings({
  baseScore,
  baseMaxScore,
  bonusScore,
  milestones,
  passed,
  size = 200,
}: ConcentricRingsProps) {
  const totalScore = baseScore + bonusScore;
  const basePercentage = Math.round((baseScore / baseMaxScore) * 100);
  const totalPercentage = Math.round((totalScore / baseMaxScore) * 100);
  
  // Ring configuration - innermost to outermost
  const ringConfig = [
    {
      id: 'base',
      label: 'Base Plan',
      percentage: Math.min(basePercentage, 100),
      color: passed ? '#00FFA3' : (basePercentage >= 60 ? '#00E0FF' : '#FF4F00'),
      strokeWidth: 12,
      radius: (size * 0.28),
    },
    ...milestones.map((m, i) => ({
      id: m.milestone,
      label: m.label,
      percentage: m.progressPercent,
      color: m.color,
      strokeWidth: 8,
      radius: (size * 0.28) + ((i + 1) * (size * 0.09)),
    })),
  ];
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Render rings from outermost to innermost for proper layering */}
        {[...ringConfig].reverse().map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius;
          const cappedPercentage = Math.min(ring.percentage, 100);
          const strokeDashoffset = circumference - (cappedPercentage / 100) * circumference;
          const delay = (ringConfig.length - 1 - index) * 0.2;
          
          return (
            <g key={ring.id}>
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={ring.radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={ring.strokeWidth}
              />
              
              {/* Progress ring */}
              {ring.percentage > 0 && (
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${ring.color}60)`,
                  }}
                />
              )}
              
              {/* Overflow indicator for >100% */}
              {ring.percentage > 100 && (
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth + 2}
                  strokeLinecap="round"
                  strokeDasharray={`${circumference * 0.05} ${circumference * 0.95}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay }}
                  style={{
                    filter: `drop-shadow(0 0 10px ${ring.color})`,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span
            className="text-4xl font-bold block"
            style={{ color: passed ? '#00FFA3' : '#FF4F00' }}
          >
            {totalPercentage}%
          </span>
          {bonusScore > 0 && (
            <motion.span
              className="text-sm text-volt-mint block mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              +{bonusScore.toFixed(1)} bonus
            </motion.span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Legend component for the rings
export function RingLegend({ milestones, baseScore, baseMaxScore, passed }: {
  milestones: MilestoneBonus[];
  baseScore: number;
  baseMaxScore: number;
  passed: boolean;
}) {
  const basePercentage = Math.round((baseScore / baseMaxScore) * 100);
  const baseColor = passed ? '#00FFA3' : (basePercentage >= 60 ? '#00E0FF' : '#FF4F00');
  
  return (
    <div className="space-y-2 mt-4">
      {/* Base ring legend */}
      <div className="flex items-center gap-3 text-sm">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: baseColor, boxShadow: `0 0 8px ${baseColor}60` }}
        />
        <span className="flex-1 opacity-70">Base Plan</span>
        <span className="font-mono" style={{ color: baseColor }}>
          {baseScore}/{baseMaxScore}
        </span>
      </div>
      
      {/* Milestone ring legends */}
      {milestones.map((m) => (
        <div key={m.milestone} className="flex items-center gap-3 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: m.progressPercent > 0 ? m.color : 'rgba(255,255,255,0.2)',
              boxShadow: m.progressPercent > 0 ? `0 0 8px ${m.color}60` : 'none'
            }}
          />
          <span className="flex-1 opacity-70">{m.label}</span>
          <span 
            className="font-mono"
            style={{ color: m.progressPercent > 0 ? m.color : 'rgba(255,255,255,0.3)' }}
          >
            {m.progressPercent > 0 ? `+${m.earnedBonus.toFixed(1)}` : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}


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
  
  // Calculate ring sizes to fit within container with proper padding
  const padding = 12;
  const availableRadius = (size / 2) - padding;
  const ringCount = milestones.length + 1; // base + milestones
  const ringSpacing = size * 0.055; // Proportional spacing
  const baseStrokeWidth = Math.max(10, size * 0.05);
  const milestoneStrokeWidth = Math.max(6, size * 0.035);
  
  // Calculate base ring radius (innermost) - ensure all rings fit
  const totalRingSpace = (ringCount - 1) * ringSpacing;
  const baseRadius = Math.max(size * 0.2, availableRadius - totalRingSpace - (baseStrokeWidth / 2));
  
  // Ring configuration - innermost to outermost
  const ringConfig = [
    {
      id: 'base',
      label: 'Base Plan',
      percentage: Math.min(basePercentage, 100),
      color: passed ? '#00FFA3' : (basePercentage >= 60 ? '#00E0FF' : '#FF4F00'),
      strokeWidth: baseStrokeWidth,
      radius: baseRadius,
    },
    ...milestones.map((m, i) => ({
      id: m.milestone,
      label: m.label,
      percentage: m.progressPercent,
      color: m.color,
      strokeWidth: milestoneStrokeWidth,
      radius: baseRadius + ((i + 1) * ringSpacing),
    })),
  ];
  
  return (
    <div 
      className="relative flex items-center justify-center flex-shrink-0" 
      style={{ width: size, height: size }}
    >
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
          const delay = (ringConfig.length - 1 - index) * 0.12;
          
          return (
            <g key={ring.id}>
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={ring.radius}
                fill="none"
                stroke="rgba(128, 128, 128, 0.15)"
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
                  transition={{ duration: 1.2, ease: 'easeOut', delay }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${ring.color}70)`,
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
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span
            className="font-bold block leading-none"
            style={{ 
              color: passed ? '#00FFA3' : '#FF4F00',
              fontSize: Math.min(size * 0.13, 24),
              textShadow: `0 0 20px ${passed ? 'rgba(0,255,163,0.3)' : 'rgba(255,79,0,0.3)'}`,
            }}
          >
            {totalPercentage}%
          </span>
          {bonusScore > 0 && (
            <motion.span
              className="block mt-0.5 font-medium"
              style={{ 
                fontSize: Math.min(size * 0.045, 10),
                color: '#00FFA3',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              +{bonusScore.toFixed(1)} bonus
            </motion.span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Compact horizontal legend for milestone rings
export function RingLegend({ milestones, baseScore, baseMaxScore, passed }: {
  milestones: MilestoneBonus[];
  baseScore: number;
  baseMaxScore: number;
  passed: boolean;
}) {
  const basePercentage = Math.round((baseScore / baseMaxScore) * 100);
  const baseColor = passed ? '#00FFA3' : (basePercentage >= 60 ? '#00E0FF' : '#FF4F00');
  
  const allItems = [
    { label: 'Base', value: `${baseScore}/${baseMaxScore}`, color: baseColor, active: true },
    ...milestones.map(m => ({
      label: m.label.replace(' Progress', '').replace(' Target', '').replace(' Milestone', ''),
      value: m.progressPercent > 0 ? `+${m.earnedBonus.toFixed(1)}` : '—',
      color: m.color,
      active: m.progressPercent > 0,
    })),
  ];
  
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
      {allItems.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ 
              backgroundColor: item.active ? item.color : 'rgba(128,128,128,0.25)',
              boxShadow: item.active ? `0 0 8px ${item.color}60` : 'none'
            }}
          />
          <span className="text-[var(--foreground)] opacity-70">{item.label}</span>
          <span 
            className="font-mono font-semibold"
            style={{ color: item.active ? item.color : 'rgba(128,128,128,0.5)' }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

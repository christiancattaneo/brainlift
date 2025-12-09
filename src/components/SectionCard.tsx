'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SectionGrade } from '@/types';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface SectionCardProps {
  sectionId: string;
  sectionTitle: string;
  grade?: SectionGrade;
  status: 'pending' | 'grading' | 'complete' | 'error';
  index: number;
}

export function SectionCard({ sectionId, sectionTitle, grade, status, index }: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-volt-mint" />;
      case 'grading':
        return <Clock className="w-5 h-5 text-alpha-blue animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-international-orange" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-chrome-silver/30" />;
    }
  };
  
  const getScoreColor = (score: number, max: number) => {
    if (max === 0) return 'text-chrome-silver';
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-volt-mint';
    if (percentage >= 60) return 'text-electric-cyan';
    return 'text-international-orange';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => status === 'complete' && setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between ${
          status === 'complete' ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'
        } transition-colors`}
        disabled={status !== 'complete'}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="text-left">
            <h3 className="font-medium text-canvas-white">{sectionTitle}</h3>
            {status === 'grading' && (
              <ThinkingIndicator message="Analyzing section..." />
            )}
            {status === 'pending' && (
              <span className="text-xs text-chrome-silver/60">Waiting...</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {status === 'complete' && grade && (
            <>
              <div className="flex gap-2 text-sm">
                {grade.thoroughnessMax > 0 && (
                  <span className={getScoreColor(grade.thoroughnessScore, grade.thoroughnessMax)}>
                    T: {grade.thoroughnessScore}/{grade.thoroughnessMax}
                  </span>
                )}
                {grade.viabilityMax > 0 && (
                  <span className={getScoreColor(grade.viabilityScore, grade.viabilityMax)}>
                    V: {grade.viabilityScore}/{grade.viabilityMax}
                  </span>
                )}
                {grade.executabilityMax > 0 && (
                  <span className={getScoreColor(grade.executabilityScore, grade.executabilityMax)}>
                    E: {grade.executabilityScore}/{grade.executabilityMax}
                  </span>
                )}
              </div>
              <div className={`font-bold ${getScoreColor(grade.totalScore, grade.totalMax)}`}>
                {grade.totalScore}/{grade.totalMax}
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-chrome-silver" />
              ) : (
                <ChevronDown className="w-5 h-5 text-chrome-silver" />
              )}
            </>
          )}
        </div>
      </button>
      
      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && grade && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/5">
              {/* Analysis */}
              <p className="text-sm text-chrome-silver mb-4">{grade.analysis}</p>
              
              {/* Strengths */}
              {grade.strengths.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-volt-mint uppercase tracking-wider mb-2">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {grade.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-chrome-silver flex items-start gap-2">
                        <span className="text-volt-mint mt-1">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Improvements */}
              {grade.improvements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-international-orange uppercase tracking-wider mb-2">
                    Areas to Improve
                  </h4>
                  <ul className="space-y-1">
                    {grade.improvements.map((improvement, i) => (
                      <li key={i} className="text-sm text-chrome-silver flex items-start gap-2">
                        <span className="text-international-orange mt-1">→</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


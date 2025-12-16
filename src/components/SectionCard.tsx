'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SectionGrade } from '@/types';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Clock, FileWarning, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface SectionCardProps {
  sectionId: string;
  sectionTitle: string;
  grade?: SectionGrade;
  status: 'pending' | 'grading' | 'complete' | 'error';
  index: number;
}

export function SectionCard({ sectionTitle, grade, status, index }: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-[var(--success)]" />;
      case 'grading':
        return <Clock className="w-5 h-5 text-[var(--alpha-blue)] animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[var(--international-orange)]" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-[var(--border-strong)]" />;
    }
  };
  
  const getScoreColor = (score: number, max: number) => {
    if (max === 0) return 'text-[var(--foreground-muted)]';
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-[var(--success)]';
    if (percentage >= 60) return 'text-[var(--electric-cyan)]';
    return 'text-[var(--international-orange)]';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-xl overflow-hidden shadow-soft"
    >
      {/* Header */}
      <button
        onClick={() => status === 'complete' && setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between ${
          status === 'complete' ? 'cursor-pointer hover:bg-[var(--accent-light)]' : 'cursor-default'
        } transition-colors`}
        disabled={status !== 'complete'}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="text-left">
            <h3 className="font-medium text-[var(--foreground)]">{sectionTitle}</h3>
            {status === 'grading' && (
              <ThinkingIndicator message="Analyzing section..." />
            )}
            {status === 'pending' && (
              <span className="text-xs text-[var(--foreground-muted)]/60">Waiting...</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {status === 'complete' && grade && (
            <>
              {/* Coherence issues badge */}
              {grade.coherenceIssues && grade.coherenceIssues.length > 0 && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">
                  <AlertTriangle className="w-3 h-3" />
                  {grade.coherenceIssues.length} inconsistent
                </span>
              )}
              {/* Empty fields badge */}
              {grade.emptyFields && grade.emptyFields.length > 0 && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                  <FileWarning className="w-3 h-3" />
                  {grade.emptyFields.length} empty
                </span>
              )}
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
                <ChevronUp className="w-5 h-5 text-[var(--foreground-muted)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
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
            <div className="px-4 pb-4 pt-2 border-t border-[var(--border)]">
              {/* Analysis */}
              <p className="text-sm text-[var(--foreground-muted)] mb-4">{grade.analysis}</p>
              
              {/* Strengths */}
              {grade.strengths.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-[var(--success)] uppercase tracking-wider mb-2">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {grade.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-[var(--foreground-muted)] flex items-start gap-2">
                        <span className="text-[var(--success)] mt-1">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Coherence Issues */}
              {grade.coherenceIssues && grade.coherenceIssues.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Coherence Issues (deducted from Thoroughness)
                  </h4>
                  <ul className="space-y-1">
                    {grade.coherenceIssues.map((ci, i) => (
                      <li key={i} className="text-sm text-[var(--foreground-muted)] flex items-start gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                        <span className={`text-xs px-1.5 py-0.5 rounded uppercase font-medium ${
                          ci.severity === 'high' ? 'bg-red-500/30 text-red-500' : 
                          ci.severity === 'medium' ? 'bg-amber-500/30 text-amber-500' : 
                          'bg-gray-500/30 text-gray-400'
                        }`}>
                          -{ci.deduction}
                        </span>
                        <span>{ci.issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Empty Fields Warning */}
              {grade.emptyFields && grade.emptyFields.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileWarning className="w-3 h-3" />
                    Empty Fields
                  </h4>
                  <ul className="space-y-1">
                    {grade.emptyFields.map((field, i) => (
                      <li key={i} className="text-sm text-[var(--foreground-muted)] flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                        <span className="text-amber-500 mt-0.5">⚠</span>
                        <div>
                          <span className="font-medium">{field.fieldName}</span>
                          <span className="text-xs block text-amber-500/70">Expected: {field.expectedContent}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Improvements */}
              {grade.improvements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[var(--international-orange)] uppercase tracking-wider mb-2">
                    Areas to Improve
                  </h4>
                  <ul className="space-y-1">
                    {grade.improvements.map((improvement, i) => (
                      <li key={i} className="text-sm text-[var(--foreground-muted)] flex items-start gap-2">
                        <span className="text-[var(--international-orange)] mt-1">→</span>
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

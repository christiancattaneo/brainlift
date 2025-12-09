'use client';

import { motion } from 'framer-motion';
import { GradingResult } from '@/types';
import { ScoreRing } from './ScoreRing';
import { Download, FileText, Copy, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface FinalSummaryProps {
  result: GradingResult;
  onExportPDF: () => void;
  onExportMarkdown: () => void;
}

export function FinalSummary({ result, onExportPDF, onExportMarkdown }: FinalSummaryProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyToClipboard = async () => {
    const markdown = generateMarkdown(result);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 md:p-8 shadow-soft"
    >
      {/* Header with score */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <ScoreRing
          score={result.totalScore}
          maxScore={result.maxScore}
          size={140}
          strokeWidth={10}
          passed={result.passed}
        />
        
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            {result.passed ? (
              <>
                <CheckCircle className="w-8 h-8 text-[var(--success)]" />
                <h2 className="text-2xl font-bold text-[var(--success)]">PASSED</h2>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-[var(--international-orange)]" />
                <h2 className="text-2xl font-bold text-[var(--international-orange)]">NEEDS WORK</h2>
              </>
            )}
          </div>
          <p className="text-[var(--foreground-muted)] text-sm">
            {result.totalScore} / {result.maxScore} points ({result.percentage}%)
          </p>
          <p className="text-xs text-[var(--foreground-muted)]/60 mt-1">
            Pass threshold: 80%
          </p>
        </div>
        
        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-[var(--accent-light)]">
            <div className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider mb-1">
              Thoroughness
            </div>
            <div className="text-lg font-bold text-[var(--foreground)]">
              {result.sections.reduce((sum, s) => sum + s.thoroughnessScore, 0)}/30
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--accent-light)]">
            <div className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider mb-1">
              Viability
            </div>
            <div className="text-lg font-bold text-[var(--foreground)]">
              {result.sections.reduce((sum, s) => sum + s.viabilityScore, 0)}/30
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--accent-light)]">
            <div className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider mb-1">
              Executability
            </div>
            <div className="text-lg font-bold text-[var(--foreground)]">
              {result.sections.reduce((sum, s) => sum + s.executabilityScore, 0)}/40
            </div>
          </div>
        </div>
      </div>
      
      {/* Overall Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Overall Analysis</h3>
        <p className="text-[var(--foreground-muted)] leading-relaxed">{result.overallAnalysis}</p>
      </div>
      
      {/* Top Recommendations */}
      {result.topRecommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Top Recommendations</h3>
          <ul className="space-y-2">
            {result.topRecommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--accent-light)] border border-[var(--alpha-blue)]/20"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--alpha-blue)] flex items-center justify-center text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[var(--foreground-muted)]">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--alpha-blue)] hover:bg-[var(--alpha-blue-light)] text-white font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
        <button
          onClick={onExportMarkdown}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--input-bg)] hover:bg-[var(--accent-light)] text-[var(--foreground)] font-medium transition-colors border border-[var(--border-strong)]"
        >
          <FileText className="w-4 h-4" />
          Export Markdown
        </button>
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--input-bg)] hover:bg-[var(--accent-light)] text-[var(--foreground)] font-medium transition-colors border border-[var(--border-strong)]"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Results
            </>
          )}
        </button>
      </div>
      
      {/* Timestamp */}
      <p className="text-xs text-[var(--foreground-muted)]/40 mt-6 text-center">
        Graded on {new Date(result.timestamp).toLocaleString()}
      </p>
    </motion.div>
  );
}

function generateMarkdown(result: GradingResult): string {
  let md = `# Business Brainlift Grading Report\n\n`;
  md += `**Date:** ${new Date(result.timestamp).toLocaleString()}\n\n`;
  md += `## Overall Score: ${result.totalScore}/${result.maxScore} (${result.percentage}%)\n\n`;
  md += `**Status:** ${result.passed ? '✅ PASSED' : '❌ NEEDS WORK'}\n\n`;
  
  md += `### Score Breakdown\n`;
  md += `- Thoroughness: ${result.sections.reduce((sum, s) => sum + s.thoroughnessScore, 0)}/30\n`;
  md += `- Viability: ${result.sections.reduce((sum, s) => sum + s.viabilityScore, 0)}/30\n`;
  md += `- Executability: ${result.sections.reduce((sum, s) => sum + s.executabilityScore, 0)}/40\n\n`;
  
  md += `## Overall Analysis\n${result.overallAnalysis}\n\n`;
  
  if (result.topRecommendations.length > 0) {
    md += `## Top Recommendations\n`;
    result.topRecommendations.forEach((rec, i) => {
      md += `${i + 1}. ${rec}\n`;
    });
    md += '\n';
  }
  
  md += `## Section Details\n\n`;
  result.sections.forEach(section => {
    md += `### ${section.sectionTitle}\n`;
    md += `**Score:** ${section.totalScore}/${section.totalMax}\n`;
    if (section.thoroughnessMax > 0) md += `- Thoroughness: ${section.thoroughnessScore}/${section.thoroughnessMax}\n`;
    if (section.viabilityMax > 0) md += `- Viability: ${section.viabilityScore}/${section.viabilityMax}\n`;
    if (section.executabilityMax > 0) md += `- Executability: ${section.executabilityScore}/${section.executabilityMax}\n`;
    md += `\n**Analysis:** ${section.analysis}\n\n`;
    
    if (section.strengths.length > 0) {
      md += `**Strengths:**\n`;
      section.strengths.forEach(s => md += `- ${s}\n`);
      md += '\n';
    }
    
    if (section.improvements.length > 0) {
      md += `**Areas to Improve:**\n`;
      section.improvements.forEach(s => md += `- ${s}\n`);
      md += '\n';
    }
  });
  
  return md;
}

'use client';

import { motion } from 'framer-motion';
import { GradingResult, TRACTION_CONFIG } from '@/types';
import { ConcentricRings, RingLegend } from './ConcentricRings';
import { Download, FileText, Copy, CheckCircle, XCircle, Zap, TrendingUp } from 'lucide-react';
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
  
  const hasTraction = result.traction && result.traction.length > 0;
  const hasBonusScore = result.bonusScore > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 md:p-8 shadow-soft"
    >
      {/* Header with concentric rings */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
        {/* Concentric Rings Visualization */}
        <div className="flex flex-col items-center">
          <ConcentricRings
            baseScore={result.baseScore}
            baseMaxScore={result.baseMaxScore}
            bonusScore={result.bonusScore}
            milestones={result.milestones}
            passed={result.passed}
            size={200}
          />
          <RingLegend
            milestones={result.milestones}
            baseScore={result.baseScore}
            baseMaxScore={result.baseMaxScore}
            passed={result.passed}
          />
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          {/* Pass/Fail Status */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
            {result.passed ? (
              <>
                <CheckCircle className="w-8 h-8 text-volt-mint" />
                <h2 className="text-2xl font-bold text-volt-mint">PASSED</h2>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-international-orange" />
                <h2 className="text-2xl font-bold text-international-orange">NEEDS WORK</h2>
              </>
            )}
          </div>
          
          {/* Score breakdown */}
          <div className="space-y-1 mb-4">
            <p className="text-[var(--foreground-muted)]">
              {result.baseScore} / {result.baseMaxScore} points ({result.basePercentage}%)
            </p>
            {hasBonusScore && (
              <p className="text-volt-mint flex items-center justify-center lg:justify-start gap-2">
                <Zap className="w-4 h-4" />
                +{result.bonusScore.toFixed(1)} traction bonus
              </p>
            )}
            <p className="text-xs text-[var(--foreground-muted)]/60">
              Pass threshold: 80%
            </p>
          </div>
          
          {/* Score categories */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[var(--accent-light)]">
              <div className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider mb-1">
                Thoroughness
              </div>
              <div className="text-lg font-bold text-[var(--foreground)]">
                {result.sections.reduce((sum, s) => sum + s.thoroughnessScore, 0).toFixed(1)}/30
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--accent-light)]">
              <div className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider mb-1">
                Viability
              </div>
              <div className="text-lg font-bold text-[var(--foreground)]">
                {result.sections.reduce((sum, s) => sum + s.viabilityScore, 0).toFixed(1)}/30
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--accent-light)]">
              <div className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider mb-1">
                Executability
              </div>
              <div className="text-lg font-bold text-[var(--foreground)]">
                {result.sections.reduce((sum, s) => sum + s.executabilityScore, 0).toFixed(1)}/40
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Traction Evidence Section */}
      {hasTraction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-4 rounded-xl bg-gradient-to-r from-volt-mint/10 to-transparent border border-volt-mint/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-volt-mint" />
            <h3 className="text-lg font-semibold text-volt-mint">Real Traction Detected</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.traction.map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--background)]/50"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${t.verified ? 'bg-volt-mint' : 'bg-electric-cyan'}`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    {TRACTION_CONFIG[t.type]?.label || t.type}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    {t.description}
                  </div>
                  {t.verified && (
                    <div className="text-xs text-volt-mint mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
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
  md += `## Overall Score: ${result.baseScore}/${result.baseMaxScore} (${result.basePercentage}%)\n\n`;
  
  if (result.bonusScore > 0) {
    md += `**Traction Bonus:** +${result.bonusScore.toFixed(1)} points\n`;
    md += `**Total with Bonus:** ${result.totalScore.toFixed(1)} points (${result.percentage}%)\n\n`;
  }
  
  md += `**Status:** ${result.passed ? '✅ PASSED' : '❌ NEEDS WORK'}\n\n`;
  
  md += `### Score Breakdown\n`;
  md += `- Thoroughness: ${result.sections.reduce((sum, s) => sum + s.thoroughnessScore, 0).toFixed(1)}/30\n`;
  md += `- Viability: ${result.sections.reduce((sum, s) => sum + s.viabilityScore, 0).toFixed(1)}/30\n`;
  md += `- Executability: ${result.sections.reduce((sum, s) => sum + s.executabilityScore, 0).toFixed(1)}/40\n\n`;
  
  // Traction section
  if (result.traction && result.traction.length > 0) {
    md += `## Traction Evidence\n`;
    result.traction.forEach(t => {
      const label = TRACTION_CONFIG[t.type]?.label || t.type;
      md += `- **${label}**: ${t.description}${t.verified ? ' ✓' : ''}\n`;
    });
    md += '\n';
  }
  
  // Milestone bonuses
  if (result.milestones && result.milestones.some(m => m.earnedBonus > 0)) {
    md += `## Milestone Progress\n`;
    result.milestones.forEach(m => {
      if (m.earnedBonus > 0) {
        md += `- ${m.label}: +${m.earnedBonus.toFixed(1)} (${m.progressPercent}% progress)\n`;
      }
    });
    md += '\n';
  }
  
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
    md += `**Score:** ${section.totalScore.toFixed(1)}/${section.totalMax}\n`;
    if (section.thoroughnessMax > 0) md += `- Thoroughness: ${section.thoroughnessScore.toFixed(1)}/${section.thoroughnessMax}\n`;
    if (section.viabilityMax > 0) md += `- Viability: ${section.viabilityScore.toFixed(1)}/${section.viabilityMax}\n`;
    if (section.executabilityMax > 0) md += `- Executability: ${section.executabilityScore.toFixed(1)}/${section.executabilityMax}\n`;
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

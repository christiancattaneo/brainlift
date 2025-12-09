'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainliftSection, SectionGrade, GradingResult, GradingStreamEvent, SECTIONS_CONFIG } from '@/types';
import { SectionCard, FinalSummary, ThinkingIndicator } from '@/components';
import { Brain, Link, ArrowRight, AlertCircle, Sparkles, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

type AppState = 'idle' | 'fetching' | 'grading' | 'complete' | 'error';
type InputMode = 'url' | 'paste';

interface SectionStatus {
  sectionId: string;
  sectionTitle: string;
  status: 'pending' | 'grading' | 'complete' | 'error';
  grade?: SectionGrade;
}

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [workflowyUrl, setWorkflowyUrl] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<BrainliftSection[]>([]);
  const [sectionStatuses, setSectionStatuses] = useState<SectionStatus[]>([]);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFetchAndGrade = useCallback(async () => {
    const input = inputMode === 'url' ? workflowyUrl.trim() : pastedContent.trim();
    
    if (!input) {
      setError(inputMode === 'url' 
        ? 'Please enter a Workflowy URL' 
        : 'Please paste your Brainlift content');
      return;
    }

    setError(null);
    setAppState('fetching');
    setGradingResult(null);

    try {
      // Fetch/parse data
      const fetchResponse = await fetch('/api/fetch-workflowy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          inputMode === 'url' 
            ? { url: workflowyUrl } 
            : { content: pastedContent }
        ),
      });

      const fetchData = await fetchResponse.json();

      if (!fetchResponse.ok) {
        // If URL fetch failed, suggest pasting content
        if (fetchData.suggestion === 'paste_content' && inputMode === 'url') {
          setError(fetchData.error);
          setInputMode('paste');
          setAppState('error');
          return;
        }
        throw new Error(fetchData.error || 'Failed to process content');
      }

      const fetchedSections: BrainliftSection[] = fetchData.sections;
      setSections(fetchedSections);

      // Initialize section statuses
      const initialStatuses: SectionStatus[] = SECTIONS_CONFIG
        .filter(config => fetchedSections.some(fs => fs.id === config.id))
        .map(config => ({
          sectionId: config.id,
          sectionTitle: config.title,
          status: 'pending' as const,
        }));

      setSectionStatuses(initialStatuses);
      setAppState('grading');

      // Start grading
      const gradeResponse = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: fetchedSections }),
      });

      if (!gradeResponse.ok) {
        throw new Error('Failed to start grading');
      }

      const reader = gradeResponse.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: GradingStreamEvent = JSON.parse(line.slice(6));

              switch (event.type) {
                case 'section_start':
                  setSectionStatuses(prev =>
                    prev.map(s =>
                      s.sectionId === event.sectionId
                        ? { ...s, status: 'grading' }
                        : s
                    )
                  );
                  break;

                case 'section_complete':
                  const grade = event.data as SectionGrade;
                  setSectionStatuses(prev =>
                    prev.map(s =>
                      s.sectionId === event.sectionId
                        ? { ...s, status: 'complete', grade }
                        : s
                    )
                  );
                  break;

                case 'final_summary':
                  const result = event.data as GradingResult;
                  setGradingResult(result);
                  setAppState('complete');
                  // Scroll to results
                  setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                  break;

                case 'error':
                  throw new Error(event.message || 'Grading error');
              }
            } catch (e) {
              console.error('Error parsing event:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAppState('error');
    }
  }, [workflowyUrl, pastedContent, inputMode]);

  const handleExportPDF = useCallback(() => {
    if (!gradingResult) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(28, 28, 255);
    pdf.text('Business Brainlift Grading Report', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Score
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Overall Score: ${gradingResult.totalScore}/${gradingResult.maxScore} (${gradingResult.percentage}%)`, 20, y);
    y += 10;

    // Status
    pdf.setFontSize(14);
    const statusColor = gradingResult.passed ? [0, 255, 163] : [255, 79, 0];
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.text(gradingResult.passed ? 'PASSED' : 'NEEDS WORK', 20, y);
    y += 15;

    // Analysis
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Overall Analysis:', 20, y);
    y += 7;
    pdf.setFontSize(10);
    const analysisLines = pdf.splitTextToSize(gradingResult.overallAnalysis, pageWidth - 40);
    pdf.text(analysisLines, 20, y);
    y += analysisLines.length * 5 + 10;

    // Recommendations
    if (gradingResult.topRecommendations.length > 0) {
      pdf.setFontSize(12);
      pdf.text('Top Recommendations:', 20, y);
      y += 7;
      pdf.setFontSize(10);
      gradingResult.topRecommendations.forEach((rec, i) => {
        const lines = pdf.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - 40);
        if (y + lines.length * 5 > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(lines, 20, y);
        y += lines.length * 5 + 3;
      });
    }

    // Sections
    y += 10;
    gradingResult.sections.forEach(section => {
      if (y > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(11);
      pdf.setTextColor(28, 28, 255);
      pdf.text(section.sectionTitle, 20, y);
      y += 6;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Score: ${section.totalScore}/${section.totalMax}`, 20, y);
      y += 5;
      const sectionAnalysis = pdf.splitTextToSize(section.analysis, pageWidth - 40);
      pdf.text(sectionAnalysis, 20, y);
      y += sectionAnalysis.length * 4 + 8;
    });

    pdf.save('brainlift-grading-report.pdf');
  }, [gradingResult]);

  const handleExportMarkdown = useCallback(() => {
    if (!gradingResult) return;

    let md = `# Business Brainlift Grading Report\n\n`;
    md += `**Date:** ${new Date(gradingResult.timestamp).toLocaleString()}\n\n`;
    md += `## Overall Score: ${gradingResult.totalScore}/${gradingResult.maxScore} (${gradingResult.percentage}%)\n\n`;
    md += `**Status:** ${gradingResult.passed ? '✅ PASSED' : '❌ NEEDS WORK'}\n\n`;

    md += `### Score Breakdown\n`;
    md += `- Thoroughness: ${gradingResult.sections.reduce((sum, s) => sum + s.thoroughnessScore, 0)}/30\n`;
    md += `- Viability: ${gradingResult.sections.reduce((sum, s) => sum + s.viabilityScore, 0)}/30\n`;
    md += `- Executability: ${gradingResult.sections.reduce((sum, s) => sum + s.executabilityScore, 0)}/40\n\n`;

    md += `## Overall Analysis\n${gradingResult.overallAnalysis}\n\n`;

    if (gradingResult.topRecommendations.length > 0) {
      md += `## Top Recommendations\n`;
      gradingResult.topRecommendations.forEach((rec, i) => {
        md += `${i + 1}. ${rec}\n`;
      });
      md += '\n';
    }

    md += `## Section Details\n\n`;
    gradingResult.sections.forEach(section => {
      md += `### ${section.sectionTitle}\n`;
      md += `**Score:** ${section.totalScore}/${section.totalMax}\n\n`;
      md += `**Analysis:** ${section.analysis}\n\n`;

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

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brainlift-grading-report.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [gradingResult]);

  const handleReset = () => {
    setWorkflowyUrl('');
    setPastedContent('');
    setAppState('idle');
    setError(null);
    setSections([]);
    setSectionStatuses([]);
    setGradingResult(null);
  };

  return (
    <main className="min-h-screen bg-structure-black relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-50" />
      <div className="fixed inset-0 bg-gradient-radial" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-alpha-blue/20 glow-blue">
              <Brain className="w-8 h-8 text-alpha-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-canvas-white">
              Business Brainlift
              <span className="text-alpha-blue"> Grader</span>
            </h1>
          </div>
          <p className="text-chrome-silver max-w-xl mx-auto">
            AI-powered evaluation of your business plan. Enter your Workflowy link or paste your content
            to get detailed feedback on viability, thoroughness, and executability.
          </p>
        </motion.header>

        {/* Input section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          {/* Input mode toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputMode('url')}
              disabled={appState === 'fetching' || appState === 'grading'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'url'
                  ? 'bg-alpha-blue text-canvas-white'
                  : 'bg-white/5 text-chrome-silver hover:bg-white/10'
              }`}
            >
              <Link className="w-4 h-4" />
              Workflowy URL
            </button>
            <button
              onClick={() => setInputMode('paste')}
              disabled={appState === 'fetching' || appState === 'grading'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'paste'
                  ? 'bg-alpha-blue text-canvas-white'
                  : 'bg-white/5 text-chrome-silver hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Content
            </button>
          </div>

          {/* URL Input */}
          {inputMode === 'url' && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-chrome-silver">
                  <Link className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={workflowyUrl}
                  onChange={(e) => setWorkflowyUrl(e.target.value)}
                  placeholder="https://workflowy.com/s/your-brainlift/..."
                  disabled={appState === 'fetching' || appState === 'grading'}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-canvas-white placeholder-chrome-silver/50 focus:outline-none focus:border-alpha-blue focus:ring-1 focus:ring-alpha-blue transition-all disabled:opacity-50"
                />
              </div>
              <button
                onClick={appState === 'complete' ? handleReset : handleFetchAndGrade}
                disabled={appState === 'fetching' || appState === 'grading'}
                className="px-6 py-4 bg-alpha-blue hover:bg-alpha-blue/80 disabled:bg-alpha-blue/50 text-canvas-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all glow-blue disabled:shadow-none"
              >
                {appState === 'idle' || appState === 'error' ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Grade Brainlift
                  </>
                ) : appState === 'fetching' ? (
                  <ThinkingIndicator message="Fetching..." />
                ) : appState === 'grading' ? (
                  <ThinkingIndicator message="Grading..." />
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Grade Another
                  </>
                )}
              </button>
            </div>
          )}

          {/* Paste Content Input */}
          {inputMode === 'paste' && (
            <div className="space-y-4">
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your Business Brainlift content here...

Copy all content from your Workflowy document and paste it here. Make sure to include section headers like:
- Strategic Vision
- Long-Term Vision
- Semester Targets
- 30-Day Gameplan
- Market and Competitive Analysis
- Product/Service Description
- Skills and Resources Needed
- Financial Projections
- Risks, Mitigation, and Contingencies
- Appendix"
                disabled={appState === 'fetching' || appState === 'grading'}
                className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-xl text-canvas-white placeholder-chrome-silver/50 focus:outline-none focus:border-alpha-blue focus:ring-1 focus:ring-alpha-blue transition-all disabled:opacity-50 resize-none font-mono text-sm"
              />
              <button
                onClick={appState === 'complete' ? handleReset : handleFetchAndGrade}
                disabled={appState === 'fetching' || appState === 'grading'}
                className="w-full px-6 py-4 bg-alpha-blue hover:bg-alpha-blue/80 disabled:bg-alpha-blue/50 text-canvas-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all glow-blue disabled:shadow-none"
              >
                {appState === 'idle' || appState === 'error' ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Grade Brainlift
                  </>
                ) : appState === 'fetching' ? (
                  <ThinkingIndicator message="Processing..." />
                ) : appState === 'grading' ? (
                  <ThinkingIndicator message="Grading..." />
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Grade Another
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-xl bg-international-orange/20 border border-international-orange/30 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-international-orange flex-shrink-0 mt-0.5" />
                <div className="text-sm text-international-orange">
                  <p>{error}</p>
                  {inputMode === 'url' && error.includes('paste') && (
                    <p className="mt-2 text-chrome-silver">
                      Tip: Switch to &quot;Paste Content&quot; mode and copy your content directly from Workflowy.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Grading progress */}
        <AnimatePresence>
          {(appState === 'grading' || appState === 'complete') && sectionStatuses.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 mb-8"
            >
              <h2 className="text-lg font-semibold text-canvas-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-alpha-blue animate-pulse" />
                Section Analysis
              </h2>
              {sectionStatuses.map((sectionStatus, index) => (
                <SectionCard
                  key={sectionStatus.sectionId}
                  sectionId={sectionStatus.sectionId}
                  sectionTitle={sectionStatus.sectionTitle}
                  grade={sectionStatus.grade}
                  status={sectionStatus.status}
                  index={index}
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Final summary */}
        <div ref={resultRef}>
          <AnimatePresence>
            {appState === 'complete' && gradingResult && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-canvas-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-volt-mint" />
                  Final Results
                </h2>
                <FinalSummary
                  result={gradingResult}
                  onExportPDF={handleExportPDF}
                  onExportMarkdown={handleExportMarkdown}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-chrome-silver/40">
          <p>Alpha Founders Academy • Business Brainlift Grader</p>
          <p className="mt-1">Pass threshold: 80% • Powered by Claude AI</p>
        </footer>
      </div>
    </main>
  );
}

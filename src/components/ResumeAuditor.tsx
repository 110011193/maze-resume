'use client';

import { useState } from 'react';
import styles from './ResumeAuditor.module.css';
import { Loader2, ArrowRight, FileText, Sparkles } from 'lucide-react';
import ResultsDisplay from './ResultsDisplay';

interface AuditResult {
  fluffCount: number;
  signalBoost: number;
  fluffWords: string[];
  cleanText: string;
}

export default function ResumeAuditor() {
  const [resumeText, setResumeText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  const handleAudit = async () => {
    if (!resumeText.trim()) return;
    setIsAuditing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to audit resume.');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className={styles.grid}>
      {/* ── Left Panel ── */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelLabel}>
            <FileText size={14} className={styles.panelIcon} />
            <span>Your Resume</span>
          </div>
          {wordCount > 0 && (
            <span className={styles.wordBadge}>{wordCount} words</span>
          )}
        </div>

        <div className={styles.panelBody}>
          <textarea
            id="resume-input"
            className={styles.textarea}
            placeholder={`Paste your resume here…\n\nExample:\n• Spearheaded a cutting-edge initiative to leverage cloud technologies and synergize cross-functional teams to streamline deployment pipelines.`}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isAuditing}
            spellCheck={false}
          />
        </div>

        <div className={styles.panelFooter}>
          {error && <p className={styles.error}>{error}</p>}
          <button
            id="audit-button"
            className={styles.auditBtn}
            onClick={handleAudit}
            disabled={isAuditing || !resumeText.trim()}
          >
            {isAuditing ? (
              <>
                <Loader2 size={14} className={styles.spin} />
                Auditing…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Audit Resume
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelLabel}>
            <Sparkles size={14} className={styles.panelIconPurple} />
            <span>Audited Output</span>
          </div>
          {result && <span className={styles.doneBadge}>✓ Complete</span>}
        </div>

        <div className={`${styles.panelBody} ${styles.outputBody}`}>
          {isAuditing && (
            <div className={styles.stateBox}>
              <div className={styles.spinnerWrapper}>
                <Loader2 size={24} className={styles.spin} />
              </div>
              <p className={styles.stateTitle}>Analyzing your resume…</p>
              <p className={styles.stateSubtitle}>Detecting buzzwords and generic phrases</p>
            </div>
          )}

          {!isAuditing && !result && (
            <div className={styles.stateBox}>
              <div className={styles.emptyIcon}>
                <FileText size={28} />
              </div>
              <p className={styles.stateTitle}>No output yet</p>
              <p className={styles.stateSubtitle}>
                Paste your resume on the left and click <strong>Audit Resume</strong> to begin.
              </p>
            </div>
          )}

          {result && (
            <div className={styles.fadeIn}>
              <ResultsDisplay
                fluffCount={result.fluffCount}
                signalBoost={result.signalBoost}
                fluffWords={result.fluffWords}
                cleanText={result.cleanText}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

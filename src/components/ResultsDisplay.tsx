'use client';

import { useState } from 'react';
import styles from './ResultsDisplay.module.css';
import { Copy, Check, Flame, TrendingUp, Hash } from 'lucide-react';

interface ResultsDisplayProps {
  fluffCount: number;
  signalBoost: number;
  fluffWords: string[];
  cleanText: string;
}

export default function ResultsDisplay({ fluffCount, signalBoost, fluffWords, cleanText }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{fluffCount}</span>
          <span className={styles.statLbl}>
            <Hash size={11} /> words removed
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={`${styles.statNum} ${styles.green}`}>+{signalBoost}%</span>
          <span className={styles.statLbl}>
            <TrendingUp size={11} /> signal boost
          </span>
        </div>
      </div>

      {/* Fluff tags */}
      {fluffWords.length > 0 && (
        <div className={styles.fluffSection}>
          <span className={styles.fluffLabel}>
            <Flame size={11} className={styles.flameIcon} /> Buzzwords removed
          </span>
          <div className={styles.tags}>
            {fluffWords.map((w, i) => (
              <span key={i} className={styles.tag}>{w}</span>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      <div className={styles.output}>
        <div className={styles.outputToolbar}>
          <span className={styles.outputTitle}>Cleaned Resume</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
          >
            {copied
              ? <><Check size={12} /> Copied!</>
              : <><Copy size={12} /> Copy text</>
            }
          </button>
        </div>
        <pre className={styles.pre}>{cleanText}</pre>
      </div>

    </div>
  );
}

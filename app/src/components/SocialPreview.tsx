import React from 'react';
import styles from './SocialPreview.module.css';

interface SocialPreviewProps {
  className?: string;
}

const SocialPreview: React.FC<SocialPreviewProps> = ({ className }) => {
  return (
    <div className={`${styles.socialPreview} ${className || ''}`}>
      <div className={styles.container}>
        {/* Header with game title */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/cinnamonroll_large.png" alt="Synonym Roll" className={styles.logo} />
            <h1 className={styles.title}>Synonym Roll</h1>
          </div>
          <p className={styles.subtitle}>A Daily Word Game</p>
        </div>

        {/* Game path visualization */}
        <div className={styles.gamePath}>
          <div className={styles.wordTile}>START</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.wordTile}>WORD</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.wordTile}>END</div>
        </div>

        {/* Description */}
        <div className={styles.description}>
          <p>Find paths between words using synonyms.</p>
          <p>Challenge your vocabulary and share your results!</p>
        </div>

        {/* Game stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>Steps</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2:30</span>
            <span className={styles.statLabel}>Time</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>85%</span>
            <span className={styles.statLabel}>Efficiency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPreview;

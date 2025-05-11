import React, { memo } from 'react';
import styles from './StatsDisplay.module.css';

interface StatsDisplayProps {
  stats: {
    elapsedTime: number;
    steps: number;
    winRate?: number;
    gamesPlayed?: number;
    currentStreak?: number;
    maxStreak?: number;
  };
  showDetailedStats?: boolean;
}

/**
 * StatsDisplay component for showing game statistics
 * 
 * This component displays game statistics such as time elapsed, steps taken,
 * win rate, games played, and streaks in a vertical list layout similar to 
 * the existing game implementation.
 */
export const StatsDisplay: React.FC<StatsDisplayProps> = memo(({
  stats,
  showDetailedStats = false
}) => {
  const { 
    elapsedTime, 
    steps, 
    winRate, 
    gamesPlayed, 
    currentStreak, 
    maxStreak 
  } = stats;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format win rate as percentage
  const formatWinRate = (rate: number): string => {
    return `${Math.round(rate * 100)}%`;
  };

  return (
    <div 
      className={styles['stats-display']} 
      data-testid="stats-display"
      role="region" 
      aria-label="Game statistics"
    >
      <div className={styles['stats-display__grid']}>
        {/* Basic stats - always shown */}
        <div className={styles['stats-display__item']}>
          <div 
            className={styles['stats-display__value']} 
            aria-label={`Time: ${formatTime(elapsedTime)}`}
          >
            {formatTime(elapsedTime)}
          </div>
          <div className={styles['stats-display__label']}>Time</div>
        </div>

        <div className={styles['stats-display__item']}>
          <div 
            className={styles['stats-display__value']} 
            aria-label={`Steps: ${steps}`}
          >
            {steps}
          </div>
          <div className={styles['stats-display__label']}>Steps</div>
        </div>

        {/* Detailed stats - shown conditionally */}
        {showDetailedStats && winRate !== undefined && (
          <div className={styles['stats-display__item']}>
            <div 
              className={styles['stats-display__value']} 
              aria-label={`Win Rate: ${formatWinRate(winRate)}`}
            >
              {formatWinRate(winRate)}
            </div>
            <div className={styles['stats-display__label']}>Win Rate</div>
          </div>
        )}

        {showDetailedStats && gamesPlayed !== undefined && (
          <div className={styles['stats-display__item']}>
            <div 
              className={styles['stats-display__value']} 
              aria-label={`Games Played: ${gamesPlayed}`}
            >
              {gamesPlayed}
            </div>
            <div className={styles['stats-display__label']}>Played</div>
          </div>
        )}

        {showDetailedStats && currentStreak !== undefined && (
          <div className={styles['stats-display__item']}>
            <div 
              className={styles['stats-display__value']} 
              aria-label={`Current Streak: ${currentStreak}`}
            >
              {currentStreak}
            </div>
            <div className={styles['stats-display__label']}>Streak</div>
          </div>
        )}

        {showDetailedStats && maxStreak !== undefined && (
          <div className={styles['stats-display__item']}>
            <div 
              className={styles['stats-display__value']} 
              aria-label={`Maximum Streak: ${maxStreak}`}
            >
              {maxStreak}
            </div>
            <div className={styles['stats-display__label']}>Best</div>
          </div>
        )}
      </div>
    </div>
  );
});

export default StatsDisplay;

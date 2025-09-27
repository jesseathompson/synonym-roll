import React, { memo } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { WordTile } from '../../../common/WordTile';
import styles from './CompletedState.module.css';

export interface CompletedStateProps {
  startWord: string;
  endWord: string;
  steps: string[];
  elapsedTime: number;
  onShare?: () => void;
  stats?: {
    winRate?: number;
    gamesPlayed?: number;
    streak?: number;
    maxStreak?: number;
  };
}

/**
 * CompletedState component displays the completed game state
 * including the path from start to end word and game statistics
 */
export const CompletedState: React.FC<CompletedStateProps> = memo(({
  startWord,
  endWord,
  steps,
  elapsedTime,
  onShare,
  stats
}) => {
  // Filter out any duplicated words in the path
  const uniqueSteps = steps.filter((word, index) => steps.indexOf(word) === index);
  
  // Format the time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles['completed-state']} role="region" aria-label="Game completed">
      <h4 className={styles['completed-state__title']}>
        You completed the puzzle in {formatTime(elapsedTime)} and{' '}
        {uniqueSteps.length - 1} steps:
      </h4>

      <div className={styles['completed-state__path']}>
        {/* Display the path of words from start to end */}
        {uniqueSteps.map((word, index) => {
          const isFirst = index === 0;
          const isLast = index === uniqueSteps.length - 1;
          const variant = isFirst ? 'start' : isLast ? 'end' : 'step';
          
          return (
            <React.Fragment key={`${word}-${index}`}>
              <WordTile 
                word={word} 
                variant={variant}
                size="md"
              />
              {!isLast && (
                <span 
                  className={styles['completed-state__arrow']}
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Stats display */}
      <div className={styles['completed-state__stats']}>
        <div className={styles['completed-state__basic-stats']}>
          <div className={styles['completed-state__stat-item']}>
            <span className={styles['completed-state__stat-value']}>
              {formatTime(elapsedTime)}
            </span>
            <span className={styles['completed-state__stat-label']}>Time</span>
          </div>
          <div className={styles['completed-state__stat-item']}>
            <span className={styles['completed-state__stat-value']}>
              {uniqueSteps.length - 1}
            </span>
            <span className={styles['completed-state__stat-label']}>Steps</span>
          </div>
          {stats && (
            <>
              <div className={styles['completed-state__stat-item']}>
                <span className={styles['completed-state__stat-value']}>
                  {Math.round((stats.winRate || 0) * 100)}%
                </span>
                <span className={styles['completed-state__stat-label']}>Win Rate</span>
              </div>
              <div className={styles['completed-state__stat-item']}>
                <span className={styles['completed-state__stat-value']}>
                  {stats.streak || 0}
                </span>
                <span className={styles['completed-state__stat-label']}>Streak</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Share button (only displayed if onShare is provided) */}
      {onShare && (
        <div className={styles['completed-state__actions']}>
          <Button
            variant="primary"
            className={styles['completed-state__share-button']}
            onClick={onShare}
            aria-label="Share your game result"
          >
            <FontAwesomeIcon icon={faShare} className={styles['completed-state__share-icon']} />
            Share Result
          </Button>
        </div>
      )}
    </div>
  );
});

export default CompletedState;

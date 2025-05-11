import React, { memo } from 'react';
import styles from './GameControls.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShare, faRedo } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

interface GameControlsProps {
  onGoBack?: () => void;
  onShare?: () => void;
  onReset?: () => void;
  showBackButton?: boolean;
  showShareButton?: boolean;
  showResetButton?: boolean;
  isCompleted?: boolean;
}

/**
 * GameControls component for providing game control buttons
 * 
 * This component displays action buttons for game navigation and interactions,
 * such as going back, sharing results, or resetting the game.
 * 
 * It's wrapped in React.memo for performance optimization.
 */
export const GameControls: React.FC<GameControlsProps> = memo(({
  onGoBack,
  onShare,
  onReset,
  showBackButton = true,
  showShareButton = false,
  showResetButton = false,
  isCompleted = false,
}) => {
  return (
    <div className={styles['game-controls']} data-testid="game-controls">
      <div className={styles['game-controls__buttons']}>
        {showBackButton && onGoBack && (
          <Button
            variant="primary"
            className={`${styles['game-controls__button']} ${styles['game-controls__button--back']}`}
            onClick={onGoBack}
            aria-label="Go back to previous step"
          >
            <FontAwesomeIcon icon={faArrowLeft} className={styles['game-controls__icon']} />
            <span>Go Back</span>
          </Button>
        )}

        {showShareButton && onShare && isCompleted && (
          <Button
            variant="primary"
            className={`${styles['game-controls__button']} ${styles['game-controls__button--share']}`}
            onClick={onShare}
            aria-label="Share your game result"
          >
            <FontAwesomeIcon icon={faShare} className={styles['game-controls__icon']} />
            <span>Share Result</span>
          </Button>
        )}

        {showResetButton && onReset && (
          <Button
            variant="secondary"
            className={`${styles['game-controls__button']} ${styles['game-controls__button--reset']}`}
            onClick={onReset}
            aria-label="Reset the game"
          >
            <FontAwesomeIcon icon={faRedo} className={styles['game-controls__icon']} />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
});

export default GameControls;

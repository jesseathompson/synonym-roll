import React from 'react';
import styles from './GameTimer.module.css';

export interface GameTimerProps {
  time: number;
  label?: string;
  className?: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ 
  time, 
  label = 'Time Elapsed', 
  className = ''
}) => {
  // Format time as MM:SS
  const formatTime = (): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`${styles['game-timer']} ${className}`} 
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles['game-timer__container']}>
        {label && (
          <span className={styles['game-timer__label']}>
            {label}:
          </span>
        )}
        <span className={styles['game-timer__time']} aria-label={`${formatTime()} minutes and seconds`}>
          {formatTime()}
        </span>
      </div>
    </div>
  );
};

export default GameTimer;

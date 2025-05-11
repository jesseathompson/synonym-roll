import React, { memo } from 'react';
import { Card } from 'react-bootstrap';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isCompleted?: boolean;
}

/**
 * GameBoard component provides layout and structure for the game area
 * 
 * This component serves as the main container for game-related UI components,
 * with optional title display and support for different game states.
 */
export const GameBoard: React.FC<GameBoardProps> = memo(({
  children,
  title,
  className = '',
  isCompleted = false
}) => {
  return (
    <Card 
      className={`${styles['game-board']} ${isCompleted ? styles['game-board--completed'] : ''} ${className}`}
    >
      <Card.Body>
        {title && (
          <div className={styles['game-board__title']}>
            {title}
          </div>
        )}
        
        <div 
          className={`${styles['game-board__content']} ${isCompleted ? styles['game-board__content--completed'] : ''}`}
          role="region"
          aria-label={isCompleted ? 'Completed game area' : 'Game play area'}
        >
          {children}
        </div>
      </Card.Body>
    </Card>
  );
});

export default GameBoard;

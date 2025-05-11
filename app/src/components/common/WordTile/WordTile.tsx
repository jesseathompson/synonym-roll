import React from 'react';
import styles from './WordTile.module.css';

export interface WordTileProps {
  word: string;
  variant: 'start' | 'step' | 'end' | 'neutral';
  onClick?: () => void;
}

export const WordTile: React.FC<WordTileProps> = ({ 
  word, 
  variant, 
  onClick 
}) => {
  // Determine base class name for BEM methodology
  const baseClassName = styles['word-tile'];
  const variantClassName = styles[`word-tile--${variant}`];

  return (
    <div 
      className={`${baseClassName} ${variantClassName}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Select word: ${word}` : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {word}
    </div>
  );
};

export default WordTile;

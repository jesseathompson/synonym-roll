import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faShare } from '@fortawesome/free-solid-svg-icons';
import { generateEnhancedShareText } from '../utils/shareUtils';
import { WordGraph } from '../utils/wordGraph';
import styles from './ShareModal.module.css';

export interface ShareModalProps {
  show: boolean;
  onHide: () => void;
  dayNumber: number;
  startWord: string;
  endWord: string;
  steps: string[];
  elapsedTime: number;
  totalMoves: number;
  minSteps: number;
  streak: number;
  winRate: number;
  gamesPlayed: number;
  maxStreak: number;
}

/**
 * ShareModal component displays game results in a shareable format
 * Similar to Wordle's share functionality with copy-to-clipboard
 */
export const ShareModal: React.FC<ShareModalProps> = ({
  show,
  onHide,
  dayNumber,
  startWord,
  endWord,
  steps,
  elapsedTime,
  totalMoves,
  minSteps,
  streak,
  winRate,
  gamesPlayed,
  maxStreak,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate the share text
  const shareText = generateEnhancedShareText({
    dayNumber,
    startWord,
    endWord,
    steps,
    elapsedTime,
    totalMoves,
    minSteps,
    streak,
    winRate,
    gamesPlayed,
    maxStreak,
  });

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate path visualization with hot/cold colors
  const generatePathVisualization = () => {
    const wordGraph = new WordGraph();
    const pathLength = steps.length - 1;
    const circles = [];
    
    // Start circle with temperature color
    const startTemp = wordGraph.getTemperatureCategory(startWord, endWord);
    circles.push(getTemperatureEmoji(startTemp));
    
    // Intermediate circles with temperature colors
    for (let i = 1; i < pathLength; i++) {
      const stepTemp = wordGraph.getTemperatureCategory(steps[i - 1], endWord);
      circles.push(getTemperatureEmoji(stepTemp));
    }
    
    // End circle (always hot since it's the target)
    circles.push('🔥');
    
    return circles.join(' ');
  };

  // Get emoji for temperature category
  const getTemperatureEmoji = (temperature: 'hot' | 'warm' | 'cool' | 'cold'): string => {
    switch (temperature) {
      case 'hot': return '🔥';
      case 'warm': return '🟠';
      case 'cool': return '🔵';
      case 'cold': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faShare} className="me-2" />
          Share Your Results
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles['share-modal__content']}>
          {/* Game Results Summary */}
          <div className={styles['share-modal__summary']}>
            <h5 className={styles['share-modal__title']}>
              🧩 Synonym Roll #{dayNumber}
            </h5>
            
            <div className={styles['share-modal__path']}>
              <div className={styles['share-modal__path-label']}>Word Path:</div>
              <div className={styles['share-modal__path-visual']}>
                {generatePathVisualization()}
              </div>
              <div className={styles['share-modal__path-info']}>
                {startWord} → {endWord} ({steps.length - 1} steps)
              </div>
            </div>

            <div className={styles['share-modal__stats']}>
              <div className={styles['share-modal__stat-row']}>
                <span className={styles['share-modal__stat-label']}>⏱️ Time:</span>
                <span className={styles['share-modal__stat-value']}>{formatTime(elapsedTime)}</span>
              </div>
              <div className={styles['share-modal__stat-row']}>
                <span className={styles['share-modal__stat-label']}>👣 Steps:</span>
                <span className={styles['share-modal__stat-value']}>
                  {steps.length - 1}{steps.length - 1 === minSteps ? ' ⭐' : ''}
                </span>
              </div>
              <div className={styles['share-modal__stat-row']}>
                <span className={styles['share-modal__stat-label']}>🎮 Total Moves:</span>
                <span className={styles['share-modal__stat-value']}>{totalMoves}</span>
              </div>
              <div className={styles['share-modal__stat-row']}>
                <span className={styles['share-modal__stat-label']}>📈 Efficiency:</span>
                <span className={styles['share-modal__stat-value']}>
                  {totalMoves > 0 ? Math.round(((steps.length - 1) / totalMoves) * 100) : 100}%
                </span>
              </div>
            </div>
          </div>

          {/* Share Text Preview */}
          <div className={styles['share-modal__preview']}>
            <h6 className={styles['share-modal__preview-title']}>Share Text:</h6>
            <div className={styles['share-modal__preview-content']}>
              <pre className={styles['share-modal__preview-text']}>{shareText}</pre>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCopy}
          className={styles['share-modal__copy-button']}
        >
          <FontAwesomeIcon 
            icon={copied ? faCheck : faCopy} 
            className="me-2" 
          />
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;

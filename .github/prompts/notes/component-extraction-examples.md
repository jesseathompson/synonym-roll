# Component Extraction Examples

This document provides concrete examples of how to extract components from the existing Play.tsx file to create a more modular and maintainable codebase.

## Original Play.tsx Structure

The current Play.tsx file combines:
- Game state management
- Timer logic
- UI rendering for the game board
- Synonym selection
- Game completion handling
- Result sharing

## Example 1: Extracting WordTile Component

### Before: In Play.tsx
```tsx
<div className="start-word">{puzzle.start}</div>
<span className="step-word">{word}</span>
<div className="end-word">{puzzle.end}</div>
```

### After: New WordTile Component
```tsx
// src/components/common/WordTile/WordTile.tsx
import React from 'react';
import styles from './WordTile.module.css';

interface WordTileProps {
  word: string;
  variant: 'start' | 'step' | 'end';
  onClick?: () => void;
}

export const WordTile: React.FC<WordTileProps> = ({ word, variant, onClick }) => {
  return (
    <div 
      className={styles[`wordTile--${variant}`]} 
      onClick={onClick}
    >
      {word}
    </div>
  );
};
```

```css
/* src/components/common/WordTile/WordTile.module.css */
.wordTile {
  padding: 0.5rem;
  font-family: var(--font-game);
  font-weight: 600;
}

.wordTile--start {
  composes: wordTile;
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--text-shadow);
  font-size: 1.5rem;
}

.wordTile--step {
  composes: wordTile;
  text-shadow: 1px 1px 3px var(--text-shadow);
  font-size: 1.25rem;
}

.wordTile--end {
  composes: wordTile;
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--text-shadow);
  font-size: 1.5rem;
}
```

### Using the WordTile Component
```tsx
// In Play.tsx or another component
import { WordTile } from '../components/common/WordTile/WordTile';

// ...

<WordTile word={puzzle.start} variant="start" />
{steps.map((word, index) => {
  if (index === 0) return null;
  return (
    <WordTile 
      key={index}
      word={word} 
      variant="step" 
    />
  );
})}
<WordTile word={puzzle.end} variant="end" />
```

## Example 2: Extracting SynonymList Component

### Before: In Play.tsx
```tsx
<div className="syn-words">
  {currentSynonyms?.sort().map((synonym, index) => (
    <Button
      key={index}
      className="btn-game"
      value={synonym}
      onClick={(e) => addStep(e)}
    >
      {synonym}
    </Button>
  ))}
</div>
```

### After: New SynonymList Component
```tsx
// src/components/features/game/SynonymList/SynonymList.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './SynonymList.module.css';

interface SynonymListProps {
  synonyms: string[];
  onSelect: (word: string) => void;
}

export const SynonymList: React.FC<SynonymListProps> = ({ synonyms, onSelect }) => {
  const sortedSynonyms = [...synonyms].sort();
  
  return (
    <div className={styles.synonymList}>
      {sortedSynonyms.map((synonym, index) => (
        <Button
          key={index}
          className="btn-game"
          onClick={() => onSelect(synonym)}
        >
          {synonym}
        </Button>
      ))}
    </div>
  );
};
```

```css
/* src/components/features/game/SynonymList/SynonymList.module.css */
.synonymList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
}

@media (max-width: 768px) {
  .synonymList {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
```

### Using the SynonymList Component
```tsx
// In Play.tsx
import { SynonymList } from '../components/features/game/SynonymList/SynonymList';

// ...

const handleSynonymSelect = (word: string) => {
  const synonyms = wordGraph.getSynonyms(word, puzzle.end) || [];
  setSteps((steps) => [...steps, word]);
  setCurrentSynonyms(synonyms);
  
  if (word === puzzle.end) {
    handleComplete();
  }
};

// ...

<SynonymList 
  synonyms={currentSynonyms} 
  onSelect={handleSynonymSelect} 
/>
```

## Example 3: Extracting GameTimer Component

### Before: In Play.tsx
```tsx
const [elapsedTime, setElapsedTime] = useState(0);
const [hasGameStarted, setHasGameStarted] = useState(false);
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);

const startTimer = () => {
  if (!hasGameStarted) {
    setHasGameStarted(true);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }
};

// ...

<div className="timer">
  <h4>
    Time Elapsed: {Math.floor(elapsedTime / 60)}:
    {(elapsedTime % 60).toString().padStart(2, "0")}
  </h4>
</div>
```

### After: New GameTimer Component and Hook
```tsx
// src/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialValue = 0) => {
  const [time, setTime] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const reset = () => {
    stop();
    setTime(initialValue);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
    formatTime
  };
};
```

```tsx
// src/components/features/game/GameTimer/GameTimer.tsx
import React from 'react';
import styles from './GameTimer.module.css';

interface GameTimerProps {
  time: number;
  label?: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ time, label = 'Time Elapsed' }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={styles.gameTimer}>
      <h4>
        {label}: {formattedTime}
      </h4>
    </div>
  );
};
```

```css
/* src/components/features/game/GameTimer/GameTimer.module.css */
.gameTimer {
  margin-bottom: var(--spacing-md);
  font-family: var(--font-game);
}
```

### Using the Timer Hook and Component
```tsx
// In Play.tsx
import { useTimer } from '../hooks/useTimer';
import { GameTimer } from '../components/features/game/GameTimer/GameTimer';

// ...

const { time, isRunning, start, stop, formatTime } = useTimer();

const handleSynonymSelect = (word: string) => {
  if (!isRunning) {
    start();
  }
  
  // Rest of the function...
};

const handleComplete = () => {
  stop();
  // Rest of the completion logic...
};

// ...

<GameTimer time={time} />
```

## Example 4: Creating a GameBoard Container Component

```tsx
// src/components/features/game/GameBoard/GameBoard.tsx
import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  children: React.ReactNode;
  title?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ children, title }) => {
  return (
    <Card className={styles.gameBoard}>
      <Card.Body>
        {title && <div className={styles.gameBoard__title}>{title}</div>}
        <div className={styles.gameBoard__content}>
          {children}
        </div>
      </Card.Body>
    </Card>
  );
};
```

```css
/* src/components/features/game/GameBoard/GameBoard.module.css */
.gameBoard {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  background-color: var(--bg-light);
  text-align: center;
  min-height: 60vh;
}

.gameBoard__title {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.gameBoard__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
```

### Using the GameBoard Component
```tsx
// In Play.tsx
import { GameBoard } from '../components/features/game/GameBoard/GameBoard';

// ...

<Container fluid className="py-3">
  <Row className="justify-content-center">
    <Col xs={12} md={10} lg={8}>
      <GameBoard title={`Daily Puzzle #${puzzleNumber}`}>
        {/* Game content here */}
      </GameBoard>
    </Col>
  </Row>
</Container>
```

By implementing these component extractions, you will achieve:
1. Better separation of concerns
2. More reusable components
3. Component-scoped CSS
4. Improved maintainability
5. Easier testing

These examples should provide a clear path forward for refactoring the application to meet the code quality standards defined in the instructions.

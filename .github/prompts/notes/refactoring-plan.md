# Synonym Roll Refactoring Plan

This document provides a step-by-step plan for implementing the recommendations from the code review to align the codebase with the defined coding standards.

## Phase 1: Component Structure Refactoring

### Step 1: Extract UI Components from Play.tsx
1. Create a `WordTile` component
   ```tsx
   // src/components/common/WordTile/WordTile.tsx
   import React from 'react';
   import styles from './WordTile.module.css';

   interface WordTileProps {
     word: string;
     status: 'current' | 'target' | 'step';
     onClick?: () => void;
   }

   export const WordTile: React.FC<WordTileProps> = ({ word, status, onClick }) => {
     return (
       <div 
         className={`${styles.wordTile} ${styles[`wordTile--${status}`]}`}
         onClick={onClick}
       >
         {word}
       </div>
     );
   };
   ```

2. Create a `SynonymList` component
   ```tsx
   // src/components/features/game/SynonymList/SynonymList.tsx
   import React from 'react';
   import { Button } from 'react-bootstrap';
   import styles from './SynonymList.module.css';

   interface SynonymListProps {
     synonyms: string[];
     onSynonymSelect: (word: string) => void;
   }

   export const SynonymList: React.FC<SynonymListProps> = ({ 
     synonyms, 
     onSynonymSelect 
   }) => {
     return (
       <div className={styles.synonymList}>
         {synonyms.map((synonym, index) => (
           <Button
             key={index}
             className="btn-game"
             value={synonym}
             onClick={() => onSynonymSelect(synonym)}
           >
             {synonym}
           </Button>
         ))}
       </div>
     );
   };
   ```

3. Create a `GameControls` component
   ```tsx
   // src/components/features/game/GameControls/GameControls.tsx
   import React from 'react';
   import { Button } from 'react-bootstrap';
   import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
   import { faArrowLeft, faShare } from "@fortawesome/free-solid-svg-icons";
   import styles from './GameControls.module.css';

   interface GameControlsProps {
     onGoBack: () => void;
     onShare?: () => void;
     canGoBack: boolean;
     hasCompleted: boolean;
   }

   export const GameControls: React.FC<GameControlsProps> = ({ 
     onGoBack, 
     onShare, 
     canGoBack, 
     hasCompleted 
   }) => {
     return (
       <div className={styles.gameControls}>
         {canGoBack && (
           <Button
             variant="primary"
             className="btn-game"
             onClick={onGoBack}
           >
             <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
             Go Back
           </Button>
         )}
         {hasCompleted && onShare && (
           <Button
             variant="primary"
             className="btn-game"
             onClick={onShare}
           >
             <FontAwesomeIcon icon={faShare} className="me-2" />
             Share Result
           </Button>
         )}
       </div>
     );
   };
   ```

### Step 2: Create Layout Components
1. Create a `GameContainer` component
   ```tsx
   // src/components/layout/GameContainer/GameContainer.tsx
   import React from 'react';
   import { Card } from 'react-bootstrap';
   import styles from './GameContainer.module.css';

   interface GameContainerProps {
     children: React.ReactNode;
     title?: string;
   }

   export const GameContainer: React.FC<GameContainerProps> = ({ 
     children, 
     title 
   }) => {
     return (
       <Card className={`game-container text-center ${styles.gameContainer}`}>
         <Card.Body>
           {title && <div className="stats-display mb-2">{title}</div>}
           {children}
         </Card.Body>
       </Card>
     );
   };
   ```

## Phase 2: CSS Modules Implementation

### Step 1: Create CSS Module Files
1. Create CSS module for WordTile
   ```css
   /* src/components/common/WordTile/WordTile.module.css */
   .wordTile {
     padding: 0.5rem 1rem;
     border-radius: 8px;
     margin: 0.25rem;
     font-weight: 600;
     transition: transform 0.2s;
   }

   .wordTile--current {
     text-transform: uppercase;
     text-shadow: 2px 2px 6px var(--text-shadow);
     font-size: larger;
   }

   .wordTile--target {
     text-transform: uppercase;
     text-shadow: 2px 2px 6px var(--text-shadow);
     font-size: larger;
   }

   .wordTile--step {
     text-shadow: 1px 1px 3px var(--text-shadow);
   }
   ```

2. Create CSS module for SynonymList
   ```css
   /* src/components/features/game/SynonymList/SynonymList.module.css */
   .synonymList {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
     gap: 0.5rem;
     margin: 1rem 0;
   }

   @media (max-width: 768px) {
     .synonymList {
       grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
     }
   }
   ```

3. Create CSS module for GameControls
   ```css
   /* src/components/features/game/GameControls/GameControls.module.css */
   .gameControls {
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem;
     justify-content: center;
     margin-top: 1rem;
   }

   .gameControl {
     min-width: 100px;
   }
   ```

### Step 2: Update Global CSS Variables
1. Update CSS variables in global.css
   ```css
   :root {
     /* Colors */
     --primary-color: #411f07;
     --text-primary: #411f07;
     --text-secondary: #c19a6b;
     --text-shadow: #c19a6b;
     --bg-light: #fefdf8;
     --bg-dark: #411f07;
     --bs-body-color: #411f07;
     
     /* Typography */
     --font-game: "Outfit", sans-serif;
     --font-size-sm: 0.875rem;
     --font-size-md: 1rem;
     --font-size-lg: 1.25rem;
     --font-size-xl: 1.5rem;
     
     /* Spacing */
     --spacing-xs: 0.25rem;
     --spacing-sm: 0.5rem;
     --spacing-md: 1rem;
     --spacing-lg: 2rem;
     --spacing-xl: 3rem;
     
     /* Effects */
     --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
     --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
     --border-radius-sm: 8px;
     --border-radius-md: 12px;
   }
   ```

## Phase 3: State Management Improvements

### Step 1: Create Game State Reducer
1. Create a game reducer
   ```tsx
   // src/reducers/gameReducer.ts
   import { GameState } from '../types/GameState';

   type GameAction =
     | { type: 'ADD_STEP'; payload: string }
     | { type: 'REMOVE_STEP' }
     | { type: 'COMPLETE_GAME' }
     | { type: 'UPDATE_ELAPSED_TIME'; payload: number }
     | { type: 'RESET_GAME'; payload: { start: string; end: string } };

   export const gameReducer = (state: GamePlayState, action: GameAction): GamePlayState => {
     switch (action.type) {
       case 'ADD_STEP':
         const newSteps = [...state.steps, action.payload];
         return {
           ...state,
           steps: newSteps,
           isCompleted: action.payload === state.targetWord,
           currentWord: action.payload
         };
       
       case 'REMOVE_STEP':
         if (state.steps.length <= 1) return state;
         const updatedSteps = state.steps.slice(0, -1);
         return {
           ...state,
           steps: updatedSteps,
           currentWord: updatedSteps[updatedSteps.length - 1]
         };
       
       case 'COMPLETE_GAME':
         return {
           ...state,
           isCompleted: true
         };
       
       case 'UPDATE_ELAPSED_TIME':
         return {
           ...state,
           elapsedTime: action.payload
         };
       
       case 'RESET_GAME':
         return {
           steps: [action.payload.start],
           currentWord: action.payload.start,
           targetWord: action.payload.end,
           isCompleted: false,
           elapsedTime: 0
         };
       
       default:
         return state;
     }
   };
   ```

2. Create a custom hook for game state
   ```tsx
   // src/hooks/useGamePlayState.ts
   import { useReducer, useEffect, useRef } from 'react';
   import { gameReducer } from '../reducers/gameReducer';

   interface UseGamePlayStateProps {
     startWord: string;
     endWord: string;
   }

   export interface GamePlayState {
     steps: string[];
     currentWord: string;
     targetWord: string;
     isCompleted: boolean;
     elapsedTime: number;
   }

   export const useGamePlayState = ({ startWord, endWord }: UseGamePlayStateProps) => {
     const [state, dispatch] = useReducer(gameReducer, {
       steps: [startWord],
       currentWord: startWord,
       targetWord: endWord,
       isCompleted: false,
       elapsedTime: 0
     });
     
     const timerRef = useRef<NodeJS.Timeout | null>(null);
     const hasStarted = useRef<boolean>(false);

     useEffect(() => {
       return () => {
         if (timerRef.current) {
           clearInterval(timerRef.current);
         }
       };
     }, []);

     const startTimer = () => {
       if (!hasStarted.current) {
         hasStarted.current = true;
         timerRef.current = setInterval(() => {
           dispatch({ 
             type: 'UPDATE_ELAPSED_TIME', 
             payload: state.elapsedTime + 1 
           });
         }, 1000);
       }
     };

     const addStep = (word: string) => {
       startTimer();
       dispatch({ type: 'ADD_STEP', payload: word });
     };

     const removeStep = () => {
       dispatch({ type: 'REMOVE_STEP' });
     };

     const completeGame = () => {
       if (timerRef.current) {
         clearInterval(timerRef.current);
       }
       dispatch({ type: 'COMPLETE_GAME' });
     };

     const resetGame = () => {
       if (timerRef.current) {
         clearInterval(timerRef.current);
       }
       hasStarted.current = false;
       dispatch({ 
         type: 'RESET_GAME', 
         payload: { start: startWord, end: endWord } 
       });
     };

     return {
       ...state,
       addStep,
       removeStep,
       completeGame,
       resetGame
     };
   };
   ```

## Phase 4: Performance Optimizations

### Step 1: Add Memoization
1. Memoize expensive calculations
   ```tsx
   // Example in component using wordGraph
   const getSynonyms = useCallback((word: string) => {
     return wordGraph.getSynonyms(word, targetWord);
   }, [targetWord]);

   const currentSynonyms = useMemo(() => {
     return getSynonyms(currentWord) || [];
   }, [getSynonyms, currentWord]);
   ```

2. Memoize components
   ```tsx
   // For SynonymList component
   export const SynonymList = memo(({ synonyms, onSynonymSelect }: SynonymListProps) => {
     // Component implementation
   });
   ```

## Phase 5: TypeScript Enhancements

1. Add utility types
   ```tsx
   // src/types/utilityTypes.ts
   export type WordStatus = 'current' | 'target' | 'step' | 'neutral';

   export interface GameStats {
     gamesPlayed: number;
     winRate: number;
     currentStreak: number;
     maxStreak: number;
     bestTime?: number;
   }
   ```

2. Improve function parameter typing
   ```tsx
   // Example
   const handleSynonymSelect = (word: string): void => {
     addStep(word);
     if (word === targetWord) {
       completeGame();
     }
   };
   ```

## Implementation Schedule

1. **Week 1:** Component Structure Refactoring
   - Extract UI components from Play.tsx
   - Create layout components
   - Update imports and usage

2. **Week 2:** CSS Modules Implementation
   - Create CSS module files
   - Update global CSS variables
   - Apply consistent BEM naming

3. **Week 3:** State Management Improvements
   - Create game reducer
   - Implement custom hook
   - Update components to use new state management

4. **Week 4:** Performance & TypeScript Enhancements
   - Add memoization for expensive calculations
   - Improve TypeScript usage
   - Final testing and bug fixes

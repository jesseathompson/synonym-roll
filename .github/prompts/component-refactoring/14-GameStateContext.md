# GameStateContext Refactoring

## Objective
Refactor the existing `GameStateContext` to follow best practices for React context and improve its structure and type safety.

## Component Details

### Location
`src/context/GameStateContext.tsx`

### Interface
```tsx
interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGameState: () => void;
  updateSettings: (updates: Partial<GameState['settings']>) => void;
}

function useGameState(): GameStateContextType;
```

### Functionality
- Provide game state to the entire application
- Store and retrieve state from localStorage
- Update game state (wins, streaks, etc.)
- Reset game state
- Update game settings
- Track game statistics

### Current Implementation
```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, DEFAULT_GAME_STATE } from '../types/GameState';

interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGameState: () => void;
  updateSettings: (updates: Partial<GameState['settings']>) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

const STORAGE_KEY = 'gameState';

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_GAME_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(current => ({
      ...current,
      ...updates,
    }));
  };

  const resetGameState = () => {
    const now = new Date();
    setGameState({
      ...DEFAULT_GAME_STATE,
      lastPlayed: now.toISOString(),
      streak: 1,
    });
  };

  const updateSettings = (updates: Partial<GameState['settings']>) => {
    setGameState(current => ({
      ...current,
      settings: {
        ...current.settings,
        ...updates,
      },
    }));
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState, resetGameState, updateSettings }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
```

## Enhanced Features to Add
1. Use a reducer to manage state instead of multiple update functions
2. Add migration strategy for handling state shape changes
3. Improve error handling for localStorage
4. Add functions for common game state updates (incrementWin, updateStreak, etc.)
5. Add TypeScript type guards for state validation

## Testing Requirements
Write tests that verify:
- Context initialization works correctly
- State updates work properly
- Local storage persistence functions correctly
- Reset functionality works as expected
- Error handling works correctly

## Important Notes
- Focus ONLY on refactoring this context
- Ensure backward compatibility with existing usages
- Consider performance implications for frequent updates
- Ensure the context is properly typed
- Add proper error handling for localStorage access

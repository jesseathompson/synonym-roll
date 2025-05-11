# GamePlayState Hook Refactoring

## Objective
Create a custom `useGamePlayState` hook that manages game state and logic, using a reducer pattern for improved state management.

## Component Details

### Location
`src/hooks/useGamePlayState.ts`
`src/reducers/gameReducer.ts`

### Interface
```tsx
// Game Reducer Types
export type GameAction =
  | { type: 'ADD_STEP'; payload: string }
  | { type: 'REMOVE_STEP' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'UPDATE_ELAPSED_TIME'; payload: number }
  | { type: 'RESET_GAME'; payload: { start: string; end: string } };

export interface GamePlayState {
  steps: string[];
  currentWord: string;
  targetWord: string;
  isCompleted: boolean;
  elapsedTime: number;
}

// Hook Interface
interface UseGamePlayStateProps {
  startWord: string;
  endWord: string;
}

interface UseGamePlayStateResult {
  state: GamePlayState;
  addStep: (word: string) => void;
  removeStep: () => void;
  completeGame: () => void;
  resetGame: (startWord: string, endWord: string) => void;
}

function useGamePlayState(props: UseGamePlayStateProps): UseGamePlayStateResult;
```

### Functionality
- Manage game state using a reducer pattern
- Handle game actions: adding steps, removing steps, completing the game
- Track elapsed time
- Reset game state
- Extract timer logic from Play.tsx

### Current Implementation in Play.tsx
```tsx
const [steps, setSteps] = useState<string[]>([puzzle.start]);
const [elapsedTime, setElapsedTime] = useState(0);
const [hasGameStarted, setHasGameStarted] = useState(false);
const timerRef = useRef<NodeJS.Timeout | null>(null);

// Timer functions
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

// Game state functions
const addStep = (event: React.MouseEvent<HTMLButtonElement>) => {
  startTimer();
  const word = (event.target as HTMLInputElement).value;
  // ... logic for adding a step
  setSteps((steps) => [...steps, word]);
};

const removeStep = () => {
  if (steps.length > 1) {
    // ... logic for removing a step
    setSteps((steps) => [...steps.slice(0, -1)]);
  }
};

const handleComplete = () => {
  if (timerRef.current) clearInterval(timerRef.current);
  // ... logic for completing the game
};
```

## Testing Requirements
Write tests that verify:
- Reducer handles all action types correctly
- Hook initializes with the correct state
- Game functions (addStep, removeStep, etc.) work as expected
- Timer management works correctly
- Resources are cleaned up properly

## Important Notes
- Focus ONLY on creating this hook and reducer
- Do NOT refactor other parts of the codebase
- Ensure proper TypeScript typing throughout
- The hook should be reusable for different game instances
- Consider performance implications when updating game state

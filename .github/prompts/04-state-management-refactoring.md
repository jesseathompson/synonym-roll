# State Management Refactoring

## Objective
Refactor the application's state management approach to follow the best practices outlined in the project guidelines, focusing on local state management, React context for global state, data normalization, and using reducers for complex state logic.

## Focus Areas
1. Keep state as local as possible to components
2. Use React context appropriately for truly global state
3. Implement data normalization for complex state structures
4. Apply reducers for managing complex state logic

## Questions to Consider
- Is state being maintained at the appropriate level in the component hierarchy?
- Are there any global states that should be managed through React context?
- Could complex state benefit from being managed with reducers?
- Is the data structure normalized to avoid duplication and inconsistency?
- Are state update patterns consistent and predictable?

## Example Implementation
```tsx
// Before refactoring: Prop drilling and mixed concerns
function GameApp() {
  const [gameState, setGameState] = useState({
    words: [],
    score: 0,
    level: 1
  });
  
  // Passing state down through multiple levels
  return <GameBoard gameState={gameState} setGameState={setGameState} />;
}

// After refactoring: Using context and reducers

// In src/context/GameStateContext.tsx
interface GameState {
  words: string[];
  score: number;
  level: number;
}

type GameAction = 
  | { type: 'ADD_WORD'; payload: string }
  | { type: 'INCREASE_SCORE'; payload: number }
  | { type: 'ADVANCE_LEVEL' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_WORD':
      return { ...state, words: [...state.words, action.payload] };
    case 'INCREASE_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'ADVANCE_LEVEL':
      return { ...state, level: state.level + 1 };
    default:
      return state;
  }
};

export const GameStateContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: { words: [], score: 0, level: 1 },
  dispatch: () => {}
});

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, { words: [], score: 0, level: 1 });
  
  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

// In a component that needs the state
const GameBoard: React.FC = () => {
  const { state, dispatch } = useContext(GameStateContext);
  
  const handleWordSelect = (word: string) => {
    dispatch({ type: 'ADD_WORD', payload: word });
    dispatch({ type: 'INCREASE_SCORE', payload: 10 });
  };
  
  return (
    <div>
      <h2>Level: {state.level}</h2>
      <h3>Score: {state.score}</h3>
      {/* Rest of component */}
    </div>
  );
};
```

## Refactoring Steps
1. Identify state that should be local vs. global
2. Create appropriate context providers for global state
3. Implement reducers for complex state logic
4. Normalize data structures for complex state
5. Replace prop drilling with context consumption
6. Update components to use the new state management patterns

# Component Hierarchy Refactoring

## Objective
Refactor the application's component hierarchy to align with the recommended component types (Container, Presentational, Layout, UI) to improve code organization, reusability, and maintainability.

## Focus Areas
1. Identify and categorize existing components into appropriate component types
2. Ensure proper separation of concerns between component types
3. Create a clear hierarchy of components based on their relationships
4. Implement the suggested component structure for new and existing features

## Component Types
1. **Container Components**: Manage state and data flow
2. **Presentational Components**: Focus on UI rendering with props
3. **Layout Components**: Handle page structure and spacing
4. **UI Components**: Reusable UI elements like buttons, inputs, etc.

## Questions to Consider
- Are container components focused solely on state management and data flow?
- Do presentational components accept props and avoid maintaining their own state?
- Are layout components properly handling page structure and spacing?
- Are UI components reusable across different parts of the application?
- Is there a clear separation of concerns between different component types?

## Example Implementation
```tsx
// Before refactoring: Mixed concerns in a single component
function GameArea() {
  const [gameState, setGameState] = useState({});
  // Data fetching, state management, and UI rendering all mixed together
  // ...

  return (
    <div className="game-area">
      {/* Complex UI rendering mixed with business logic */}
    </div>
  );
}

// After refactoring: Clear separation of concerns

// Container component (GameBoard.tsx)
export const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState({});
  // Data fetching and state management
  // ...

  return (
    <GameGrid
      words={gameState.words}
      onWordSelect={handleWordSelect}
    />
  );
};

// Layout component (GameGrid.tsx)
interface GameGridProps {
  words: string[];
  onWordSelect: (word: string) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ words, onWordSelect }) => {
  return (
    <div className="game-grid">
      {words.map((word) => (
        <WordRow
          key={word}
          word={word}
          onSelect={() => onWordSelect(word)}
        />
      ))}
      <GameControls />
    </div>
  );
};

// Presentational component (WordRow.tsx)
interface WordRowProps {
  word: string;
  onSelect: () => void;
}

export const WordRow: React.FC<WordRowProps> = ({ word, onSelect }) => {
  return (
    <div className="word-row">
      <WordTile word={word} status="neutral" onClick={onSelect} />
    </div>
  );
};

// UI component (WordTile.tsx)
interface WordTileProps {
  word: string;
  status: 'correct' | 'incorrect' | 'neutral';
  onClick?: () => void;
}

export const WordTile: React.FC<WordTileProps> = ({ word, status, onClick }) => {
  return (
    <div className={`word-tile word-tile--${status}`} onClick={onClick}>
      {word}
    </div>
  );
};
```

## Refactoring Steps
1. Analyze current component structure and identify component types
2. Separate container logic from presentational components
3. Create dedicated layout components for page structure
4. Extract reusable UI elements into their own components
5. Establish a clear component hierarchy
6. Update imports and component relationships to reflect the new structure

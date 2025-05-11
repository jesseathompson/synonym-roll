# Accessibility Refactoring

## Objective
Enhance the application's accessibility to ensure it's usable by people with various disabilities, following WCAG guidelines and best practices for accessible web applications.

## Focus Areas
1. Ensure proper semantic HTML structure
2. Add appropriate ARIA attributes when necessary
3. Maintain sufficient color contrast
4. Implement keyboard navigation
5. Provide text alternatives for non-text content
6. Ensure focus management

## Questions to Consider
- Are semantic HTML elements being used appropriately?
- Do interactive elements have proper keyboard support?
- Is there sufficient color contrast between text and backgrounds?
- Do images and icons have appropriate alt text or aria-labels?
- Can the application be navigated and used without a mouse?
- Are form elements properly labeled?

## Example Implementation
```tsx
// Before refactoring
function GameTile({ word, onClick }) {
  return (
    <div style={{ backgroundColor: '#d3d3d3' }} onClick={onClick}>
      {word}
    </div>
  );
}

// After refactoring
interface GameTileProps {
  word: string;
  isSelected: boolean;
  onClick: () => void;
}

export const GameTile: React.FC<GameTileProps> = ({ word, isSelected, onClick }) => {
  return (
    <button
      className={`game-tile ${isSelected ? 'game-tile--selected' : ''}`}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Word tile: ${word}${isSelected ? ', selected' : ''}`}
    >
      {word}
    </button>
  );
};

// Focus management example
export const GameBoard: React.FC = () => {
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const tileRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  
  useEffect(() => {
    // Move focus to newly selected tile
    if (selectedTileId && tileRefs.current.has(selectedTileId)) {
      tileRefs.current.get(selectedTileId)?.focus();
    }
  }, [selectedTileId]);
  
  return (
    <div 
      role="grid" 
      aria-label="Word selection board"
    >
      {words.map((word) => (
        <GameTile
          key={word.id}
          word={word.text}
          isSelected={word.id === selectedTileId}
          onClick={() => setSelectedTileId(word.id)}
          ref={(el) => {
            if (el) tileRefs.current.set(word.id, el);
          }}
        />
      ))}
    </div>
  );
};
```

## Refactoring Steps
1. Audit the application for accessibility issues using tools like axe, Lighthouse, or WAVE
2. Replace non-semantic HTML with semantic elements where appropriate
3. Add ARIA attributes to enhance accessibility when semantic HTML isn't sufficient
4. Ensure all interactive elements are keyboard accessible
5. Add proper focus management
6. Verify that text alternatives are provided for all non-text content
7. Test the application with screen readers
8. Check color contrast ratios and adjust as needed
9. Implement skip links for keyboard navigation
10. Test with various assistive technologies

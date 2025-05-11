# Component Structure Refactoring

## Objective
Refactor the existing components to follow the component structure guidelines: small, reusable components with single responsibilities following the specified naming conventions and file structure.

## Focus Areas
1. Review all components in the `src/components` directory
2. Ensure each component:
   - Has its own file in the appropriate subdirectory
   - Uses PascalCase for component and file names
   - Has clearly defined prop interfaces above component definitions
   - Follows the Single Responsibility Principle

## Questions to Consider
- Are there any large components that should be broken down into smaller ones?
- Do all components have properly defined prop interfaces?
- Is each component focused on a single responsibility?
- Are components organized in appropriate subdirectories?

## Example Implementation
```tsx
// Before refactoring
function GameTile(props) {
  // Multiple responsibilities mixed
  // No proper prop interface defined
  // ...
}

// After refactoring
// In src/components/WordTile/WordTile.tsx
interface WordTileProps {
  word: string;
  status: 'correct' | 'incorrect' | 'neutral';
  onClick?: () => void;
}

export const WordTile: React.FC<WordTileProps> = ({ word, status, onClick }) => {
  // Focused responsibility
  return (
    <div className={`word-tile word-tile--${status}`} onClick={onClick}>
      {word}
    </div>
  );
};
```

## Refactoring Steps
1. Identify components that need restructuring
2. Define clear prop interfaces for each component
3. Split large components into smaller, focused ones
4. Organize components into appropriate subdirectories
5. Update imports across the codebase to reflect new structure

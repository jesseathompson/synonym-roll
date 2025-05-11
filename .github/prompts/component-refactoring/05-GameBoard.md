# GameBoard Component Refactoring

## Objective
Create a reusable `GameBoard` container component that provides the layout and structure for the game area, serving as the main container for game-related UI components.

## Component Details

### Location
`src/components/features/game/GameBoard/GameBoard.tsx`
`src/components/features/game/GameBoard/GameBoard.module.css`

### Props Interface
```tsx
interface GameBoardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isCompleted?: boolean;
}
```

### Functionality
- Provide a structured layout for game components
- Display an optional title/header area
- Support different states (playing, completed)
- Serve as a container for other game components

### Current Implementation in Play.tsx
```tsx
<Card className="game-container text-center">
  <Card.Body>
    {/* Optional title/stats display */}
    <div className="stats-display mb-2">
      <span>Daily Puzzle #{puzzleNumber}</span>
    </div>

    {/* Game content container */}
    <div className="game-content">
      {/* Game components rendered here */}
    </div>
  </Card.Body>
</Card>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Create a clean, structured layout
- Apply appropriate spacing and container styling
- Support responsive design at different viewport sizes

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- GameBoard with various child components
- Different title variations
- Completed vs. in-progress game states
- Responsive behavior at different viewport sizes

## Testing Requirements
Write tests that verify:
- Component renders children correctly
- Title is displayed when provided
- Custom class names are applied correctly
- Component renders differently based on the isCompleted prop

## Important Notes
- Focus ONLY on creating this component and its related files
- Do NOT refactor other parts of the codebase
- This is a container component - it should focus on layout and structure
- Ensure the component is accessible (proper ARIA roles if needed)
- Consider how this component will interact with other extracted components

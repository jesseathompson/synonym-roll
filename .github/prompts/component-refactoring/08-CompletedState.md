# CompletedState Component Refactoring

## Objective
Create a reusable `CompletedState` component that displays the completed game state, including the path from start to end word and game statistics.

## Component Details

### Location
`src/components/features/game/CompletedState/CompletedState.tsx`
`src/components/features/game/CompletedState/CompletedState.module.css`

### Props Interface
```tsx
interface CompletedStateProps {
  startWord: string;
  endWord: string;
  steps: string[];
  elapsedTime: number;
  onShare?: () => void;
  stats?: {
    winRate?: number;
    gamesPlayed?: number;
    streak?: number;
    maxStreak?: number;
  };
}
```

### Functionality
- Display congratulatory message
- Show the complete word path from start to end
- Display game statistics (time, steps)
- Provide a share button if onShare function is provided
- Show additional stats if provided

### Current Implementation in Play.tsx
```tsx
<div className="completed-state">
  <h4>
    You completed the puzzle in {Math.floor(elapsedTime / 60)}:
    {(elapsedTime % 60).toString().padStart(2, "0")} and{" "}
    {steps.length - 1} steps:
  </h4>

  <div className="start-word">{puzzle.start}</div>
  {steps.map((word, index) => {
    if (index === 0) return null;
    return (
      <span key={index} className="step-word">
        {word}
        {index < steps.length - 1}
      </span>
    );
  })}
  <div className="end-word">{puzzle.end}</div>

  {/* Stats display */}
  <div className="score-grid">
    {/* Stats items */}
  </div>

  <Button
    variant="primary"
    className="btn-game"
    onClick={handleShare}
  >
    <FontAwesomeIcon icon={faShare} className="me-2" />
    Share Result
  </Button>
</div>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Style the completed state with appropriate spacing
- Create a visually appealing display of the word path
- Ensure responsive layout at different viewport sizes

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- Different path lengths (short, medium, long)
- With and without sharing functionality
- With and without additional stats
- Responsive behavior at different viewport sizes

## Testing Requirements
Write tests that verify:
- Component renders all words in the path correctly
- Time is formatted correctly
- Share button is only rendered when onShare is provided
- Additional stats are displayed correctly when provided

## Important Notes
- Focus ONLY on creating this component and its related files
- Do NOT refactor other parts of the codebase
- Consider reusing other components like WordTile and StatsDisplay
- Ensure the component is accessible
- Consider how the component will look with words of varying lengths

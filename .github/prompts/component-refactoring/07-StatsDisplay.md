# StatsDisplay Component Refactoring

## Objective
Create a reusable `StatsDisplay` component that shows game statistics like time elapsed, steps taken, win rate, and games played.

## Component Details

### Location
`src/components/features/stats/StatsDisplay/StatsDisplay.tsx`
`src/components/features/stats/StatsDisplay/StatsDisplay.module.css`

### Props Interface
```tsx
interface StatsDisplayProps {
  stats: {
    elapsedTime: number;
    steps: number;
    winRate?: number;
    gamesPlayed?: number;
    currentStreak?: number;
    maxStreak?: number;
  };
  showDetailedStats?: boolean;
}
```

### Functionality
- Display game statistics in a clean, organized layout
- Format time display (minutes:seconds)
- Support basic stats (time, steps) and detailed stats (win rate, games played, streaks)
- Handle responsive layout for different screen sizes

### Current Implementation in Play.tsx
```tsx
<div className="score-grid">
  <div className="score-item">
    <div className="score-value">
      {Math.floor(elapsedTime / 60)}:
      {(elapsedTime % 60).toString().padStart(2, "0")}
    </div>
    <div className="score-label">Time</div>
  </div>

  <div className="score-item">
    <div className="score-value">{steps.length - 1}</div>
    <div className="score-label">Steps</div>
  </div>
  <div className="stat-item">
    <div className="stat-value">
      {Math.round(winRate * 100)}%
    </div>
    <div className="stat-label">Win Rate</div>
  </div>
  <div className="stat-item">
    <div className="stat-value">{gamesPlayed}</div>
    <div className="stat-label">Played</div>
  </div>
</div>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Create a responsive grid layout for stats items
- Ensure consistent styling and alignment
- Use appropriate typography for values and labels

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- Basic stats display (time and steps only)
- Complete stats display (all statistics)
- Different value ranges (short/long time, high/low steps, etc.)
- Responsive behavior at different viewport sizes

## Testing Requirements
Write tests that verify:
- Component renders all stats correctly
- Time is formatted correctly
- Conditional rendering works based on props
- Layout adapts to different stats combinations

## Important Notes
- Focus ONLY on creating this component and its related files
- Do NOT refactor other parts of the codebase
- Ensure the component is accessible (proper ARIA attributes if needed)
- Consider internationalization aspects for formatting numbers

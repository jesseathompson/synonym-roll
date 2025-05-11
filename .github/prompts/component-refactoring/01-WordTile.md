# WordTile Component Refactoring

## Objective
Create a reusable `WordTile` component that displays a word with different visual styling based on its status in the game (start word, step word, or end word).

## Component Details

### Location
`src/components/common/WordTile/WordTile.tsx`
`src/components/common/WordTile/WordTile.module.css`

### Props Interface
```tsx
interface WordTileProps {
  word: string;
  variant: 'start' | 'step' | 'end' | 'neutral';
  onClick?: () => void;
}
```

### Functionality
- Display a word with appropriate styling based on its variant
- Handle click events (optional)
- Apply appropriate CSS classes and accessibility attributes

### Current Implementation in Play.tsx
```tsx
<div className="start-word">{puzzle.start}</div>
<span className="step-word">{word}</span>
<div className="end-word">{puzzle.end}</div>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Implement styles for different variants (start, step, end, neutral)
- Apply responsive design principles
- Use CSS variables from the design token system

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- All variants of the WordTile
- Interactive example with onClick handler
- Responsive behavior at different viewport sizes

## Testing Requirements
Write tests that verify:
- Component renders with the correct text
- Component applies the appropriate classes based on variant
- Click handler is called when the component is clicked

## Important Notes
- Focus ONLY on creating this component and its related files
- Do NOT refactor other parts of the codebase
- Ensure the component is accessible (keyboard navigation, screen readers)
- Component should be reusable across the application

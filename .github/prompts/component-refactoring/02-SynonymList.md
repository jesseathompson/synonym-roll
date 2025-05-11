# SynonymList Component Refactoring

## Objective
Create a reusable `SynonymList` component that displays a grid of buttons for synonym selection during gameplay.

## Component Details

### Location
`app/src/components/features/game/SynonymList/SynonymList.tsx`
`app/src/components/features/game/SynonymList/SynonymList.module.css`

### Props Interface
```tsx
interface SynonymListProps {
  synonyms: string[];
  onSelect: (word: string) => void;
  isLoading?: boolean;
}
```

### Functionality
- Display a grid of buttons, each representing a synonym
- Handle click events to select a synonym
- Sort synonyms alphabetically
- Show loading state (optional)
- Handle empty state when no synonyms are available

### Current Implementation in Play.tsx
```tsx
<div className="syn-words">
  {currentSynonyms?.sort().map((synonym, index) => (
    <Button
      key={index}
      className="btn-game"
      value={synonym}
      onClick={(e) => addStep(e)}
    >
      {synonym}
    </Button>
  ))}
</div>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Implement a responsive grid layout for buttons
- Ensure consistent button sizing and spacing
- Apply appropriate styling for interactive states (hover, focus, active)

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- List with different numbers of synonyms (few, many)
- Interactive example with selection handler
- Empty state
- Loading state (if implemented)
- Responsive behavior at different viewport sizes

## Testing Requirements
Write tests that verify:
- Component renders the correct number of buttons
- Buttons display the correct text
- Click handlers are called with the correct synonym
- Synonyms are properly sorted

## Important Notes
- Focus ONLY on creating this component and its related files
- Do NOT refactor other parts of the codebase
- Ensure the component is accessible (keyboard navigation, screen readers)
- Consider performance optimization for large lists of synonyms

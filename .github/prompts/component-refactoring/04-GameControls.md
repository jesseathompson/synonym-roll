# GameControls Component Refactoring

## Objective
Create a reusable `GameControls` component that provides game control buttons such as "Go Back" and other game actions.

## Component Details

### Location
`src/components/features/game/GameControls/GameControls.tsx`
`src/components/features/game/GameControls/GameControls.module.css`

### Props Interface
```tsx
interface GameControlsProps {
  onGoBack?: () => void;
  onShare?: () => void;
  onReset?: () => void;
  showBackButton?: boolean;
  showShareButton?: boolean;
  showResetButton?: boolean;
  isCompleted?: boolean;
}
```

### Functionality
- Display game control buttons based on provided props
- Handle click events for each action (go back, share, reset)
- Conditionally render buttons based on game state
- Include appropriate icons with each button

### Current Implementation in Play.tsx
```tsx
<Button
  variant="primary"
  className="btn-game"
  onClick={removeStep}
>
  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
  Go Back
</Button>

// And in the completed state:
<Button
  variant="primary"
  className="btn-game"
  onClick={handleShare}
>
  <FontAwesomeIcon icon={faShare} className="me-2" />
  Share Result
</Button>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Consistent button sizing and spacing
- Responsive layout for button arrangement
- Appropriate styling for different button states

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- Different combinations of visible buttons
- Button click handlers (using actions)
- Responsive behavior at different viewport sizes

## Testing Requirements
Write tests that verify:
- Buttons render correctly based on props
- Click handlers are called when buttons are clicked
- Buttons are not rendered when their respective show props are false

## Important Notes
- Focus ONLY on creating this component and its related files
- Do NOT refactor other parts of the codebase
- Ensure the component is accessible (keyboard navigation, screen readers)
- Use consistent button styling across all control buttons

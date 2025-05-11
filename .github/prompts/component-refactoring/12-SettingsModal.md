# SettingsModal Component Refactoring

## Objective
Refactor the existing `SettingsModal` component to follow component best practices and use CSS modules.

## Component Details

### Location
`src/components/common/SettingsModal/SettingsModal.tsx`
`src/components/common/SettingsModal/SettingsModal.module.css`

### Props Interface
```tsx
interface SettingsModalProps {
  show: boolean;
  onHide: () => void;
}
```

### Functionality
- Display game settings in a modal
- Allow users to toggle theme (light/dark)
- Provide option to reset game progress
- Allow users to close the modal

### Current Implementation
```tsx
import { Modal, Form, Button } from "react-bootstrap";
import { useGameState } from "../context/GameStateContext";
import { useTheme } from "../hooks/useTheme";

interface SettingsModalProps {
  show: boolean;
  onHide: () => void;
}

export const SettingsModal = ({ show, onHide }: SettingsModalProps) => {
  const { resetGameState } = useGameState();
  const { theme, toggleTheme } = useTheme();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all game progress?")) {
      resetGameState();
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="modal-game">
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Theme</Form.Label>
            <Form.Check
              type="switch"
              id="theme-switch"
              label={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`}
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
          </Form.Group>

          {/* TODO: Add your game-specific settings here */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleReset}>
          Reset Progress
        </Button>
        <Button className='btn-game' variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Apply appropriate styling for modal elements and form controls
- Use design tokens for colors, spacing, etc.

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- Modal in open state
- Theme toggle functionality (mocked if necessary)
- Reset confirmation dialog (mocked if necessary)

## Testing Requirements
Write tests that verify:
- Component renders with the correct content
- Theme toggle works correctly
- Reset confirmation dialog appears when reset button is clicked
- Close button functions correctly

## Important Notes
- Focus ONLY on refactoring this component and its related files
- Ensure the component is accessible (keyboard navigation, screen readers)
- Consider how this component fits into the overall application structure
- Make sure to preserve all current functionality
- Mock context hooks for testing and Storybook stories

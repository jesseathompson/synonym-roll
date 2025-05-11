# InfoModal Component Refactoring

## Objective
Refactor the existing `InfoModal` component to follow component best practices and use CSS modules.

## Component Details

### Location
`src/components/common/InfoModal/InfoModal.tsx`
`src/components/common/InfoModal/InfoModal.module.css`

### Props Interface
```tsx
interface InfoModalProps {
  show: boolean;
  onHide: () => void;
}
```

### Functionality
- Display game instructions and information in a modal
- Allow users to close the modal
- Show copyright information

### Current Implementation
```tsx
import { Modal, Button } from 'react-bootstrap';

interface InfoModalProps {
  show: boolean;
  onHide: () => void;
}

export const InfoModal = ({ show, onHide }: InfoModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered className="modal-game">
      <Modal.Header closeButton>
        <Modal.Title>How to Play</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        Transform the starting word into the ending word by selecting synonyms, aiming to create the shortest path possible.
        </p>
        
        <h5 className="mt-4">More Features Coming Soon!</h5>
        <ul className="list-unstyled">
          <li>• Scores</li>
          <li>• Share</li>
          <li>• Streaks</li>
        </ul>

        <hr />
        
        <small className="text-muted">
          <br />
          © {new Date().getFullYear()} Lisa Thompson & Jesse Thompson
        </small>
      </Modal.Body>
      <Modal.Footer>
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
- Apply appropriate styling for modal elements
- Use design tokens for colors, spacing, etc.

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- Modal in open state
- Modal interactions (close button)

## Testing Requirements
Write tests that verify:
- Component renders with the correct content
- Close button functions correctly

## Important Notes
- Focus ONLY on refactoring this component and its related files
- Ensure the component is accessible (keyboard navigation, screen readers)
- Consider how this component fits into the overall application structure
- Make sure to preserve all current functionality

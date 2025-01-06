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
        {/* TODO: Replace with your game's instructions */}
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
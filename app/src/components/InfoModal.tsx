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
        <div className="how-to-play-content">
          <h6 className="mb-3">🎯 Objective</h6>
          <p className="mb-3">
            Transform the <strong>starting word</strong> into the <strong>ending word</strong> by selecting synonyms, 
            aiming to create the shortest path possible.
          </p>

          <h6 className="mb-3">🎮 How to Play</h6>
          <ol className="mb-3">
            <li>Click on synonyms from the available list to build your path</li>
            <li>Each word you select becomes your new position</li>
            <li>Continue until you reach the target word</li>
            <li>Use the "Go Back" button to undo your last move</li>
          </ol>

          <h6 className="mb-3">🌡️ Temperature System</h6>
          <p className="mb-3">
            Words are color-coded by how "hot" or "cold" they are relative to your target:
          </p>
          <div className="temperature-guide mb-3">
            <div className="d-flex align-items-center mb-2">
              <div className="temperature-indicator hot me-2"></div>
              <span><strong>HOT</strong> - Very close to the target (1-2 steps away)</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="temperature-indicator warm me-2"></div>
              <span><strong>WARM</strong> - Getting closer (2-3 steps away)</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="temperature-indicator cool me-2"></div>
              <span><strong>COOL</strong> - Somewhat related (3-4 steps away)</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="temperature-indicator cold me-2"></div>
              <span><strong>COLD</strong> - Distant from target (4+ steps away)</span>
            </div>
          </div>

          <h6 className="mb-3">💡 Strategy Tips</h6>
          <ul className="mb-3">
            <li>Look for "bridge words" that connect different semantic areas</li>
            <li>Hotter words are generally better choices</li>
            <li>Consider multiple paths - there's often more than one solution</li>
            <li>Use the thermometer to gauge your progress</li>
            <li>Don't be afraid to backtrack if you hit a dead end</li>
          </ul>

          <h6 className="mb-3">📊 Scoring</h6>
          <p className="mb-3">
            Your score is based on the efficiency of your path. Shorter paths with higher-quality 
            synonym connections earn better scores. Try to beat your personal best!
          </p>

          <hr />
          
          <small className="text-muted">
            <br />
            © {new Date().getFullYear()} Lisa Thompson & Jesse Thompson
          </small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-game' variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 
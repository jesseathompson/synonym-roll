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

          <h6 className="mb-3">⛳ Par</h6>
          <p className="mb-3">
            Every puzzle has a <strong>par</strong> — the fewest moves it can be solved in.
            The empty slots between your start and target show the optimal path length.
            Fill them all and land on the target to match par; take extra moves and you go over,
            golf-style.
          </p>

          <h6 className="mb-3">🔥 The Reveal</h6>
          <p className="mb-3">
            When you finish, your path is revealed in hot/cold colors showing how close each
            of your words actually was to the target. Were you circling the answer the whole
            time, or did you take the scenic route? Share it and compare with friends!
          </p>

          <h6 className="mb-3">💡 Strategy Tips</h6>
          <ul className="mb-3">
            <li>Many words have multiple meanings - tap <strong>📖 Definitions</strong> to see what each option means, in the sense it shares with your current word</li>
            <li>Look for "bridge words" that connect different semantic areas</li>
            <li>Consider multiple paths - there's often more than one solution</li>
            <li>Use par to pace yourself: if the slots are full and the target isn't next, rethink your route</li>
            <li>Don't be afraid to backtrack - words you've already explored appear faded with a ✓, so you always know where you've been</li>
          </ul>

          <h6 className="mb-3">📊 Scoring</h6>
          <p className="mb-3">
            Match par for a perfect game ⭐. Fewer total moves (including backtracks) means
            higher efficiency. Try to beat your personal best!
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
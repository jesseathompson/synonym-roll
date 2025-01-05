import { Container, Row, Col, Card, Button, Stack } from "react-bootstrap";
import { useGameState } from "../context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { generateShareText, shareResults } from "../utils/shareUtils";
import { getTodaysPuzzle, getTodaysSeed } from "../utils/gameUtils";
import { WordGraph } from "../utils/wordGraph";
import { useState } from "react";
const wordGraph = new WordGraph();

export const Play = () => {
  const { gameState, updateGameState } = useGameState();
  const { todayCompleted, gamesPlayed, streak, maxStreak, winRate, wins } =
    gameState;
  const [puzzle, setPuzzle] = useState(getTodaysPuzzle());
  const [currentSynonyms, setCurrentSynonyms] = useState(
    wordGraph.getSynonyms(puzzle.start)
  );
  const [steps, setSteps] = useState<string[]>([puzzle.start]);
  const [minSteps, setMinSteps] = useState(
    wordGraph.findShortestPathLengthBiDirectional(puzzle.start, puzzle.end)
  );
  const addStep = (event: React.MouseEvent<HTMLButtonElement>) => {
    const word = (event.target as HTMLInputElement).value;
    const synonyms = wordGraph.getSynonyms(word);
    if (word === puzzle.end) {
      window.confirm("YOU WIN!!!");
    } else {
      setSteps((steps) => [...steps, word]);
      setCurrentSynonyms(() => synonyms);
      setMinSteps(() => 
        wordGraph.findShortestPathLengthBiDirectional(word, puzzle.end)
      );
    }
  };
  const removeStep = () => {
    if (steps.length > 1) {
      const word = steps[steps.length - 2];
      console.log(word);
      setSteps((steps) => [...steps.slice(0, -1)]);
      setCurrentSynonyms(() => wordGraph.getSynonyms(word));
      setMinSteps(() =>
        wordGraph.findShortestPathLengthBiDirectional(word, puzzle.end)
      );
    }
  };
  // Get today's puzzle number
  const puzzleNumber = Math.floor((getTodaysSeed() % 1000000) / 100);

  const handleComplete = () => {
    const newGamesPlayed = gamesPlayed + 1;
    const newWins = wins + 1;
    updateGameState({
      todayCompleted: true,
      gamesPlayed: newGamesPlayed,
      wins: newWins,
      winRate: newWins / newGamesPlayed,
      maxStreak: Math.max(maxStreak, streak),
    });
  };

  const handleShare = async () => {
    const shareText = generateShareText({
      title: "Synonym Roll",
      dayNumber: puzzleNumber,
      streak,
      stats: {
        gamesPlayed,
        winRate,
        currentStreak: streak,
        maxStreak,
      },
    });

    await shareResults(shareText);
  };

  return (
    <Container fluid className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="game-container text-center">
            {/* Card Body Start */}

            <Card.Body>
              {/* <div className="stats-display mb-2">
                <span>Daily Puzzle #{puzzleNumber}</span>
              </div> */}

              {todayCompleted ? (
                <div className="completed-state">
                  <h4 className="mb-2">Daily puzzle completed!</h4>
                  <div className="stats-grid mb-2">
                    <div className="stat-item">
                      <div className="stat-value">{gamesPlayed}</div>
                      <div className="stat-label">Played</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {Math.round(winRate * 100)}%
                      </div>
                      <div className="stat-label">Win Rate</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{streak}</div>
                      <div className="stat-label">Streak</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{maxStreak}</div>
                      <div className="stat-label">Best</div>
                    </div>
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
              ) : (
                // Playing Game

                <div className="game-content">
                  <Stack gap={1}>
                    <div className="start-end">
                      Starting Word:
                      <div className="start-word">{puzzle.start}</div>
                      <div className="steps-container">
                        {steps.map((word, index) => {
                          if (index === 0) return null;
                          return (
                            <span key={index} className="step-word">
                              {word}
                              {index < steps.length - 1 && " > "}{" "}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="syn-words">
                      {currentSynonyms?.sort().map((synonym, index) => (
                        <Button
                          key={index}
                          // variant="secondary"
                          className="btn-game"
                          value={synonym}
                          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>addStep(e)}
                        >
                          {synonym}
                        </Button>
                      ))}
                    </div>
                    <div className="start-end">
                      {minSteps} steps to Ending Word:
                      <div className="end-word">{puzzle.end}</div>
                      <Button
                        variant="primary"
                        // size="md"
                        className="btn-game"
                        onClick={removeStep}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Go Back
                      </Button>
                    </div>
                  </Stack>

                  <span>
                    {/* <div className="floating-steps">{minSteps} Steps Left</div> */}
                    {/* <Button variant="primary" size="md" className="btn-game">
                      {minSteps} Words To Go
                    </Button> */}
                    {/* <Button
                      variant="primary"
                      size="md"
                      className="btn-game"
                      onClick={removeStep}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Go Back
                    </Button> */}
                  </span>

                  <div>
                    {/* <Button
                      variant="primary"
                      size="md"
                      className="btn-game"
                      onClick={() =>
                        console.log(
                          wordGraph.findPath(puzzle.start, puzzle.end)
                        )
                      }
                    >
                      log solution
                    </Button> */}
                    {/* <Button
                      variant="primary"
                      size="sm"
                      className="btn-game"
                      onClick={handleComplete}
                    >
                      Don't Click
                    </Button> */}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

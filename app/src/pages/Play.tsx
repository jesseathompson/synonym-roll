import { Container, Row, Col } from "react-bootstrap";
import { useGameState } from "../context/GameStateContext";
import { getTodaysPuzzle, getTodaysSeed } from "../utils/gameUtils";
import { useState, useEffect } from "react";
import { WordGraph } from "../utils/wordGraph";

// Import components
import { GameBoard } from "../components/features/game/GameBoard";
import { GameTimer } from "../components/features/game/GameTimer";
import { GameControls } from "../components/features/game/GameControls";
import { CompletedState } from "../components/features/game/CompletedState";
import { useGamePlayState } from "../hooks/useGamePlayState";

// Import components
import { SynonymList } from "../components/features/game/SynonymList";
import { GamePath } from "../components/features/game/GamePath";

export const Play = () => {
  const { gameState, updateGameState } = useGameState();
  const { todayCompleted, gamesPlayed, streak, maxStreak, winRate, wins } = gameState;
  
  // Get today's puzzle
  const [puzzle] = useState(getTodaysPuzzle());
  
  // Use the game play state hook
  const { state, addStep, removeStep, completeGame, resetGame } = useGamePlayState({
    startWord: puzzle.start,
    endWord: puzzle.end,
  });
 
  // Get today's puzzle number
  const puzzleNumber = Math.floor((getTodaysSeed() % 1000000) / 100);

  // Handle game completion
  useEffect(() => {
    if (state.isCompleted && !todayCompleted) {
      const newGamesPlayed = gamesPlayed + 1;
      const newWins = wins + 1;
      updateGameState({
        todayCompleted: true,
        gamesPlayed: newGamesPlayed,
        wins: newWins,
        winRate: newWins / newGamesPlayed,
        maxStreak: Math.max(maxStreak, streak),
      });
    }
  }, [state.isCompleted, todayCompleted, gamesPlayed, wins, updateGameState, maxStreak, streak]);


  const handleSynonymSelect = (word: string) => {
    addStep(word);
    if (word === puzzle.end) {
      completeGame();
    }
  };

  // Debug function (can be removed in production)
  const logSolution = () => {
    const wordGraph = new WordGraph();
    const currentWord = state.currentWord;
    const endWord = puzzle.end;
    
    console.log(`Finding path from "${currentWord}" to "${endWord}"`);
    
    const solutionPath = wordGraph.findPath(currentWord, endWord);
    
    if (solutionPath) {
      console.log("✅ Valid solution path found:");
      console.log("Path:", solutionPath.join(" → "));
      console.log("Path length:", solutionPath.length);
      console.log("Full path array:", solutionPath);
    } else {
      console.log("❌ No valid path found from current word to end word");
      console.log("This might indicate a problem with the word graph or puzzle setup");
    }
  };

  return (
    <Container fluid className="game-container">
      <Row className="justify-content-center h-100">
        <Col xs={12} md={10} lg={8} className="d-flex flex-column">
          <GameBoard 
            isCompleted={state.isCompleted}
            className="text-center flex-grow-1 d-flex flex-column"
          >
            {state.isCompleted || todayCompleted ? (
              <CompletedState
                startWord={puzzle.start}
                endWord={puzzle.end}
                steps={state.steps}
                elapsedTime={state.elapsedTime}
                totalMoves={state.totalMoves}
                minSteps={state.minSteps || 3}
                dayNumber={puzzleNumber}
                stats={{
                  winRate,
                  gamesPlayed,
                  streak,
                  maxStreak,
                }}
              />
            ) : (
              <div className="game-content-compact">
                {/* Header with Timer */}
                <div className="game-header">
                  <GameTimer 
                    time={state.elapsedTime} 
                    label="Time" 
                  />
                </div>

                {/* Game Path, Synonyms, and Controls - Unified Container */}
                <div className="game-main-section">
                  <GamePath
                    startWord={puzzle.start}
                    endWord={puzzle.end}
                    steps={state.steps}
                    minSteps={state.minSteps || 3}
                  />
                  <SynonymList
                    synonyms={state.synonyms}
                    onSelect={handleSynonymSelect}
                  />
                  <div className="game-controls-inline">
                    <GameControls
                      showBackButton={state.steps.length > 1}
                      showResetButton={false}
                      onGoBack={removeStep}
                    />
                  </div>
                </div>

                {/* Debug Controls (can be removed in production) */}
                <div className="debug-controls">
                  <button 
                    className="btn btn-secondary btn-sm me-2"
                    onClick={logSolution}
                  >
                    Log Solution
                  </button>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={completeGame}
                  >
                    Complete Game (Debug)
                  </button>
                </div>
              </div>
            )}
          </GameBoard>
        </Col>
      </Row>
    </Container>
  );
};

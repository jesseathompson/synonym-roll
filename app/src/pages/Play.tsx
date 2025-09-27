import { Container, Row, Col } from "react-bootstrap";
import { useGameState } from "../context/GameStateContext";
import { generateShareText, shareResults } from "../utils/shareUtils";
import { getTodaysPuzzle, getTodaysSeed } from "../utils/gameUtils";
import { useState, useEffect } from "react";

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

  const handleSynonymSelect = (word: string) => {
    addStep(word);
    if (word === puzzle.end) {
      completeGame();
    }
  };

  // Debug function (can be removed in production)
  const logSolution = () => {
    console.log("Solution path would be logged here");
  };

  return (
    <Container fluid className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <GameBoard 
            isCompleted={state.isCompleted}
            className="text-center"
          >
            {state.isCompleted || todayCompleted ? (
              <CompletedState
                startWord={puzzle.start}
                endWord={puzzle.end}
                steps={state.steps}
                elapsedTime={state.elapsedTime}
                onShare={handleShare}
                stats={{
                  winRate,
                  gamesPlayed,
                  streak,
                  maxStreak,
                }}
              />
            ) : (
              <div className="game-content">
                {/* Timer Display */}
                <GameTimer 
                  time={state.elapsedTime} 
                  label="Time Elapsed" 
                />

                {/* Game Path Display */}
                <GamePath
                  startWord={puzzle.start}
                  endWord={puzzle.end}
                  steps={state.steps}
                  minSteps={state.minSteps || 3}
                />

                {/* Synonym Selection */}
                <SynonymList
                  synonyms={state.synonyms}
                  onSelect={handleSynonymSelect}
                />

                {/* Game Controls */}
                <GameControls
                  showBackButton={state.steps.length > 1}
                  showResetButton={false}
                  onGoBack={removeStep}
                />

                {/* Debug Controls (can be removed in production) */}
                <div className="debug-controls mt-3">
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

import { Container, Row, Col } from "react-bootstrap";
import { useGameState } from "../context/GameStateContext";
import { getTodaysPuzzle, getTodaysPuzzleNumber } from "../utils/gameUtils";
import { useState, useEffect } from "react";
import { WordGraph } from "../utils/wordGraph";
import { trackPageView, trackGameStart, trackWordSelected, trackGameComplete, trackGameBack, trackDebugEvent, GA_EVENTS } from "../utils/analytics";

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
  
  // Get today's puzzle number
  const puzzleNumber = getTodaysPuzzleNumber();
  
  // Use the game play state hook
  const { state, addStep, removeStep, completeGame, resetGame } = useGamePlayState({
    startWord: puzzle.start,
    endWord: puzzle.end,
    puzzleNumber,
  });

  // Track page view on component mount
  useEffect(() => {
    trackPageView('Play', {
      puzzle_number: puzzleNumber,
      start_word: puzzle.start,
      end_word: puzzle.end,
      streak: streak,
      today_completed: todayCompleted,
    });
  }, [puzzleNumber, puzzle.start, puzzle.end, streak, todayCompleted]);

  // Track game start when entering play page
  useEffect(() => {
    if (!todayCompleted) {
      trackGameStart({
        puzzle_number: puzzleNumber,
        start_word: puzzle.start,
        end_word: puzzle.end,
        streak: streak,
        is_returning_player: gamesPlayed > 0,
      });
    }
  }, [puzzleNumber, puzzle.start, puzzle.end, streak, todayCompleted, gamesPlayed]);

  // Handle game completion
  useEffect(() => {
    if (state.isCompleted && !todayCompleted) {
      const newGamesPlayed = gamesPlayed + 1;
      const newWins = wins + 1;
      const newWinRate = newWins / newGamesPlayed;
      
      // Track game completion
      trackGameComplete({
        puzzle_number: puzzleNumber,
        completion_time_seconds: state.elapsedTime,
        steps_taken: state.steps.length - 1,
        min_steps: state.minSteps || 3,
        total_moves: state.totalMoves,
        efficiency_percentage: state.totalMoves > 0 ? Math.round(((state.steps.length - 1) / state.totalMoves) * 100) : 100,
        streak: streak,
        win_rate: newWinRate,
        games_played: newGamesPlayed,
      });

      updateGameState({
        todayCompleted: true,
        gamesPlayed: newGamesPlayed,
        wins: newWins,
        winRate: newWinRate,
        maxStreak: Math.max(maxStreak, streak),
      });
    }
  }, [state.isCompleted, todayCompleted, gamesPlayed, wins, updateGameState, maxStreak, streak, puzzleNumber, state.elapsedTime, state.steps.length, state.minSteps, state.totalMoves]);


  const handleSynonymSelect = (word: string) => {
    // Track word selection
    trackWordSelected({
      word: word,
      step_number: state.steps.length,
      available_synonyms_count: state.synonyms.length,
      puzzle_number: puzzleNumber,
    });
    
    addStep(word);
    if (word === puzzle.end) {
      completeGame();
    }
  };

  // Track back button usage
  const handleGoBack = () => {
    trackGameBack(puzzleNumber, state.steps.length);
    removeStep();
  };

  // Debug function (can be removed in production)
  const logSolution = () => {
    // Only run in development mode
    if (!import.meta.env.DEV) return;
    
    // Track debug solution log
    trackDebugEvent(GA_EVENTS.DEBUG_SOLUTION_LOG, {
      puzzle_number: puzzleNumber,
      current_word: state.currentWord,
      end_word: puzzle.end,
    });
    
    const wordGraph = new WordGraph();
    const currentWord = state.currentWord;
    const endWord = puzzle.end;
    
    console.log(`🔍 Finding filtered solution path from "${currentWord}" to "${endWord}"`);
    console.log("=".repeat(60));
    
    // Get the synonyms that would be shown to the user
    const availableSynonyms = wordGraph.getSynonyms(currentWord, endWord) || [];
    console.log(`📋 Available synonyms (${availableSynonyms.length}):`, availableSynonyms);
    
    // Find a path using only the filtered synonyms
    const filteredSolutionPath = wordGraph.findPathWithFilteredSynonyms(currentWord, endWord, availableSynonyms);
    
    if (filteredSolutionPath) {
      console.log("✅ Valid filtered solution path found:");
      console.log("Path:", filteredSolutionPath.join(" → "));
      console.log("Path length:", filteredSolutionPath.length - 1, "steps");
      console.log("Full path array:", filteredSolutionPath);
      
      // Also show the unfiltered path for comparison
      const unfilteredPath = wordGraph.findPath(currentWord, endWord);
      if (unfilteredPath && unfilteredPath.length !== filteredSolutionPath.length) {
        console.log("\n📊 Comparison with unfiltered path:");
        console.log("Unfiltered path:", unfilteredPath.join(" → "));
        console.log("Unfiltered length:", unfilteredPath.length - 1, "steps");
        console.log("Difference:", (unfilteredPath.length - filteredSolutionPath.length), "steps longer");
      }
    } else {
      console.log("❌ No valid path found using filtered synonyms");
      console.log("This means the current filtering might be too restrictive");
      
      // Show what synonyms are available vs what's needed
      const unfilteredPath = wordGraph.findPath(currentWord, endWord);
      if (unfilteredPath) {
        console.log("\n🔍 Analysis:");
        console.log("Unfiltered path exists:", unfilteredPath.join(" → "));
        console.log("Missing synonyms needed for path:");
        unfilteredPath.slice(1, -1).forEach((word, index) => {
          const isAvailable = availableSynonyms.includes(word);
          console.log(`  ${index + 1}. "${word}" - ${isAvailable ? '✅ Available' : '❌ Filtered out'}`);
        });
      }
    }
    
    // Additional validation
    const validation = wordGraph.validateFiltering(currentWord, endWord);
    console.log("\n🔍 Filtering Validation:");
    console.log("Valid game:", validation.isValid ? "✅ Yes" : "❌ No");
    console.log("Analysis:", validation.analysis);
    
    if (validation.missingWords.length > 0) {
      console.log("Missing critical words:", validation.missingWords);
    }
    
    console.log("=".repeat(60));
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
                      onGoBack={handleGoBack}
                    />
                  </div>
                </div>

                {/* Debug Controls (development only) */}
                {import.meta.env.DEV && (
                  <div className="debug-controls">
                    <button 
                      className="btn btn-secondary btn-sm me-2"
                      onClick={logSolution}
                    >
                      Log Solution
                    </button>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        trackDebugEvent(GA_EVENTS.DEBUG_GAME_COMPLETE, {
                          puzzle_number: puzzleNumber,
                          current_word: state.currentWord,
                          steps_taken: state.steps.length - 1,
                        });
                        completeGame();
                      }}
                    >
                      Complete Game (Debug)
                    </button>
                  </div>
                )}
              </div>
            )}
          </GameBoard>
        </Col>
      </Row>
    </Container>
  );
};

import { useReducer, useEffect, useRef, useCallback } from 'react';
import { gameReducer, GamePlayState, GameAction } from '../reducers/gameReducer';
import { WordGraph } from '../utils/wordGraph';

const wordGraph = new WordGraph();
const GAME_PLAY_STORAGE_KEY = 'gamePlayState';

interface StoredGamePlayState extends GamePlayState {
	puzzleNumber: number;
	savedAt: number;
}

interface UseGamePlayStateProps {
	startWord: string;
	endWord: string;
	puzzleNumber: number;
}

interface UseGamePlayStateResult {
	state: GamePlayState;
	addStep: (word: string) => void;
	removeStep: () => void;
	completeGame: () => void;
	resetGame: (startWord: string, endWord: string) => void;
}

/**
 * Save game play state to localStorage
 */
const saveGamePlayState = (state: GamePlayState, puzzleNumber: number) => {
	try {
		const toStore: StoredGamePlayState = {
			...state,
			puzzleNumber,
			savedAt: Date.now(),
		};
		localStorage.setItem(GAME_PLAY_STORAGE_KEY, JSON.stringify(toStore));
	} catch (error) {
		console.error('Error saving game play state:', error);
	}
};

/**
 * Load game play state from localStorage
 */
const loadGamePlayState = (
	currentPuzzleNumber: number,
	startWord: string,
	endWord: string
): GamePlayState | null => {
	try {
		const stored = localStorage.getItem(GAME_PLAY_STORAGE_KEY);
		if (!stored) return null;

		const data: StoredGamePlayState = JSON.parse(stored);

		// Only restore if it's the same puzzle
		if (
			data.puzzleNumber !== currentPuzzleNumber ||
			data.steps[0] !== startWord ||
			data.targetWord !== endWord
		) {
			// Different puzzle, clear old data
			clearGamePlayState();
			return null;
		}

		// Don't restore completed games
		if (data.isCompleted) {
			clearGamePlayState();
			return null;
		}

		// Return the game state without metadata
		const { puzzleNumber: _, savedAt: __, ...gameState } = data;
		return gameState;
	} catch (error) {
		console.error('Error loading game play state:', error);
		return null;
	}
};

/**
 * Clear saved game play state
 */
const clearGamePlayState = () => {
	try {
		localStorage.removeItem(GAME_PLAY_STORAGE_KEY);
	} catch (error) {
		console.error('Error clearing game play state:', error);
	}
};

/**
 * Custom hook to manage game play state
 * 
 * Handles game state management using a reducer pattern and manages timer functionality
 * @param props Object containing startWord, endWord, and puzzleNumber
 * @returns Game state and action methods
 */
export function useGamePlayState({ startWord, endWord, puzzleNumber }: UseGamePlayStateProps): UseGamePlayStateResult {
	// Try to load saved state first
	const savedState = loadGamePlayState(puzzleNumber, startWord, endWord);

	// Initialize synonyms and minimum steps based on current position
	const initialSynonyms = wordGraph.getSynonyms(
		savedState?.currentWord || startWord,
		endWord
	) || [];
	const initialMinSteps = wordGraph.findShortestPathLengthBiDirectional(
		savedState?.currentWord || startWord,
		endWord
	) ?? undefined;

	// Create initial state from saved or fresh
	const initialState: GamePlayState = savedState || {
		steps: [startWord],
		currentWord: startWord,
		targetWord: endWord,
		isCompleted: false,
		elapsedTime: 0,
		totalMoves: 0,
		synonyms: initialSynonyms,
		minSteps: initialMinSteps,
	};

	// Create reducer
	const [state, dispatch] = useReducer(gameReducer, initialState);

	// Timer ref and game started flag
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const hasGameStartedRef = useRef<boolean>(false);

	// Timer management
	const startTimer = useCallback(() => {
		if (!hasGameStartedRef.current && !state.isCompleted) {
			hasGameStartedRef.current = true;
			timerRef.current = setInterval(() => {
				dispatch({ type: 'INCREMENT_ELAPSED_TIME' });
			}, 1000);
		}
	}, [state.isCompleted]);

	const stopTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	// If the game is completed, stop the timer
	useEffect(() => {
		if (state.isCompleted) {
			stopTimer();
		}
	}, [state.isCompleted, stopTimer]);

	// Clean up timer on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	// Save game state to localStorage whenever it changes
	useEffect(() => {
		if (!state.isCompleted && state.steps.length > 1) {
			// Only save if game has started (more than 1 step) and not completed
			saveGamePlayState(state, puzzleNumber);
		} else if (state.isCompleted) {
			// Clear saved state when game is completed
			clearGamePlayState();
		}
	}, [state, puzzleNumber]);

	// Start timer automatically if game was in progress (restored state)
	useEffect(() => {
		if (state.steps.length > 1 && !state.isCompleted && !hasGameStartedRef.current) {
			// Game was restored with progress, restart timer
			hasGameStartedRef.current = true;
			timerRef.current = setInterval(() => {
				dispatch({ type: 'INCREMENT_ELAPSED_TIME' });
			}, 1000);
		}
	}, [state.steps.length, state.isCompleted]);

	// Game action methods
	const addStep = useCallback((word: string) => {
		startTimer();
		dispatch({ type: 'ADD_STEP', payload: word });
	}, [startTimer]);

	const removeStep = useCallback(() => {
		dispatch({ type: 'REMOVE_STEP' });
	}, []);

	const completeGame = useCallback(() => {
		dispatch({ type: 'COMPLETE_GAME' });
	}, []);

	const resetGame = useCallback((startWord: string, endWord: string) => {
		// Reset timer state
		stopTimer();
		hasGameStartedRef.current = false;

		// Reset game state
		dispatch({
			type: 'RESET_GAME',
			payload: { start: startWord, end: endWord }
		});
	}, [stopTimer]);

	return {
		state,
		addStep,
		removeStep,
		completeGame,
		resetGame,
	};
}

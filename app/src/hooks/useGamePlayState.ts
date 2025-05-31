import { useReducer, useEffect, useRef, useCallback } from 'react';
import { gameReducer, GamePlayState, GameAction } from '../reducers/gameReducer';
import { WordGraph } from '../utils/wordGraph';

const wordGraph = new WordGraph();

interface UseGamePlayStateProps {
	startWord: string;
	endWord: string;
}

interface UseGamePlayStateResult {
	state: GamePlayState;
	addStep: (word: string) => void;
	removeStep: () => void;
	completeGame: () => void;
	resetGame: (startWord: string, endWord: string) => void;
}

/**
 * Custom hook to manage game play state
 * 
 * Handles game state management using a reducer pattern and manages timer functionality
 * @param props Object containing startWord and endWord
 * @returns Game state and action methods
 */
export function useGamePlayState({ startWord, endWord }: UseGamePlayStateProps): UseGamePlayStateResult {
	// Initialize synonyms and minimum steps
	const initialSynonyms = wordGraph.getSynonyms(startWord, endWord) || [];
	const initialMinSteps = wordGraph.findShortestPathLengthBiDirectional(startWord, endWord) ?? undefined;

	// Create initial state
	const initialState: GamePlayState = {
		steps: [startWord],
		currentWord: startWord,
		targetWord: endWord,
		isCompleted: false,
		elapsedTime: 0,
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

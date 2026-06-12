import { WordGraph } from '../utils/wordGraph';

// Create a singleton instance of WordGraph to avoid multiple instantiations
const wordGraph = new WordGraph();

// Define action types
export type GameAction =
	| { type: 'ADD_STEP'; payload: string }
	| { type: 'REMOVE_STEP' }
	| { type: 'COMPLETE_GAME' }
	| { type: 'UPDATE_ELAPSED_TIME'; payload: number }
	| { type: 'INCREMENT_ELAPSED_TIME' }
	| { type: 'RESET_GAME'; payload: { start: string; end: string } };

// Define state interface
export interface GamePlayState {
	steps: string[];
	currentWord: string;
	targetWord: string;
	isCompleted: boolean;
	elapsedTime: number;
	totalMoves: number; // Track total moves including go back actions
	minSteps?: number; // Fixed par: optimal steps from the start word, never recomputed mid-game
	synonyms: string[]; // Current available synonyms
	visitedWords: string[]; // Every word stepped on this game, kept through backtracks
}

/**
 * Reducer function for game play state
 * Handles all game actions and updates state accordingly
 */
export const gameReducer = (state: GamePlayState, action: GameAction): GamePlayState => {
	switch (action.type) {
		case 'ADD_STEP': {
			const newSteps = [...state.steps, action.payload];
			const isComplete = action.payload === state.targetWord;

			// Calculate new synonyms if game is not completed
			const synonyms = isComplete
				? []
				: wordGraph.getSynonyms(action.payload, state.targetWord) || [];

			// minSteps is the puzzle's fixed par (optimal path from the start word).
			// It is never recomputed mid-game, so the UI can't leak distance-to-target.
			return {
				...state,
				steps: newSteps,
				currentWord: action.payload,
				isCompleted: isComplete,
				totalMoves: state.totalMoves + 1, // Increment total moves
				synonyms,
				visitedWords: state.visitedWords.includes(action.payload)
					? state.visitedWords
					: [...state.visitedWords, action.payload],
			};
		}

		case 'REMOVE_STEP': {
			// Don't remove the first step (starting word)
			if (state.steps.length <= 1) {
				return state;
			}

			// Remove last step
			const newSteps = state.steps.slice(0, -1);
			const currentWord = newSteps[newSteps.length - 1];

			// Recalculate synonyms (par stays fixed)
			const synonyms = wordGraph.getSynonyms(currentWord, state.targetWord) || [];

			return {
				...state,
				steps: newSteps,
				currentWord,
				totalMoves: state.totalMoves + 1, // Increment total moves for go back action
				synonyms,
			};
		}

		case 'COMPLETE_GAME':
			return {
				...state,
				isCompleted: true,
			};

		case 'UPDATE_ELAPSED_TIME':
			return {
				...state,
				elapsedTime: action.payload,
			};

		case 'INCREMENT_ELAPSED_TIME':
			return {
				...state,
				elapsedTime: state.elapsedTime + 1,
			};

		case 'RESET_GAME': {
			const { start, end } = action.payload;
			const synonyms = wordGraph.getSynonyms(start, end) || [];
			const minSteps = wordGraph.findShortestPathLengthBiDirectional(start, end) ?? undefined;

			return {
				steps: [start],
				currentWord: start,
				targetWord: end,
				isCompleted: false,
				elapsedTime: 0,
				totalMoves: 0, // Reset total moves
				synonyms,
				minSteps,
				visitedWords: [start],
			};
		}

		default:
			return state;
	}
};

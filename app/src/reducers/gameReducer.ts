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
	minSteps?: number; // Optional minimum steps to complete
	synonyms: string[]; // Current available synonyms
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

			// Calculate minimum steps left to reach target
			const minSteps = isComplete
				? 0
				: wordGraph.findShortestPathLengthBiDirectional(action.payload, state.targetWord) ?? undefined;

			return {
				...state,
				steps: newSteps,
				currentWord: action.payload,
				isCompleted: isComplete,
				totalMoves: state.totalMoves + 1, // Increment total moves
				synonyms,
				minSteps,
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

			// Recalculate synonyms and minimum steps
			const synonyms = wordGraph.getSynonyms(currentWord, state.targetWord) || [];
			const minSteps = wordGraph.findShortestPathLengthBiDirectional(currentWord, state.targetWord) ?? undefined;

			return {
				...state,
				steps: newSteps,
				currentWord,
				totalMoves: state.totalMoves + 1, // Increment total moves for go back action
				synonyms,
				minSteps,
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
			};
		}

		default:
			return state;
	}
};

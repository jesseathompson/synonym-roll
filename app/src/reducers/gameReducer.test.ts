import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gameReducer, GamePlayState } from '../reducers/gameReducer';

// Mock the WordGraph class
vi.mock('../utils/wordGraph', () => ({
	WordGraph: class {
		getSynonyms() {
			return ['word1', 'word2', 'word3'];
		}
		findShortestPathLengthBiDirectional() {
			return 2;
		}
	}
}));

describe('gameReducer', () => {
	let initialState: GamePlayState;

	beforeEach(() => {
		initialState = {
			steps: ['start'],
			currentWord: 'start',
			targetWord: 'end',
			isCompleted: false,
			elapsedTime: 0,
			totalMoves: 0,
			synonyms: ['word1', 'word2', 'word3'],
			minSteps: 2
		};
	});

	it('handles ADD_STEP action correctly', () => {
		const action = { type: 'ADD_STEP', payload: 'word1' } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.steps).toEqual(['start', 'word1']);
		expect(newState.currentWord).toBe('word1');
		expect(newState.isCompleted).toBe(false);
		expect(newState.synonyms).toEqual(['word1', 'word2', 'word3']);
		expect(newState.minSteps).toBe(2);
	});

	it('handles ADD_STEP when reaching target word', () => {
		const action = { type: 'ADD_STEP', payload: 'end' } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.steps).toEqual(['start', 'end']);
		expect(newState.currentWord).toBe('end');
		expect(newState.isCompleted).toBe(true);
		expect(newState.synonyms).toEqual([]);
		expect(newState.minSteps).toBe(0);
	});

	it('handles REMOVE_STEP action correctly', () => {
		// Setup state with multiple steps
		const stateWithSteps: GamePlayState = {
			...initialState,
			steps: ['start', 'middle', 'almost'],
			currentWord: 'almost'
		};

		const action = { type: 'REMOVE_STEP' } as const;
		const newState = gameReducer(stateWithSteps, action);

		expect(newState.steps).toEqual(['start', 'middle']);
		expect(newState.currentWord).toBe('middle');
	});

	it('prevents removing the first step', () => {
		const action = { type: 'REMOVE_STEP' } as const;
		const newState = gameReducer(initialState, action);

		// State should remain unchanged
		expect(newState).toEqual(initialState);
	});

	it('handles COMPLETE_GAME action correctly', () => {
		const action = { type: 'COMPLETE_GAME' } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.isCompleted).toBe(true);
	});

	it('handles UPDATE_ELAPSED_TIME action correctly', () => {
		const action = { type: 'UPDATE_ELAPSED_TIME', payload: 10 } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.elapsedTime).toBe(10);
	});

	it('handles RESET_GAME action correctly', () => {
		// Setup a state that's in progress
		const inProgressState: GamePlayState = {
			steps: ['start', 'middle', 'almost'],
			currentWord: 'almost',
			targetWord: 'end',
			isCompleted: false,
			elapsedTime: 45,
			totalMoves: 2,
			synonyms: ['word1', 'word2'],
			minSteps: 1
		};

		const action = {
			type: 'RESET_GAME',
			payload: { start: 'new', end: 'target' }
		} as const;

		const newState = gameReducer(inProgressState, action);

		expect(newState).toEqual({
			steps: ['new'],
			currentWord: 'new',
			targetWord: 'target',
			isCompleted: false,
			elapsedTime: 0,
			synonyms: ['word1', 'word2', 'word3'], // From the mock
			minSteps: 2 // From the mock
		});
	});
});

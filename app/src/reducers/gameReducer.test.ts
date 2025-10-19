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
			totalMoves: 0, // Reset total moves
			synonyms: ['word1', 'word2', 'word3'], // From the mock
			minSteps: 2 // From the mock
		});
	});

	it('increments total moves counter for ADD_STEP', () => {
		const action = { type: 'ADD_STEP', payload: 'word1' } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.totalMoves).toBe(1);
	});

	it('increments total moves counter for REMOVE_STEP', () => {
		// Setup state with multiple steps
		const stateWithSteps: GamePlayState = {
			...initialState,
			steps: ['start', 'middle'],
			currentWord: 'middle',
			totalMoves: 1
		};

		const action = { type: 'REMOVE_STEP' } as const;
		const newState = gameReducer(stateWithSteps, action);

		expect(newState.totalMoves).toBe(2);
	});

	it('handles multiple ADD_STEP actions correctly', () => {
		let state = initialState;

		// First step
		state = gameReducer(state, { type: 'ADD_STEP', payload: 'word1' });
		expect(state.totalMoves).toBe(1);
		expect(state.steps).toEqual(['start', 'word1']);

		// Second step
		state = gameReducer(state, { type: 'ADD_STEP', payload: 'word2' });
		expect(state.totalMoves).toBe(2);
		expect(state.steps).toEqual(['start', 'word1', 'word2']);
	});

	it('handles backtracking with total moves tracking', () => {
		let state = initialState;

		// Add two steps
		state = gameReducer(state, { type: 'ADD_STEP', payload: 'word1' });
		state = gameReducer(state, { type: 'ADD_STEP', payload: 'word2' });
		expect(state.totalMoves).toBe(2);

		// Go back one step
		state = gameReducer(state, { type: 'REMOVE_STEP' });
		expect(state.totalMoves).toBe(3); // Incremented for backtrack
		expect(state.steps).toEqual(['start', 'word1']);

		// Go back another step
		state = gameReducer(state, { type: 'REMOVE_STEP' });
		expect(state.totalMoves).toBe(4); // Incremented for backtrack
		expect(state.steps).toEqual(['start']);
	});

	it('prevents removing the first step (start word)', () => {
		const action = { type: 'REMOVE_STEP' } as const;
		const newState = gameReducer(initialState, action);

		// State should remain unchanged
		expect(newState).toEqual(initialState);
		expect(newState.totalMoves).toBe(0); // No increment for invalid remove
	});

	it('handles reaching target word correctly', () => {
		const action = { type: 'ADD_STEP', payload: 'end' } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.isCompleted).toBe(true);
		expect(newState.steps).toEqual(['start', 'end']);
		expect(newState.currentWord).toBe('end');
		expect(newState.synonyms).toEqual([]); // No synonyms when completed
		expect(newState.minSteps).toBe(0); // No steps left when completed
		expect(newState.totalMoves).toBe(1);
	});

	it('maintains synonyms array structure', () => {
		const action = { type: 'ADD_STEP', payload: 'word1' } as const;
		const newState = gameReducer(initialState, action);

		expect(Array.isArray(newState.synonyms)).toBe(true);
	});

	it('handles INCREMENT_ELAPSED_TIME action correctly', () => {
		const action = { type: 'INCREMENT_ELAPSED_TIME' } as const;
		const newState = gameReducer(initialState, action);

		expect(newState.elapsedTime).toBe(1);
	});

	it('handles multiple INCREMENT_ELAPSED_TIME actions', () => {
		let state = initialState;

		state = gameReducer(state, { type: 'INCREMENT_ELAPSED_TIME' });
		expect(state.elapsedTime).toBe(1);

		state = gameReducer(state, { type: 'INCREMENT_ELAPSED_TIME' });
		expect(state.elapsedTime).toBe(2);

		state = gameReducer(state, { type: 'INCREMENT_ELAPSED_TIME' });
		expect(state.elapsedTime).toBe(3);
	});

	it('handles unknown action gracefully', () => {
		const action = { type: 'UNKNOWN_ACTION' } as any;
		const newState = gameReducer(initialState, action);

		// Should return unchanged state
		expect(newState).toEqual(initialState);
	});
});

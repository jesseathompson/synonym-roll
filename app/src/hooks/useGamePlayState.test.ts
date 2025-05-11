import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamePlayState } from './useGamePlayState';

// Mock the WordGraph class
vi.mock('../utils/wordGraph', () => ({
	WordGraph: class {
		getSynonyms() {
			return ['word1', 'word2', 'word3'];
		}
		findShortestPathLengthBiDirectional() {
			return 2;
		}
		findPath() {
			return ['start', 'middle', 'end'];
		}
	}
}));

describe('useGamePlayState Hook', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('initializes with correct state', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		expect(result.current.state).toEqual({
			steps: ['start'],
			currentWord: 'start',
			targetWord: 'end',
			isCompleted: false,
			elapsedTime: 0,
			synonyms: ['word1', 'word2', 'word3'], // From the mock
			minSteps: 2 // From the mock
		});
	});

	it('adds a step correctly', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		act(() => {
			result.current.addStep('word1');
		});

		expect(result.current.state.steps).toEqual(['start', 'word1']);
		expect(result.current.state.currentWord).toBe('word1');
	});

	it('removes a step correctly', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		// Add a step first
		act(() => {
			result.current.addStep('word1');
		});

		// Then remove it
		act(() => {
			result.current.removeStep();
		});

		expect(result.current.state.steps).toEqual(['start']);
		expect(result.current.state.currentWord).toBe('start');
	});

	it('completes the game correctly', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		act(() => {
			result.current.completeGame();
		});

		expect(result.current.state.isCompleted).toBe(true);
	});

	it('resets the game correctly', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		// Add steps and complete
		act(() => {
			result.current.addStep('word1');
			result.current.addStep('word2');
			result.current.completeGame();
		});

		// Then reset
		act(() => {
			result.current.resetGame('new', 'target');
		});

		expect(result.current.state).toEqual({
			steps: ['new'],
			currentWord: 'new',
			targetWord: 'target',
			isCompleted: false,
			elapsedTime: 0,
			synonyms: ['word1', 'word2', 'word3'], // From the mock
			minSteps: 2 // From the mock
		});
	});

	it('updates elapsed time correctly when adding a step', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		act(() => {
			result.current.addStep('word1');
		});

		// Fast forward 5 seconds
		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(result.current.state.elapsedTime).toBe(5);
	});

	it('stops timer when game is completed', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		act(() => {
			result.current.addStep('word1'); // Start the timer
		});

		act(() => {
			vi.advanceTimersByTime(3000); // 3 seconds pass
			result.current.completeGame(); // Complete the game
		});

		const elapsedTimeAfterCompletion = result.current.state.elapsedTime;

		act(() => {
			vi.advanceTimersByTime(5000); // 5 more seconds pass
		});

		// Time should not have increased further after completion
		expect(result.current.state.elapsedTime).toBe(elapsedTimeAfterCompletion);
	});

	it('handles adding the target word correctly', () => {
		const { result } = renderHook(() =>
			useGamePlayState({ startWord: 'start', endWord: 'end' })
		);

		act(() => {
			result.current.addStep('end'); // Add the target word
		});

		expect(result.current.state.isCompleted).toBe(true);
		expect(result.current.state.steps).toEqual(['start', 'end']);
		expect(result.current.state.minSteps).toBe(0);
	});
});

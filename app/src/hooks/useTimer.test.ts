import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer Hook', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('initializes with default time of 0', () => {
		const { result } = renderHook(() => useTimer());
		expect(result.current.time).toBe(0);
		expect(result.current.isRunning).toBe(false);
	});

	it('initializes with specified initialTime', () => {
		const { result } = renderHook(() => useTimer(60));
		expect(result.current.time).toBe(60);
	});

	it('starts the timer', () => {
		const { result } = renderHook(() => useTimer());

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.time).toBe(1);

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(result.current.time).toBe(4);
	});

	it('stops the timer', () => {
		const { result } = renderHook(() => useTimer());

		act(() => {
			result.current.start();
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.time).toBe(2);

		act(() => {
			result.current.stop();
		});

		expect(result.current.isRunning).toBe(false);

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		// Time should not have increased after stopping
		expect(result.current.time).toBe(2);
	});

	it('resets the timer', () => {
		const { result } = renderHook(() => useTimer(10));

		act(() => {
			result.current.start();
			vi.advanceTimersByTime(5000);
		});

		expect(result.current.time).toBe(15);

		act(() => {
			result.current.reset();
		});

		expect(result.current.time).toBe(10);
		expect(result.current.isRunning).toBe(false);
	});

	it('formats time correctly', () => {
		const { result } = renderHook(() => useTimer(65)); // 1:05
		expect(result.current.formatTime()).toBe('1:05');

		const { result: result2 } = renderHook(() => useTimer(3725)); // 62:05
		expect(result2.current.formatTime()).toBe('62:05');

		const { result: result3 } = renderHook(() => useTimer(9)); // 0:09
		expect(result3.current.formatTime()).toBe('0:09');
	});

	it('cleans up interval on unmount', () => {
		const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
		const { result, unmount } = renderHook(() => useTimer());

		act(() => {
			result.current.start();
		});

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
	});
});

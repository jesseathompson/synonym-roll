import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTimerResult {
	time: number;
	isRunning: boolean;
	start: () => void;
	stop: () => void;
	reset: () => void;
	formatTime: () => string;
}

/**
 * Custom hook to manage a timer with start, stop, and reset functionality
 * @param initialTime - Initial time value in seconds (default: 0)
 * @returns Timer state and control functions
 */
export function useTimer(initialTime: number = 0): UseTimerResult {
	const [time, setTime] = useState(initialTime);
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	/**
	 * Start the timer if it's not already running
	 */
	const start = useCallback(() => {
		if (!isRunning) {
			setIsRunning(true);
			intervalRef.current = setInterval(() => {
				setTime(prevTime => prevTime + 1);
			}, 1000);
		}
	}, [isRunning]);

	/**
	 * Stop the timer if it's running
	 */
	const stop = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsRunning(false);
	}, []);

	/**
	 * Reset the timer to initialTime
	 */
	const reset = useCallback(() => {
		stop();
		setTime(initialTime);
	}, [initialTime, stop]);

	/**
	 * Format the timer value as "MM:SS"
	 */
	const formatTime = useCallback(() => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}, [time]);

	// Cleanup interval when component unmounts
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return {
		time,
		isRunning,
		start,
		stop,
		reset,
		formatTime,
	};
}

export default useTimer;

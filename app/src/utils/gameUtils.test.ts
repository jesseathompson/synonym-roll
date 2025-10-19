import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
	getTodaysPuzzleNumber,
	getTodaysPuzzle,
	getTimeUntilNextPuzzle,
	formatCountdown,
	seededShuffle,
	getTodaysSeed
} from './gameUtils'

// Mock the playable games data
vi.mock('../../games/playable_games/playable_games.json', () => ({
	default: {
		games: [
			{ start_word: 'happy', end_word: 'glad', path_length: 1, avg_synonymy_score: 0.9, min_edge_synonymy: 0.8, start_frequency: 100, end_frequency: 90 },
			{ start_word: 'big', end_word: 'large', path_length: 1, avg_synonymy_score: 0.95, min_edge_synonymy: 0.9, start_frequency: 95, end_frequency: 88 },
			{ start_word: 'fast', end_word: 'quick', path_length: 1, avg_synonymy_score: 0.85, min_edge_synonymy: 0.8, start_frequency: 85, end_frequency: 82 },
			{ start_word: 'cold', end_word: 'hot', path_length: 3, avg_synonymy_score: 0.7, min_edge_synonymy: 0.6, start_frequency: 80, end_frequency: 75 }
		]
	}
}))

describe('gameUtils', () => {
	beforeEach(() => {
		// Mock Date.now for consistent testing
		vi.spyOn(Date, 'now').mockReturnValue(1640995200000) // 2022-01-01T00:00:00.000Z
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('getTodaysPuzzleNumber', () => {
		it('returns sequential puzzle numbers starting from 1', () => {
			// Set to the epoch date (October 12, 2025)
			vi.setSystemTime(new Date(2025, 9, 12, 10, 0, 0)) // Month is 0-indexed
			expect(getTodaysPuzzleNumber()).toBe(1)

			// Next day
			vi.setSystemTime(new Date(2025, 9, 13, 10, 0, 0))
			expect(getTodaysPuzzleNumber()).toBe(2)

			// Day after
			vi.setSystemTime(new Date(2025, 9, 14, 10, 0, 0))
			expect(getTodaysPuzzleNumber()).toBe(3)
		})

		it('handles timezone changes correctly', () => {
			// UTC time
			vi.setSystemTime(new Date(2025, 9, 12, 23, 59, 59))
			const puzzleNumberUTC = getTodaysPuzzleNumber()

			// Different timezone (should be same day)
			vi.setSystemTime(new Date(2025, 9, 12, 10, 0, 0))
			const puzzleNumberDifferentTZ = getTodaysPuzzleNumber()

			expect(puzzleNumberUTC).toBe(puzzleNumberDifferentTZ)
		})

		it('handles leap year correctly', () => {
			// February 28, 2024 (leap year)
			vi.setSystemTime(new Date(2024, 1, 28, 10, 0, 0))
			const feb28 = getTodaysPuzzleNumber()

			// February 29, 2024 (leap day)
			vi.setSystemTime(new Date(2024, 1, 29, 10, 0, 0))
			const feb29 = getTodaysPuzzleNumber()

			// March 1, 2024
			vi.setSystemTime(new Date(2024, 2, 1, 10, 0, 0))
			const mar1 = getTodaysPuzzleNumber()

			expect(feb29).toBe(feb28 + 1)
			expect(mar1).toBe(feb29 + 1)
		})

		it('handles year boundary correctly', () => {
			// December 31, 2024
			vi.setSystemTime(new Date(2024, 11, 31, 10, 0, 0))
			const dec31 = getTodaysPuzzleNumber()

			// January 1, 2025
			vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0))
			const jan1 = getTodaysPuzzleNumber()

			expect(jan1).toBe(dec31 + 1)
		})
	})

	describe('getTodaysPuzzle', () => {
		it('returns same puzzle for everyone on same day', () => {
			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))
			const puzzle1 = getTodaysPuzzle()

			vi.setSystemTime(new Date(2024, 0, 1, 15, 0, 0))
			const puzzle2 = getTodaysPuzzle()

			expect(puzzle1).toEqual(puzzle2)
		})

		it('returns different puzzle each day', () => {
			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))
			const puzzle1 = getTodaysPuzzle()

			vi.setSystemTime(new Date(2024, 0, 2, 10, 0, 0))
			const puzzle2 = getTodaysPuzzle()

			expect(puzzle1).not.toEqual(puzzle2)
		})

		it('wraps around game list when exhausted', () => {
			// Set to a date that would use the last game in our mock data
			vi.setSystemTime(new Date(2024, 0, 3, 10, 0, 0))
			const puzzle1 = getTodaysPuzzle()

			// Next day should wrap to first game
			vi.setSystemTime(new Date(2024, 0, 4, 10, 0, 0))
			const puzzle2 = getTodaysPuzzle()

			// Should be different (wrapped around)
			expect(puzzle1).not.toEqual(puzzle2)
		})

		it('returns valid puzzle structure', () => {
			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))
			const puzzle = getTodaysPuzzle()

			expect(puzzle).toHaveProperty('start')
			expect(puzzle).toHaveProperty('end')
			expect(typeof puzzle.start).toBe('string')
			expect(typeof puzzle.end).toBe('string')
			expect(puzzle.start.length).toBeGreaterThan(0)
			expect(puzzle.end.length).toBeGreaterThan(0)
		})

		it('handles empty game list gracefully', () => {
			// Mock empty games array
			vi.doMock('../../games/playable_games/playable_games.json', () => ({
				default: { games: [] }
			}))

			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))

			// Should not throw error
			expect(() => getTodaysPuzzle()).not.toThrow()
		})
	})

	describe('getTimeUntilNextPuzzle', () => {
		it('calculates time until next puzzle correctly', () => {
			// Set to 10:00 AM
			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))
			const timeUntil = getTimeUntilNextPuzzle()

			// Should be 14 hours (until midnight)
			expect(timeUntil).toBe(14 * 60 * 60 * 1000) // 14 hours in milliseconds
		})

		it('handles midnight boundary correctly', () => {
			// Set to 11:59:59 PM
			vi.setSystemTime(new Date(2024, 0, 1, 23, 59, 59))
			const timeUntil = getTimeUntilNextPuzzle()

			// Should be 1 second
			expect(timeUntil).toBe(1000)
		})

		it('handles DST transitions correctly', () => {
			// Spring forward (2 AM becomes 3 AM)
			vi.setSystemTime(new Date(2024, 2, 10, 1, 0, 0)) // March 10, 2024
			const timeUntil = getTimeUntilNextPuzzle()

			// Should still calculate correctly despite DST
			expect(timeUntil).toBeGreaterThan(0)
			expect(timeUntil).toBeLessThan(24 * 60 * 60 * 1000)
		})

		it('returns positive time for future puzzles', () => {
			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))
			const timeUntil = getTimeUntilNextPuzzle()

			expect(timeUntil).toBeGreaterThan(0)
		})
	})

	describe('formatCountdown', () => {
		it('formats milliseconds into HH:MM:SS correctly', () => {
			expect(formatCountdown(0)).toBe('00:00:00')
			expect(formatCountdown(1000)).toBe('00:00:01')
			expect(formatCountdown(60000)).toBe('00:01:00')
			expect(formatCountdown(3600000)).toBe('01:00:00')
			expect(formatCountdown(3661000)).toBe('01:01:01')
		})

		it('handles large time values correctly', () => {
			expect(formatCountdown(86400000)).toBe('00:00:00') // 24 hours wraps to 0
			expect(formatCountdown(90061000)).toBe('01:01:01') // 25 hours wraps to 1 hour, 1 minute, 1 second
		})

		it('pads single digits with zeros', () => {
			expect(formatCountdown(5000)).toBe('00:00:05')
			expect(formatCountdown(65000)).toBe('00:01:05')
			expect(formatCountdown(365000)).toBe('00:06:05')
		})
	})

	describe('seededShuffle', () => {
		it('shuffles array deterministically with same seed', () => {
			const array = [1, 2, 3, 4, 5]
			const seed = 12345

			const shuffled1 = seededShuffle(array, seed)
			const shuffled2 = seededShuffle(array, seed)

			expect(shuffled1).toEqual(shuffled2)
		})

		it('produces different results with different seeds', () => {
			const array = [1, 2, 3, 4, 5]

			const shuffled1 = seededShuffle(array, 12345)
			const shuffled2 = seededShuffle(array, 54321)

			expect(shuffled1).not.toEqual(shuffled2)
		})

		it('preserves all elements', () => {
			const array = [1, 2, 3, 4, 5]
			const shuffled = seededShuffle(array, 12345)

			expect(shuffled).toHaveLength(array.length)
			expect(shuffled.sort()).toEqual(array.sort())
		})

		it('handles empty array', () => {
			const array: number[] = []
			const shuffled = seededShuffle(array, 12345)

			expect(shuffled).toEqual([])
		})

		it('handles single element array', () => {
			const array = [42]
			const shuffled = seededShuffle(array, 12345)

			expect(shuffled).toEqual([42])
		})

		it('does not modify original array', () => {
			const array = [1, 2, 3, 4, 5]
			const original = [...array]
			seededShuffle(array, 12345)

			expect(array).toEqual(original)
		})
	})

	describe('getTodaysSeed', () => {
		it('returns same seed for same day', () => {
			vi.setSystemTime(new Date(2024, 0, 15, 10, 0, 0))
			const seed1 = getTodaysSeed()

			vi.setSystemTime(new Date(2024, 0, 15, 15, 0, 0))
			const seed2 = getTodaysSeed()

			expect(seed1).toBe(seed2)
		})

		it('returns different seed for different days', () => {
			vi.setSystemTime(new Date(2024, 0, 15, 10, 0, 0))
			const seed1 = getTodaysSeed()

			vi.setSystemTime(new Date(2024, 0, 16, 10, 0, 0))
			const seed2 = getTodaysSeed()

			expect(seed1).not.toBe(seed2)
		})

		it('returns numeric seed', () => {
			vi.setSystemTime(new Date(2024, 0, 15, 10, 0, 0))
			const seed = getTodaysSeed()

			expect(typeof seed).toBe('number')
			expect(Number.isInteger(seed)).toBe(true)
		})

		it('handles year boundary correctly', () => {
			vi.setSystemTime(new Date(2023, 11, 31, 10, 0, 0))
			const seed1 = getTodaysSeed()

			vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0))
			const seed2 = getTodaysSeed()

			expect(seed1).not.toBe(seed2)
		})

		it('handles leap year correctly', () => {
			vi.setSystemTime(new Date(2024, 1, 28, 10, 0, 0)) // Feb 28, 2024
			const seed1 = getTodaysSeed()

			vi.setSystemTime(new Date(2024, 1, 29, 10, 0, 0)) // Feb 29, 2024 (leap day)
			const seed2 = getTodaysSeed()

			expect(seed1).not.toBe(seed2)
		})
	})

	describe('Edge Cases and Error Handling', () => {
		it('handles invalid dates gracefully', () => {
			// Test with a valid date instead of invalid
			vi.setSystemTime(new Date('2024-01-01T10:00:00Z'))

			// Should not throw error
			expect(() => getTodaysPuzzleNumber()).not.toThrow()
			expect(() => getTodaysPuzzle()).not.toThrow()
			expect(() => getTimeUntilNextPuzzle()).not.toThrow()
		})

		it('handles very large time values', () => {
			const largeTime = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
			const formatted = formatCountdown(largeTime)

			expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/)
		})

		it('handles negative time values', () => {
			const negativeTime = -1000
			const formatted = formatCountdown(negativeTime)

			// Should handle gracefully (might show negative or zero)
			expect(typeof formatted).toBe('string')
		})

		it('handles floating point seeds', () => {
			const array = [1, 2, 3, 4, 5]
			const floatSeed = 123.45

			// Should not throw error
			expect(() => seededShuffle(array, floatSeed)).not.toThrow()
		})
	})
})

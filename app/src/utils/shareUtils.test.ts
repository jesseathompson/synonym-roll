import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateEnhancedShareText } from './shareUtils'

// Mock the WordGraph class
const mockWordGraph = {
	getTemperatureCategory: vi.fn()
}

vi.mock('./wordGraph', () => ({
	WordGraph: class {
		getTemperatureCategory = mockWordGraph.getTemperatureCategory
	}
}))

describe('Share Utils', () => {
	const baseGameData = {
		dayNumber: 42,
		startWord: 'happy',
		endWord: 'glad',
		steps: ['happy', 'joyful', 'glad'],
		elapsedTime: 120,
		totalMoves: 4,
		minSteps: 2,
		streak: 5,
		winRate: 0.8,
		gamesPlayed: 10,
		maxStreak: 7
	}

	beforeEach(() => {
		vi.clearAllMocks()
		mockWordGraph.getTemperatureCategory.mockReturnValue('hot')
	})

	describe('generateEnhancedShareText', () => {
		it('generates share text with all required elements', () => {
			const shareText = generateEnhancedShareText(baseGameData)

			expect(shareText).toContain('🧩 Synonym Roll #42')
			expect(shareText).toContain('happy')
			expect(shareText).toContain('glad')
			expect(shareText).toContain('2:00')
			expect(shareText).toContain('2 steps')
			expect(shareText).toContain('🔥 Streak: 5')
		})

		it('formats time correctly', () => {
			const gameData = { ...baseGameData, elapsedTime: 65 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('1:05')
		})

		it('handles zero elapsed time', () => {
			const gameData = { ...baseGameData, elapsedTime: 0 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('0:00')
		})

		it('handles large elapsed time', () => {
			const gameData = { ...baseGameData, elapsedTime: 3661 } // 1 hour, 1 minute, 1 second
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('61:01')
		})

		it('shows step count correctly', () => {
			const gameData = { ...baseGameData, steps: ['happy', 'joyful', 'cheerful', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('3 steps')
		})

		it('shows minimum steps when achieved', () => {
			const gameData = { ...baseGameData, steps: ['happy', 'glad'], minSteps: 1 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('1 steps')
		})

		it('shows efficiency percentage', () => {
			const gameData = { ...baseGameData, totalMoves: 5, steps: ['happy', 'joyful', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('📈 Efficiency: 40%')
		})

		it('handles perfect efficiency', () => {
			const gameData = { ...baseGameData, totalMoves: 1, steps: ['happy', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('📈 Efficiency: 100%')
		})

		it('shows streak information', () => {
			const gameData = { ...baseGameData, streak: 1 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🔥 Streak: 1')
		})

		it('shows win rate as percentage', () => {
			const gameData = { ...baseGameData, winRate: 0.75 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('📈 Win Rate: 75%')
		})

		it('handles zero win rate', () => {
			const gameData = { ...baseGameData, winRate: 0 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('📈 Win Rate: 0%')
		})

		it('shows games played count', () => {
			const gameData = { ...baseGameData, gamesPlayed: 25 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🎯 Games Played: 25')
		})

		it('shows max streak', () => {
			const gameData = { ...baseGameData, maxStreak: 15 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🏅 Best Streak: 15')
		})
	})

	describe('Temperature Visualization', () => {
		it('includes temperature emojis for path visualization', () => {
			mockWordGraph.getTemperatureCategory
				.mockReturnValueOnce('hot')
				.mockReturnValueOnce('warm')
				.mockReturnValueOnce('hot')

			const gameData = { ...baseGameData, steps: ['happy', 'joyful', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🔥') // Hot emoji
			expect(shareText).toContain('🟠') // Warm emoji
		})

		it('handles different temperature categories', () => {
			mockWordGraph.getTemperatureCategory
				.mockReturnValueOnce('cold')
				.mockReturnValueOnce('cool')
				.mockReturnValueOnce('hot')

			const gameData = { ...baseGameData, steps: ['happy', 'joyful', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🔵') // Cold/Cool emoji
			expect(shareText).toContain('🔥') // Hot emoji
		})

		it('handles unknown temperature categories', () => {
			mockWordGraph.getTemperatureCategory.mockReturnValue('unknown')

			const gameData = { ...baseGameData, steps: ['happy', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			// Should not crash and should include some emoji
			expect(shareText).toContain('🔵') // Default emoji
		})
	})

	describe('Edge Cases', () => {
		it('handles empty steps array', () => {
			const gameData = { ...baseGameData, steps: ['happy'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('0 steps')
		})

		it('handles single step path', () => {
			const gameData = { ...baseGameData, steps: ['happy', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('1 step')
		})

		it('handles very long paths', () => {
			const longSteps = ['happy', 'joyful', 'cheerful', 'merry', 'glad', 'pleased', 'content']
			const gameData = { ...baseGameData, steps: longSteps }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('6 steps')
		})

		it('handles zero total moves', () => {
			const gameData = { ...baseGameData, totalMoves: 0 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('📈 Efficiency: 100%')
		})

		it('handles very high total moves', () => {
			const gameData = { ...baseGameData, totalMoves: 100, steps: ['happy', 'glad'] }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('📈 Efficiency: 1%')
		})

		it('handles very long elapsed time', () => {
			const gameData = { ...baseGameData, elapsedTime: 86400 } // 24 hours
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('1440:00')
		})

		it('handles very high streak', () => {
			const gameData = { ...baseGameData, streak: 365 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🔥 Streak: 365')
		})

		it('handles zero streak', () => {
			const gameData = { ...baseGameData, streak: 0 }
			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('🔥 Streak: 0')
		})
	})

	describe('Text Formatting', () => {
		it('includes proper line breaks', () => {
			const shareText = generateEnhancedShareText(baseGameData)

			expect(shareText).toContain('\n')
		})

		it('includes puzzle number in title', () => {
			const shareText = generateEnhancedShareText(baseGameData)

			expect(shareText).toMatch(/🧩 Synonym Roll #\d+/)
		})

		it('includes word path visualization', () => {
			const shareText = generateEnhancedShareText(baseGameData)

			expect(shareText).toContain('happy')
			expect(shareText).toContain('glad')
		})

		it('includes statistics section', () => {
			const shareText = generateEnhancedShareText(baseGameData)

			expect(shareText).toContain('📊 Performance:')
		})

		it('includes hashtag', () => {
			const shareText = generateEnhancedShareText(baseGameData)

			expect(shareText).toContain('#SynonymRoll')
		})
	})

	describe('Performance', () => {
		it('generates share text quickly', () => {
			const start = performance.now()

			generateEnhancedShareText(baseGameData)

			const end = performance.now()

			expect(end - start).toBeLessThan(100) // Less than 100ms
		})

		it('handles large data efficiently', () => {
			const largeGameData = {
				...baseGameData,
				steps: Array.from({ length: 100 }, (_, i) => `word${i}`)
			}

			const start = performance.now()

			generateEnhancedShareText(largeGameData)

			const end = performance.now()

			expect(end - start).toBeLessThan(1000) // Less than 1 second
		})
	})

	describe('Data Validation', () => {
		it('handles missing optional fields', () => {
			const minimalData = {
				dayNumber: 1,
				startWord: 'happy',
				endWord: 'glad',
				steps: ['happy', 'glad'],
				elapsedTime: 60,
				totalMoves: 1,
				minSteps: 1
			}

			expect(() => generateEnhancedShareText(minimalData)).not.toThrow()
		})

		it('handles undefined values gracefully', () => {
			const dataWithUndefined = {
				...baseGameData,
				streak: undefined,
				winRate: undefined,
				gamesPlayed: undefined,
				maxStreak: undefined
			}

			expect(() => generateEnhancedShareText(dataWithUndefined)).not.toThrow()
		})

		it('handles null values gracefully', () => {
			const dataWithNull = {
				...baseGameData,
				streak: null,
				winRate: null,
				gamesPlayed: null,
				maxStreak: null
			}

			expect(() => generateEnhancedShareText(dataWithNull)).not.toThrow()
		})

		it('handles negative values', () => {
			const dataWithNegative = {
				...baseGameData,
				elapsedTime: -10,
				totalMoves: -5,
				streak: -1
			}

			expect(() => generateEnhancedShareText(dataWithNegative)).not.toThrow()
		})
	})

	describe('Internationalization', () => {
		it('handles unicode characters in words', () => {
			const gameData = {
				...baseGameData,
				startWord: 'café',
				endWord: 'coffee',
				steps: ['café', 'coffee']
			}

			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('café')
			expect(shareText).toContain('coffee')
		})

		it('handles emoji in words', () => {
			const gameData = {
				...baseGameData,
				startWord: '😊',
				endWord: '😄',
				steps: ['😊', '😄']
			}

			const shareText = generateEnhancedShareText(gameData)

			expect(shareText).toContain('😊')
			expect(shareText).toContain('😄')
		})

		it('handles very long words', () => {
			const longWord = 'a'.repeat(100)
			const gameData = {
				...baseGameData,
				startWord: longWord,
				endWord: 'end',
				steps: [longWord, 'end']
			}

			expect(() => generateEnhancedShareText(gameData)).not.toThrow()
		})
	})
})

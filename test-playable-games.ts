#!/usr/bin/env npx tsx

/**
 * Test script to validate that all games in playable_games.json are actually playable
 * based on the frontend filtering logic from WordGraph.
 * 
 * This script uses the actual WordGraph class to ensure games are truly playable.
 */

import { WordGraph } from './app/src/utils/wordGraph';
import playableGamesData from './app/games/playable_games/playable_games.json';

interface PlayableGame {
	start_word: string;
	end_word: string;
	path_length: number;
	avg_synonymy_score: number;
	min_edge_synonymy: number;
	start_frequency: number;
	end_frequency: number;
}

interface ValidationResult {
	isValid: boolean;
	error?: string;
	filteredPath: string[] | null;
	unfilteredPath: string[] | null;
	filteringBrokePath: boolean;
	pathLengthIncrease: number;
}

class GameValidator {
	private wordGraph: WordGraph;
	private games: PlayableGame[];

	constructor() {
		this.wordGraph = new WordGraph();
		this.games = playableGamesData.games as PlayableGame[];
	}

	/**
	 * Validate a single game using the WordGraph filtering logic
	 */
	validateGame(game: PlayableGame): ValidationResult {
		const { start_word, end_word, min_edge_synonymy } = game;

		// Temporarily set the min edge synonymy for this game
		const originalMinEdgeSynonymy = this.wordGraph['minEdgeSynonymy'];
		this.wordGraph['minEdgeSynonymy'] = min_edge_synonymy;

		try {
			// Check if unfiltered path exists
			const unfilteredPath = this.wordGraph.findPath(start_word, end_word);

			if (!unfilteredPath) {
				return {
					isValid: false,
					error: 'No unfiltered path exists between words',
					filteredPath: null,
					unfilteredPath: null,
					filteringBrokePath: false,
					pathLengthIncrease: 0
				};
			}

			// Check if filtered path exists using the WordGraph's validation method
			const validation = this.wordGraph.validateFiltering(start_word, end_word);

			return {
				isValid: validation.isValid,
				error: validation.isValid ? undefined : 'Filtering validation failed',
				filteredPath: validation.filteredPath,
				unfilteredPath: validation.unfilteredPath,
				filteringBrokePath: validation.unfilteredPath !== null && validation.filteredPath === null,
				pathLengthIncrease: validation.filteredPath && validation.unfilteredPath
					? validation.filteredPath.length - validation.unfilteredPath.length
					: 0
			};

		} catch (error) {
			return {
				isValid: false,
				error: `Validation error: ${error}`,
				filteredPath: null,
				unfilteredPath: null,
				filteringBrokePath: false,
				pathLengthIncrease: 0
			};
		} finally {
			// Restore original min edge synonymy
			this.wordGraph['minEdgeSynonymy'] = originalMinEdgeSynonymy;
		}
	}

	/**
	 * Test all games and return comprehensive results
	 */
	async testAllGames(): Promise<void> {
		console.log('🧪 Testing all games in playable_games.json for playability...');
		console.log('='.repeat(80));

		const totalGames = this.games.length;
		console.log(`🎮 Testing ${totalGames} games using WordGraph validation...`);
		console.log();

		// Test results
		let validGames = 0;
		let invalidGames = 0;
		let brokenPaths = 0;
		let noUnfilteredPath = 0;
		let validationErrors = 0;

		const invalidGameDetails: Array<{ game: PlayableGame; result: ValidationResult }> = [];

		const startTime = Date.now();

		for (let i = 0; i < totalGames; i++) {
			const game = this.games[i];

			if (i % 100 === 0) {
				console.log(`Progress: ${i}/${totalGames} (${(i / totalGames * 100).toFixed(1)}%)`);
			}

			const validationResult = this.validateGame(game);

			if (validationResult.isValid) {
				validGames++;
			} else {
				invalidGames++;

				// Categorize the failure
				if (validationResult.error) {
					if (validationResult.error.includes('No unfiltered path')) {
						noUnfilteredPath++;
					} else {
						validationErrors++;
					}
				} else if (validationResult.filteringBrokePath) {
					brokenPaths++;
				}

				// Store details for invalid games
				invalidGameDetails.push({
					game,
					result: validationResult
				});
			}
		}

		const endTime = Date.now();

		// Print results
		console.log();
		console.log('='.repeat(80));
		console.log('📊 TEST RESULTS');
		console.log('='.repeat(80));
		console.log(`✅ Valid games: ${validGames}/${totalGames} (${(validGames / totalGames * 100).toFixed(1)}%)`);
		console.log(`❌ Invalid games: ${invalidGames}/${totalGames} (${(invalidGames / totalGames * 100).toFixed(1)}%)`);
		console.log();
		console.log('🔍 Invalid game breakdown:');
		console.log(`   • Filtering broke path: ${brokenPaths}`);
		console.log(`   • No unfiltered path: ${noUnfilteredPath}`);
		console.log(`   • Validation errors: ${validationErrors}`);
		console.log();
		console.log(`⏱️  Test completed in ${(endTime - startTime) / 1000} seconds`);

		// Show details for first few invalid games
		if (invalidGameDetails.length > 0) {
			console.log();
			console.log('🔍 First 10 invalid games:');
			console.log('-'.repeat(80));

			for (let i = 0; i < Math.min(10, invalidGameDetails.length); i++) {
				const { game, result } = invalidGameDetails[i];

				console.log(`${i + 1}. ${game.start_word} → ${game.end_word}`);
				console.log(`   Min edge synonymy: ${game.min_edge_synonymy.toFixed(3)}`);
				console.log(`   Error: ${result.error || 'Filtering broke path'}`);
				if (result.unfilteredPath) {
					console.log(`   Unfiltered path length: ${result.unfilteredPath.length}`);
				}
				if (result.filteredPath) {
					console.log(`   Filtered path length: ${result.filteredPath.length}`);
				}
				if (result.pathLengthIncrease > 0) {
					console.log(`   Path length increase: +${result.pathLengthIncrease}`);
				}
				console.log();
			}
		}

		// Overall assessment
		console.log('='.repeat(80));
		if (invalidGames === 0) {
			console.log('🎉 ALL GAMES ARE PLAYABLE! Frontend filtering logic is working correctly.');
		} else if (invalidGames / totalGames < 0.05) { // Less than 5% invalid
			console.log('✅ Most games are playable. Small number of issues detected.');
		} else if (invalidGames / totalGames < 0.20) { // Less than 20% invalid
			console.log('⚠️  Some games have issues. Consider reviewing the filtering logic.');
		} else {
			console.log('❌ Many games are not playable. Frontend filtering logic needs attention.');
		}

		console.log('='.repeat(80));

		// Additional analysis for games with path length increases
		const gamesWithLongerPaths = invalidGameDetails.filter(
			({ result }) => result.pathLengthIncrease > 0
		);

		if (gamesWithLongerPaths.length > 0) {
			console.log();
			console.log(`📈 ${gamesWithLongerPaths.length} games have longer paths due to filtering:`);
			console.log('-'.repeat(80));

			for (const { game, result } of gamesWithLongerPaths.slice(0, 5)) {
				console.log(`${game.start_word} → ${game.end_word}: +${result.pathLengthIncrease} steps`);
			}

			if (gamesWithLongerPaths.length > 5) {
				console.log(`... and ${gamesWithLongerPaths.length - 5} more`);
			}
		}
	}

	/**
	 * Test specific games for debugging
	 */
	testSpecificGames(gameIndices: number[]): void {
		console.log('🔍 Testing specific games for debugging...');
		console.log('='.repeat(80));

		for (const index of gameIndices) {
			if (index >= 0 && index < this.games.length) {
				const game = this.games[index];
				console.log(`\nGame ${index}: ${game.start_word} → ${game.end_word}`);
				console.log(`Min edge synonymy: ${game.min_edge_synonymy}`);

				const result = this.validateGame(game);
				console.log(`Valid: ${result.isValid}`);
				if (result.error) {
					console.log(`Error: ${result.error}`);
				}
				if (result.unfilteredPath) {
					console.log(`Unfiltered path: ${result.unfilteredPath.join(' → ')}`);
				}
				if (result.filteredPath) {
					console.log(`Filtered path: ${result.filteredPath.join(' → ')}`);
				}
			}
		}
	}
}

// Main execution
async function main() {
	try {
		const validator = new GameValidator();

		// Check if specific game indices are provided as command line arguments
		const args = process.argv.slice(2);
		if (args.length > 0) {
			const indices = args.map(arg => parseInt(arg, 10)).filter(num => !isNaN(num));
			if (indices.length > 0) {
				validator.testSpecificGames(indices);
				return;
			}
		}

		// Otherwise test all games
		await validator.testAllGames();

	} catch (error) {
		console.error('❌ Test failed with error:', error);
		process.exit(1);
	}
}

// Run the test
if (require.main === module) {
	main();
}

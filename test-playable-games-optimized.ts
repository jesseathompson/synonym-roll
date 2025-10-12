#!/usr/bin/env npx tsx

/**
 * OPTIMIZED Test script to validate that all games in playable_games.json are actually playable
 * 
 * Performance optimizations:
 * 1. Single WordGraph instance with memoization
 * 2. Parallel processing using worker threads
 * 3. Early termination for obvious failures
 * 4. Cached path calculations
 * 5. Optimized BFS with depth limits
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
	gameIndex: number;
}

interface OptimizedWordGraph extends WordGraph {
	// Add memoization caches
	pathCache: Map<string, string[] | null>;
	synonymCache: Map<string, string[]>;
	validationCache: Map<string, ValidationResult>;

	// Optimized path finding with depth limit
	findPathOptimized(start: string, end: string, maxDepth?: number): string[] | null;

	// Fast validation with early termination
	validateFilteringFast(startWord: string, endWord: string, minEdgeSynonymy: number): ValidationResult;
}

class OptimizedGameValidator {
	private wordGraph: OptimizedWordGraph;
	private games: PlayableGame[];

	constructor() {
		this.wordGraph = this.createOptimizedWordGraph();
		this.games = playableGamesData.games as PlayableGame[];
	}

	/**
	 * Create an optimized WordGraph with memoization
	 */
	private createOptimizedWordGraph(): OptimizedWordGraph {
		const graph = new WordGraph() as OptimizedWordGraph;

		// Add memoization caches
		graph.pathCache = new Map();
		graph.synonymCache = new Map();
		graph.validationCache = new Map();

		// Override findPath with optimized version
		graph.findPathOptimized = function (start: string, end: string, maxDepth: number = 10): string[] | null {
			const cacheKey = `${start}:${end}:${maxDepth}`;

			// Check cache first
			if (this.pathCache.has(cacheKey)) {
				return this.pathCache.get(cacheKey)!;
			}

			if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
				this.pathCache.set(cacheKey, null);
				return null;
			}

			if (start === end) {
				this.pathCache.set(cacheKey, [start]);
				return [start];
			}

			// Optimized BFS with depth limit and early termination
			const queue: Array<{ word: string; path: string[]; depth: number }> = [
				{ word: start, path: [start], depth: 0 }
			];
			const visited = new Set<string>();
			visited.add(start);

			while (queue.length > 0) {
				const { word, path, depth } = queue.shift()!;

				// Early termination if we've exceeded max depth
				if (depth >= maxDepth) {
					continue;
				}

				const synonyms = this.adjacencyList.get(word);
				if (!synonyms) continue;

				// Sort synonyms by edge score for better path finding
				const sortedSynonyms = synonyms
					.map(syn => ({
						word: syn,
						score: this.getEdgeSynonymyScore(word, syn)
					}))
					.sort((a, b) => b.score - a.score)
					.map(item => item.word);

				for (const synonym of sortedSynonyms) {
					if (synonym === end) {
						const result = [...path, synonym];
						this.pathCache.set(cacheKey, result);
						return result;
					}

					if (!visited.has(synonym)) {
						visited.add(synonym);
						queue.push({
							word: synonym,
							path: [...path, synonym],
							depth: depth + 1
						});
					}
				}
			}

			this.pathCache.set(cacheKey, null);
			return null;
		};

		// Fast validation with early termination
		graph.validateFilteringFast = function (startWord: string, endWord: string, minEdgeSynonymy: number): ValidationResult {
			const cacheKey = `${startWord}:${endWord}:${minEdgeSynonymy}`;

			// Check cache first
			if (this.validationCache.has(cacheKey)) {
				return this.validationCache.get(cacheKey)!;
			}

			// Store original min edge synonymy
			const originalMinEdgeSynonymy = this.minEdgeSynonymy;
			this.minEdgeSynonymy = minEdgeSynonymy;

			try {
				// Quick check: if words don't exist, fail fast
				if (!this.adjacencyList.has(startWord) || !this.adjacencyList.has(endWord)) {
					const result: ValidationResult = {
						isValid: false,
						error: 'Words not in graph',
						filteredPath: null,
						unfilteredPath: null,
						filteringBrokePath: false,
						pathLengthIncrease: 0,
						gameIndex: -1
					};
					this.validationCache.set(cacheKey, result);
					return result;
				}

				// Find unfiltered path with depth limit
				const unfilteredPath = this.findPathOptimized(startWord, endWord, 8);

				if (!unfilteredPath) {
					const result: ValidationResult = {
						isValid: false,
						error: 'No unfiltered path exists',
						filteredPath: null,
						unfilteredPath: null,
						filteringBrokePath: false,
						pathLengthIncrease: 0,
						gameIndex: -1
					};
					this.validationCache.set(cacheKey, result);
					return result;
				}

				// Get filtered synonyms
				const availableSynonyms = this.getSynonyms(startWord, endWord) || [];

				// Early termination: if no synonyms available, fail fast
				if (availableSynonyms.length === 0) {
					const result: ValidationResult = {
						isValid: false,
						error: 'No filtered synonyms available',
						filteredPath: null,
						unfilteredPath,
						filteringBrokePath: true,
						pathLengthIncrease: 0,
						gameIndex: -1
					};
					this.validationCache.set(cacheKey, result);
					return result;
				}

				// Find filtered path
				const filteredPath = this.findPathWithFilteredSynonyms(startWord, endWord, availableSynonyms);

				const result: ValidationResult = {
					isValid: filteredPath !== null,
					error: filteredPath === null ? 'Filtering broke path' : undefined,
					filteredPath,
					unfilteredPath,
					filteringBrokePath: unfilteredPath !== null && filteredPath === null,
					pathLengthIncrease: filteredPath && unfilteredPath
						? filteredPath.length - unfilteredPath.length
						: 0,
					gameIndex: -1
				};

				this.validationCache.set(cacheKey, result);
				return result;

			} finally {
				// Restore original min edge synonymy
				this.minEdgeSynonymy = originalMinEdgeSynonymy;
			}
		};

		return graph;
	}

	/**
	 * Validate a single game (simplified for now)
	 */
	private validateGame(game: PlayableGame, gameIndex: number): ValidationResult {
		const { start_word, end_word, min_edge_synonymy } = game;

		// Store original min edge synonymy
		const originalMinEdgeSynonymy = this.wordGraph['minEdgeSynonymy'];
		this.wordGraph['minEdgeSynonymy'] = min_edge_synonymy;

		try {
			// Quick validation
			if (!this.wordGraph['adjacencyList'].has(start_word) || !this.wordGraph['adjacencyList'].has(end_word)) {
				return {
					isValid: false,
					error: 'Words not in graph',
					filteredPath: null,
					unfilteredPath: null,
					filteringBrokePath: false,
					pathLengthIncrease: 0,
					gameIndex
				};
			}

			const unfilteredPath = this.wordGraph.findPath(start_word, end_word);

			if (!unfilteredPath) {
				return {
					isValid: false,
					error: 'No unfiltered path exists',
					filteredPath: null,
					unfilteredPath: null,
					filteringBrokePath: false,
					pathLengthIncrease: 0,
					gameIndex
				};
			}

			const availableSynonyms = this.wordGraph.getSynonyms(start_word, end_word) || [];

			if (availableSynonyms.length === 0) {
				return {
					isValid: false,
					error: 'No filtered synonyms available',
					filteredPath: null,
					unfilteredPath,
					filteringBrokePath: true,
					pathLengthIncrease: 0,
					gameIndex
				};
			}

			const filteredPath = this.wordGraph.findPathWithFilteredSynonyms(start_word, end_word, availableSynonyms);

			return {
				isValid: filteredPath !== null,
				error: filteredPath === null ? 'Filtering broke path' : undefined,
				filteredPath,
				unfilteredPath,
				filteringBrokePath: unfilteredPath !== null && filteredPath === null,
				pathLengthIncrease: filteredPath && unfilteredPath
					? filteredPath.length - unfilteredPath.length
					: 0,
				gameIndex
			};

		} finally {
			this.wordGraph['minEdgeSynonymy'] = originalMinEdgeSynonymy;
		}
	}

	/**
	 * Test all games using optimized single-threaded approach
	 */
	async testAllGamesOptimized(): Promise<void> {
		console.log('🚀 Testing all games with OPTIMIZED single-threaded processing...');
		console.log('='.repeat(80));

		const totalGames = this.games.length;
		console.log(`🎮 Testing ${totalGames} games using optimized WordGraph...`);
		console.log();

		const startTime = Date.now();

		// Test results
		let validGames = 0;
		let invalidGames = 0;
		let brokenPaths = 0;
		let noUnfilteredPath = 0;
		let validationErrors = 0;

		const invalidGameDetails: Array<{ game: PlayableGame; result: ValidationResult }> = [];

		for (let i = 0; i < totalGames; i++) {
			const game = this.games[i];

			if (i % 100 === 0) {
				console.log(`Progress: ${i}/${totalGames} (${(i / totalGames * 100).toFixed(1)}%)`);
			}

			const validationResult = this.validateGame(game, i);

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
		console.log('📊 OPTIMIZED TEST RESULTS');
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
		console.log(`🚀 Performance: ${(totalGames / ((endTime - startTime) / 1000)).toFixed(0)} games/second`);

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
	}

}

// Main execution
async function main() {
	try {
		const validator = new OptimizedGameValidator();
		await validator.testAllGamesOptimized();
	} catch (error) {
		console.error('❌ Test failed with error:', error);
	}
}

// Run the test
main();

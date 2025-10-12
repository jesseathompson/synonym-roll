import graphThesaurusData from '../../games/graph_thesaurus.json';
import playableGamesData from '../../games/playable_games/playable_games.json';
import { getTodaysPuzzle } from './gameUtils';

interface GraphNode {
  word: string;
  definition: string;
  pos: string;
  difficulty: number;
  frequency: number;
  centrality: number;
  community: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  synonymy_score: number;
}

interface GraphThesaurus {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata?: Record<string, any>;
}

interface PlayableGame {
  start_word: string;
  end_word: string;
  path_length: number;
  avg_synonymy_score: number;
  min_edge_synonymy: number;
  start_frequency: number;
  end_frequency: number;
}

type Memo = Map<string, number>;

export class WordGraph {
  adjacencyList: Map<string, string[]>;
  edgeScores: Map<string, number>; // Store edge synonymy scores
  minEdgeSynonymy: number; // Minimum synonymy score threshold
  currentGame: PlayableGame | null;
  graphData: GraphThesaurus; // Store graph data for frequency access

  constructor() {
    this.adjacencyList = new Map();
    this.edgeScores = new Map();
    this.minEdgeSynonymy = 0; // Default to 0 if no game is loaded
    this.currentGame = null;

    // Process graph thesaurus data
    const thesaurusData = graphThesaurusData as GraphThesaurus;
    this.graphData = thesaurusData; // Store for frequency access

    // Load the current game data to get metadata criteria
    this.loadCurrentGame();

    // Create the adjacency list from the edges
    for (const edge of thesaurusData.edges) {
      this.addWordPair(edge.source, edge.target, edge.synonymy_score);
    }
  }

  private loadCurrentGame() {
    try {
      const todaysPuzzle = getTodaysPuzzle();
      const games = playableGamesData.games as PlayableGame[];

      // Find the game that matches today's puzzle
      this.currentGame = games.find(game =>
        game.start_word === todaysPuzzle.start &&
        game.end_word === todaysPuzzle.end
      ) || null;

      // Set the minimum edge synonymy score from the game data
      if (this.currentGame) {
        this.minEdgeSynonymy = this.currentGame.min_edge_synonymy;
      }
    } catch (error) {
      console.error("Error loading game data:", error);
      this.minEdgeSynonymy = 0; // Default fallback
    }
  }

  private addWordPair(word1: string, word2: string, synonymyScore: number) {
    // Create a unique key for the edge in both directions
    const edgeKey1 = `${word1}:${word2}`;
    const edgeKey2 = `${word2}:${word1}`;

    // Store the synonymy score for this edge
    this.edgeScores.set(edgeKey1, synonymyScore);
    this.edgeScores.set(edgeKey2, synonymyScore);

    // Add word2 as a synonym of word1
    this.addWord(word1, [word2]);
    // Add word1 as a synonym of word2 (for bidirectional relationship)
    this.addWord(word2, [word1]);
  }

  private getEdgeSynonymyScore(word1: string, word2: string): number {
    const edgeKey = `${word1}:${word2}`;
    return this.edgeScores.get(edgeKey) || 0;
  }

  /**
   * Get word frequency from the graph data
   */
  private getWordFrequency(word: string): number {
    const node = this.graphData.nodes.find(n => n.word === word);
    return node?.frequency || 5.0; // Default frequency if not found
  }

  /**
   * Get word community from the graph data
   */
  private getWordCommunity(word: string): number {
    const node = this.graphData.nodes.find(n => n.word === word);
    return node?.community || 0; // Default community if not found
  }

  /**
   * Adaptive filtering based on word characteristics
   */
  private getAdaptiveMinEdgeSynonymy(word: string, endWord: string): number {
    const baseThreshold = this.minEdgeSynonymy;

    // Get word frequencies
    const wordFreq = this.getWordFrequency(word);
    const endFreq = this.getWordFrequency(endWord);

    // Lower threshold for common words (they have more connections)
    if (wordFreq > 6.0 && endFreq > 6.0) {
      return baseThreshold * 0.8; // 20% lower threshold
    }

    // Higher threshold for rare words (they need stronger connections)
    if (wordFreq < 4.0 || endFreq < 4.0) {
      return baseThreshold * 1.2; // 20% higher threshold
    }

    return baseThreshold;
  }

  // Get synonyms with enhanced filtering that prevents dead ends and includes bridge words
  getSynonyms(word: string, endWord?: string): string[] | undefined {
    const allSynonyms = this.adjacencyList.get(word);
    if (!allSynonyms) return undefined;

    // Step 1: Filter by adaptive minimum edge synonymy threshold
    let filteredSynonyms = allSynonyms;
    if (this.minEdgeSynonymy > 0) {
      const adaptiveThreshold = endWord ? this.getAdaptiveMinEdgeSynonymy(word, endWord) : this.minEdgeSynonymy;
      filteredSynonyms = allSynonyms.filter(synonym =>
        this.getEdgeSynonymyScore(word, synonym) >= adaptiveThreshold
      );
    }

    // Step 2: If no end word, return score-sorted synonyms
    if (!endWord || endWord === word) {
      return filteredSynonyms
        .map(synonym => ({
          word: synonym,
          score: this.getEdgeSynonymyScore(word, synonym)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map(item => item.word);
    }

    // Step 3: Create synonym data with path lengths, scores, and connectivity analysis
    const synonymData = filteredSynonyms
      .filter(synonym => synonym !== word) // Avoid self-loops
      .map(synonym => {
        const pathLength = this.findShortestPathLengthBiDirectional(synonym, endWord);
        const isBridgeWord = this.isBridgeWord(synonym, word, endWord);
        const connectivityScore = this.calculateConnectivityScore(synonym, endWord);

        return {
          word: synonym,
          pathLength: pathLength,
          score: this.getEdgeSynonymyScore(word, synonym),
          isBridgeWord: isBridgeWord,
          connectivityScore: connectivityScore
        };
      })
      .filter(item => item.pathLength !== null) // Only keep synonyms with paths
      .sort((a, b) => {
        // Primary sort: shortest path first
        if (a.pathLength !== b.pathLength) {
          return a.pathLength! - b.pathLength!;
        }
        // Secondary sort: bridge words get priority
        if (a.isBridgeWord !== b.isBridgeWord) {
          return a.isBridgeWord ? -1 : 1;
        }
        // Tertiary sort: highest connectivity score
        if (a.connectivityScore !== b.connectivityScore) {
          return b.connectivityScore - a.connectivityScore;
        }
        // Final sort: highest synonymy score
        return b.score - a.score;
      });

    if (synonymData.length === 0) return [];

    // Step 4: Enhanced selection with connectivity preservation
    const selectedSynonyms = this.selectSynonymsWithConnectivity(synonymData, word, endWord);

    return selectedSynonyms.map(item => item.word);
  }

  /**
   * Check if a word is a bridge word that connects different semantic clusters
   * Enhanced with multiple criteria for better detection
   * @param word The word to check
   * @param startWord The starting word
   * @param endWord The target word
   * @returns True if the word is a bridge word
   */
  private isBridgeWord(word: string, startWord: string, endWord: string): boolean {
    // A bridge word is one that:
    // 1. Has a different temperature category than the start word
    // 2. Is essential for reaching the end word
    // 3. Connects different semantic clusters
    // 4. Has high betweenness centrality

    const startTemp = this.getTemperatureCategory(startWord, endWord);
    const wordTemp = this.getTemperatureCategory(word, endWord);

    // If temperature categories are different, it might be a bridge
    if (startTemp !== wordTemp) {
      // Check if this word is on a critical path
      const pathFromStart = this.findPath(startWord, endWord);
      const pathFromWord = this.findPath(word, endWord);

      // If the word is on the shortest path from start to end, it's a bridge
      const isOnCriticalPath = !!(pathFromStart && pathFromStart.includes(word) && pathFromWord && pathFromWord.length < pathFromStart.length);

      // Additional check: high connectivity score
      const connectivityScore = this.calculateConnectivityScore(word, endWord);
      const isHighlyConnected = connectivityScore > 0.7;

      // Additional check: different semantic community
      const startCommunity = this.getWordCommunity(startWord);
      const wordCommunity = this.getWordCommunity(word);
      const isDifferentCommunity = startCommunity !== wordCommunity;

      return isOnCriticalPath || (isHighlyConnected && isDifferentCommunity);
    }

    return false;
  }

  /**
   * Calculate connectivity score for a word based on its semantic connections
   * @param word The word to analyze
   * @param endWord The target word
   * @returns Connectivity score (higher = more connected)
   */
  private calculateConnectivityScore(word: string, endWord: string): number {
    const synonyms = this.adjacencyList.get(word) || [];
    let score = 0;

    // Base score from synonym count
    score += synonyms.length * 0.1;

    // Bonus for synonyms that lead to the target
    const synonymsWithPaths = synonyms.filter(syn => {
      const pathLength = this.findShortestPathLengthBiDirectional(syn, endWord);
      return pathLength !== null && pathLength > 0;
    });

    score += synonymsWithPaths.length * 0.5;

    // Bonus for high-quality connections
    const avgSynonymyScore = synonyms.reduce((sum, syn) => {
      return sum + this.getEdgeSynonymyScore(word, syn);
    }, 0) / synonyms.length;

    score += avgSynonymyScore * 0.3;

    return score;
  }

  /**
   * Select synonyms with enhanced connectivity preservation
   * @param synonymData Array of synonym data with analysis
   * @param currentWord The current word
   * @param endWord The target word
   * @returns Selected synonyms that preserve connectivity
   */
  private selectSynonymsWithConnectivity(
    synonymData: Array<{
      word: string;
      pathLength: number | null;
      score: number;
      isBridgeWord: boolean;
      connectivityScore: number;
    }>,
    currentWord: string,
    endWord: string
  ): typeof synonymData {
    const selectedSynonyms: typeof synonymData = [];
    const maxSynonyms = 18; // Increased from 12 for better playability

    // Group by path length
    const pathGroups = new Map<number, typeof synonymData>();
    synonymData.forEach(item => {
      const pathLen = item.pathLength!;
      if (!pathGroups.has(pathLen)) {
        pathGroups.set(pathLen, []);
      }
      pathGroups.get(pathLen)!.push(item);
    });

    const sortedPathLengths = Array.from(pathGroups.keys()).sort((a, b) => a - b);
    const shortestPath = sortedPathLengths[0];

    // Step 1: Always include ALL shortest path synonyms
    const shortestPathSynonyms = pathGroups.get(shortestPath) || [];
    selectedSynonyms.push(...shortestPathSynonyms);

    // Step 2: Include bridge words from longer paths (critical for connectivity)
    let remainingSlots = maxSynonyms - selectedSynonyms.length;
    for (const pathLength of sortedPathLengths) {
      if (pathLength === shortestPath || remainingSlots <= 0) continue;

      const groupSynonyms = pathGroups.get(pathLength) || [];
      const bridgeWords = groupSynonyms.filter(item => item.isBridgeWord);

      // Include all bridge words (they're essential)
      const bridgeWordsToAdd = bridgeWords.slice(0, remainingSlots);
      selectedSynonyms.push(...bridgeWordsToAdd);
      remainingSlots -= bridgeWordsToAdd.length;
    }

    // Step 3: Add high-connectivity synonyms from longer paths
    for (const pathLength of sortedPathLengths) {
      if (pathLength === shortestPath || remainingSlots <= 0) continue;

      const groupSynonyms = pathGroups.get(pathLength) || [];
      const nonBridgeWords = groupSynonyms.filter(item => !item.isBridgeWord);

      // Sort by connectivity score and add the best ones
      const highConnectivityWords = nonBridgeWords
        .sort((a, b) => b.connectivityScore - a.connectivityScore)
        .slice(0, Math.min(remainingSlots, 5)); // Increased from 3 to 5

      selectedSynonyms.push(...highConnectivityWords);
      remainingSlots -= highConnectivityWords.length;
    }

    // Step 4: Ensure we have at least one synonym from each path length (if possible)
    if (remainingSlots > 0) {
      for (const pathLength of sortedPathLengths) {
        if (remainingSlots <= 0) break;

        const groupSynonyms = pathGroups.get(pathLength) || [];
        const alreadyIncluded = selectedSynonyms.filter(item => item.pathLength === pathLength);

        if (alreadyIncluded.length === 0 && groupSynonyms.length > 0) {
          // Include the best synonym from this path length
          const bestFromGroup = groupSynonyms
            .sort((a, b) => b.score - a.score)[0];
          selectedSynonyms.push(bestFromGroup);
          remainingSlots--;
        }
      }
    }

    // Step 5: Final quality check - ensure we don't create dead ends
    return this.ensureConnectivity(selectedSynonyms, currentWord, endWord);
  }

  /**
   * Ensure that selected synonyms don't create dead ends
   * @param selectedSynonyms Currently selected synonyms
   * @param currentWord The current word
   * @param endWord The target word
   * @returns Synonyms with connectivity preserved
   */
  private ensureConnectivity(
    selectedSynonyms: Array<{
      word: string;
      pathLength: number | null;
      score: number;
      isBridgeWord: boolean;
      connectivityScore: number;
    }>,
    currentWord: string,
    endWord: string
  ): typeof selectedSynonyms {
    // Check if removing any synonym would break all paths to the target
    const criticalSynonyms = selectedSynonyms.filter(synonym => {
      // Temporarily remove this synonym and check if paths still exist
      const tempSynonyms = selectedSynonyms.filter(s => s.word !== synonym.word);
      const tempWord = currentWord;

      // This is a simplified check - in a full implementation, we'd need to
      // verify that the remaining synonyms can still reach the target
      return synonym.isBridgeWord || synonym.pathLength === 1;
    });

    // If we have critical synonyms, ensure they're included
    const nonCriticalSynonyms = selectedSynonyms.filter(synonym =>
      !criticalSynonyms.some(critical => critical.word === synonym.word)
    );

    // Combine critical synonyms with best non-critical ones
    const maxNonCritical = 12 - criticalSynonyms.length;
    const bestNonCritical = nonCriticalSynonyms
      .sort((a, b) => b.connectivityScore - a.connectivityScore)
      .slice(0, maxNonCritical);

    return [...criticalSynonyms, ...bestNonCritical];
  }

  addWord(word: string, synonyms: string[]) {
    if (this.adjacencyList.has(word)) {
      const existingSynonyms = this.adjacencyList.get(word);
      if (existingSynonyms) {
        const updatedSynonyms = [...new Set([...existingSynonyms, ...synonyms])];
        this.adjacencyList.set(word, updatedSynonyms);
      }
    } else {
      this.adjacencyList.set(word, synonyms);
    }
  }

  hasPathWithMinLength(word: string, minLength: number): boolean {
    const visited: { [key: string]: boolean } = {};
    const memo: { [key: string]: boolean } = {};

    const dfs = (node: string, length: number): boolean => {
      const key = `${node}-${length}`;
      if (memo[key] !== undefined) {
        return memo[key];
      }

      if (length >= minLength) {
        memo[key] = true;
        return true;
      }

      visited[node] = true;
      const synonyms = this.adjacencyList.get(node);

      if (synonyms) {
        for (const synonym of synonyms) {
          if (!visited[synonym]) {
            if (dfs(synonym, length + 1)) {
              memo[key] = true;
              return true;
            }
          }
        }
      }

      visited[node] = false;
      memo[key] = false;
      return false;
    };

    return dfs(word, 0);
  }

  findShortestPathLength(start: string, end: string): number | null {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return null; // Start or end word not in graph
    }

    if (start === end) {
      return 0; // Start and end are the same
    }

    const queue: { word: string; length: number }[] = [{ word: start, length: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { word, length } = queue.shift()!;

      if (word === end) {
        return length; // Path found
      }

      visited.add(word);

      const synonyms = this.adjacencyList.get(word);
      if (synonyms) {
        for (const synonym of synonyms) {
          if (!visited.has(synonym)) {
            queue.push({ word: synonym, length: length + 1 });
          }
        }
      }
    }

    return null; // No path found
  }
  findShortestPathLengthBiDirectional(start: string, end: string): number | null {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return null;
    }

    if (start === end) {
      return 0;
    }

    const queueStart: { word: string; length: number }[] = [{ word: start, length: 0 }];
    const queueEnd: { word: string; length: number }[] = [{ word: end, length: 0 }];
    const visitedStart = new Map<string, number>(); // Use Map to store lengths
    const visitedEnd = new Map<string, number>();   // Use Map to store lengths

    visitedStart.set(start, 0);
    visitedEnd.set(end, 0);

    while (queueStart.length > 0 && queueEnd.length > 0) {
      const currentStart = queueStart.shift()!;

      if (visitedEnd.has(currentStart.word)) {
        return currentStart.length + visitedEnd.get(currentStart.word)!;
      }

      const synonymsStart = this.adjacencyList.get(currentStart.word);
      if (synonymsStart) {
        for (const synonym of synonymsStart) {
          if (!visitedStart.has(synonym)) {
            visitedStart.set(synonym, currentStart.length + 1);
            queueStart.push({ word: synonym, length: currentStart.length + 1 });
          }
        }
      }

      const currentEnd = queueEnd.shift()!;
      if (visitedStart.has(currentEnd.word)) {
        return currentEnd.length + visitedStart.get(currentEnd.word)!;
      }

      const synonymsEnd = this.adjacencyList.get(currentEnd.word);
      if (synonymsEnd) {
        for (const synonym of synonymsEnd) {
          if (!visitedEnd.has(synonym)) {
            visitedEnd.set(synonym, currentEnd.length + 1);
            queueEnd.push({ word: synonym, length: currentEnd.length + 1 });
          }
        }
      }
    }

    return null;
  }

  findLongestPath(startNode: string): number {
    const memo: Memo = new Map();

    const dfs = (node: string): number => {
      if (memo.has(node)) {
        return memo.get(node)!;
      }

      let maxLength = 0;
      const synonyms = this.adjacencyList.get(node);

      if (synonyms) {
        for (const synonym of synonyms) {
          const length = dfs(synonym) + 1;
          maxLength = Math.max(maxLength, length);
        }
      }

      memo.set(node, maxLength);
      return maxLength;
    };

    return dfs(startNode);
  }

  findNodesWithMinPathLength(minLength: number): string[] {
    const nodesWithMinPath: string[] = [];

    const dfs = (node: string, length: number, visited: { [key: string]: boolean }) => {
      visited[node] = true;

      if (length >= minLength) {
        nodesWithMinPath.push(node);
        return;
      }

      const synonyms = this.adjacencyList.get(node);
      if (synonyms) {
        for (const synonym of synonyms) {
          if (!visited[synonym]) {
            dfs(synonym, length + 1, visited);
          }
        }
      }

      visited[node] = false;
    };

    for (const node of this.adjacencyList.keys()) {
      const visited: { [key: string]: boolean } = {};
      dfs(node, 0, visited);
    }

    return nodesWithMinPath;
  }
  printGraph() {
    // Only run in development mode
    if (!import.meta.env.DEV) return;

    for (const [word, synonyms] of this.adjacencyList.entries()) {
      console.log(`${word} -> ${synonyms.join(', ')}`);
    }
  }

  findPath(start: string, end: string): string[] | null {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return null; // Start or end word not in graph
    }

    const queue: { word: string; path: string[] }[] = [{ word: start, path: [start] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { word, path } = queue.shift()!;

      if (word === end) {
        return path; // Path found
      }

      visited.add(word);

      const synonyms = this.adjacencyList.get(word);
      if (synonyms) {
        for (const synonym of synonyms) {
          if (!visited.has(synonym)) {
            queue.push({ word: synonym, path: [...path, synonym] });
          }
        }
      }
    }

    return null; // No path found
  }

  printPath(start: string, end: string): void {
    // Only run in development mode
    if (!import.meta.env.DEV) return;

    const path = this.findPath(start, end);

    if (path) {
      console.log(`Path from ${start} to ${end}: ${path.join(" -> ")}`);
    } else {
      console.log(`No path found from ${start} to ${end}`);
    }
  }

  /**
   * Find a path from start to end using only the provided filtered synonyms
   * This simulates what the user can actually do with the displayed synonyms
   * @param start The starting word
   * @param end The target word
   * @param filteredSynonyms Array of synonyms that would be shown to the user
   * @returns Path array or null if no path exists
   */
  findPathWithFilteredSynonyms(start: string, end: string, filteredSynonyms: string[]): string[] | null {
    if (start === end) {
      return [start];
    }

    // Create a filtered adjacency list that only includes the provided synonyms
    const filteredAdjacencyList = new Map<string, string[]>();

    // For each word in the path, only include its filtered synonyms
    const queue: Array<{ word: string; path: string[] }> = [];
    const visited = new Set<string>();

    queue.push({ word: start, path: [start] });
    visited.add(start);

    while (queue.length > 0) {
      const { word, path } = queue.shift()!;

      // Get the filtered synonyms for this word
      let availableSynonyms: string[] = [];

      if (word === start) {
        // For the starting word, use the provided filtered synonyms
        availableSynonyms = filteredSynonyms;
      } else {
        // For intermediate words, get their filtered synonyms
        const intermediateSynonyms = this.getSynonyms(word, end) || [];
        availableSynonyms = intermediateSynonyms;
      }

      for (const synonym of availableSynonyms) {
        if (synonym === end) {
          return [...path, synonym];
        }

        if (!visited.has(synonym)) {
          visited.add(synonym);
          queue.push({ word: synonym, path: [...path, synonym] });
        }
      }
    }

    return null; // No path found using filtered synonyms
  }

  /**
   * Validate that the current filtering doesn't create impossible games
   * @param startWord The starting word
   * @param endWord The target word
   * @returns Object with validation results
   */
  validateFiltering(startWord: string, endWord: string): {
    isValid: boolean;
    filteredPath: string[] | null;
    unfilteredPath: string[] | null;
    missingWords: string[];
    analysis: string;
  } {
    const unfilteredPath = this.findPath(startWord, endWord);
    const availableSynonyms = this.getSynonyms(startWord, endWord) || [];
    const filteredPath = this.findPathWithFilteredSynonyms(startWord, endWord, availableSynonyms);

    const missingWords: string[] = [];
    let analysis = "";

    if (unfilteredPath && filteredPath) {
      // Both paths exist - check if filtering made it longer
      if (filteredPath.length > unfilteredPath.length) {
        analysis = `Filtering made path ${filteredPath.length - unfilteredPath.length} steps longer`;
      } else {
        analysis = "Filtering preserved optimal path length";
      }
    } else if (unfilteredPath && !filteredPath) {
      // Unfiltered path exists but filtered doesn't - this is a problem
      analysis = "❌ CRITICAL: Filtering broke the path completely!";

      // Find which words are missing
      const pathWords = unfilteredPath.slice(1, -1); // Exclude start and end
      for (const word of pathWords) {
        const wordSynonyms = this.getSynonyms(word, endWord) || [];
        if (wordSynonyms.length === 0) {
          missingWords.push(word);
        }
      }
    } else if (!unfilteredPath) {
      analysis = "No path exists even without filtering";
    }

    return {
      isValid: filteredPath !== null,
      filteredPath,
      unfilteredPath,
      missingWords,
      analysis
    };
  }

  /**
   * Debug synonym filtering to understand "colder path" phenomenon
   * @param word The current word
   * @param endWord The target word
   */
  debugSynonymFiltering(word: string, endWord: string) {
    // Only run in development mode
    if (!import.meta.env.DEV) return;

    console.log(`\n🔍 Debugging synonym filtering for "${word}" → "${endWord}"`);
    console.log('='.repeat(60));

    const allSynonyms = this.adjacencyList.get(word) || [];
    console.log(`\n📊 All synonyms (${allSynonyms.length}):`);
    allSynonyms.forEach(synonym => {
      const pathLength = this.findShortestPathLengthBiDirectional(synonym, endWord);
      const temp = this.getTemperature(synonym, endWord);
      const tempCategory = this.getTemperatureCategory(synonym, endWord);
      const score = this.getEdgeSynonymyScore(word, synonym);
      const isBridge = this.isBridgeWord(synonym, word, endWord);
      const connectivity = this.calculateConnectivityScore(synonym, endWord);

      console.log(`  ${synonym}: path=${pathLength}, temp=${temp.toFixed(2)} (${tempCategory}), score=${score.toFixed(2)}, bridge=${isBridge}, connectivity=${connectivity.toFixed(2)}`);
    });

    const selectedSynonyms = this.getSynonyms(word, endWord) || [];
    console.log(`\n✅ Selected synonyms (${selectedSynonyms.length}):`);
    selectedSynonyms.forEach(synonym => {
      const pathLength = this.findShortestPathLengthBiDirectional(synonym, endWord);
      const tempCategory = this.getTemperatureCategory(synonym, endWord);
      const isBridge = this.isBridgeWord(synonym, word, endWord);

      console.log(`  ${synonym}: path=${pathLength}, temp=${tempCategory}, bridge=${isBridge}`);
    });

    // Check for potential "colder path" issues
    const currentTemp = this.getTemperatureCategory(word, endWord);
    const colderSynonyms = selectedSynonyms.filter(syn => {
      const synTemp = this.getTemperatureCategory(syn, endWord);
      return this.getTemperatureValue(synTemp) < this.getTemperatureValue(currentTemp);
    });

    if (colderSynonyms.length > 0) {
      console.log(`\n⚠️  "Colder" synonyms included (${colderSynonyms.length}):`);
      colderSynonyms.forEach(synonym => {
        const synTemp = this.getTemperatureCategory(synonym, endWord);
        const isBridge = this.isBridgeWord(synonym, word, endWord);
        console.log(`  ${synonym}: ${currentTemp} → ${synTemp} (bridge: ${isBridge})`);
      });
    }

    console.log('\n' + '='.repeat(60));
  }

  /**
   * Helper to convert temperature category to numeric value for comparison
   */
  private getTemperatureValue(category: 'hot' | 'warm' | 'cool' | 'cold'): number {
    switch (category) {
      case 'hot': return 4;
      case 'warm': return 3;
      case 'cool': return 2;
      case 'cold': return 1;
      default: return 0;
    }
  }

  /**
   * Calculate the "temperature" (hot/cold) of a word relative to the target word
   * Now includes semantic similarity, path length, and frequency weighting
   * Returns a value between 0 (coldest) and 1 (hottest)
   * @param currentWord The current word to evaluate
   * @param targetWord The target word to compare against
   * @returns Temperature value between 0 and 1
   */
  getTemperature(currentWord: string, targetWord: string): number {
    if (currentWord === targetWord) {
      return 1; // Hottest - exact match
    }

    // Get the shortest path length
    const pathLength = this.findShortestPathLengthBiDirectional(currentWord, targetWord);

    if (pathLength === null) {
      return 0; // Coldest - no path exists
    }

    // Calculate semantic similarity score
    const semanticScore = this.getEdgeSynonymyScore(currentWord, targetWord);

    // Get word frequencies for weighting
    const currentFreq = this.getWordFrequency(currentWord);
    const targetFreq = this.getWordFrequency(targetWord);

    // Frequency similarity bonus (common words are easier to connect)
    const freqSimilarity = 1 - Math.abs(currentFreq - targetFreq) / 8; // Normalize by max frequency

    // Path length component (less aggressive decay)
    const pathComponent = Math.exp(-pathLength / 3); // Less aggressive than /2

    // Semantic similarity component
    const semanticComponent = semanticScore;

    // Combine components with weights
    const temperature = (
      0.4 * pathComponent +      // 40% path length
      0.4 * semanticComponent +  // 40% semantic similarity
      0.2 * freqSimilarity       // 20% frequency similarity
    );

    // Ensure temperature is between 0 and 1
    return Math.max(0, Math.min(1, temperature));
  }

  /**
   * Get the temperature category (hot, warm, cool, cold) for a word
   * @param currentWord The current word to evaluate
   * @param targetWord The target word to compare against
   * @returns Temperature category string
   */
  getTemperatureCategory(currentWord: string, targetWord: string): 'hot' | 'warm' | 'cool' | 'cold' {
    const temperature = this.getTemperature(currentWord, targetWord);

    if (temperature >= 0.7) return 'hot';
    if (temperature >= 0.4) return 'warm';
    if (temperature >= 0.1) return 'cool';
    return 'cold';
  }
}
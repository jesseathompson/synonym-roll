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

  constructor() {
    this.adjacencyList = new Map();
    this.edgeScores = new Map();
    this.minEdgeSynonymy = 0; // Default to 0 if no game is loaded
    this.currentGame = null;

    // Process graph thesaurus data
    const thesaurusData = graphThesaurusData as GraphThesaurus;

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

  // Get synonyms with improved filtering that prioritizes shortest paths
  getSynonyms(word: string, endWord?: string): string[] | undefined {
    const allSynonyms = this.adjacencyList.get(word);
    if (!allSynonyms) return undefined;

    // Step 1: Filter by minimum edge synonymy threshold
    let filteredSynonyms = allSynonyms;
    if (this.minEdgeSynonymy > 0) {
      filteredSynonyms = allSynonyms.filter(synonym =>
        this.getEdgeSynonymyScore(word, synonym) >= this.minEdgeSynonymy
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

    // Step 3: Create synonym data with path lengths and scores
    const synonymData = filteredSynonyms
      .filter(synonym => synonym !== word) // Avoid self-loops
      .map(synonym => {
        const pathLength = this.findShortestPathLengthBiDirectional(synonym, endWord);
        return {
          word: synonym,
          pathLength: pathLength,
          score: this.getEdgeSynonymyScore(word, synonym)
        };
      })
      .filter(item => item.pathLength !== null) // Only keep synonyms with paths
      .sort((a, b) => {
        // Primary sort: shortest path first
        if (a.pathLength !== b.pathLength) {
          return a.pathLength! - b.pathLength!;
        }
        // Secondary sort: highest score within same path length
        return b.score - a.score;
      });

    if (synonymData.length === 0) return [];

    // Step 4: Group by path length and apply smart filtering
    const shortestPath = synonymData[0].pathLength!;
    const pathGroups = new Map<number, typeof synonymData>();

    synonymData.forEach(item => {
      const pathLen = item.pathLength!;
      if (!pathGroups.has(pathLen)) {
        pathGroups.set(pathLen, []);
      }
      pathGroups.get(pathLen)!.push(item);
    });

    // Step 5: Select synonyms with preference for shorter paths
    const selectedSynonyms: typeof synonymData = [];

    // Always include ALL synonyms with the shortest path
    const shortestPathSynonyms = pathGroups.get(shortestPath) || [];
    selectedSynonyms.push(...shortestPathSynonyms);

    // Add synonyms from longer paths if we have space and they're high quality
    let remainingSlots = 12 - selectedSynonyms.length;
    const sortedPathLengths = Array.from(pathGroups.keys()).sort((a, b) => a - b);

    for (const pathLength of sortedPathLengths) {
      if (pathLength === shortestPath || remainingSlots <= 0) continue;

      const groupSynonyms = pathGroups.get(pathLength) || [];
      const avgScore = groupSynonyms.reduce((sum, item) => sum + item.score, 0) / groupSynonyms.length;

      // Only add high-scoring synonyms from longer paths
      const highQualitySynonyms = groupSynonyms
        .filter(item => item.score >= avgScore)
        .slice(0, Math.min(remainingSlots, 4)); // Limit longer paths

      selectedSynonyms.push(...highQualitySynonyms);
      remainingSlots -= highQualitySynonyms.length;
    }

    // Step 6: Final filtering if we still have too many
    if (selectedSynonyms.length > 8) {
      // Keep all shortest path synonyms + best from others
      const shortestPathCount = shortestPathSynonyms.length;
      const otherSynonyms = selectedSynonyms.slice(shortestPathCount);
      const remainingSlots = Math.max(0, 8 - shortestPathCount);

      return [
        ...shortestPathSynonyms.map(item => item.word),
        ...otherSynonyms.slice(0, remainingSlots).map(item => item.word)
      ];
    }

    return selectedSynonyms.map(item => item.word);
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
    const path = this.findPath(start, end);

    if (path) {
      console.log(`Path from ${start} to ${end}: ${path.join(" -> ")}`);
    } else {
      console.log(`No path found from ${start} to ${end}`);
    }
  }
}
import { readFileSync } from 'fs';
// import wordData from './en_thesaurus.json' assert { type: "json" };
interface WordData {
  word: string;
  key: string;
  pos: string;
  synonyms: string[];
}
//   import jsonData from './en_thesaurus.json'  assert { type: WordData[] };

// Read the JSON file synchronously (you can use asynchronous read if preferred)
const jsonDataFilePath = './en_thesaurus.json'; // Replace with your file path
const jsonData: WordData[] = JSON.parse(readFileSync(jsonDataFilePath, 'utf-8'));
type SynonymsMap = Map<string, string[]>;
type Memo = Map<string, number>;

class WordGraph {
  adjacencyList: Map<string, string[]>;

  constructor() {
    this.adjacencyList = new Map();
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

  getSynonyms(word: string): string[] | undefined {
    return this.adjacencyList.get(word);
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

// Example usage:
const wordGraph = new WordGraph();
while (jsonData.length > 0) {
  const w = jsonData.pop()
  if (w) {
    wordGraph.addWord(w.word, w.synonyms);

  }

}
function printEveryFour(arr: string[] | undefined) {
  if (!Array.isArray(arr)) {
    console.error("Input must be an array.");
    return;
  }

  // Create a copy to avoid modifying the original array
  const arrCopy = [...arr].sort();

  while (arrCopy.length > 0) {
    const chunk = arrCopy.splice(0, 4); // Extract up to 4 elements
    console.log(chunk.join(", ")); // Print the chunk on a new line
  }
}
// wordGraph.printGraph()
// console.log(wordGraph.findNodesWithMinPathLength(6))

const game =  {
  "start": "accomplished",
  "end": "industrious"
}

console.log(game)
console.log('steps left', wordGraph.findShortestPathLengthBiDirectional(game.start, game.end))
printEveryFour(wordGraph.getSynonyms(game.start))

// console.log(wordGraph.printPath(game.start, game.end))
const path = [game.start]
import * as rl from 'readline-sync';
var more = 1;
read();
function read() {
  while (more) {
    let answer = rl.question("Enter a synonym or 1 for the answer\n");
    if (wordGraph.getSynonyms(answer)?.includes(game.end)) {
      more = 0;
      console.log("you win");
    } else {
      if (answer === '1') {
        console.log(wordGraph.printPath(game.start, game.end))
      }
      else{
        more++;
        console.clear()
        path.push(answer)

        console.log(path.join('-> '))
        console.log('end: ', game.end)
        console.log('steps left', wordGraph.findShortestPathLengthBiDirectional(answer, game.end))

        console.log(`Synonyms of ${answer}`)
        printEveryFour(wordGraph.getSynonyms(answer))
        
      }
   
    }
  }
}
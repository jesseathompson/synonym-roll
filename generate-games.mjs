import fs from 'fs';
import wordData from './en_thesaurus.json';

function createAdjacencyList(data) {
    const adjacencyList = {};
  
    data.forEach(wordObj => {
      const word = wordObj.word;
      const synonyms = wordObj.synonyms;
  
      if (!(word in adjacencyList)) {
        adjacencyList[word] = [];
      }
  
      synonyms.forEach(synonym => {
        if (!(synonym in adjacencyList)) {
          adjacencyList[synonym] = [];
        }
  
        if (!adjacencyList[word].includes(synonym)) {
          adjacencyList[word].push(synonym);
        }
  
        if (!adjacencyList[synonym].includes(word) && word !== synonym) {
          adjacencyList[synonym].push(word);
        }
      });
    });
  
    return adjacencyList;
  }
  
  
function preprocessToAdjacencyList(data) {
    const adjacencyList = {};
  
    data.forEach(wordObj => {
      const word = wordObj.word;
      const synonyms = wordObj.synonyms;
  
      if (!(word in adjacencyList)) {
        adjacencyList[word] = [];
      }
  
      synonyms.forEach(synonym => {
        if (!(synonym in adjacencyList)) {
          adjacencyList[synonym] = [];
        }
  
        if (!adjacencyList[word].includes(synonym)) {
          adjacencyList[word].push(synonym);
        }
  
        if (!adjacencyList[synonym].includes(word)) {
          adjacencyList[synonym].push(word);
        }
      });
    });
  
    return adjacencyList;
  }
  

function findWordsWithMinPathLength(adjacencyList, startWord, minDegree) {
  const reachableWords = new Set();
  const visited = new Set();

  function dfs(currentWord, depth) {
    visited.add(currentWord);

    if (depth >= minDegree) {
      reachableWords.add(currentWord);
      return;
    }

    const neighbors = adjacencyList[currentWord];
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, depth + 1);
        }
      }
    }
  }

  dfs(startWord, 0);
  return Array.from(reachableWords);
}

const adjacencyList = createAdjacencyList(wordData);
const games = [];

wordData.forEach(element => {
  const possibleMatches = findWordsWithMinPathLength(adjacencyList, element.word, 6);

  if (possibleMatches.length > 0) {
    possibleMatches.forEach(x => {
      const start = element.word;
      const end = x;
      games.push({ start, end, path: findShortestPath(adjacencyList, start, end) });
    });
  }
});
function findShortestPath(adjacencyList, startWord, endWord) {
  const queue = [[startWord, 0]]; // Queue of [word, distance] pairs
  const visited = new Set();

  while (queue.length > 0) {
    const [currentWord, distance] = queue.shift();

    if (currentWord === endWord) {
      return distance;
    }

    if (!visited.has(currentWord)) {
      visited.add(currentWord);

      for (const neighbor of adjacencyList[currentWord]) {
        queue.push([neighbor, distance + 1]);
      }
    }
  }

  return -1; // Path not found
}
fs.writeFile("./games.json", JSON.stringify(games), 'utf8', function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});

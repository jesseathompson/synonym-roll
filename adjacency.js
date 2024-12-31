 function preprocessToAdjacencyList(data) {
    const adjacencyList = {};
  
    // Iterate through the word data to create the adjacency list
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
  
        // Add edges between the word and its synonyms bidirectionally
        adjacencyList[word].push(synonym);
        adjacencyList[synonym].push(word);
      });
    });
  
    return adjacencyList;
  }
  function findWordsWithNDegreesUsingAdjacencyList(adjacencyList, startWord, n) {
    const reachableWords = new Set();
    const visited = new Set();
  
    function dfs(currentWord, depth) {
      visited.add(currentWord);
  
      if (depth >= n) {
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
  
  function findPathUsingAdjacencyList(adjacencyList, startWord, endWord) {
    const visited = new Set();
    const queue = [];
  
    queue.push([startWord]);
    visited.add(startWord);
  
    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentWord = currentPath[currentPath.length - 1];
  
      if (currentWord === endWord) {
        return currentPath;
      }
  
      const neighbors = adjacencyList[currentWord];
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            const newPath = [...currentPath, neighbor];
            queue.push(newPath);
          }
        }
      }
    }
  
    return null; // If no path is found
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
  // Example usage:
  const adjacencyList = preprocessToAdjacencyList(wordData);
adjacencyList.forEach(word => {
  const wordsWithMinPath = findWordsWithMinPathLength(adjacencyList, word, 6);
    wordsWithMinPath.forEach(x => {
        const path = findPathUsingAdjacencyList(adjacencyList, word, x)
        console.log(`Path from "${word}" to "${x}": ${path.join(" -> ")}`);
    })
})

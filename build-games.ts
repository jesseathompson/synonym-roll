import * as fs from 'fs';

interface WordData {
    word: string;
    key: string;
    pos: string;
    synonyms: string[];
  }
//   import jsonData from './en_thesaurus.json'  assert { type: WordData[] };

  // Read the JSON file synchronously (you can use asynchronous read if preferred)
const jsonDataFilePath = './en_thesaurus.json'  ; // Replace with your file path
const jsonData: WordData[] = JSON.parse(fs.readFileSync(jsonDataFilePath, 'utf-8'));


  
  interface AdjacencyList {
    [word: string]: string[];
  }
  
  function createAdjacencyList(data: WordData[]): { [word: string]: string[] } {
    const adjacencyList: { [word: string]: string[] } = {};
  
    data.forEach(({ word, synonyms }) => {
      // Ensure adjacencyList[word] is an array or initialize it as an empty array
      adjacencyList[word] = adjacencyList[word] || [];
  
      // Merge synonyms into the adjacency list for the word
      adjacencyList[word] = Array.from(new Set([...adjacencyList[word], ...synonyms]));
    });
  
    return adjacencyList;
  }
  
  const adjacencyList: AdjacencyList = createAdjacencyList(jsonData);
  console.log('created list: ', adjacencyList[0]);
  
import fs from 'fs';

const inputFileName = 'en_thesaurus.jsonl';
const outputFileName = 'en_thesaurus.json';
// const fs = require('fs');

function convertJSONLtoJSON(jsonlFilePath, outputFilePath) {
  const jsonArray = [];

  // Read the JSONL file line by line
  const lines = fs.readFileSync(jsonlFilePath, 'utf8').split('\n');

  // Parse each line as JSON and add to the array
  lines.forEach(line => {
    if (line.trim() !== '') {
      const jsonObject = JSON.parse(line);
      jsonArray.push(jsonObject);
    }
  });

  // Write the array of JSON objects to a new JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonArray, null, 2));

  console.log(`Converted ${jsonlFilePath} to ${outputFilePath}`);
}

// Example usage:
// const inputJSONLFile = 'input.jsonl'; // Replace with your input JSONL file
// const outputJSONFile = 'output.json'; // Replace with the desired output JSON file

convertJSONLtoJSON(inputFileName, outputFileName);
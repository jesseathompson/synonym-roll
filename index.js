import fs from 'fs';

import wordData from './en_thesaurus.json'  assert { type: "json" };
import path from 'path';
function findUniqueSynonyms(startWord) {
    const uniqueSynonyms = new Set();
    const visited = new Set();
    const queue = [];

    queue.push(startWord);
    visited.add(startWord);

    while (queue.length > 0) {
        const currentWord = queue.shift();
        const wordObject = wordData.find(word => word.word === currentWord);

        if (wordObject) {
            const synonyms = wordObject.synonyms;

            for (const synonym of synonyms) {
                uniqueSynonyms.add(synonym);

                const synonymObject = wordData.find(word => word.word === synonym);

                if (synonymObject) {
                    const synonymsOfSynonym = synonymObject.synonyms.filter(
                        s => !wordObject.synonyms.includes(s) && !visited.has(s)
                    );

                    for (const newSynonym of synonymsOfSynonym) {
                        uniqueSynonyms.add(newSynonym);
                        visited.add(newSynonym);
                        queue.push(newSynonym);
                    }
                }
            }
        }
    }

    return Array.from(uniqueSynonyms);
}

function findPathWithMinDegrees(startWord, n) {
    const visited = new Set();
    const queue = [];

    queue.push({ word: startWord, depth: 0 });

    while (queue.length > 0) {
        const { word, depth } = queue.shift();

        if (depth === n) {
            return {
                start: startWord,
                end: word,
                path:queue
            };
        }

        if (depth < n) {
            visited.add(word);
            const wordObject = wordData.find(obj => obj.word === word);
            if (wordObject) {
                const synonyms = wordObject.synonyms;

                for (const synonym of synonyms) {
                    if (!visited.has(synonym)) {
                        queue.push({ word: synonym, depth: depth + 1 });
                    }
                }
            }
        }
    }

    return null; // If no path is found
}




function findWordsWithNDegrees(startWord, n) {
    const reachableWords = new Set();
    const visited = new Set();
    const queue = [];

    queue.push([startWord]);
    visited.add(startWord);

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const currentWord = currentPath[currentPath.length - 1];

        if (currentPath.length >= n + 1) {
            reachableWords.add(currentWord);
            continue;
        }

        const wordObject = wordData.find(word => word.word === currentWord);
        if (wordObject) {
            const synonyms = wordObject.synonyms;

            for (const synonym of synonyms) {
                if (!visited.has(synonym)) {
                    visited.add(synonym);
                    const newPath = [...currentPath, synonym];
                    queue.push(newPath);
                }
            }
        }
    }

    return Array.from(reachableWords);
}
function findPath(startWord, endWord) {
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

        const wordObject = wordData.find(word => word.word === currentWord);
        if (wordObject) {
            const synonyms = wordObject.synonyms;

            for (const synonym of synonyms) {
                if (!visited.has(synonym)) {
                    visited.add(synonym);
                    const newPath = [...currentPath, synonym];
                    queue.push(newPath);
                }
            }
        }
    }

    return null; // If no path is found
}


function countPaths(startWord, endWord) {
    let count = 0;
    const visited = new Set();
    const queue = [];

    queue.push([startWord]);
    visited.add(startWord);

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const currentWord = currentPath[currentPath.length - 1];

        if (currentWord === endWord) {
            count++;
        }

        const wordObject = wordData.find(word => word.word === currentWord);
        if (wordObject) {
            const synonyms = wordObject.synonyms;

            for (const synonym of synonyms) {
                if (!visited.has(synonym)) {
                    visited.add(synonym);
                    const newPath = [...currentPath, synonym];
                    queue.push(newPath);
                }
            }
        }
    }

    return count;
}

function countPathsMemoized(startWord, endWord, memo = {}) {
    const memoKey = `${startWord}_${endWord}`;
    if (memoKey in memo) {
        return memo[memoKey];
    }

    let count = 0;
    const visited = new Set();
    const queue = [];

    queue.push([startWord]);
    visited.add(startWord);

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const currentWord = currentPath[currentPath.length - 1];

        if (currentWord === endWord) {
            count++;
        }

        const wordObject = wordData.find(word => word.word === currentWord);
        if (wordObject) {
            const synonyms = wordObject.synonyms;

            for (const synonym of synonyms) {
                if (!visited.has(synonym)) {
                    visited.add(synonym);
                    const newPath = [...currentPath, synonym];
                    queue.push(newPath);
                }
            }
        }
    }

    memo[memoKey] = count;
    return count;
}
const games = [];
let gamesFound = 0;

wordData.forEach(element => {
    if (games.length >= 20) {
        return; // Exit loop if 5000 games are found
    }
    // console.log(element.word)
    const game = findPathWithMinDegrees(element.word, 6)
    if (game) {
        console.log('game ', game)
        games.push(game)
    }

    // const possibleMatches = findWordsWithNDegrees(element.word, 6);

    // if (possibleMatches.length > 0) {
    //     if (gamesFound >= 5000) {
    //         return; // Exit loop if 5000 games are found
    //     }

    //     const start = element.word;
    //     const end = possibleMatches[0];
    //     games.push({ start, end });
    //     gamesFound++;
    //     console.log(`Found games: ${gamesFound}`);
        // possibleMatches.forEach(x => {
        //     if (gamesFound >= 5000) {
        //         return; // Exit loop if 5000 games are found
        //     }

        //     const start = element.word;
        //     const end = x;
        //     games.push({ start, end });
        //     gamesFound++;
        //     console.log(`Found games: ${gamesFound}`);
        // });
    // }
});

fs.writeFile("./games2.json", JSON.stringify(games), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
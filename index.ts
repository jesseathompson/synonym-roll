import * as fs from 'fs';
import wordData from './processed_thesaurus.json';

interface WordDataEntry {
    word: string;
    pos: string[];
    synonyms?: string[];
}

interface GameResult {
    start: string;
    ends: string[];
}

function findPathWithMinDegrees(startWord: string, n: number): GameResult | null {
    const reachableEnds = new Set<string>();
    const visited = new Set<string>();
    const queue: { word: string; depth: number }[] = [];

    queue.push({ word: startWord, depth: 0 });
    visited.add(startWord);

    while (queue.length > 0) {
        const { word, depth } = queue.shift()!; // Non-null assertion since queue.length > 0

        if (depth === n) {
            reachableEnds.add(word);
            continue;
        }

        if (depth < n) {
            const wordObject = (wordData as WordDataEntry[]).find(obj => obj.word === word);
            if (wordObject) {
                const synonyms = wordObject.synonyms;
                if (synonyms) {
                    for (const synonym of synonyms) {
                        if (!visited.has(synonym)) {
                            visited.add(synonym);
                            queue.push({ word: synonym, depth: depth + 1 });
                        }
                    }
                }
            }
        }
    }

    if (reachableEnds.size > 0) {
        return {
            start: startWord,
            ends: Array.from(reachableEnds),
        };
    }

    return null;
}

async function writeGamesToStream(outputPath: string, maxGames: number = 10): Promise<void> {
    const outputStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });
    outputStream.write('['); // Start of JSON array

    let gamesWritten = 0;
    let isFirstGame = true;

    for (const element of wordData as WordDataEntry[]) { // Type assertion here
        if (gamesWritten >= maxGames) {
            break;
        }

        const game = findPathWithMinDegrees(element.word, 6);
        if (game) {
            if (!isFirstGame) {
                outputStream.write(',');
            } else {
                isFirstGame = false;
            }
            outputStream.write(JSON.stringify(game));
            gamesWritten++;
        }
    }

    outputStream.write(']'); // End of JSON array
    outputStream.end();

    console.log(`Successfully wrote ${gamesWritten} games to ${outputPath}`);
}

const outputFile = './games_streamed.json';
writeGamesToStream(outputFile);
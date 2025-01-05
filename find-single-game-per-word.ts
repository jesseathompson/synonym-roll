import * as fs from 'fs';
import { thesaurus } from './processed_thesaurus';

interface WordDataEntry {
    word: string;
    pos: string[];
    synonyms?: string[];
}

interface GameResult {
    start: string;
    end: string | null;
}

function findPathWithMinDegrees(startWord: string, n: number): GameResult | null {
    const visited = new Set<string>();
    const queue: { word: string; depth: number }[] = [];

    queue.push({ word: startWord, depth: 0 });
    visited.add(startWord);

    while (queue.length > 0) {
        const { word, depth } = queue.shift()!;

        if (depth === n) {
            return {
                start: startWord,
                end: word,
            };
        }

        if (depth < n) {
            const wordObject = (thesaurus as WordDataEntry[]).find(obj => obj.word === word);
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

    return {
        start: startWord,
        end: null
    };
}

async function writeGamesToStream(outputPath: string, maxGames: number = 200): Promise<void> {
    console.log(`Finding games`);

    const outputStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });
    outputStream.write('[');

    let gamesWritten = 0;
    let isFirstGame = true;

    const wordList = thesaurus as WordDataEntry[]; // Type assertion for easier access
    const wordListLength = wordList.length;

    if (wordListLength === 0) {
        console.error("Word list is empty. Cannot generate games.");
        outputStream.write(']');
        outputStream.end();
        return;
    }

    while (gamesWritten < maxGames) {
        const randomIndex = Math.floor(Math.random() * wordListLength);
        const randomWord = wordList[randomIndex].word;

        const game = findPathWithMinDegrees(randomWord, 6);
        if (game && game.end !== null) {
            if (!isFirstGame) {
                outputStream.write(',');
            } else {
                isFirstGame = false;
            }
            outputStream.write(JSON.stringify(game));
            gamesWritten++;
        }
    }

    outputStream.write(']');
    outputStream.end();

    console.log(`Successfully wrote ${gamesWritten} games to ${outputPath}`);
}

const outputFile = './games_streamed.json';
writeGamesToStream(outputFile);
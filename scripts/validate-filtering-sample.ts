#!/usr/bin/env npx tsx

/**
 * Samples 1 in 25 of the playable games and runs WordGraph.validateFiltering
 * on each, reporting any game where the displayed-synonym filtering breaks
 * every path from start to target. Pass --all to test every game.
 */

import { WordGraph } from '../app/src/utils/wordGraph';
import playableGamesData from '../app/games/playable_games/playable_games.json';

interface PlayableGame {
  start_word: string;
  end_word: string;
  min_edge_synonymy: number;
}

const games = playableGamesData.games as PlayableGame[];
const step = process.argv.includes('--all') ? 1 : 25;
const graph = new WordGraph();

let tested = 0;
let broken = 0;
const failures: string[] = [];
const start = Date.now();

for (let i = 0; i < games.length; i += step) {
  const game = games[i];
  (graph as any).minEdgeSynonymy = game.min_edge_synonymy;
  const result = graph.validateFiltering(game.start_word, game.end_word);
  tested++;

  if (!result.isValid && result.unfilteredPath) {
    broken++;
    failures.push(
      `  ${game.start_word} → ${game.end_word} (min_edge=${game.min_edge_synonymy.toFixed(3)}): ${result.analysis}`
    );
  }

  if (tested % 100 === 0) {
    console.log(`Progress: ${tested} tested, ${broken} broken (${((Date.now() - start) / 1000).toFixed(0)}s)`);
  }
}

console.log(`\nTested ${tested} games (every ${step}th of ${games.length})`);
console.log(`Filtering broke the path in ${broken} games`);
if (failures.length > 0) {
  console.log('\nFailures:');
  console.log(failures.join('\n'));
}
process.exit(broken > 0 ? 1 : 0);

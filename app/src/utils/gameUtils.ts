import playableGames from '../../games/playable_games/playable_games.json';

interface PlayableGame {
  start_word: string;
  end_word: string;
  path_length: number;
  avg_synonymy_score: number;
  min_edge_synonymy: number;
  start_frequency: number;
  end_frequency: number;
}

/**
 * Get a deterministic puzzle for today's date
 * @returns Today's puzzle with start and end words
 */
export const getTodaysPuzzle = () => {
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (24 * 60 * 60 * 1000));
  
  // Get a deterministic game based on the current day
  const games = playableGames.games as PlayableGame[];
  const gameIndex = daysSinceEpoch % games.length;
  const game = games[gameIndex];

  return {
    start: game.start_word,
    end: game.end_word
  };
};

/**
 * Get time until next puzzle in milliseconds
 * @returns Milliseconds until next puzzle
 */
export const getTimeUntilNextPuzzle = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
};

/**
 * Format milliseconds into a countdown string
 * @param ms Milliseconds
 * @returns Formatted string like "23:59:59"
 */
export const formatCountdown = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Shuffle an array using Fisher-Yates algorithm with a seeded random
 * @param array Array to shuffle
 * @param seed Seed for random number generator
 * @returns New shuffled array
 */
export const seededShuffle = <T>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let temporaryValue;
  let randomIndex;

  // Simple seeded random number generator
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled;
};

/**
 * Get a unique puzzle seed for today
 * @returns Number to use as a seed for randomization
 */
export const getTodaysSeed = (): number => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};
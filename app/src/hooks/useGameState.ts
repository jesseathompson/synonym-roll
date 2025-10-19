import { useState, useEffect } from 'react';
import { GameState, DEFAULT_GAME_STATE } from '../types/GameState';

const STORAGE_KEY = 'gameState';
const MIGRATION_VERSION_KEY = 'gameState_migration_version';
const CURRENT_MIGRATION_VERSION = '1.1'; // Increment when adding new migrations

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isConsecutiveDay = (lastDate: Date, currentDate: Date) => {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const diffInDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / oneDayInMs);
  return diffInDays === 1;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_GAME_STATE;
  });

  // Check and update streak on component mount and when lastPlayed changes
  useEffect(() => {
    const now = new Date();
    const lastPlayed = gameState.lastPlayed ? new Date(gameState.lastPlayed) : null;

    // Run migration for todayCompleted bug fix
    const migrationVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
    if (migrationVersion !== CURRENT_MIGRATION_VERSION) {
      console.log('[GameState Migration] Running migration version', CURRENT_MIGRATION_VERSION);

      // Migration 1.1: Fix todayCompleted bug for stuck users
      if (gameState.todayCompleted && lastPlayed) {
        const lastPlayedDate = new Date(lastPlayed);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastPlayedStart = new Date(lastPlayedDate.getFullYear(), lastPlayedDate.getMonth(), lastPlayedDate.getDate());

        // If lastPlayed was from a previous day, reset todayCompleted
        if (lastPlayedStart < todayStart) {
          console.log('[GameState Migration] Fixing stuck todayCompleted for user');
          updateGameState({
            todayCompleted: false,
          });
        }
      }

      // Mark migration as complete
      localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION);
    }

    if (!lastPlayed) {
      // First visit
      updateGameState({
        streak: 1,
        lastPlayed: now.toISOString(),
        todayCompleted: false, // Ensure new day starts with no completion
      });
    } else if (!isSameDay(lastPlayed, now)) {
      // Not same day, check if consecutive
      if (isConsecutiveDay(lastPlayed, now)) {
        // Consecutive day, increment streak
        updateGameState({
          streak: gameState.streak + 1,
          lastPlayed: now.toISOString(),
          todayCompleted: false, // Reset completion for new day
        });
      } else {
        // Not consecutive, reset streak
        updateGameState({
          streak: 1,
          lastPlayed: now.toISOString(),
          todayCompleted: false, // Reset completion for new day
        });
      }
    }
  }, []); // Only run on mount

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(current => ({
      ...current,
      ...updates,
    }));
  };

  const resetGameState = () => {
    const now = new Date();
    setGameState({
      ...DEFAULT_GAME_STATE,
      lastPlayed: now.toISOString(),
      streak: 1,
    });
  };

  const updateSettings = (updates: Partial<GameState['settings']>) => {
    setGameState(current => ({
      ...current,
      settings: {
        ...current.settings,
        ...updates,
      },
    }));
  };

  return {
    gameState,
    updateGameState,
    resetGameState,
    updateSettings,
  };
}; 
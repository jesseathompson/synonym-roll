# useTheme Hook Refactoring

## Objective
Refactor the existing `useTheme` hook to follow best practices for custom React hooks and improve its functionality.

## Component Details

### Location
`src/hooks/useTheme.ts`

### Interface
```tsx
interface UseThemeResult {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  isDarkMode: boolean;
}

function useTheme(): UseThemeResult;
```

### Functionality
- Manage the application theme (light/dark)
- Sync theme with the user's system preferences if no theme is set
- Toggle between light and dark themes
- Update the document attribute for Bootstrap theming
- Store theme preference in game state

### Current Implementation
```tsx
import { useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';

export const useTheme = () => {
  const { gameState, updateSettings } = useGameState();
  const { theme } = gameState.settings;

  useEffect(() => {
    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateSettings({ theme: prefersDark ? 'dark' : 'light' });
    }
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme, updateSettings]);

  const toggleTheme = () => {
    updateSettings({ theme: theme === 'light' ? 'dark' : 'light' });
  };

  return {
    theme,
    toggleTheme,
  };
};
```

## Enhanced Features to Add
1. Add a direct `setTheme` function to set the theme explicitly
2. Add an `isDarkMode` boolean for convenience
3. Add listener for system theme preference changes
4. Add proper TypeScript type definitions
5. Add CSS variable management for custom theming beyond Bootstrap

## Testing Requirements
Write tests that verify:
- Hook initializes with the correct theme
- Theme toggle works correctly
- Theme is synced with system preferences
- Document attributes are properly updated
- CSS variables are properly set (if implemented)

## Important Notes
- Focus ONLY on refactoring this hook
- Ensure proper cleanup of event listeners
- Consider adding more robust error handling
- Make sure the hook is reusable across different components

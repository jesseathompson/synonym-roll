# Component Refactoring Prompts

This directory contains prompt files for refactoring individual components in the Synonym Roll application. Each prompt focuses on extracting a specific component from the existing codebase, primarily from the `Play.tsx` file.

## Objective

The goal of this refactoring is to break down large components with mixed responsibilities into smaller, reusable components with clear responsibilities. This approach will improve:

1. **Code organization** - Smaller, focused components are easier to understand and maintain
2. **Reusability** - Components can be reused across different parts of the application
3. **Testability** - Isolated components are easier to test
4. **Performance** - Optimized components can prevent unnecessary re-renders

## Components to Refactor

### UI Components
1. [WordTile](./01-WordTile.md) - A reusable UI component for displaying words with different visual styles
11. [InfoModal](./11-InfoModal.md) - A modal component for displaying game instructions
12. [SettingsModal](./12-SettingsModal.md) - A modal component for game settings

### Feature Components
2. [SynonymList](./02-SynonymList.md) - A grid of buttons for synonym selection
3. [GameTimer](./03-GameTimer.md) - A component for displaying elapsed time, with a custom hook
4. [GameControls](./04-GameControls.md) - Control buttons for game actions (go back, share, etc.)
5. [GameBoard](./05-GameBoard.md) - A container component for the game area
7. [StatsDisplay](./07-StatsDisplay.md) - A component for displaying game statistics
8. [CompletedState](./08-CompletedState.md) - A component for the completed game state
10. [Navigation](./10-Navigation.md) - The application header with navigation links

### State Management
6. [GamePlayState](./06-GamePlayState.md) - A custom hook for managing game state with a reducer
13. [useTheme](./13-useTheme.md) - A custom hook for managing theme settings
14. [GameStateContext](./14-GameStateContext.md) - The global game state context provider

### Styling System
9. [DesignTokenSystem](./09-DesignTokenSystem.md) - A comprehensive CSS variables system

## Refactoring Process

For each component:

1. Create the component file and its associated CSS module
2. Implement the component with the specified props interface
3. Create Storybook stories to showcase different states and variations
4. Write tests to verify functionality
5. Ensure the component follows accessibility best practices

## Important Notes

- Each prompt focuses on a **single component** - do not refactor other parts of the codebase yet
- Follow the defined code style guidelines, including:
  - PascalCase for component names
  - Proper prop interfaces
  - CSS modules with BEM naming convention
- Consider performance optimizations where appropriate (memoization, preventing re-renders)
- Ensure all components are accessible

## Next Steps

After completing the component extraction, the next phases of the refactoring will include:

1. CSS Modules Implementation - Converting all styles to CSS modules
2. Component Hierarchy Refactoring - Establishing a clear hierarchy of components
3. State Management Improvements - Using reducers and custom hooks for complex state
4. Performance Optimizations - Adding memoization and preventing unnecessary re-renders
5. TypeScript Enhancements - Improving type definitions throughout the codebase

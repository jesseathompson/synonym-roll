# GitHub Copilot Instructions for Synonym Roll

## Project Context
Synonym Roll is a daily word game built using React, TypeScript, and Bootstrap. The application allows users to play word-based puzzles with daily challenges and tracks their progress over time.

## Code Style Guidelines

### React Component Structure
- **Component Organization**: Create small, reusable components with single responsibilities
- **Component Naming**: Use PascalCase for component names (e.g., `GameBoard.tsx`, `WordTile.tsx`)
- **Component File Structure**: Each component should have its own file in the appropriate subdirectory
- **Props Interface**: Always define prop interfaces above component definitions
  ```tsx
  interface WordTileProps {
    word: string;
    status: 'correct' | 'incorrect' | 'neutral';
    onClick?: () => void;
  }

  export const WordTile: React.FC<WordTileProps> = ({ word, status, onClick }) => {
    // Component implementation
  };
  ```

### CSS Best Practices
- **Component-Scoped CSS**: Use CSS modules or styled-components for component-specific styling
- **Naming Convention**: Follow BEM methodology (Block Element Modifier) for CSS classes
- **Responsive Design**: Always implement mobile-first responsive design
- **CSS Variables**: Use CSS variables for theme colors, spacing, and typography
  ```css
  :root {
    --primary-color: #5c62d6;
    --secondary-color: #8287e0;
    --text-color: #333333;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
  }
  ```
- **Avoid Inline Styles**: Use class-based styling instead of inline styles
- **Use Flexbox/Grid**: Prefer modern layout techniques like CSS Grid and Flexbox over older methods

### Component Suggestions
When implementing new features, consider breaking them down into the following component types:
1. **Container Components**: Manage state and data flow
2. **Presentational Components**: Focus on UI rendering with props
3. **Layout Components**: Handle page structure and spacing
4. **UI Components**: Reusable UI elements like buttons, inputs, etc.

Example of component hierarchy:
```
GameBoard (container)
  └── GameGrid (layout)
      ├── WordRow (presentational)
      │   └── WordTile (UI component)
      └── GameControls (presentational)
          ├── Button (UI component)
          └── Timer (UI component)
```

### State Management
- Keep state as local as possible
- Use React context for truly global state
- Consider data normalization for complex state
- Use reducers for complex state logic

### Performance Considerations
- Memoize expensive calculations with `useMemo`
- Prevent unnecessary re-renders with `React.memo` and `useCallback`
- Implement virtualization for long lists
- Optimize images and assets

## Commit Message Format
- feat: A new feature
- fix: A bug fix
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- docs: Documentation only changes
- build: Changes that affect the build system or external dependencies
- ci: Changes to CI configuration files and scripts

## Additional Resources
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [CSS BEM Naming Convention](http://getbem.com/)
- [TypeScript Guidelines](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

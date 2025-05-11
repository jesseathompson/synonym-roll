# CSS Styling Refactoring

## Objective
Refactor the Synonym Roll application's styling approach to follow the CSS best practices outlined in the project guidelines, focusing on component-scoped CSS, BEM methodology, responsive design, and comprehensive CSS variables.

## Current CSS Issues
- Single `global.css` file containing all styles
- Inconsistent naming conventions (e.g., `step-word`, `start-end`, `game-title`)
- Limited CSS variables primarily focused on colors
- No component-scoped styling
- Some inline styles in components

## Focus Areas
1. Implement component-scoped CSS using CSS modules
2. Apply BEM methodology consistently for CSS class naming
3. Create a comprehensive design token system with CSS variables
4. Ensure responsive design with mobile-first approach
5. Replace all inline styles with class-based styling
6. Utilize Flexbox and Grid for modern layouts

## Implementation Examples

### 1. Converting to CSS Modules

**Before (in global.css):**
```css
.start-word,
.end-word {
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--text-shadow);
  font-size: larger;
  font-weight: 600;
}

.step-word {
  text-shadow: 1px 1px 3px var(--text-shadow);
}
```

**After (in WordTile.module.css):**
```css
.wordTile {
  padding: var(--spacing-xs);
  margin: var(--spacing-xs) 0;
  font-family: var(--font-family-base);
  font-weight: 600;
}

.wordTile--start {
  composes: wordTile;
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--color-shadow);
  font-size: var(--font-size-xl);
}

.wordTile--step {
  composes: wordTile;
  text-shadow: 1px 1px 3px var(--color-shadow);
  font-size: var(--font-size-lg);
}

.wordTile--end {
  composes: wordTile;
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--color-shadow);
  font-size: var(--font-size-xl);
}
```

### 2. Comprehensive CSS Variables

**Before:**
```css
:root {
  --primary-color: #411f07;
  --text-primary: #411f07;
  --text-secondary: #c19a6b;
  --text-shadow: #c19a6b;
  --bg-light: #fefdf8;
  --bg-dark: #411f07;
  --bs-body-color: #411f07;
  --font-game: "Outfit", sans-serif;
}
```

**After:**
```css
:root {
  /* Color system */
  --color-primary: #411f07;
  --color-primary-light: #5a2c0a;
  --color-secondary: #c19a6b;
  --color-secondary-light: #d6b794;
  --color-background-light: #fefdf8;
  --color-background-dark: #411f07;
  --color-text-light: #fefdf8;
  --color-text-dark: #411f07;
  --color-text-muted: #8a8a8a;
  --color-shadow: rgba(193, 154, 107, 0.5);
  
  /* Typography */
  --font-family-base: "Outfit", sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-lg: 1.25rem;    /* 20px */
  --font-size-xl: 1.5rem;     /* 24px */
  --font-size-2xl: 2rem;      /* 32px */
  
  /* Spacing */
  --spacing-xs: 0.25rem;      /* 4px */
  --spacing-sm: 0.5rem;       /* 8px */
  --spacing-md: 1rem;         /* 16px */
  --spacing-lg: 1.5rem;       /* 24px */
  --spacing-xl: 2rem;         /* 32px */
  
  /* Border radius */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### 3. Modern Layout with Flexbox/Grid

**Before:**
```css
.syn-words {
  margin: 10px 0;
}

.syn-words button {
  margin: 5px;
  display: inline-block;
}
```

**After (in SynonymList.module.css):**
```css
.synonymList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
}

@media (min-width: 768px) {
  .synonymList {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-md);
  }
}
```

### 4. BEM Naming Convention

**Before:**
```css
.game-container {
  min-height: 80vh;
}

.completed-state {
  margin-top: 1rem;
}
```

**After (in GameBoard.module.css):**
```css
.gameBoard {
  min-height: 80vh;
  border-radius: var(--border-radius-lg);
  background-color: var(--color-background-light);
}

.gameBoard__content {
  padding: var(--spacing-md);
}

.gameBoard__completedState {
  margin-top: var(--spacing-md);
}
```

## Refactoring Steps
1. **Create Design Token System:**
   - Establish comprehensive CSS variables in `variables.css`
   - Include colors, spacing, typography, shadows, etc.
   - Update dark theme variables

2. **Component-by-Component Refactoring:**
   - Start with extracting styles for newly created components
   - Create a CSS module file for each component
   - Apply consistent BEM naming to CSS classes

3. **Update Global Styles:**
   - Refactor `global.css` to only include truly global styles
   - Move component-specific styles to their respective modules
   - Ensure all hardcoded values are replaced with variables

4. **Implement Mobile-First Approach:**
   - Start with styles for mobile devices
   - Add `@media` queries for larger breakpoints
   - Test thoroughly across different screen sizes

5. **Layout Modernization:**
   - Use CSS Grid for page layouts and complex component layouts
   - Implement Flexbox for alignment and simpler layouts
   - Replace older positioning methods

6. **Style Cleanup:**
   - Remove unused or redundant styles
   - Ensure all styles follow the BEM convention
   - Validate that inline styles have been eliminated

By following this approach, the styling in Synonym Roll will become more maintainable, consistent, and follow modern best practices while adhering to the project's coding standards.

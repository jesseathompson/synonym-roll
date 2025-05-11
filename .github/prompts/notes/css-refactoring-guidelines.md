# CSS Refactoring Guidelines

This document provides an analysis of the current CSS approach in the Synonym Roll application and offers concrete examples for refactoring to follow CSS best practices outlined in the coding standards.

## Current CSS Approach Issues

1. **Global CSS File:**
   - All styles are defined in a single `global.css` file
   - No component-scoped styles
   - Potential for class name conflicts

2. **Inconsistent Naming:**
   - Mix of naming conventions (e.g., `step-word`, `start-end`, `game-title`)
   - Not following BEM methodology consistently

3. **Limited CSS Variables:**
   - Good use of color variables
   - Missing variables for spacing, typography, and other design tokens

4. **Inline Styles:**
   - Some components use inline styles

## CSS Best Practices to Implement

1. **Component-Scoped CSS using CSS Modules**
2. **BEM Naming Convention**
3. **Expanded CSS Variables**
4. **Mobile-First Responsive Design**
5. **Modern Layout Techniques (Flexbox/Grid)**

## Example 1: Converting to CSS Modules

### Before: Global CSS
```css
/* In global.css */
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

### After: CSS Module
```tsx
// WordTile.tsx
import React from 'react';
import styles from './WordTile.module.css';

interface WordTileProps {
  word: string;
  variant: 'start' | 'step' | 'end';
}

export const WordTile: React.FC<WordTileProps> = ({ word, variant }) => {
  return (
    <div className={styles[variant]}>
      {word}
    </div>
  );
};
```

```css
/* WordTile.module.css */
.base {
  font-family: var(--font-game);
  font-weight: 600;
  padding: var(--spacing-xs);
  margin: var(--spacing-xs) 0;
}

.start {
  composes: base;
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--text-shadow);
  font-size: var(--font-size-xl);
}

.end {
  composes: base;
  text-transform: uppercase;
  text-shadow: 2px 2px 6px var(--text-shadow);
  font-size: var(--font-size-xl);
}

.step {
  composes: base;
  text-shadow: 1px 1px 3px var(--text-shadow);
  font-size: var(--font-size-lg);
}
```

## Example 2: Applying BEM Methodology

### Before: Non-BEM CSS
```css
/* In global.css */
.game-container {
  min-height: 80vh;
  background-color: var(--bg-light);
  border-radius: 12px;
}

.game-content {
  padding: 1rem;
}

.completed-state {
  margin-top: 1rem;
}
```

### After: BEM CSS Module
```css
/* GameBoard.module.css */
.gameBoard {
  min-height: 80vh;
  background-color: var(--bg-light);
  border-radius: var(--border-radius-md);
}

.gameBoard__content {
  padding: var(--spacing-md);
}

.gameBoard__completedState {
  margin-top: var(--spacing-md);
}
```

```tsx
// Using BEM in the component
import styles from './GameBoard.module.css';

<div className={styles.gameBoard}>
  <div className={styles.gameBoard__content}>
    {isCompleted && <div className={styles.gameBoard__completedState}>
      {/* Completed state content */}
    </div>}
  </div>
</div>
```

## Example 3: Enhanced CSS Variables

### Before: Limited Variables
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

### After: Comprehensive Variables
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
  --font-size-3xl: 2.5rem;    /* 40px */
  
  /* Line heights */
  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Spacing */
  --spacing-xs: 0.25rem;      /* 4px */
  --spacing-sm: 0.5rem;       /* 8px */
  --spacing-md: 1rem;         /* 16px */
  --spacing-lg: 1.5rem;       /* 24px */
  --spacing-xl: 2rem;         /* 32px */
  --spacing-2xl: 3rem;        /* 48px */
  
  /* Border radius */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  
  /* Z-index levels */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal: 1040;
  --z-index-popover: 1050;
  --z-index-tooltip: 1060;
}

[data-bs-theme="dark"] {
  --color-primary: #fefdf8;
  --color-primary-light: #e9e7d5;
  --color-secondary: #f1dfc9;
  --color-background-light: #411f07;
  --color-background-dark: #2a1404;
  --color-text-light: #f1dfc9;
  --color-text-dark: #fefdf8;
  --color-text-muted: #b0b0b0;
  --color-shadow: rgba(0, 0, 0, 0.5);
}
```

## Example 4: Mobile-First Responsive Design

### Before: Desktop-first Approach
```css
.game-container {
  width: 80%;
  margin: 0 auto;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .game-container {
    width: 95%;
  }
}
```

### After: Mobile-First Approach
```css
.gameContainer {
  width: 95%;
  margin: 0 auto;
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .gameContainer {
    width: 80%;
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .gameContainer {
    width: 70%;
    max-width: 1200px;
    padding: var(--spacing-lg);
  }
}
```

## Example 5: Using Flexbox and Grid

### Before: Traditional Layout
```css
.stats-display {
  margin-bottom: 15px;
}

.syn-words {
  margin: 10px 0;
}

.syn-words button {
  margin: 5px;
  display: inline-block;
}
```

### After: Modern Layout with Flexbox and Grid
```css
/* SynonymList.module.css */
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

/* StatsDisplay.module.css */
.statsDisplay {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: var(--spacing-md);
}

.statsDisplay__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  flex: 1;
  min-width: 80px;
}

.statsDisplay__value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.statsDisplay__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
```

## Implementation Strategy

1. **Create a Design Token System:**
   - Start by establishing comprehensive CSS variables in a `variables.css` file
   - Include all design tokens: colors, spacing, typography, etc.

2. **Component-by-Component Refactoring:**
   - Create a CSS module file for each component
   - Apply BEM naming to CSS classes
   - Use CSS composition for shared styles

3. **Responsive Design Updates:**
   - Review and update media queries to follow mobile-first approach
   - Test across multiple screen sizes

4. **Layout Modernization:**
   - Replace older layout methods with Flexbox and Grid
   - Use Grid for page layouts and complex component layouts
   - Use Flexbox for alignment and simpler layouts

5. **Style Cleanup:**
   - Remove unused styles from global.css
   - Ensure all styles are properly scoped to components
   - Validate that inline styles have been eliminated

By following these guidelines, the Synonym Roll application's styling will become more maintainable, consistent, and aligned with modern best practices.

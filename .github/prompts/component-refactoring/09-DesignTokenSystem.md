# Design Token System Implementation

## Objective
Create a comprehensive design token system using CSS variables to ensure consistent styling across the application.

## Component Details

### Location
`src/styles/variables.css`

### Implementation Details

Create a CSS variables file that defines tokens for:

1. **Colors**
   - Primary and secondary colors
   - Text colors
   - Background colors
   - Border colors
   - State colors (success, error, warning, info)

2. **Typography**
   - Font families
   - Font sizes
   - Font weights
   - Line heights
   - Letter spacing

3. **Spacing**
   - Consistent spacing values
   - Margin and padding values
   - Grid gaps

4. **Layout**
   - Border radius values
   - Container max-widths
   - Z-index values

5. **Effects**
   - Box shadows
   - Text shadows
   - Transitions

### Current Implementation in global.css
```css
:root {
  --primary-color: #411f07;
  --text-primary: #411f07;
  --text-secondary: #c19a6b;
  --text-shadow: #c19a6b;
  --bg-light: #fefdf8;
  --bg-dark: #411f07;
  --bs-body-color: #411f07;
}
```

## Example Implementation

```css
:root {
  /* Colors */
  --color-primary: #411f07;
  --color-primary-light: #723911;
  --color-secondary: #c19a6b;
  --color-text-primary: #411f07;
  --color-text-secondary: #c19a6b;
  --color-background-light: #fefdf8;
  --color-background-dark: #411f07;
  --color-border: #e6d7c3;
  
  /* Typography */
  --font-family-base: "Outfit", sans-serif;
  --font-family-game: "KG Kiss Me Slowly", cursive;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-md: 1rem;      /* 16px */
  --font-size-lg: 1.25rem;   /* 20px */
  --font-size-xl: 1.5rem;    /* 24px */
  --font-size-2xl: 2rem;     /* 32px */
  
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  
  /* Layout */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  
  --max-width-sm: 640px;
  --max-width-md: 768px;
  --max-width-lg: 1024px;
  
  --z-index-dropdown: 1000;
  --z-index-modal: 2000;
  
  /* Effects */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```

## Requirements
- Create a comprehensive set of design tokens using CSS variables
- Organize tokens by category (colors, typography, spacing, etc.)
- Use meaningful naming conventions
- Provide comments to explain usage where helpful
- Ensure variables can be used across the application

## Important Notes
- This file will be imported in global.css
- Focus on creating a complete design token system
- Do NOT refactor other parts of the codebase yet
- Consider dark mode support with potential CSS variables
- Use a consistent naming convention across all tokens

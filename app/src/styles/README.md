# Synonym Roll Design Token System

This document outlines the design token system implemented for the Synonym Roll application.

## Overview

The design token system uses CSS variables to ensure consistent styling across the entire application. All design tokens are defined in `/app/src/styles/variables.css` and imported in the global CSS file.

## Using Design Tokens

### Importing Design Tokens

The design tokens are automatically available throughout the application since they are imported in the global CSS file:

```css
/* In global.css */
@import './variables.css';
```

### Accessing Tokens in CSS

To use design tokens in your CSS files:

```css
.my-element {
  color: var(--color-primary);
  font-size: var(--font-size-md);
  margin: var(--spacing-md);
}
```

### Tokens in Component-Specific CSS Modules

For component-specific styling, reference the global tokens:

```css
/* In YourComponent.module.css */
.component {
  background-color: var(--color-background-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
```

## Design Token Categories

### Colors

- **Main Palette**: `--color-primary`, `--color-primary-light`, `--color-secondary`, etc.
- **Text Colors**: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, etc.
- **Background Colors**: `--color-background-light`, `--color-background-medium`, `--color-background-dark`
- **Status Colors**: `--color-success`, `--color-error`, `--color-warning`, `--color-info`
- **Border Colors**: `--color-border-light`, `--color-border-medium`, `--color-border-dark`

### Typography

- **Font Families**: `--font-family-base`, `--font-family-game`
- **Font Sizes**: `--font-size-xs` through `--font-size-3xl`
- **Font Weights**: `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`
- **Line Heights**: `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`
- **Letter Spacing**: `--letter-spacing-tight`, `--letter-spacing-normal`, `--letter-spacing-wide`

### Spacing

- **Spacing Scale**: `--spacing-xs` through `--spacing-3xl`

### Layout

- **Border Radius**: `--border-radius-xs` through `--border-radius-xl` and `--border-radius-full`
- **Container Sizes**: `--max-width-xs` through `--max-width-xl`
- **Z-index Scale**: `--z-index-base`, `--z-index-dropdown`, `--z-index-modal`, etc.

### Effects

- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-inner`
- **Transitions**: `--transition-fast`, `--transition-normal`, `--transition-slow`

## Dark Theme Support

The design token system includes a set of tokens specifically for dark mode, which are applied when the `[data-bs-theme="dark"]` attribute is present:

```css
[data-bs-theme="dark"] {
  --color-primary: #fefdf8;
  --color-background-light: #411f07;
  /* other dark mode tokens... */
}
```

## Legacy Variable Support

To maintain backward compatibility, legacy variables are mapped to the new design tokens in global.css:

```css
:root {
  --primary-color: var(--color-primary);
  --text-primary: var(--color-text-primary);
  /* other legacy mappings... */
}
```

## Best Practices

1. Always use design tokens instead of hardcoded values
2. For component-specific styling, create tokens that reference global tokens
3. Follow the naming convention when creating new tokens
4. Consider responsive design when applying spacing and layout tokens
5. Test changes in both light and dark themes

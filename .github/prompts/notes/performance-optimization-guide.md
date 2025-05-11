# Performance Optimization Guide

This document provides a detailed guide for optimizing the performance of the Synonym Roll application according to the standards outlined in the coding instructions.

## Current Performance Issues

1. **Unoptimized Renderings:**
   - No memoization for expensive calculations
   - Components re-render unnecessarily
   - Inline function declarations cause needless re-renders

2. **Processing Inefficiencies:**
   - WordGraph operations are potentially expensive and not memoized
   - Repeated calculations that could be cached

3. **Missing Optimizations:**
   - No React.memo for components
   - No useCallback for event handlers
   - No virtualization for potentially long lists

## Optimization Techniques

### 1. Memoization with useMemo

Memoization prevents expensive calculations from being performed on every render when inputs haven't changed.

#### Example: Memoizing Synonym Calculations

Before:
```tsx
const currentSynonyms = wordGraph.getSynonyms(
  steps[steps.length - 1], 
  puzzle.end
) || [];
```

After:
```tsx
import { useMemo } from 'react';

// ...

const currentWord = steps[steps.length - 1];
const currentSynonyms = useMemo(() => {
  return wordGraph.getSynonyms(currentWord, puzzle.end) || [];
}, [currentWord, puzzle.end]);
```

#### Example: Memoizing Path Calculations

Before:
```tsx
const minSteps = wordGraph.findShortestPathLengthBiDirectional(
  steps[steps.length - 1],
  puzzle.end
);
```

After:
```tsx
const minSteps = useMemo(() => {
  return wordGraph.findShortestPathLengthBiDirectional(
    currentWord,
    puzzle.end
  );
}, [currentWord, puzzle.end]);
```

### 2. Stable Callbacks with useCallback

Event handlers defined inside components get recreated on every render. Using `useCallback` creates stable function references.

#### Example: Optimizing Event Handlers

Before:
```tsx
const addStep = (event: React.MouseEvent<HTMLButtonElement>) => {
  startTimer();
  const word = (event.target as HTMLInputElement).value;
  // Implementation...
};

const removeStep = () => {
  if (steps.length > 1) {
    // Implementation...
  }
};

return (
  // ...
  <Button onClick={removeStep}>Go Back</Button>
  <Button value={synonym} onClick={addStep}>
    {synonym}
  </Button>
  // ...
);
```

After:
```tsx
import { useCallback } from 'react';

// ...

const addStep = useCallback((word: string) => {
  startTimer();
  // Implementation without needing event.target
}, [startTimer, /* other dependencies */]);

const removeStep = useCallback(() => {
  if (steps.length > 1) {
    // Implementation...
  }
}, [steps.length, /* other dependencies */]);

return (
  // ...
  <Button onClick={removeStep}>Go Back</Button>
  <SynonymList synonyms={currentSynonyms} onSelect={addStep} />
  // ...
);
```

### 3. Preventing Re-renders with React.memo

Components that receive the same props shouldn't re-render. Use React.memo to prevent this.

#### Example: Memoizing UI Components

```tsx
import React, { memo } from 'react';

interface WordTileProps {
  word: string;
  variant: 'start' | 'step' | 'end';
}

// The component will only re-render if its props change
export const WordTile = memo<WordTileProps>(({ word, variant }) => {
  return (
    <div className={`word-tile word-tile--${variant}`}>
      {word}
    </div>
  );
});

// Using the memoized component
<WordTile word={puzzle.start} variant="start" />
```

### 4. Implementing Virtualization for Long Lists

When dealing with potentially long lists, use virtualization to only render what's visible in the viewport.

#### Example: Virtualizing Synonym List

```tsx
import React, { memo } from 'react';
import { FixedSizeGrid } from 'react-window';

interface SynonymListProps {
  synonyms: string[];
  onSelect: (word: string) => void;
}

export const SynonymList = memo<SynonymListProps>(({ synonyms, onSelect }) => {
  // Only needed for very large lists (e.g., 100+ items)
  if (synonyms.length > 100) {
    const columnCount = Math.floor(window.innerWidth / 120); // 120px per item
    const rowCount = Math.ceil(synonyms.length / columnCount);
    
    return (
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={120}
        height={Math.min(300, rowCount * 50)} // Max height of 300px
        rowCount={rowCount}
        rowHeight={50}
        width={window.innerWidth * 0.9} // 90% of viewport width
        itemData={{ synonyms, onSelect }}
      >
        {({ columnIndex, rowIndex, style, data }) => {
          const index = rowIndex * columnCount + columnIndex;
          if (index >= data.synonyms.length) return null;
          
          return (
            <div style={style}>
              <button
                className="btn btn-game"
                onClick={() => data.onSelect(data.synonyms[index])}
              >
                {data.synonyms[index]}
              </button>
            </div>
          );
        }}
      </FixedSizeGrid>
    );
  }
  
  // For smaller lists, use the standard rendering
  return (
    <div className="synonym-list">
      {synonyms.map((synonym, index) => (
        <button
          key={index}
          className="btn btn-game"
          onClick={() => onSelect(synonym)}
        >
          {synonym}
        </button>
      ))}
    </div>
  );
});
```

### 5. Optimizing Class Methods

The WordGraph class methods like `getSynonyms` and `findShortestPathLengthBiDirectional` can be optimized with memoization.

#### Example: Adding Memoization to Class Methods

```tsx
export class WordGraph {
  private synonymMemo: Map<string, string[]> = new Map();
  private pathLengthMemo: Map<string, number> = new Map();
  
  // ...
  
  getSynonyms(word: string, targetWord: string): string[] | null {
    const key = `${word}:${targetWord}`;
    if (this.synonymMemo.has(key)) {
      return this.synonymMemo.get(key) || null;
    }
    
    // Original calculation logic...
    
    this.synonymMemo.set(key, result);
    return result;
  }
  
  findShortestPathLengthBiDirectional(start: string, end: string): number {
    const key = `${start}:${end}`;
    if (this.pathLengthMemo.has(key)) {
      return this.pathLengthMemo.get(key)!;
    }
    
    // Original calculation logic...
    
    this.pathLengthMemo.set(key, result);
    return result;
  }
}
```

### 6. Optimizing Asset Loading

#### Example: Lazy Loading Assets

```tsx
// Lazy load components that aren't immediately needed
import React, { lazy, Suspense } from 'react';

const InfoModal = lazy(() => import('./components/InfoModal'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));

export const Navigation = () => {
  // ...
  
  return (
    <>
      <Navbar>
        {/* ... */}
      </Navbar>
      
      <Suspense fallback={<div>Loading...</div>}>
        {showSettings && <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />}
      </Suspense>
      
      <Suspense fallback={<div>Loading...</div>}>
        {showInfo && <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />}
      </Suspense>
    </>
  );
};
```

### 7. Implementing Performance Profiling

Measure performance before and after optimizations to ensure they're having the intended effect.

```tsx
import React, { Profiler } from 'react';

const onRender = (
  id: string,
  phase: string,
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  console.log(`Component ${id} rendered in ${actualDuration.toFixed(2)}ms`);
};

// In your component
<Profiler id="GameBoard" onRender={onRender}>
  <GameBoard>
    {/* Component content */}
  </GameBoard>
</Profiler>
```

## Implementation Strategy

1. **Measure First:**
   - Profile current performance with React DevTools
   - Identify components that render frequently
   - Find expensive calculations

2. **Apply Memoization:**
   - Add useMemo for expensive calculations
   - Apply React.memo to pure components
   - Use useCallback for event handlers

3. **Optimize Large Data Structures:**
   - Add memoization to WordGraph methods
   - Implement virtualization for large lists

4. **Reduce Bundle Size:**
   - Lazy load non-critical components
   - Optimize image assets

5. **Validate Improvements:**
   - Measure performance again
   - Ensure no regressions introduced
   - Document performance gains

By implementing these optimizations, the Synonym Roll application will have improved responsiveness and efficiency, providing a better user experience especially on lower-powered devices.

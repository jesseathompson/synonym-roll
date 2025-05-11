# GameTimer Component Refactoring

## Objective
Create a reusable `GameTimer` component and a custom `useTimer` hook to manage and display the elapsed time during gameplay.

## Component Details

### Location
`src/components/features/game/GameTimer/GameTimer.tsx`
`src/components/features/game/GameTimer/GameTimer.module.css`
`src/hooks/useTimer.ts`

### Props Interface
```tsx
interface GameTimerProps {
  time: number;
  label?: string;
  className?: string;
}
```

### Hook Interface
```tsx
interface UseTimerResult {
  time: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  formatTime: () => string;
}

function useTimer(initialTime: number = 0): UseTimerResult;
```

### Functionality
- Display formatted time (minutes:seconds)
- Custom hook to manage timer state and controls
- Support for starting, stopping, and resetting the timer
- Clean up interval when component unmounts

### Current Implementation in Play.tsx
```tsx
const [elapsedTime, setElapsedTime] = useState(0);
const [hasGameStarted, setHasGameStarted] = useState(false);
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  // Cleanup the timer when the component unmounts
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);

const startTimer = () => {
  if (!hasGameStarted) {
    setHasGameStarted(true);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }
};

// In the render:
<div className="timer">
  <h4>
    Time Elapsed: {Math.floor(elapsedTime / 60)}:
    {(elapsedTime % 60).toString().padStart(2, "0")}
  </h4>
</div>
```

## CSS Requirements
- Use CSS module with BEM naming convention
- Style the timer display appropriately
- Ensure text is readable and properly sized
- Support for responsive design

## Storybook Story Requirements
Create a Storybook story that demonstrates:
- Timer display at different time values
- Different label options
- Custom CSS class application

## Testing Requirements
Write tests for the hook that verify:
- Timer starts, stops, and resets correctly
- Time is formatted correctly
- Cleanup functions work properly

Write tests for the component that verify:
- Component renders with the correct time format
- Component displays the correct label
- Component applies custom classes correctly

## Important Notes
- Focus ONLY on creating this component, hook, and related files
- Do NOT refactor other parts of the codebase
- Ensure the hook properly cleans up resources
- Consider accessibility for time display
- The hook should be reusable across different parts of the application

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameTimer } from './GameTimer';

describe('GameTimer Component', () => {
  it('renders with correct time format', () => {
    render(<GameTimer time={65} />);
    
    expect(screen.getByText('1:05')).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    render(<GameTimer time={30} label="Game Time" />);
    
    const labelElement = screen.getByText('Game Time:');
    expect(labelElement).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('uses default label when not provided', () => {
    render(<GameTimer time={45} />);
    
    const labelElement = screen.getByText('Time Elapsed:');
    expect(labelElement).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<GameTimer time={10} className="custom-timer" />);
    
    const timerElement = container.firstChild;
    expect(timerElement).toHaveClass('game-timer');
    expect(timerElement).toHaveClass('custom-timer');
  });

  it('handles zero time correctly', () => {
    render(<GameTimer time={0} />);
    
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('handles large time values correctly', () => {
    render(<GameTimer time={3661} />); // 1 hour, 1 minute, 1 second
    
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<GameTimer time={75} />);
    
    const timerElement = container.firstChild;
    expect(timerElement).toHaveAttribute('aria-live', 'polite');
    expect(timerElement).toHaveAttribute('aria-atomic', 'true');
    
    const timeDisplay = screen.getByLabelText('1:15 minutes and seconds');
    expect(timeDisplay).toBeInTheDocument();
  });
});

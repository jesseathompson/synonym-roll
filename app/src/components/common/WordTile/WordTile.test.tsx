import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WordTile } from './WordTile';

describe('WordTile Component', () => {
  it('renders the word correctly', () => {
    render(<WordTile word="test" variant="neutral" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('applies the correct class based on variant', () => {
    const { container, rerender } = render(<WordTile word="start" variant="start" />);
    expect(container.firstChild).toHaveClass('word-tile--start');
    
    rerender(<WordTile word="step" variant="step" />);
    expect(container.firstChild).toHaveClass('word-tile--step');
    
    rerender(<WordTile word="end" variant="end" />);
    expect(container.firstChild).toHaveClass('word-tile--end');
    
    rerender(<WordTile word="neutral" variant="neutral" />);
    expect(container.firstChild).toHaveClass('word-tile--neutral');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<WordTile word="clickable" variant="neutral" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible with keyboard navigation', () => {
    const handleClick = vi.fn();
    render(<WordTile word="accessible" variant="neutral" onClick={handleClick} />);
    
    const wordTile = screen.getByText('accessible');
    expect(wordTile).toHaveAttribute('tabIndex', '0');
    expect(wordTile).toHaveAttribute('role', 'button');
    
    // Test keyboard Enter key press
    fireEvent.keyDown(wordTile, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Test keyboard Space key press
    fireEvent.keyDown(wordTile, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('does not have interactive attributes when onClick is not provided', () => {
    render(<WordTile word="non-interactive" variant="neutral" />);
    
    const wordTile = screen.getByText('non-interactive');
    expect(wordTile).not.toHaveAttribute('tabIndex');
    expect(wordTile).not.toHaveAttribute('role');
  });
});

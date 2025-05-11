import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from './GameBoard';
import '@testing-library/jest-dom';

describe('GameBoard Component', () => {
  it('renders children correctly', () => {
    render(
      <GameBoard>
        <div data-testid="test-child">Child content</div>
      </GameBoard>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(
      <GameBoard title="Test Title">
        <div>Content</div>
      </GameBoard>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('does not display title when not provided', () => {
    const { container } = render(
      <GameBoard>
        <div>Content</div>
      </GameBoard>
    );
    
    // We don't have a specific selector for the title, but we can check if there are any elements with the title class
    expect(container.querySelector('.game-board__title')).not.toBeInTheDocument();
  });

  it('applies custom class names correctly', () => {
    const { container } = render(
      <GameBoard className="custom-class">
        <div>Content</div>
      </GameBoard>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders differently based on isCompleted prop', () => {
    const { container, rerender } = render(
      <GameBoard isCompleted={false}>
        <div>Content</div>
      </GameBoard>
    );
    
    expect(container.firstChild).not.toHaveClass('game-board--completed');
    
    rerender(
      <GameBoard isCompleted={true}>
        <div>Content</div>
      </GameBoard>
    );
    
    expect(container.firstChild).toHaveClass('game-board--completed');
  });
  
  it('has appropriate accessibility attributes', () => {
    const { rerender } = render(
      <GameBoard isCompleted={false}>
        <div>Content</div>
      </GameBoard>
    );
    
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Game play area');
    
    rerender(
      <GameBoard isCompleted={true}>
        <div>Content</div>
      </GameBoard>
    );
    
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Completed game area');
  });
});

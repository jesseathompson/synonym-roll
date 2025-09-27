import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompletedState } from './CompletedState';

// Mock the dependencies
vi.mock('../../../common/WordTile', () => ({
  WordTile: ({ word, variant }: { word: string, variant: string }) => (
    <div data-testid={`word-tile-${variant}`}>{word}</div>
  )
}));

vi.mock('../../stats/StatsDisplay', () => ({
  StatsDisplay: ({ stats }: { stats: any, showDetailedStats: boolean }) => (
    <div data-testid="stats-display">
      <div data-testid="elapsed-time">{stats.elapsedTime}</div>
      <div data-testid="steps">{stats.steps}</div>
      {stats.winRate && <div data-testid="win-rate">{stats.winRate}</div>}
      {stats.gamesPlayed && <div data-testid="games-played">{stats.gamesPlayed}</div>}
      {stats.currentStreak && <div data-testid="current-streak">{stats.currentStreak}</div>}
      {stats.maxStreak && <div data-testid="max-streak">{stats.maxStreak}</div>}
    </div>
  )
}));

describe('CompletedState Component', () => {
  it('renders all words in the path correctly', () => {
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "joyful", "glad"]} 
        elapsedTime={65}
        totalMoves={2}
        minSteps={2}
        dayNumber={42}
      />
    );
    
    expect(screen.getByText('happy')).toBeInTheDocument();
    expect(screen.getByText('joyful')).toBeInTheDocument();
    expect(screen.getByText('glad')).toBeInTheDocument();
    
    // Check that we have the correct variants
    expect(screen.getByTestId('word-tile-start')).toHaveTextContent('happy');
    expect(screen.getByTestId('word-tile-step')).toHaveTextContent('joyful');
    expect(screen.getByTestId('word-tile-end')).toHaveTextContent('glad');
  });

  it('formats time correctly', () => {
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "glad"]} 
        elapsedTime={65}
        totalMoves={1}
        minSteps={1}
        dayNumber={42}
      />
    );
    
    expect(screen.getByText(/you completed the puzzle in 1:05 and 1 steps:/i)).toBeInTheDocument();
  });

  it('calls onShare when share button is clicked', () => {
    const mockOnShare = vi.fn();
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "glad"]} 
        elapsedTime={65}
        totalMoves={1}
        minSteps={1}
        dayNumber={42}
        onShare={mockOnShare}
      />
    );
    
    const shareButton = screen.getByText(/share result/i);
    expect(shareButton).toBeInTheDocument();
    
    fireEvent.click(shareButton);
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it('does not render share button when onShare is not provided', () => {
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "glad"]} 
        elapsedTime={65}
        totalMoves={1}
        minSteps={1}
        dayNumber={42}
      />
    );
    
    expect(screen.queryByText(/share result/i)).not.toBeInTheDocument();
  });

  it('passes additional stats to StatsDisplay when provided', () => {
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "glad"]} 
        elapsedTime={65}
        totalMoves={1}
        minSteps={1}
        dayNumber={42}
        stats={{
          winRate: 0.75,
          gamesPlayed: 10,
          streak: 3,
          maxStreak: 5
        }}
      />
    );
    
    expect(screen.getByTestId('win-rate')).toHaveTextContent('0.75');
    expect(screen.getByTestId('games-played')).toHaveTextContent('10');
    expect(screen.getByTestId('current-streak')).toHaveTextContent('3');
    expect(screen.getByTestId('max-streak')).toHaveTextContent('5');
  });

  it('handles path with duplicate words correctly', () => {
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "joyful", "happy", "glad"]} 
        elapsedTime={65}
        totalMoves={3}
        minSteps={2}
        dayNumber={42}
      />
    );
    
    // Should only have 3 words after filtering duplicates
    expect(screen.getByText(/you completed the puzzle in 1:05 and 2 steps:/i)).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(
      <CompletedState 
        startWord="happy" 
        endWord="glad" 
        steps={["happy", "glad"]} 
        elapsedTime={65}
        totalMoves={1}
        minSteps={1}
        dayNumber={42}
        onShare={() => {}}
      />
    );
    
    // Check for region role
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'Game completed');
    
    // Check for share button accessibility
    const shareButton = screen.getByRole('button');
    expect(shareButton).toHaveAttribute('aria-label', 'Share your game result');
  });
});

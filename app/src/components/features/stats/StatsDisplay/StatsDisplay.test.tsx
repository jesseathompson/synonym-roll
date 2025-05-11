import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatsDisplay } from './StatsDisplay';

describe('StatsDisplay Component', () => {
  it('renders basic stats correctly', () => {
    render(
      <StatsDisplay 
        stats={{
          elapsedTime: 65,
          steps: 4,
        }}
      />
    );
    
    // Check if time is formatted correctly
    expect(screen.getByText('1:05')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    
    // Check if steps are displayed
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Steps')).toBeInTheDocument();
  });

  it('does not show detailed stats when showDetailedStats is false', () => {
    render(
      <StatsDisplay 
        stats={{
          elapsedTime: 65,
          steps: 4,
          winRate: 0.75,
          gamesPlayed: 10,
        }}
        showDetailedStats={false}
      />
    );
    
    // Basic stats should be present
    expect(screen.getByText('1:05')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Detailed stats should not be present
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
    expect(screen.queryByText('10')).not.toBeInTheDocument();
    expect(screen.queryByText('Win Rate')).not.toBeInTheDocument();
    expect(screen.queryByText('Played')).not.toBeInTheDocument();
  });

  it('shows detailed stats when showDetailedStats is true', () => {
    render(
      <StatsDisplay 
        stats={{
          elapsedTime: 65,
          steps: 4,
          winRate: 0.75,
          gamesPlayed: 10,
          currentStreak: 3,
          maxStreak: 5,
        }}
        showDetailedStats={true}
      />
    );
    
    // Basic stats should be present
    expect(screen.getByText('1:05')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Detailed stats should be present
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Played')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
  });

  it('formats time correctly for different durations', () => {
    const { rerender } = render(
      <StatsDisplay 
        stats={{
          elapsedTime: 0,
          steps: 1,
        }}
      />
    );
    expect(screen.getByText('0:00')).toBeInTheDocument();
    
    rerender(
      <StatsDisplay 
        stats={{
          elapsedTime: 9,
          steps: 1,
        }}
      />
    );
    expect(screen.getByText('0:09')).toBeInTheDocument();
    
    rerender(
      <StatsDisplay 
        stats={{
          elapsedTime: 61,
          steps: 1,
        }}
      />
    );
    expect(screen.getByText('1:01')).toBeInTheDocument();
    
    rerender(
      <StatsDisplay 
        stats={{
          elapsedTime: 612,
          steps: 1,
        }}
      />
    );
    expect(screen.getByText('10:12')).toBeInTheDocument();
  });

  it('renders only available detailed stats', () => {
    render(
      <StatsDisplay 
        stats={{
          elapsedTime: 65,
          steps: 4,
          winRate: 0.75,
          // gamesPlayed is missing
          currentStreak: 3,
          // maxStreak is missing
        }}
        showDetailedStats={true}
      />
    );
    
    // Available stats should be present
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
    
    // Missing stats should not be rendered
    expect(screen.queryByText('Played')).not.toBeInTheDocument();
    expect(screen.queryByText('Best')).not.toBeInTheDocument();
  });

  it('has appropriate accessibility attributes', () => {
    render(
      <StatsDisplay 
        stats={{
          elapsedTime: 65,
          steps: 4,
        }}
      />
    );
    
    const statsRegion = screen.getByRole('region');
    expect(statsRegion).toHaveAttribute('aria-label', 'Game statistics');
    
    // Check if individual stats have appropriate aria-labels
    expect(screen.getByLabelText('Time: 1:05')).toBeInTheDocument();
    expect(screen.getByLabelText('Steps: 4')).toBeInTheDocument();
  });
});

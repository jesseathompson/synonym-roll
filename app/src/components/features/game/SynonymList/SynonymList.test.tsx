import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SynonymList } from './SynonymList';

// Mock the WordTile component to isolate SynonymList tests
vi.mock('../../../common/WordTile', () => ({
  WordTile: ({ word, onClick }: { word: string, onClick?: () => void }) => (
    <button data-testid={`word-tile-${word}`} onClick={onClick}>{word}</button>
  )
}));

describe('SynonymList Component', () => {
  it('renders the correct number of buttons', () => {
    const synonyms = ['apple', 'banana', 'cherry'];
    render(<SynonymList synonyms={synonyms} onSelect={() => {}} />);
    
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('displays buttons with correct text', () => {
    const synonyms = ['apple', 'banana', 'cherry'];
    render(<SynonymList synonyms={synonyms} onSelect={() => {}} />);
    
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('cherry')).toBeInTheDocument();
  });

  it('calls onSelect handler with the correct synonym', () => {
    const synonyms = ['apple', 'banana', 'cherry'];
    const handleSelect = vi.fn();
    render(<SynonymList synonyms={synonyms} onSelect={handleSelect} />);
    
    fireEvent.click(screen.getByTestId('word-tile-banana'));
    expect(handleSelect).toHaveBeenCalledWith('banana');
  });

  it('sorts synonyms alphabetically', () => {
    const unsortedSynonyms = ['cherry', 'apple', 'banana'];
    render(<SynonymList synonyms={unsortedSynonyms} onSelect={() => {}} />);
    
    const listItems = screen.getAllByRole('listitem');
    
    // Check if the first item is "apple" (alphabetically first)
    expect(listItems[0].textContent).toBe('apple');
    // Check if the second item is "banana" (alphabetically second)
    expect(listItems[1].textContent).toBe('banana');
    // Check if the third item is "cherry" (alphabetically third)
    expect(listItems[2].textContent).toBe('cherry');
  });

  it('displays empty state when no synonyms are provided', () => {
    render(<SynonymList synonyms={[]} onSelect={() => {}} />);
    
    expect(screen.getByText('No synonyms available')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('displays loading state when isLoading is true', () => {
    render(<SynonymList synonyms={['apple', 'banana']} onSelect={() => {}} isLoading={true} />);
    
    expect(screen.getByText('Loading synonyms...')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});

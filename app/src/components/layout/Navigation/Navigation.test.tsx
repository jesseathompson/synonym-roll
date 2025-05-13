import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';
import { ThemeProvider } from '../../../hooks/useTheme';

// Mock the modals and hooks
jest.mock('../../SettingsModal', () => ({
  SettingsModal: ({ show, onHide }: { show: boolean; onHide: () => void }) =>
    show ? <div data-testid="settings-modal">Settings Modal <button onClick={onHide}>Close</button></div> : null,
}));

jest.mock('../../InfoModal', () => ({
  InfoModal: ({ show, onHide }: { show: boolean; onHide: () => void }) =>
    show ? <div data-testid="info-modal">Info Modal <button onClick={onHide}>Close</button></div> : null,
}));

// Mock the theme hook
const mockToggleTheme = jest.fn();
jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Navigation Component', () => {
  const renderNavigation = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the navigation with correct elements', () => {
    renderNavigation();
    
    // Check for title/brand
    expect(screen.getByText('Synonym Roll')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByLabelText(/Toggle .* theme/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Game information')).toBeInTheDocument();
    expect(screen.getByLabelText('Game settings')).toBeInTheDocument();
  });

  it('opens and closes the info modal', () => {
    renderNavigation();
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('info-modal')).not.toBeInTheDocument();
    
    // Open modal
    fireEvent.click(screen.getByLabelText('Game information'));
    expect(screen.getByTestId('info-modal')).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('info-modal')).not.toBeInTheDocument();
  });

  it('opens and closes the settings modal', () => {
    renderNavigation();
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    
    // Open modal
    fireEvent.click(screen.getByLabelText('Game settings'));
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
  });

  it('calls toggleTheme when theme button is clicked', () => {
    renderNavigation();
    
    fireEvent.click(screen.getByLabelText(/Toggle .* theme/i));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Navigation className="custom-class" />
        </ThemeProvider>
      </BrowserRouter>
    );
    
    // Get the nav element (first element with custom-class)
    const navElement = document.querySelector('nav');
    expect(navElement).toHaveClass('custom-class');
  });
});

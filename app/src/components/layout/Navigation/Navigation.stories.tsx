import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';
import { ThemeProvider } from '../../../hooks/useTheme'; // Assuming ThemeProvider exists
import { expect, within, userEvent } from '@storybook/test';

// Mock components to avoid errors in Storybook
const mockModals = () => {
  // Mock the modals to prevent them from being rendered in Storybook
  jest.mock('../../SettingsModal', () => ({
    SettingsModal: ({ show, onHide }: { show: boolean, onHide: () => void }) => 
      show ? <div data-testid="settings-modal">Settings Modal <button onClick={onHide}>Close</button></div> : null
  }));

  jest.mock('../../InfoModal', () => ({
    InfoModal: ({ show, onHide }: { show: boolean, onHide: () => void }) => 
      show ? <div data-testid="info-modal">Info Modal <button onClick={onHide}>Close</button></div> : null
  }));
}

const meta = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'synonym-roll-light',
      values: [
        { name: 'synonym-roll-light', value: '#fefdf8' }, // bg-light
        { name: 'synonym-roll-dark', value: '#411f07' }, // bg-dark
      ],
    },
    docs: {
      description: {
        component: 'Navigation component displays the application header with logo, title, and navigation controls including theme toggle, info, and settings buttons.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify navigation elements are present
    await expect(canvas.getByText('Synonym Roll')).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Toggle .* theme/i)).toBeInTheDocument();
    await expect(canvas.getByLabelText('Game information')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Game settings')).toBeInTheDocument();
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Click the info button
    await userEvent.click(canvas.getByLabelText('Game information'));
    
    // If using real modals, we could test for modal visibility here
    // Since we're mocking, this is just a demonstration
  },
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'synonym-roll-dark' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Click the theme toggle
    await userEvent.click(canvas.getByLabelText(/Toggle .* theme/i));
    
    // Verify theme changed (would need additional logic for real test)
  },
};

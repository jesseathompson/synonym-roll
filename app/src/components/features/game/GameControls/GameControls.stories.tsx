import type { Meta, StoryObj } from '@storybook/react';
import { GameControls } from './GameControls';
import { action } from '@storybook/addon-actions';
import React from 'react';

const meta = {
  title: 'Game/GameControls',
  component: GameControls,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'synonym-roll-light',
      values: [
        { name: 'synonym-roll-light', value: '#fefdf8' }, // bg-light
        { name: 'synonym-roll-dark', value: '#411f07' }, // bg-dark
      ],
    },
    docs: {
      description: {
        component: 'GameControls component provides game action buttons such as back, share, and reset.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onGoBack: { action: 'Go Back clicked' },
    onShare: { action: 'Share clicked' },
    onReset: { action: 'Reset clicked' },
    showBackButton: { control: 'boolean' },
    showShareButton: { control: 'boolean' },
    showResetButton: { control: 'boolean' },
    isCompleted: { control: 'boolean' },
  },
} satisfies Meta<typeof GameControls>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example with just the back button
export const Default: Story = {
  args: {
    showBackButton: true,
    showShareButton: false,
    showResetButton: false,
    isCompleted: false,
    onGoBack: action('Go Back clicked'),
  },
};

// In-game controls with back and reset
export const InGame: Story = {
  args: {
    showBackButton: true,
    showShareButton: false,
    showResetButton: true,
    isCompleted: false,
    onGoBack: action('Go Back clicked'),
    onReset: action('Reset clicked'),
  },
};

// Game completed with share button
export const GameCompleted: Story = {
  args: {
    showBackButton: false,
    showShareButton: true,
    showResetButton: true,
    isCompleted: true,
    onShare: action('Share clicked'),
    onReset: action('Reset clicked'),
  },
};

// All controls visible
export const AllControls: Story = {
  args: {
    showBackButton: true,
    showShareButton: true,
    showResetButton: true,
    isCompleted: true,
    onGoBack: action('Go Back clicked'),
    onShare: action('Share clicked'),
    onReset: action('Reset clicked'),
  },
};

// Responsive layout demonstration
export const ResponsiveLayout: Story = {
  args: {
    showBackButton: true,
    showShareButton: true,
    showResetButton: true,
    isCompleted: true,
    onGoBack: action('Go Back clicked'),
    onShare: action('Share clicked'),
    onReset: action('Reset clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

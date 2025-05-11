import type { Meta, StoryObj } from '@storybook/react';
import { StatsDisplay } from './StatsDisplay';

const meta = {
  title: 'Stats/StatsDisplay',
  component: StatsDisplay,
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
        component: 'StatsDisplay component for showing game statistics such as time elapsed, steps taken, win rate, etc. in a vertical list similar to the existing game.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stats: {
      control: 'object',
      description: 'Game statistics including elapsedTime, steps, and optional detailed stats',
    },
    showDetailedStats: {
      control: 'boolean',
      description: 'Whether to show detailed statistics like win rate, games played, and streaks',
    },
  },
} satisfies Meta<typeof StatsDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stats only (time and steps)
export const BasicStats: Story = {
  args: {
    stats: {
      elapsedTime: 65, // 1:05
      steps: 4,
    },
    showDetailedStats: false,
  },
};

// Complete stats display with all statistics
export const CompleteStats: Story = {
  args: {
    stats: {
      elapsedTime: 185, // 3:05
      steps: 6,
      winRate: 0.75,
      gamesPlayed: 12,
      currentStreak: 5,
      maxStreak: 8,
    },
    showDetailedStats: true,
  },
};

// Long game with many steps
export const LongGame: Story = {
  args: {
    stats: {
      elapsedTime: 612, // 10:12
      steps: 15,
      winRate: 0.62,
      gamesPlayed: 37,
      currentStreak: 3,
      maxStreak: 9,
    },
    showDetailedStats: true,
  },
};

// First-time player with minimal stats
export const NewPlayer: Story = {
  args: {
    stats: {
      elapsedTime: 92, // 1:32
      steps: 5,
      winRate: 1.0,
      gamesPlayed: 1,
      currentStreak: 1,
      maxStreak: 1,
    },
    showDetailedStats: true,
  },
};

// Perfect player with impressive stats
export const ProPlayer: Story = {
  args: {
    stats: {
      elapsedTime: 38, // 0:38
      steps: 3, // Minimal steps
      winRate: 0.98,
      gamesPlayed: 156,
      currentStreak: 42,
      maxStreak: 42,
    },
    showDetailedStats: true,
  },
};

// Different viewport sizes demonstration
export const Responsive: Story = {
  args: {
    stats: {
      elapsedTime: 128,
      steps: 7,
      winRate: 0.8,
      gamesPlayed: 25,
      currentStreak: 4,
      maxStreak: 12,
    },
    showDetailedStats: true,
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'This example demonstrates the responsive behavior of the StatsDisplay component at different viewport sizes.',
      },
    },
  },
};

// Game-like context story
export const GameContextVertical: Story = {
  args: {
    stats: {
      elapsedTime: 62,
      steps: 5,
      winRate: 0.8,
      gamesPlayed: 10,
    },
    showDetailedStats: true,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '1.5rem', 
        maxWidth: '400px',
        backgroundColor: '#fefdf8',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-game, "Outfit", sans-serif)',
          color: '#411f07',
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Game Completed!</h4>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            You completed the puzzle in 1:02 and 5 steps:
          </div>
        </div>
        
        <Story />
        
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#5c62d6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Share Result
          </button>
        </div>
      </div>
    ),
  ],
};
